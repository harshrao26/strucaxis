"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditJobPage() {
  const { id } = useParams();
  const router = useRouter();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [okMsg, setOkMsg] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/jobs/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load job");
        const data = await res.json();
        setJob(data);
      } catch (e) {
        setError(e.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const update = (k, v) => setJob(j => (j ? { ...j, [k]: v } : j));

  const save = async (e) => {
    e.preventDefault();
    if (!job) return;
    if (!job.title?.trim() || !job.team?.trim() || !job.type?.trim() || !job.location?.trim() || !job.blurb?.trim()) {
      setError("Please fill all required fields"); return;
    }
    setError(null); setOkMsg(null); setSaving(true);
    try {
      const res = await fetch(`/api/jobs/${job._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: job.title.trim(),
          team: job.team.trim(),
          type: job.type.trim(),
          location: job.location.trim(),
          blurb: job.blurb.trim(),
          description: job.description || "",
          tags: (job.tags || []).map(t => String(t).trim()).filter(Boolean),
          active: !!job.active,
          applyEmail: job.applyEmail || "careers@trygvestudio.com",
          applyLink: job.applyLink || "",
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Failed to save");
      }
      setOkMsg("Saved");
      setTimeout(() => router.push("/admin/dashboard/jobs"), 500);
    } catch (e) {
      setError(e.message || "Error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading…</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!job) return <p>Not found.</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 pt-32 sm:px-0 md:px-8 py-4">
      <h2 className="text-2xl font-semibold">Edit Job</h2>

      {okMsg && <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{okMsg}</p>}
      {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <form onSubmit={save} className="mt-6 space-y-5">
        <Field label="Title *">
          <input className="input border-2 rounded w-full p-2"  value={job.title} onChange={e => update("title", e.target.value)} />
        </Field>

        <div className="grid gap-5 md:grid-cols-3">
          <Field label="Team *"><input className="input border-2 rounded w-full p-2" value={job.team} onChange={e => update("team", e.target.value)} /></Field>
          <Field label="Type *"><input className="input border-2 rounded w-full p-2" value={job.type} onChange={e => update("type", e.target.value)} /></Field>
          <Field label="Location *"><input className="input border-2 rounded w-full p-2" value={job.location} onChange={e => update("location", e.target.value)} /></Field>
        </div>

        <Field label="Tags (comma separated)">
          <input
            className="input border-2 rounded w-full p-2"
            value={(job.tags || []).join(", ")}
            onChange={e => update("tags", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
          />
        </Field>

        <Field label="Blurb *">
          <textarea className="input border-2 rounded w-full p-2 min-h-[80px]" value={job.blurb} onChange={e => update("blurb", e.target.value)} />
        </Field>

        <Field label="Description">
          <textarea className="input border-2 rounded w-full p-2 min-h-[180px]" value={job.description} onChange={e => update("description", e.target.value)} />
        </Field>

        <div className="grid gap-5 md:grid-cols-3">
          <Field label="Apply Email">
            <input className="input border-2 rounded w-full p-2" value={job.applyEmail ?? ""} onChange={e => update("applyEmail", e.target.value)} />
          </Field>
          <Field label="Apply Link">
            <input className="input border-2 rounded w-full p-2" value={job.applyLink ?? ""} onChange={e => update("applyLink", e.target.value)} />
          </Field>
          <Field label="Status">
            <select className="input border-2 rounded w-full p-2" value={String(job.active)} onChange={e => update("active", e.target.value === "true")}>
              <option value="true">Active</option>
              <option value="false">Closed</option>
            </select>
          </Field>
        </div>

        <div className="flex items-center gap-3">
          <button disabled={saving} className="rounded-lg bg-zinc-900 text-white px-4 py-2 text-sm font-medium disabled:opacity-50">
            {saving ? "Saving…" : "Save Changes"}
          </button>
          <button type="button" onClick={() => history.back()} className="rounded-lg border px-4 py-2 text-sm">Back</button>
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