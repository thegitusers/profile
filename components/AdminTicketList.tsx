"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarRange, X, Building2 } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { formatDate, formatDateTime } from "@/lib/formatDate";
import { companyCode, formatTicketCode } from "@/lib/ticketCode";
import { STATUS_ROW_BG } from "@/lib/statusStyles";
import type { Ticket, TicketStatus } from "@/lib/types";

function displayNumber(t: Ticket, indexFallback: number) {
  const code = t.companyCode ?? companyCode(t.companyName);
  return formatTicketCode(code, t.ticketNumber ?? indexFallback);
}

const FILTERS: Array<{ label: string; value: TicketStatus | "all" }> = [
  { label: "All", value: "all" },
  { label: "Open", value: "open" },
  { label: "In progress", value: "in_progress" },
  { label: "Resolved", value: "resolved" },
  { label: "Closed", value: "closed" },
];

export default function AdminTicketList({ tickets }: { tickets: Ticket[] }) {
  const [filter, setFilter] = useState<TicketStatus | "all">("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [company, setCompany] = useState("all");

  const companies = useMemo(() => {
    const names = new Set(tickets.map((t) => t.companyName));
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [tickets]);

  const filtered = useMemo(() => {
    const from = dateFrom ? new Date(dateFrom + "T00:00:00") : null;
    const to = dateTo ? new Date(dateTo + "T23:59:59") : null;
    return tickets.filter((t) => {
      const matchesStatus = filter === "all" || t.status === filter;
      const matchesCompany = company === "all" || t.companyName === company;
      const raisedAt = new Date(t.createdAt);
      const matchesFrom = !from || raisedAt >= from;
      const matchesTo = !to || raisedAt <= to;
      return matchesStatus && matchesCompany && matchesFrom && matchesTo;
    });
  }, [tickets, filter, company, dateFrom, dateTo]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-5">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`text-sm font-medium rounded-full px-3.5 py-1.5 border transition-colors ${
              filter === f.value
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50"
            }`}
          >
            {f.label}
          </button>
        ))}

        <div className="flex items-center gap-2 border border-blue-200 rounded-full px-3 py-1.5 bg-white">
          <Building2 size={15} className="text-slate-400 shrink-0" />
          <select
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="outline-none text-sm text-slate-600 bg-transparent max-w-40"
          >
            <option value="all">All companies</option>
            {companies.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 border border-blue-200 rounded-full px-3 py-1.5 bg-white ml-auto">
          <CalendarRange size={15} className="text-slate-400 shrink-0" />
          <input
            type="date"
            value={dateFrom}
            max={dateTo || undefined}
            onChange={(e) => setDateFrom(e.target.value)}
            className="outline-none text-sm text-slate-600 bg-transparent"
          />
          <span className="text-slate-300">–</span>
          <input
            type="date"
            value={dateTo}
            min={dateFrom || undefined}
            onChange={(e) => setDateTo(e.target.value)}
            className="outline-none text-sm text-slate-600 bg-transparent"
          />
          {(dateFrom || dateTo) && (
            <button
              type="button"
              onClick={() => {
                setDateFrom("");
                setDateTo("");
              }}
              aria-label="Clear date filter"
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-sm text-slate-500 p-8 text-center">No tickets found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white text-black text-left">
                  <th className="px-5 py-3 font-semibold">#</th>
                  <th className="px-5 py-3 font-semibold">Subject</th>
                  <th className="px-5 py-3 font-semibold">Company</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Raised</th>
                  <th className="px-5 py-3 font-semibold">Updated</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => (
                  <tr
                    key={t._id}
                    className={`border-t border-blue-50 transition-colors ${STATUS_ROW_BG[t.status]}`}
                  >
                    <td className="px-5 py-3 text-slate-500 font-medium whitespace-nowrap">
                      {displayNumber(t, i + 1)}
                    </td>
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/tickets/${t._id}`}
                        className="font-medium text-slate-800 hover:text-blue-700"
                      >
                        {t.subject}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{t.companyName}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="px-5 py-3 text-slate-500 whitespace-nowrap">
                      {formatDate(t.createdAt)}
                    </td>
                    <td className="px-5 py-3 text-slate-500 whitespace-nowrap">
                      {formatDateTime(t.updatedAt)}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        href={`/admin/tickets/${t._id}`}
                        className="text-sm font-medium text-blue-700 border border-blue-200 rounded-lg px-3 py-1.5 hover:bg-blue-50 transition-colors whitespace-nowrap inline-block"
                      >
                        View details →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
