import { NextResponse, after } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { sendMail } from "@/lib/mailer";
import { newCommentAdminEmail, newCommentCompanyEmail } from "@/lib/emailTemplates";
import { sanitizeAttachments } from "@/lib/attachments";
import { companyCode, formatTicketCode } from "@/lib/ticketCode";
import type { Comment, TicketStatus } from "@/lib/types";

type TicketDoc = {
  ticketNumber?: number;
  companyCode?: string;
  companyId: string;
  companyName: string;
  subject: string;
  description: string;
  status: string;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ticket id." }, { status: 400 });
  }

  const { message, attachments } = await request.json();
  const cleanAttachments = sanitizeAttachments(attachments);
  if ((!message || !String(message).trim()) && cleanAttachments.length === 0) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  const db = await getDb();
  const tickets = db.collection<TicketDoc>("tickets");
  const ticket = await tickets.findOne({ _id: new ObjectId(id) });
  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found." }, { status: 404 });
  }
  if (session.role === "company" && ticket.companyId !== session.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.role === "company" && ticket.status === "closed") {
    return NextResponse.json(
      { error: "This ticket is closed. Raise a new ticket if you need further help." },
      { status: 403 },
    );
  }

  const comment: Comment = {
    author: session.role,
    authorName: session.name,
    message: message ? String(message).trim() : "",
    createdAt: new Date().toISOString(),
    attachments: cleanAttachments,
  };

  await tickets.updateOne(
    { _id: new ObjectId(id) },
    { $push: { comments: comment }, $set: { updatedAt: comment.createdAt } },
  );

  const ticketCode = formatTicketCode(
    ticket.companyCode ?? companyCode(ticket.companyName),
    ticket.ticketNumber ?? 1,
  );

  if (session.role === "company" && process.env.ADMIN_EMAIL) {
    after(() =>
      sendMail(
        process.env.ADMIN_EMAIL as string,
        `New comment on ${ticketCode}: ${ticket.subject}`,
        newCommentAdminEmail({
          ticketId: id,
          ticketCode,
          subject: ticket.subject,
          status: ticket.status as TicketStatus,
          companyName: session.name,
          message: comment.message,
          attachmentCount: cleanAttachments.length,
        }),
      ),
    );
  } else if (session.role === "admin") {
    after(async () => {
      const company = await db
        .collection("companies")
        .findOne({ _id: new ObjectId(ticket.companyId) });
      if (company) {
        await sendMail(
          company.email,
          `New comment on ${ticketCode}: ${ticket.subject}`,
          newCommentCompanyEmail({
            ticketId: id,
            ticketCode,
            subject: ticket.subject,
            status: ticket.status as TicketStatus,
            message: comment.message,
            attachmentCount: cleanAttachments.length,
          }),
        );
      }
    });
  }

  return NextResponse.json({ success: true, comment });
}
