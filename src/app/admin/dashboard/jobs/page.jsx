"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

 
export default function AdminJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [error, setError] = useState(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const url = q ? `/api/jobs?search=${encodeURIComponent(q)}&limit=50` : "/api/jobs?limit=50";
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load jobs");
      const data = await res.json();
      setJobs(Array.isArray(data.items) ? data.items : []);
    } catch (e) {
      setError(e.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); /* initial load */ }, []);
  const filtered = useMemo(() => jobs, [jobs]);

  const toggleActive = async (id, next) => {
    const prev = jobs;
    setJobs(jobs.map(j => j._id === id ? { ...j, active: next } : j));
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: next })
      });
      if (!res.ok) throw new Error("Failed toggle");
    } catch {
      setJobs(prev); // revert
      alert("Failed to update job status");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this job? This cannot be undone.")) return;
    const prev = jobs;
    setJobs(jobs.filter(j => j._id !== id));
    try {
      const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed delete");
    } catch {
      setJobs(prev);
      alert("Failed to delete job");
    }
  };

  const onSearch = async (e) => {
    e.preventDefault();
    await fetchJobs();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-0 md:px-8 py-4 pt-32 min-h-screen">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">Jobs</h2>
        <Link
          href="/admin/dashboard/jobs/new"
          className="rounded-lg bg-zinc-900 text-white px-4 py-2 text-sm font-medium hover:opacity-90"
        >
          + New Job
        </Link>
      </div>

      <form onSubmit={onSearch} className="mt-6 flex gap-2">
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search title, team, type, location, tags…"
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900/10"
        />
        <button className="rounded-lg border px-3 py-2 text-sm">Search</button>
        <button
          type="button"
          onClick={() => { setQ(""); fetchJobs(); }}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          Reset
        </button>
      </form>

      {loading && <p className="mt-6 text-sm text-zinc-600">Loading…</p>}
      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

      <div className="mt-6 grid gap-4">
        {filtered.map(job => (
          <div key={job._id} className="rounded-xl border bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{job.title}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${job.active ? "bg-emerald-100 text-emerald-700" : "bg-zinc-200 text-zinc-700"}`}>
                    {job.active ? "Active" : "Closed"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-zinc-700">{job.blurb}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-sm text-zinc-700">
                  <span>{job.team}</span>
                  <span>•</span>
                  <span>{job.type}</span>
                  <span>•</span>
                  <span>{job.location}</span>
                  {job.tags?.length > 0 && (
                    <>
                      <span>•</span>
                      <span className="flex flex-wrap gap-1">
                        {job.tags.map(t => (<code key={t} className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs">{t}</code>))}
                      </span>
                    </>
                  )}
                </div>
                <p className="mt-2 text-xs text-zinc-500">
                  Created {new Date(job.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link
                  href={`/admin/dashboard/jobs/${job._id}`}
                  className="rounded-lg border px-3 py-1.5 text-sm hover:bg-zinc-50"
                >
                  Edit
                </Link>
                <button
                  onClick={() => toggleActive(job._id, !job.active)}
                  className="rounded-lg border px-3 py-1.5 text-sm hover:bg-zinc-50"
                >
                  {job.active ? "Close" : "Reopen"}
                </button>
                <button
                  onClick={() => remove(job._id)}
                  className="rounded-lg border border-red-300 text-red-700 px-3 py-1.5 text-sm hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {!loading && filtered.length === 0 && (
          <p className="text-sm text-zinc-600">No jobs found.</p>
        )}
      </div>
    </div>
  );
}