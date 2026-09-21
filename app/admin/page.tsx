import AdminTicketList from "@/components/AdminTicketList";
import { getSession } from "@/lib/auth";
import { getTicketsForSession } from "@/lib/tickets";

export default async function AdminTicketsPage() {
  const session = await getSession();
  const tickets = session ? await getTicketsForSession(session) : [];

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">All tickets</h1>
      <AdminTicketList tickets={tickets} />
    </div>
  );
}
