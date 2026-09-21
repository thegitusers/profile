import Link from "next/link";
import { getSession } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f2e7]">
      {session && (
        <header className="bg-linear-to-r from-blue-700 to-blue-600 px-4 md:px-8 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="font-semibold text-white tracking-tight text-lg">
              Support Admin
            </Link>
            <nav className="flex items-center gap-5">
              <Link
                href="/admin"
                className="text-sm font-medium text-blue-50 hover:text-white transition-colors"
              >
                Tickets
              </Link>
              <Link
                href="/admin/companies"
                className="text-sm font-medium text-blue-50 hover:text-white transition-colors"
              >
                Companies
              </Link>
            </nav>
          </div>
          <LogoutButton redirectTo="/admin/login" />
        </header>
      )}
      <main className="flex-1 px-4 md:px-8 py-8">{children}</main>
    </div>
  );
}
