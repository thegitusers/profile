"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Honeypot from "@/components/Honeypot";
import PasswordInput from "@/components/PasswordInput";
import { HONEYPOT_FIELD } from "@/lib/honeypot";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [honeypot, setHoneypot] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, [HONEYPOT_FIELD]: honeypot }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed.");
      toast.success(data.message || "Account created.");
      router.push("/login");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Signup failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16 bg-[#f7f2e7]">
      <div className="w-full max-w-md bg-white rounded-2xl border border-blue-100 shadow-lg p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Create a company account</h1>
        <p className="text-sm text-slate-500 mb-6">
          After signing up, an admin needs to approve your account before you can log in.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Honeypot value={honeypot} onChange={setHoneypot} />
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">
              Company name
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-blue-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Email</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-blue-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Password</label>
            <PasswordInput
              required
              minLength={8}
              value={form.password}
              onChange={(v) => setForm({ ...form, password: v })}
              className="border border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded-lg py-2.5 font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>
        <p className="text-sm mt-6 text-center text-slate-600">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-blue-700 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
