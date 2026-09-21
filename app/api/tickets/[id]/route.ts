import { NextResponse, after } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { sendMail } from "@/lib/mailer";
import { statusUpdateCompanyEmail } from "@/lib/emailTemplates";
import { getTicketByIdForSession } from "@/lib/tickets";
import { companyCode, formatTicketCode } from "@/lib/ticketCode";
import type { TicketStatus } from "@/lib/types";

const VALID_STATUSES: TicketStatus[] = ["open", "in_progress", "resolved", "closed"];

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const ticket = await getTicketByIdForSession(id, session);
  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found." }, { status: 404 });
  }

  return NextResponse.json({ ticket });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ticket id." }, { status: 400 });
  }

  const { status } = await request.json();
  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const db = await getDb();
  const tickets = db.collection("tickets");
  const ticket = await tickets.findOne({ _id: new ObjectId(id) });
  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found." }, { status: 404 });
  }

  await tickets.updateOne(
    { _id: new ObjectId(id) },
    { $set: { status, updatedAt: new Date().toISOString() } },
  );

  after(async () => {
    const company = await db
      .collection("companies")
      .findOne({ _id: new ObjectId(ticket.companyId) });
    if (company) {
      const ticketCode = formatTicketCode(
        ticket.companyCode ?? companyCode(ticket.companyName),
        ticket.ticketNumber ?? 1,
      );
      await sendMail(
        company.email,
        `Ticket ${ticketCode} update: ${ticket.subject}`,
        statusUpdateCompanyEmail({
          ticketId: id,
          ticketCode,
          subject: ticket.subject,
          status: status as TicketStatus,
        }),
      );
    }
  });

  return NextResponse.json({ success: true });
}
