"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  Calendar,
  Clock,
  ImageIcon,
  MessageCircle,
  FolderOpen,
  Hash,
  FileText,
  CircleDot,
  LifeBuoy,
  Send,
  Mail,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import StatusBadge from "@/components/StatusBadge";
import ImageUploader from "@/components/ImageUploader";
import AttachmentGrid from "@/components/AttachmentGrid";
import Avatar from "@/components/Avatar";
import { formatDateTime } from "@/lib/formatDate";
import { companyCode, formatTicketCode } from "@/lib/ticketCode";
import type { Attachment, Ticket, TicketStatus } from "@/lib/types";

const STATUS_OPTIONS: TicketStatus[] = ["open", "in_progress", "resolved", "closed"];

const ACCENT_BAR: Record<TicketStatus, string> = {
  open: "bg-blue-500",
  in_progress: "bg-amber-500",
  resolved: "bg-emerald-500",
  closed: "bg-slate-300",
};

const STATUS_DESCRIPTION: Record<TicketStatus, string> = {
  open: "This ticket is currently open. Our team will get back to you soon.",
  in_progress: "Our team is currently working on this issue.",
  resolved: "This issue has been marked as resolved.",
  closed: "This ticket has been closed.",
};

export default function TicketDetail({
  ticketId,
  isAdmin,
  initialTicket,
  backHref,
  viewerName,
  viewerLogoDataUrl,
  supportEmail,
}: {
  ticketId: string;
  isAdmin: boolean;
  initialTicket: Ticket;
  backHref: string;
  viewerName: string;
  viewerLogoDataUrl?: string | null;
  supportEmail?: string;
}) {
  const [ticket, setTicket] = useState<Ticket>(initialTicket);
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [posting, setPosting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const ticketCode = formatTicketCode(
    ticket.companyCode ?? companyCode(ticket.companyName),
    ticket.ticketNumber ?? 1,
  );
  const commentingLocked = !isAdmin && ticket.status === "closed";

  async function load() {
    const res = await fetch(`/api/tickets/${ticketId}`);
    const data = await res.json();
    if (res.ok) setTicket(data.ticket);
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim() && attachments.length === 0) return;
    setPosting(true);
    try {
      const res = await fetch(`/api/tickets/${ticketId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, attachments }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to post comment.");
      setMessage("");
      setAttachments([]);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to post comment.");
    } finally {
      setPosting(false);
    }
  }

  async function handleStatusChange(status: TicketStatus) {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status.");
      toast.success("Status updated.");
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update status.");
    } finally {
      setUpdatingStatus(false);
    }
  }

  return (
    <div className="max-w-8xl mx-auto">
      <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-4">
        <Link href={backHref} className="flex items-center gap-1 hover:text-blue-700 transition-colors">
          <ArrowLeft size={14} /> Tickets
        </Link>
        <ChevronRight size={14} />
        <span className="text-slate-700 font-medium">Ticket {ticketCode}</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
            <span className={`absolute left-0 top-0 bottom-0 w-1.5 ${ACCENT_BAR[ticket.status]}`} />
            <div className="p-6 pl-7">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-blue-600 mb-1">{ticketCode}</p>
                  <h1 className="text-2xl font-bold text-slate-800">{ticket.subject}</h1>
                </div>
                <StatusBadge status={ticket.status} withDot />
              </div>

              <p className="mt-2 text-slate-600 whitespace-pre-wrap">{ticket.description}</p>

              <div className="flex flex-wrap items-center gap-4 mt-4">
                <span className="flex items-center gap-2 text-sm text-slate-500">
                  <Avatar name={ticket.companyName} size={26} />
                  Raised by <span className="font-medium text-slate-700">{ticket.companyName}</span>
                </span>
                <span className="flex items-center gap-1.5 text-sm text-slate-500">
                  <Calendar size={14} /> {formatDateTime(ticket.createdAt)}
                </span>
              </div>

              {ticket.attachments && ticket.attachments.length > 0 && (
                <div className="mt-5 pt-5 border-t border-blue-50">
                  <p className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <ImageIcon size={16} /> Attached Image{ticket.attachments.length > 1 ? "s" : ""}
                  </p>
                  <AttachmentGrid attachments={ticket.attachments} />
                </div>
              )}

              {isAdmin && (
                <div className="mt-5 pt-5 border-t border-blue-50">
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">
                    Update status
                  </label>
                  <select
                    disabled={updatingStatus}
                    value={ticket.status}
                    onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
                    className="border border-blue-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Comments */}
          <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6">
            <p className="flex items-center gap-2 font-bold text-slate-800 mb-4">
              <MessageCircle size={18} className="text-blue-600" /> Comments ({ticket.comments.length})
            </p>

            <div className="space-y-3 mb-4">
              {ticket.comments.length === 0 && (
                <p className="text-sm text-slate-500">No comments yet. Be the first to add a comment.</p>
              )}
              {ticket.comments.map((c, i) => (
                <div key={i} className="flex gap-3">
                  <Avatar name={c.authorName} />
                  <div className="flex-1 bg-blue-50/60 rounded-xl p-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-sm text-slate-800">
                        {c.authorName}{" "}
                        {c.author === "admin" && (
                          <span className="text-blue-600 font-medium">(Support)</span>
                        )}
                      </span>
                      <span className="text-xs text-slate-400 whitespace-nowrap">
                        {formatDateTime(c.createdAt)}
                      </span>
                    </div>
                    {c.message && (
                      <p className="mt-1 text-sm text-slate-700 whitespace-pre-wrap">{c.message}</p>
                    )}
                    <AttachmentGrid attachments={c.attachments} />
                  </div>
                </div>
              ))}
            </div>

            {commentingLocked ? (
              <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                <Lock size={15} />
                This ticket is closed, so no further comments can be added. Raise a new ticket if
                you need more help.
              </div>
            ) : (
              <form onSubmit={handleComment} className="space-y-3">
                <div className="flex gap-3">
                  <Avatar name={viewerName} logoDataUrl={viewerLogoDataUrl} />
                  <textarea
                    rows={3}
                    placeholder="Write a comment..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 border border-blue-200 rounded-lg px-3 py-2 outline-none bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="flex-1 w-full">
                    <ImageUploader attachments={attachments} onChange={setAttachments} disabled={posting} />
                  </div>
                  <button
                    disabled={posting || (!message.trim() && attachments.length === 0)}
                    className="flex items-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-2.5 font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors shrink-0 self-end"
                  >
                    <Send size={15} /> {posting ? "Posting..." : "Post comment"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 font-bold text-slate-800">
                <span className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <FolderOpen size={18} />
                </span>
                Ticket Status
              </span>
              <StatusBadge status={ticket.status} withDot />
            </div>
            <p className="text-sm text-slate-500 mt-3">{STATUS_DESCRIPTION[ticket.status]}</p>
          </div>

          <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5">
            <p className="font-bold text-slate-800 mb-3">Ticket Information</p>
            <div className="space-y-3">
              <InfoRow icon={<Hash size={15} />} label="Ticket ID" value={ticketCode.replace("#", "")} />
              <InfoRow icon={<FileText size={15} />} label="Subject" value={ticket.subject} />
              <InfoRow
                icon={<Calendar size={15} />}
                label="Created on"
                value={formatDateTime(ticket.createdAt)}
              />
              <InfoRow
                icon={<Clock size={15} />}
                label="Last updated"
                value={formatDateTime(ticket.updatedAt)}
              />
              <InfoRow
                icon={<CircleDot size={15} />}
                label="Status"
                value={<StatusBadge status={ticket.status} withDot />}
              />
            </div>
          </div>

          {!isAdmin && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
              <span className="flex items-center gap-2 font-bold text-emerald-900">
                <span className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <LifeBuoy size={18} />
                </span>
                Need more help?
              </span>
              <p className="text-sm text-emerald-800/80 mt-2">
                If your issue is urgent, please raise a new ticket or contact our support team.
              </p>
              <a
                href={supportEmail ? `mailto:${supportEmail}` : "/dashboard/tickets/new"}
                className="mt-3 inline-flex items-center gap-2 bg-white border border-emerald-200 text-emerald-700 rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-emerald-50 transition-colors"
              >
                <Mail size={14} /> Contact Support
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-2 text-sm text-slate-500">
        {icon} {label}
      </span>
      <span className="text-sm font-medium text-slate-800 text-right">{value}</span>
    </div>
  );
}
