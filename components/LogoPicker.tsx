"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { compressImage } from "@/lib/compressImage";
import { MAX_LOGO_BYTES } from "@/lib/attachments";

export default function LogoPicker({
  value,
  onChange,
  disabled,
}: {
  value: string | null;
  onChange: (dataUrl: string | null) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [processing, setProcessing] = useState(false);

  async function handleFile(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }

    setProcessing(true);
    try {
      const dataUrl = await compressImage(file, MAX_LOGO_BYTES, 512);
      onChange(dataUrl);
    } catch {
      toast.error("Couldn't process that image.");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="w-20 h-20 rounded-2xl border border-blue-100 bg-blue-50 flex items-center justify-center overflow-hidden shrink-0">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Company logo" className="w-full h-full object-cover" />
        ) : (
          <span className="text-2xl font-bold text-blue-300">?</span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <button
            type="button"
            disabled={disabled || processing}
            onClick={() => inputRef.current?.click()}
            className="text-sm font-medium border border-blue-200 text-blue-700 rounded-lg px-3 py-1.5 hover:bg-blue-50 disabled:opacity-50 transition-colors"
          >
            {processing ? "Processing..." : value ? "Change logo" : "Upload logo"}
          </button>
          {value && (
            <button
              type="button"
              disabled={disabled}
              onClick={() => onChange(null)}
              className="text-sm font-medium text-slate-500 hover:text-red-600 transition-colors"
            >
              Remove
            </button>
          )}
        </div>
        <span className="text-xs text-slate-400">Square image works best, up to 300KB.</span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          disabled={disabled}
          onChange={(e) => {
            handleFile(e.target.files);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
