"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Copy,
  CalendarRange,
  X,
} from "lucide-react";
import { toast } from "sonner";
import StatusBadge from "@/components/StatusBadge";
import { formatDate, formatDateTime } from "@/lib/formatDate";
import { companyCode, formatTicketCode } from "@/lib/ticketCode";
import { STATUS_ROW_BG } from "@/lib/statusStyles";
import type { Ticket, TicketStatus } from "@/lib/types";

const PAGE_SIZE = 10;

function displayNumber(t: Ticket, indexFallback: number) {
  const code = t.companyCode ?? companyCode(t.companyName);
  return formatTicketCode(code, t.ticketNumber ?? indexFallback);
}

export default function DashboardTicketList({
  tickets,
  companyName,
}: {
  tickets: Ticket[];
  companyName: string;
}) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);

  const counts = useMemo(() => {
    const open = tickets.filter((t) => t.status === "open" || t.status === "in_progress").length;
    const resolved = tickets.filter((t) => t.status === "resolved").length;
    const closed = tickets.filter((t) => t.status === "closed").length;
    return { total: tickets.length, open, resolved, closed };
  }, [tickets]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const from = dateFrom ? new Date(dateFrom + "T00:00:00") : null;
    const to = dateTo ? new Date(dateTo + "T23:59:59") : null;
    return tickets.filter((t) => {
      const matchesStatus = statusFilter === "all" || t.status === statusFilter;
      const matchesQuery =
        !q ||
        t.subject.toLowerCase().includes(q) ||
        displayNumber(t, 0).toLowerCase().includes(q);
      const raisedAt = new Date(t.createdAt);
      const matchesFrom = !from || raisedAt >= from;
      const matchesTo = !to || raisedAt <= to;
      return matchesStatus && matchesQuery && matchesFrom && matchesTo;
    });
  }, [tickets, query, statusFilter, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function updateQuery(v: string) {
    setQuery(v);
    setPage(1);
  }
  function updateStatusFilter(v: TicketStatus | "all") {
    setStatusFilter(v);
    setPage(1);
  }
  function updateDateFrom(v: string) {
    setDateFrom(v);
    setPage(1);
  }
  function updateDateTo(v: string) {
    setDateTo(v);
    setPage(1);
  }
  function clearDateFilter() {
    setDateFrom("");
    setDateTo("");
    setPage(1);
  }

  useEffect(() => {
    if (!menuOpenFor) return;
    const close = () => setMenuOpenFor(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [menuOpenFor]);

  function copyLink(ticketId: string) {
    const url = `${window.location.origin}/dashboard/tickets/${ticketId}`;
    navigator.clipboard.writeText(url).then(
      () => toast.success("Link copied."),
      () => toast.error("Couldn't copy link."),
    );
    setMenuOpenFor(null);
  }

  return (
    <div className="w-full">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-50 via-blue-50 to-sky-100 border border-blue-100 px-6 md:px-10 py-8 mb-6">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-blue-200/40 blur-2xl" />
        <div className="absolute right-10 bottom-0 w-40 h-40 rounded-full bg-sky-300/30 blur-2xl" />
        <div className="relative">
          <p className="text-xs font-semibold tracking-widest text-blue-600 uppercase mb-1">
            Welcome back
          </p>
          <h1 className="text-3xl font-bold text-slate-800">Your Tickets</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track, manage and get updates on your support requests.
          </p>
        </div>

        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          <StatCard icon={<FileText size={20} />} tone="blue" value={counts.total} label="Total Tickets" />
          <StatCard icon={<CheckCircle2 size={20} />} tone="green" value={counts.resolved} label="Resolved" />
          <StatCard icon={<Clock size={20} />} tone="amber" value={counts.open} label="Open" />
          <StatCard icon={<XCircle size={20} />} tone="red" value={counts.closed} label="Closed" />
        </div>
      </div>

      {/* Search + filter */}
      <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-3 flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 flex items-center gap-2 border border-blue-100 rounded-xl px-3 py-2">
          <Search size={16} className="text-slate-400 shrink-0" />
          <input
            value={query}
            onChange={(e) => updateQuery(e.target.value)}
            placeholder="Search by subject or ticket ID..."
            className="w-full outline-none text-sm placeholder:text-slate-400"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => updateStatusFilter(e.target.value as TicketStatus | "all")}
          className="border border-blue-100 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All status</option>
          <option value="open">Open</option>
          <option value="in_progress">In progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
        <div className="flex items-center gap-2 border border-blue-100 rounded-xl px-3 py-2">
          <CalendarRange size={16} className="text-slate-400 shrink-0" />
          <input
            type="date"
            value={dateFrom}
            max={dateTo || undefined}
            onChange={(e) => updateDateFrom(e.target.value)}
            className="outline-none text-sm text-slate-600 bg-transparent"
          />
          <span className="text-slate-300">–</span>
          <input
            type="date"
            value={dateTo}
            min={dateFrom || undefined}
            onChange={(e) => updateDateTo(e.target.value)}
            className="outline-none text-sm text-slate-600 bg-transparent"
          />
          {(dateFrom || dateTo) && (
            <button
              type="button"
              onClick={clearDateFilter}
              aria-label="Clear date filter"
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
        {tickets.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-slate-600 mb-4">
              {companyName}, you haven&apos;t raised any tickets yet.
            </p>
            <Link
              href="/dashboard/tickets/new"
              className="inline-block bg-blue-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-blue-700 transition-colors"
            >
              Raise your first ticket
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-slate-500 p-8 text-center">No tickets match your search.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white text-black text-left">
                    <th className="px-5 py-3 font-semibold">#</th>
                    <th className="px-5 py-3 font-semibold">Subject</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Raised</th>
                    <th className="px-5 py-3 font-semibold">Updated</th>
                    <th className="px-5 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((t, i) => (
                    <tr
                      key={t._id}
                      className={`border-t border-blue-50 transition-colors ${STATUS_ROW_BG[t.status]}`}
                    >
                      <td className="px-5 py-3 text-slate-500 font-medium">
                        {displayNumber(t, i + 1)}
                      </td>
                      <td className="px-5 py-3">
                        <Link
                          href={`/dashboard/tickets/${t._id}`}
                          className="font-medium text-slate-800 hover:text-blue-700"
                        >
                          {t.subject}
                        </Link>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                          {t.description}
                        </p>
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={t.status} />
                      </td>
                      <td className="px-5 py-3 text-slate-500 whitespace-nowrap">
                        {formatDate(t.createdAt)}
                      </td>
                      <td className="px-5 py-3 text-slate-500 whitespace-nowrap">
                        {formatDateTime(t.updatedAt)}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-2 relative">
                          <Link
                            href={`/dashboard/tickets/${t._id}`}
                            className="text-sm font-medium text-blue-700 border border-blue-200 rounded-lg px-3 py-1.5 hover:bg-blue-50 transition-colors whitespace-nowrap"
                          >
                            View details →
                          </Link>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setMenuOpenFor(menuOpenFor === t._id ? null : t._id);
                            }}
                            className="w-8 h-8 rounded-full border border-blue-100 flex items-center justify-center text-slate-500 hover:bg-blue-50 transition-colors"
                            aria-label="More actions"
                          >
                            <MoreVertical size={16} />
                          </button>
                          {menuOpenFor === t._id && (
                            <div className="absolute right-0 top-9 z-10 bg-white border border-blue-100 rounded-lg shadow-lg py-1 w-44">
                              <button
                                type="button"
                                onClick={() => copyLink(t._id)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 transition-colors"
                              >
                                <Copy size={14} /> Copy ticket link
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between px-5 py-3 border-t border-blue-50">
              <span className="text-xs text-slate-500">
                Showing {pageItems.length} of {filtered.length} ticket
                {filtered.length === 1 ? "" : "s"}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="w-8 h-8 rounded-full border border-blue-100 flex items-center justify-center text-slate-500 hover:bg-blue-50 disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-semibold flex items-center justify-center">
                  {currentPage}
                </span>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="w-8 h-8 rounded-full border border-blue-100 flex items-center justify-center text-slate-500 hover:bg-blue-50 disabled:opacity-40 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
  tone,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  tone: "blue" | "green" | "amber" | "red";
}) {
  const tones: Record<string, string> = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-emerald-100 text-emerald-600",
    amber: "bg-amber-100 text-amber-600",
    red: "bg-red-100 text-red-500",
  };

  return (
    <div className="bg-white rounded-2xl border border-blue-100/80 shadow-sm p-4 flex items-center gap-3">
      <span className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${tones[tone]}`}>
        {icon}
      </span>
      <div>
        <p className="text-xl font-bold text-slate-800 leading-none">{value}</p>
        <p className="text-xs text-slate-500 mt-1">{label}</p>
      </div>
    </div>
  );
}
