"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewJobPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [okMsg, setOkMsg] = useState(null);

  const [f, setF] = useState({
    title: "",
    team: "",
    type: "Full-time",
    location: "Remote",
    blurb: "",
    description: "",
    tags: "",
    active: true,
    applyEmail: "careers@trygvestudio.com",
    applyLink: "",
  });

  const onChange = (k, v) => setF(s => ({ ...s, [k]: v }));

  const required = ["title", "team", "type", "location", "blurb"];

  const validate = () => {
    const missing = required.filter(k => !String(f[k]).trim());
    if (missing.length) return `Missing required: ${missing.join(", ")}`;
    if (f.title.length > 140) return "Title must be ≤ 140 chars";
    if (f.blurb.length > 400) return "Blurb must be ≤ 400 chars";
    if (f.applyEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.applyEmail)) return "Invalid apply email";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); setOkMsg(null);
    const v = validate();
    if (v) { setError(v); return; }

    setSubmitting(true);
    try {
      const payload = {
        title: f.title.trim(),
        team: f.team.trim(),
        type: f.type.trim(),
        location: f.location.trim(),
        blurb: f.blurb.trim(),
        description: f.description,
        tags: f.tags.split(",").map(s => s.trim()).filter(Boolean),
        active: !!f.active,
        applyEmail: f.applyEmail.trim(),
        applyLink: f.applyLink.trim(),
      };
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Failed to create job");
      }
      setOkMsg("Job created!");
      setTimeout(() => router.push("/admin/dashboard/jobs"), 700);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-0 md:px-8 py-4 pt-32">
      <h2 className="text-2xl font-semibold">New Job</h2>
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        {okMsg && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{okMsg}</p>}

        <Field label="Title *">
          <input  className="input border-2 rounded w-full p-2" value={f.title} onChange={e => onChange("title", e.target.value)} />
        </Field>

        <div className="grid gap-5 md:grid-cols-3">
          <Field label="Team *">
            <input  className="input border-2 rounded w-full p-2" value={f.team} onChange={e => onChange("team", e.target.value)} placeholder="Engineering / Product / Design" />
          </Field>
          <Field label="Type *">
            <input  className="input border-2 rounded w-full p-2" value={f.type} onChange={e => onChange("type", e.target.value)} placeholder="Full-time / Contract" />
          </Field>
          <Field label="Location *">
            <input  className="input border-2 rounded w-full p-2" value={f.location} onChange={e => onChange("location", e.target.value)} placeholder="Remote / Bengaluru" />
          </Field>
        </div>

        <Field label="Tags (comma separated)">
          <input  className="input border-2 rounded w-full p-2" value={f.tags} onChange={e => onChange("tags", e.target.value)} placeholder="React, Next.js, Tailwind" />
        </Field>

        <Field label="Blurb *">
          <textarea className="input min-h-[80px] border-2 rounded w-full p-2" value={f.blurb} onChange={e => onChange("blurb", e.target.value)} />
          <p className="mt-1  text-xs text-zinc-500">{f.blurb.length}/400</p>
        </Field>

        <Field label="Description (Markdown/HTML/plain)">
          <textarea className="border-2 rounded w-full p-2 input min-h-[180px]" value={f.description} onChange={e => onChange("description", e.target.value)} />
        </Field>

        <div className="grid gap-5 md:grid-cols-3">
          <Field label="Apply Email">
            <input  className="input border-2 rounded w-full p-2" value={f.applyEmail} onChange={e => onChange("applyEmail", e.target.value)} />
          </Field>
          <Field label="Apply Link (optional)">
            <input  className="input border-2 rounded w-full p-2" value={f.applyLink} onChange={e => onChange("applyLink", e.target.value)} placeholder="https://your-ats/job/123" />
          </Field>
          <Field label="Active">
            <select  className="input border-2 rounded w-full p-2" value={String(f.active)} onChange={e => onChange("active", e.target.value === "true")}>
              <option value="true">Active</option>
              <option value="false">Closed</option>
            </select>
          </Field>
        </div>

        <div className="flex items-center gap-3">
          <button
            disabled={submitting}
            className="rounded-lg bg-zinc-900 text-white px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {submitting ? "Saving…" : "Create Job"}
          </button>
          <button
            type="button"
            onClick={() => history.back()}
            className="rounded-lg border px-4 py-2 text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <div className="mb-1 text-sm font-medium">{label}</div>
      {children}
      <style jsx>{`
        .input {
          all: unset;
          display: block;
          width: 100%;
          background: white;
          padding: 0.5rem 0.75rem;
          border: 1px solid rgb(212 212 216);
          border-radius: 0.5rem;
          font-size: 0.875rem;
        }
        .input:focus {
          outline: 2px solid rgb(24 24 27 / 0.1);
        }
      `}</style>
    </label>
  );
}