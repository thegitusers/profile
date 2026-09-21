import type { Attachment } from "@/lib/types";

export const MAX_ATTACHMENTS = 4;
// Images are compressed client-side to fit under this before upload.
export const MAX_ATTACHMENT_BYTES = 900 * 1024;
export const MAX_LOGO_BYTES = 300 * 1024;

const DATA_URL_RE = /^data:image\/(png|jpeg|jpg|webp|gif);base64,/;

// data: URL length is ~4/3 the raw byte size, plus a little slack for the header.
function maxDataUrlLength(maxBytes: number): number {
  return Math.ceil((maxBytes * 4) / 3) + 200;
}

export function sanitizeAttachments(input: unknown): Attachment[] {
  if (!Array.isArray(input)) return [];

  const attachments: Attachment[] = [];
  const limit = maxDataUrlLength(MAX_ATTACHMENT_BYTES);
  for (const item of input.slice(0, MAX_ATTACHMENTS)) {
    if (!item || typeof item !== "object") continue;
    const { filename, contentType, dataUrl } = item as Record<string, unknown>;
    if (typeof dataUrl !== "string" || !DATA_URL_RE.test(dataUrl)) continue;
    if (dataUrl.length > limit) continue;

    attachments.push({
      filename: typeof filename === "string" ? filename.slice(0, 200) : "image",
      contentType: typeof contentType === "string" ? contentType : "image/jpeg",
      dataUrl,
    });
  }
  return attachments;
}

// Returns the sanitized logo data URL, or null if not a valid image, or
// undefined if the caller didn't send one at all (leave existing logo alone).
export function sanitizeLogoDataUrl(input: unknown): string | null | undefined {
  if (input === undefined) return undefined;
  if (input === null) return null;
  if (typeof input !== "string") return null;
  if (!DATA_URL_RE.test(input)) return null;
  if (input.length > maxDataUrlLength(MAX_LOGO_BYTES)) return null;
  return input;
}
