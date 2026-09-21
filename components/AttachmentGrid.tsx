import type { Attachment } from "@/lib/types";

export default function AttachmentGrid({ attachments }: { attachments?: Attachment[] }) {
  if (!attachments || attachments.length === 0) return null;

  return (
    <div className="mt-3 grid grid-cols-4 gap-2">
      {attachments.map((a, i) => (
        <a
          key={i}
          href={a.dataUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={a.dataUrl}
            alt={a.filename}
            className="w-full aspect-square object-cover rounded-lg border border-blue-100 hover:opacity-80 transition-opacity"
          />
        </a>
      ))}
    </div>
  );
}
