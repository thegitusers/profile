import { NextResponse, after } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { sendMail } from "@/lib/mailer";
import { newTicketAdminEmail } from "@/lib/emailTemplates";
import { getTicketsForSession } from "@/lib/tickets";
import { sanitizeAttachments } from "@/lib/attachments";
import { companyCode, formatTicketCode } from "@/lib/ticketCode";
import { formatDateTime } from "@/lib/formatDate";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tickets = await getTicketsForSession(session);
  return NextResponse.json({ tickets });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "company") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { subject, description, attachments } = await request.json();
  if (!subject || !description) {
    return NextResponse.json(
      { error: "Subject and description are required." },
      { status: 400 },
    );
  }

  const now = new Date().toISOString();
  const db = await getDb();
  const ticketNumber = (await db.collection("tickets").countDocuments({ companyId: session.id })) + 1;
  const code = companyCode(session.name);
  const cleanAttachments = sanitizeAttachments(attachments);
  const result = await db.collection("tickets").insertOne({
    ticketNumber,
    companyCode: code,
    companyId: session.id,
    companyName: session.name,
    subject: String(subject).trim(),
    description: String(description).trim(),
    status: "open",
    attachments: cleanAttachments,
    comments: [],
    createdAt: now,
    updatedAt: now,
  });

  const ticketCode = formatTicketCode(code, ticketNumber);

  if (process.env.ADMIN_EMAIL) {
    after(() =>
      sendMail(
        process.env.ADMIN_EMAIL as string,
        `New ticket ${ticketCode} from ${session.name}: ${subject}`,
        newTicketAdminEmail({
          ticketId: result.insertedId.toString(),
          ticketCode,
          subject: String(subject).trim(),
          companyName: session.name,
          companyEmail: session.email,
          createdAt: formatDateTime(now),
          message: String(description).trim(),
          attachmentCount: cleanAttachments.length,
          status: "open",
        }),
      ),
    );
  }

  return NextResponse.json({ success: true, id: result.insertedId.toString() });
}
