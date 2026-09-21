export const HONEYPOT_FIELD = "company_site";

export function isBot(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}
