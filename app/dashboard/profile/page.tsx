"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import LogoPicker from "@/components/LogoPicker";
import type { Company } from "@/lib/types";

export default function CompanyProfilePage() {
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [name, setName] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/companies/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.company) {
          setCompany(data.company);
          setName(data.company.name);
          setLogo(data.company.logoDataUrl ?? null);
        }
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/companies/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, logoDataUrl: logo }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile.");
      toast.success("Profile updated.");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  }

  if (!company) {
    return <p className="text-sm text-slate-500 max-w-xl mx-auto">Loading...</p>;
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Company profile</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6 space-y-5"
      >
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">Logo</label>
          <LogoPicker value={logo} onChange={setLogo} disabled={saving} />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">
            Company name
          </label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-blue-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Email</label>
          <input
            disabled
            value={company.email}
            className="w-full border border-slate-200 bg-slate-50 text-slate-500 rounded-lg px-3 py-2"
          />
        </div>

        <button
          disabled={saving}
          className="bg-blue-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}
