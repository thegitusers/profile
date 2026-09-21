import Link from "next/link";
import { Home, User, Plus } from "lucide-react";
import { getSession } from "@/lib/auth";
import { getCompanyById } from "@/lib/companies";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const company = session ? await getCompanyById(session.id) : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f2e7]">
      <header className="bg-linear-to-r from-blue-700 to-blue-600 px-4 md:px-8 py-4 flex items-center justify-between shadow-md">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <span className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center overflow-hidden shrink-0">
            {company?.logoDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={company.logoDataUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white font-bold text-sm">
                {(session?.name ?? "?").charAt(0).toUpperCase()}
              </span>
            )}
          </span>
          <span className="font-semibold text-white tracking-tight text-lg">
            {session?.name ?? "Dashboard"}
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-blue-50 hover:text-white transition-colors"
          >
            <Home size={16} /> Home
          </Link>
          <Link
            href="/dashboard/profile"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-blue-50 hover:text-white transition-colors"
          >
            <User size={16} /> Profile
          </Link>
          <Link
            href="/dashboard/tickets/new"
            className="flex items-center gap-1.5 text-sm font-medium bg-white text-blue-700 rounded-lg px-3.5 py-1.5 hover:bg-blue-50 transition-colors"
          >
            <Plus size={16} /> Raise ticket
          </Link>
          <LogoutButton redirectTo="/login" />
        </div>
      </header>
      <main className="flex-1 px-4 md:px-8 py-8">{children}</main>
    </div>
  );
}
