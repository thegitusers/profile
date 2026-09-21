// A pinned locale keeps server-rendered and client-rendered output identical —
// relying on the runtime's default locale caused hydration mismatches when the
// server and browser disagreed on date order (e.g. 9/12 vs 12/9).
const LOCALE = "en-GB";

export function formatDate(value: string | Date): string {
  return new Date(value).toLocaleDateString(LOCALE, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(value: string | Date): string {
  return new Date(value).toLocaleString(LOCALE, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
