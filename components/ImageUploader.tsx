"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { UploadCloud } from "lucide-react";
import { compressImage } from "@/lib/compressImage";
import { MAX_ATTACHMENTS, MAX_ATTACHMENT_BYTES } from "@/lib/attachments";
import type { Attachment } from "@/lib/types";

const MAX_RAW_UPLOAD_BYTES = 5 * 1024 * 1024;

export default function ImageUploader({
  attachments,
  onChange,
  disabled,
}: {
  attachments: Attachment[];
  onChange: (attachments: Attachment[]) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [processing, setProcessing] = useState(false);

  async function addFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) {
      toast.error("Only image files are supported.");
      return;
    }

    const withinSize = imageFiles.filter((f) => f.size <= MAX_RAW_UPLOAD_BYTES);
    if (withinSize.length < imageFiles.length) {
      toast.error("Some images were over 5MB and skipped.");
    }
    if (withinSize.length === 0) return;

    const remaining = MAX_ATTACHMENTS - attachments.length;
    if (remaining <= 0) {
      toast.error(`You can attach up to ${MAX_ATTACHMENTS} images.`);
      return;
    }
    const toProcess = withinSize.slice(0, remaining);
    if (withinSize.length > remaining) {
      toast.error(`Only ${MAX_ATTACHMENTS} images allowed — added the first ${remaining}.`);
    }

    setProcessing(true);
    try {
      const compressed = await Promise.all(
        toProcess.map(async (file) => {
          const dataUrl = await compressImage(file, MAX_ATTACHMENT_BYTES);
          return { filename: file.name, contentType: "image/jpeg", dataUrl };
        }),
      );
      onChange([...attachments, ...compressed]);
    } catch {
      toast.error("Couldn't process one of those images.");
    } finally {
      setProcessing(false);
    }
  }

  function removeAt(index: number) {
    onChange(attachments.filter((_, i) => i !== index));
  }

  return (
    <div>
      <div
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (!disabled) addFiles(e.dataTransfer.files);
        }}
        className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 cursor-pointer transition-colors ${
          dragOver ? "border-blue-400 bg-blue-50" : "border-blue-100 hover:bg-blue-50/50"
        } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
      >
        <UploadCloud size={18} className="text-blue-600 shrink-0" />
        <div className="leading-tight">
          <p className="text-sm font-medium text-blue-700">
            {processing
              ? "Processing images..."
              : `Attach screenshots (optional, up to ${MAX_ATTACHMENTS})`}
          </p>
          <p className="text-xs text-slate-400">PNG, JPG or WEBP (max 5MB each)</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          disabled={disabled}
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {attachments.length > 0 && (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {attachments.map((a, i) => (
            <div key={i} className="relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={a.dataUrl}
                alt={a.filename}
                className="w-full aspect-square object-cover rounded-lg border border-blue-100"
              />
              <button
                type="button"
                disabled={disabled}
                onClick={() => removeAt(i)}
                aria-label="Remove image"
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-800 text-white text-xs flex items-center justify-center shadow hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
