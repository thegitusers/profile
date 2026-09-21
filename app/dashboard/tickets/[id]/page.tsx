import { notFound } from "next/navigation";
import TicketDetail from "@/components/TicketDetail";
import { getSession } from "@/lib/auth";
import { getTicketByIdForSession } from "@/lib/tickets";
import { getCompanyById } from "@/lib/companies";

export default async function CompanyTicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  const ticket = session ? await getTicketByIdForSession(id, session) : null;
  if (!ticket) notFound();

  const company = session ? await getCompanyById(session.id) : null;

  return (
    <TicketDetail
      ticketId={id}
      isAdmin={false}
      initialTicket={ticket}
      backHref="/dashboard"
      viewerName={session?.name ?? "You"}
      viewerLogoDataUrl={company?.logoDataUrl}
      supportEmail={process.env.ADMIN_EMAIL}
    />
  );
}
