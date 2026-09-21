// Two-letter company code from initials of the first two words
// ("Andaman Bliss" -> "AB"); falls back to the first two letters of a
// single-word name, padded if needed ("Acme" -> "AC", "X" -> "XX").
export function companyCode(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  let code: string;
  if (words.length >= 2) {
    code = words[0][0] + words[1][0];
  } else if (words.length === 1) {
    code = words[0].slice(0, 2).padEnd(2, "X");
  } else {
    code = "XX";
  }
  return code.toUpperCase();
}

export function formatTicketCode(code: string, ticketNumber: number): string {
  return `#${code}${String(ticketNumber).padStart(5, "0")}`;
}
