import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import type { SessionPayload } from "@/lib/auth";
import type { Ticket } from "@/lib/types";

export async function getTicketByIdForSession(
  id: string,
  session: SessionPayload,
): Promise<Ticket | null> {
  if (!ObjectId.isValid(id)) return null;

  const db = await getDb();
  const ticket = await db.collection("tickets").findOne({ _id: new ObjectId(id) });
  if (!ticket) return null;
  if (session.role === "company" && ticket.companyId !== session.id) return null;

  return { ...ticket, _id: ticket._id.toString() } as Ticket;
}

export async function getTicketsForSession(session: SessionPayload): Promise<Ticket[]> {
  const db = await getDb();
  const filter = session.role === "admin" ? {} : { companyId: session.id };
  const tickets = await db
    .collection("tickets")
    .find(filter)
    .sort({ updatedAt: -1 })
    .toArray();

  return tickets.map((t) => ({ ...t, _id: t._id.toString() })) as Ticket[];
}
