"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ImageUploader from "@/components/ImageUploader";
import type { Attachment } from "@/lib/types";

export default function NewTicketPage() {
  const router = useRouter();
  const [form, setForm] = useState({ subject: "", description: "" });
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, attachments }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to raise ticket.");
      toast.success("Ticket raised.");
      router.push(`/dashboard/tickets/${data.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to raise ticket.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Raise a ticket</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6 space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Subject</label>
          <input
            required
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="w-full border border-blue-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">
            Description
          </label>
          <textarea
            required
            rows={6}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-blue-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <ImageUploader attachments={attachments} onChange={setAttachments} disabled={loading} />

        <button
          disabled={loading}
          className="bg-blue-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Submitting..." : "Submit ticket"}
        </button>
      </form>
    </div>
  );
}
