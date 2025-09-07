"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FiPlus, FiSearch, FiTrash2, FiEdit2, FiRefreshCw,
  FiTag, FiChevronLeft, FiChevronRight, FiExternalLink
} from "react-icons/fi";

export const dynamic = "force-dynamic";

const Badge = ({ children }) => (
  <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 ring-1 ring-inset ring-zinc-200">
    {children}
  </span>
);

function ConfirmButton({ onConfirm, children, className = "" }) {
  const [ask, setAsk] = useState(false);
  useEffect(() => {
    if (!ask) return;
    const t = setTimeout(() => setAsk(false), 2500);
    return () => clearTimeout(t);
  }, [ask]);
  return (
    <button
      onClick={() => (ask ? onConfirm() : setAsk(true))}
      className={`inline-flex items-center gap-2 rounded border px-3 py-1.5 text-sm transition hover:bg-zinc-50 ${ask ? "border-red-300 text-red-700 bg-red-50" : "border-zinc-200"} ${className}`}
    >
      {ask ? "Sure?" : children}
    </button>
  );
}

export default function FeatureProjectsAdmin() {
  const router = useRouter();
  const sp = useSearchParams();

  const [data, setData] = useState({ items: [], page: 1, pages: 1, total: 0, limit: 20 });
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const page   = Number(sp.get("page") || 1);
  const limit  = Number(sp.get("limit") || 12);
  const search = sp.get("search") || "";
  const tag    = sp.get("tag") || "";
  const sort   = sp.get("sort") || "-createdAt";

  const q = useMemo(() => {
    const u = new URLSearchParams();
    u.set("page", String(page));
    u.set("limit", String(limit));
    if (search) u.set("search", search);
    if (tag) u.set("tag", tag);
    if (sort) u.set("sort", sort);
    return u.toString();
  }, [page, limit, search, tag, sort]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/feature-projects?${q}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to load");
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); /* eslint-disable-next-line */ }, [q]);

  const updateSearch = (kv) => {
    const u = new URLSearchParams(sp.toString());
    Object.entries(kv).forEach(([k, v]) => (v ? u.set(k, v) : u.delete(k)));
    router.push(`/admin/dashboard/feature-projects?${u.toString()}`);
  };

  const handleDelete = async (slug) => {
    try {
      setBusyId(slug);
      const res = await fetch(`/api/feature-projects/${encodeURIComponent(slug)}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      await fetchData();
    } catch (e) {
      alert(e.message || "Delete failed");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-8 mt-20 text-sm text-neutral-500">Loading featured projects…</div>}>
      <div className="mx-auto max-w-7xl px-4 py-8 mt-20">
        {/* header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Featured Projects <span className="text-sm align-top text-zinc-400">✨</span></h1>
            <p className="text-sm text-zinc-500">Create, curate, and celebrate your best work.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchData} className="inline-flex items-center gap-2 rounded border border-zinc-200 px-3 py-2 text-sm hover:bg-zinc-50">
              <FiRefreshCw className={loading ? "animate-spin" : ""} /> Refresh
            </button>
            <Link href="/admin/dashboard/feature-projects/new" className="inline-flex items-center gap-2 rounded bg-zinc-900 px-3 py-2 text-sm text-white hover:bg-black">
              <FiPlus /> New Project
            </Link>
          </div>
        </div>

        {/* toolbar */}
        <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="relative">
            <FiSearch className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-zinc-400" />
            <input
              defaultValue={search}
              onKeyDown={(e) => e.key === "Enter" && updateSearch({ search: e.currentTarget.value, page: "1" })}
              placeholder="Search title, client, tag…"
              className="w-full rounded-lg border border-zinc-200 bg-white pl-10 pr-3 py-2.5 text-sm outline-none ring-0 focus:border-zinc-300"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <FiTag className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-zinc-400" />
              <input
                defaultValue={tag}
                onKeyDown={(e) => e.key === "Enter" && updateSearch({ tag: e.currentTarget.value, page: "1" })}
                placeholder="Filter by tag (e.g., Web)"
                className="w-full rounded-lg border border-zinc-200 bg-white pl-10 pr-3 py-2.5 text-sm outline-none focus:border-zinc-300"
              />
            </div>
            <button
              onClick={() => updateSearch({ search: "", tag: "", page: "1" })}
              className="rounded border border-zinc-200 px-3 py-2 text-sm hover:bg-zinc-50"
            >
              Clear
            </button>
          </div>
          <div>
            <select
              defaultValue={sort}
              onChange={(e) => updateSearch({ sort: e.target.value })}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm"
            >
              <option value="-createdAt">Newest first</option>
              <option value="createdAt">Oldest first</option>
              <option value="-year">Year desc</option>
              <option value="year">Year asc</option>
              <option value="title">Title A–Z</option>
              <option value="-title">Title Z–A</option>
            </select>
          </div>
        </div>

        {/* grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-zinc-200 bg-white p-4">
                <div className="h-40 w-full rounded-lg bg-zinc-100" />
                <div className="mt-4 h-4 w-1/2 rounded bg-zinc-100" />
                <div className="mt-2 h-3 w-1/3 rounded bg-zinc-100" />
                <div className="mt-3 flex gap-2">
                  <div className="h-6 w-12 rounded-full bg-zinc-100" />
                  <div className="h-6 w-16 rounded-full bg-zinc-100" />
                </div>
              </div>
            ))}
          </div>
        ) : data.items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 p-10 text-center">
            <div className="text-2xl">🌱</div>
            <p className="mt-2 font-medium">No featured projects yet</p>
            <p className="text-sm text-zinc-500">Click “New Project” to add your first masterpiece.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.items.map((p) => (
                <article key={p.slug} className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-white transition hover:shadow-lg">
                  <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
                    {p.coverImage ? (
                      <img src={p.coverImage} alt={p.coverAlt || p.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-zinc-400">No cover</div>
                    )}
                    {p.mediaUrl && (
                      <video
                        className="pointer-events-none absolute inset-0 hidden h-full w-full object-cover group-hover:block"
                        src={p.mediaUrl}
                        autoPlay
                        muted
                        loop
                        playsInline
                      />
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="line-clamp-1 text-base font-semibold">{p.title}</h3>
                        <div className="mt-0.5 text-xs text-zinc-500">{p.client || "—"} {p.year ? `• ${p.year}` : ""}</div>
                      </div>
                      <Badge>Featured</Badge>
                    </div>
                    {!!(p.tags?.length) && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {p.tags.slice(0, 4).map((t) => (
                          <span key={t} className="rounded bg-zinc-50 px-2 py-0.5 text-[11px] text-zinc-600 ring-1 ring-inset ring-zinc-200">{t}</span>
                        ))}
                        {p.tags.length > 4 && <span className="text-[11px] text-zinc-400">+{p.tags.length - 4}</span>}
                      </div>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/dashboard/feature-projects/${encodeURIComponent(p.slug)}`} className="inline-flex items-center gap-1.5 rounded border border-zinc-200 px-2.5 py-1.5 text-xs hover:bg-zinc-50">
                          <FiEdit2 /> Edit
                        </Link>
                        {p.caseStudyUrl && (
                          <a href={p.caseStudyUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded border border-zinc-200 px-2.5 py-1.5 text-xs hover:bg-zinc-50">
                            <FiExternalLink /> View Case
                          </a>
                        )}
                      </div>
                      <ConfirmButton onConfirm={() => handleDelete(p.slug)}>
                        <FiTrash2 /> {busyId === p.slug ? "Deleting…" : "Delete"}
                      </ConfirmButton>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* pagination */}
            <div className="mt-8 flex items-center justify-between">
              <div className="text-sm text-zinc-600">
                Showing <b>{(data.page - 1) * data.limit + 1}</b>–<b>{Math.min(data.page * data.limit, data.total)}</b> of <b>{data.total}</b>
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={data.page <= 1}
                  onClick={() => updateSearch({ page: String(data.page - 1) })}
                  className="inline-flex items-center gap-2 rounded border border-zinc-200 px-3 py-2 text-sm disabled:opacity-40"
                >
                  <FiChevronLeft /> Prev
                </button>
                <button
                  disabled={data.page >= data.pages}
                  onClick={() => updateSearch({ page: String(data.page + 1) })}
                  className="inline-flex items-center gap-2 rounded border border-zinc-200 px-3 py-2 text-sm disabled:opacity-40"
                >
                  Next <FiChevronRight />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </Suspense>
  );
}