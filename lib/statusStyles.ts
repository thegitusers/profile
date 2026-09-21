import type { TicketStatus } from "@/lib/types";

// Table row tint per ticket status — same status family as StatusBadge.
export const STATUS_ROW_BG: Record<TicketStatus, string> = {
  open: "bg-blue-50/70 hover:bg-blue-100/70",
  in_progress: "bg-amber-50/70 hover:bg-amber-100/70",
  resolved: "bg-emerald-50/70 hover:bg-emerald-100/70",
  closed: "bg-emerald-100/50 hover:bg-emerald-200/50",
};
