import type { TicketStatus } from "@/lib/types";

const LABELS: Record<TicketStatus, string> = {
  open: "Open",
  in_progress: "In progress",
  resolved: "Resolved",
  closed: "Closed",
};

const STYLES: Record<TicketStatus, string> = {
  open: "bg-blue-100 text-blue-700 ring-1 ring-blue-200",
  in_progress: "bg-amber-100 text-amber-800 ring-1 ring-amber-200",
  resolved: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
  closed: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
};

const DOT_STYLES: Record<TicketStatus, string> = {
  open: "bg-blue-600",
  in_progress: "bg-amber-600",
  resolved: "bg-emerald-600",
  closed: "bg-slate-400",
};

export default function StatusBadge({
  status,
  withDot = false,
}: {
  status: TicketStatus;
  withDot?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${STYLES[status]}`}
    >
      {withDot && <span className={`w-1.5 h-1.5 rounded-full ${DOT_STYLES[status]}`} />}
      {LABELS[status]}
    </span>
  );
}

export const STATUS_LABELS = LABELS;
