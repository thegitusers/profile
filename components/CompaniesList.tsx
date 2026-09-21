"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { Company } from "@/lib/types";

export default function CompaniesList({ initialCompanies }: { initialCompanies: Company[] }) {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/companies");
    const data = await res.json();
    if (res.ok) setCompanies(data.companies);
  }

  async function setApproval(id: string, approved: boolean) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/companies/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update company.");
      toast.success(approved ? "Company approved." : "Company rejected.");
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update company.");
    } finally {
      setBusyId(null);
    }
  }

  const pending = companies.filter((c) => !c.approved);
  const approved = companies.filter((c) => c.approved);

  return (
    <div className="w-full space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 mb-5">Pending approval</h1>
        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
          {pending.length === 0 ? (
            <p className="text-sm text-slate-500 p-8 text-center">No pending signups.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white text-black text-left">
                    <th className="px-5 py-3 font-semibold">Company</th>
                    <th className="px-5 py-3 font-semibold">Email</th>
                    <th className="px-5 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.map((c) => (
                    <tr key={c._id} className="border-t border-blue-50">
                      <td className="px-5 py-3 font-medium text-slate-800">{c.name}</td>
                      <td className="px-5 py-3 text-slate-600">{c.email}</td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            disabled={busyId === c._id}
                            onClick={() => setApproval(c._id, true)}
                            className="bg-blue-600 text-white rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            disabled={busyId === c._id}
                            onClick={() => setApproval(c._id, false)}
                            className="border border-slate-300 text-slate-600 rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-slate-50 disabled:opacity-50 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-5">Approved companies</h2>
        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
          {approved.length === 0 ? (
            <p className="text-sm text-slate-500 p-8 text-center">No approved companies yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white text-black text-left">
                    <th className="px-5 py-3 font-semibold">Company</th>
                    <th className="px-5 py-3 font-semibold">Email</th>
                    <th className="px-5 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {approved.map((c) => (
                    <tr key={c._id} className="border-t border-blue-50">
                      <td className="px-5 py-3 font-medium text-slate-800">{c.name}</td>
                      <td className="px-5 py-3 text-slate-600">{c.email}</td>
                      <td className="px-5 py-3 text-right">
                        <button
                          disabled={busyId === c._id}
                          onClick={() => setApproval(c._id, false)}
                          className="border border-slate-300 text-slate-600 rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-slate-50 disabled:opacity-50 transition-colors"
                        >
                          Revoke
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
