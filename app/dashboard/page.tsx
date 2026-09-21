import DashboardTicketList from "@/components/DashboardTicketList";
import { getSession } from "@/lib/auth";
import { getTicketsForSession } from "@/lib/tickets";

export default async function DashboardPage() {
  const session = await getSession();
  const tickets = session ? await getTicketsForSession(session) : [];

  return (
    <DashboardTicketList tickets={tickets} companyName={session?.name ?? "there"} />
  );
}
