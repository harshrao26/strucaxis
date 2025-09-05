"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { FiPlus, FiTrash2, FiEdit2, FiSearch } from "react-icons/fi";
import { apiGet } from "@/lib/api";

export default function FeatureProjectsListPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [data, setData] = useState({ items: [], total: 0, page: 1, pages: 1, limit: 20 });
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState(searchParams.get("search") || "");
  const page = Number(searchParams.get("page") || 1);

  const qs = useMemo(() => {
    const p = new URLSearchParams();
    if (q) p.set("search", q);
    p.set("page", String(page));
    p.set("limit", "12");
    p.set("sort", "-createdAt");
    return p.toString();
  }, [q, page]);

  useEffect(() => {
    let ok = true;
    setLoading(true);
    apiGet(`/api/feature-projects?${qs}`)
      .then((j) => { if (ok) setData(j); })
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => { ok = false; };
  }, [qs]);

  const remove = async (id) => {
    if (!confirm("Delete this project?")) return;
    const res = await fetch(`/api/feature-projects/${id}`, { method: "DELETE" });
    if (!res.ok) alert((await res.json().catch(()=>({})))?.error || "Failed");
    else {
      // refresh list
      apiGet(`/api/feature-projects?${qs}`).then(setData);
    }
  };

  const setPage = (n) => {
    const p = new URLSearchParams(searchParams.toString());
    p.set("page", String(n));
    router.push(`/admin/feature-projects?${p.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-0 pt-32 py-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">Feature Projects</h2>
        <Link href="/admin/dashboard/featured-projects/new" className="inline-flex items-center gap-2 rounded bg-black text-white px-3 py-2 text-sm">
          <FiPlus /> New Project
        </Link>
      </div>

      {/* Search */}
      <div className="mt-6 flex items-center gap-2">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-3 text-neutral-400" />
          <input
            className="pl-9 input border-2 rounded w-full p-2"
            placeholder="Search title, client, tag, slug…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") router.push(`/admin/feature-projects?search=${encodeURIComponent(e.currentTarget.value)}`); }}
          />
        </div>
        <button
          className="rounded border px-3 py-2 text-sm"
          onClick={() => router.push(`/admin/feature-projects?search=${encodeURIComponent(q)}`)}
        >
          Search
        </button>
      </div>

      {/* Grid */}
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {loading && Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border p-4 animate-pulse h-48 bg-white" />
        ))}
        {!loading && data.items.map((p) => (
          <div key={p._id} className="rounded-xl border overflow-hidden bg-white flex flex-col">
            {p.coverImage ? (
              <img src={p.coverImage} alt={p.coverAlt || p.title} className="h-40 w-full object-cover" />
            ) : (
              <div className="h-40 w-full bg-neutral-100 flex items-center justify-center text-neutral-400 text-sm">No cover</div>
            )}
            <div className="p-4 flex-1 flex flex-col">
              <div className="text-sm text-neutral-500">{p.client || "—"}</div>
              <div className="font-medium">{p.title}</div>
              <div className="mt-1 text-xs text-neutral-500">{(p.tags || []).join(", ")}</div>
              <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                <Link href={`/admin/feature-projects/${p._id}/edit`} className="inline-flex items-center gap-1 text-sm">
                  <FiEdit2 /> Edit
                </Link>
                <button onClick={()=>remove(p._id)} className="inline-flex items-center gap-1 text-sm text-red-600">
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {!loading && data.pages > 1 && (
        <div className="mt-6 flex items-center gap-2">
          <button disabled={data.page <= 1} onClick={()=>setPage(data.page - 1)} className="rounded border px-3 py-1.5 text-sm disabled:opacity-50">Prev</button>
          <div className="text-sm">Page {data.page} / {data.pages}</div>
          <button disabled={data.page >= data.pages} onClick={()=>setPage(data.page + 1)} className="rounded border px-3 py-1.5 text-sm disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
}