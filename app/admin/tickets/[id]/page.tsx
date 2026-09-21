import { notFound } from "next/navigation";
import TicketDetail from "@/components/TicketDetail";
import { getSession } from "@/lib/auth";
import { getTicketByIdForSession } from "@/lib/tickets";

export default async function AdminTicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  const ticket = session ? await getTicketByIdForSession(id, session) : null;
  if (!ticket) notFound();

  return (
    <TicketDetail
      ticketId={id}
      isAdmin={true}
      initialTicket={ticket}
      backHref="/admin"
      viewerName={session?.name ?? "Admin"}
    />
  );
}
