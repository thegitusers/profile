"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm font-medium border border-white/30 text-white rounded-lg px-3.5 py-1.5 hover:bg-white/10 transition-colors"
    >
      Log out
    </button>
  );
}
