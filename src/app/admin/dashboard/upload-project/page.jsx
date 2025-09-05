"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminProjectsPage() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const url = q ? `/api/projects?search=${encodeURIComponent(q)}&limit=50` : "/api/projects?limit=50";
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setItems(data.items || []);
    } catch (e) {
      setErr(e.message || "Error");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const toggleFeatured = async (id, next) => {
    const prev = items;
    setItems(items.map(x => x._id === id ? { ...x, featured: next } : x));
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: next })
      });
      if (!res.ok) throw new Error("Failed");
    } catch {
      setItems(prev);
      alert("Failed to update");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this project?")) return;
    const prev = items;
    setItems(items.filter(x => x._id !== id));
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
    } catch {
      setItems(prev);
      alert("Failed to delete");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-0 md:px-0 py-4 pt-32 min-h-screen">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">Projects</h2>
        <Link href="/admin/dashboard/upload-project/new" className="rounded-lg bg-zinc-900 text-white px-4 py-2 text-sm">+ New Project</Link>
      </div>

      <form onSubmit={(e)=>{e.preventDefault(); load();}} className="mt-6 flex gap-2">
        <input className="w-full rounded-lg border px-3 py-2 text-sm"
               placeholder="Search title, client, tags…"
               value={q} onChange={e=>setQ(e.target.value)} />
        <button className="rounded-lg border px-3 py-2 text-sm">Search</button>
        <button type="button" className="rounded-lg border px-3 py-2 text-sm"
                onClick={()=>{ setQ(""); load(); }}>Reset</button>
      </form>

      {loading && <p className="mt-6 text-sm text-zinc-600">Loading…</p>}
      {err && <p className="mt-6 text-sm text-red-600">{err}</p>}

      <div className="mt-6 grid gap-4">
        {items.map(p => (
          <div key={p._id} className="rounded-xl border bg-white p-4">
            <div className="flex gap-4">
              <img src={p.coverImage || "/placeholder.png"} alt="" className="h-20 w-32 rounded object-cover" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{p.title}</h3>
                  <span className="text-xs text-zinc-500">/{p.slug}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${p.featured ? "bg-emerald-100 text-emerald-700" : "bg-zinc-200 text-zinc-700"}`}>
                    {p.featured ? "Featured" : "Hidden"}
                  </span>
                </div>
                <p className="text-sm text-zinc-700">{p.client} {p.year ? `• ${p.year}` : ""}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {(p.tags || []).slice(0,5).map(t => <span key={t} className="rounded bg-zinc-100 px-2 py-0.5 text-xs">{t}</span>)}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Link href={`/admin/dashboard/projects/${p._id}`} className="rounded border px-3 py-1.5 text-sm text-center">Edit</Link>
                <button onClick={()=>toggleFeatured(p._id, !p.featured)} className="rounded border px-3 py-1.5 text-sm">
                  {p.featured ? "Hide" : "Feature"}
                </button>
                <button onClick={()=>remove(p._id)} className="rounded border border-red-300 text-red-700 px-3 py-1.5 text-sm">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && items.length === 0 && <p className="text-sm text-zinc-600">No projects.</p>}
    </div>
  );
}