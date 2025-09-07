"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FiPlus, FiSearch, FiRefreshCw, FiTrash2, FiEdit2,
} from "react-icons/fi";

export const dynamic = "force-dynamic";

function ConfirmButton({ onConfirm, children, className = "" }) {
  const [ask, setAsk] = useState(false);
  useEffect(() => {
    if (!ask) return;
    const t = setTimeout(() => setAsk(false), 2000);
    return () => clearTimeout(t);
  }, [ask]);
  return (
    <button
      onClick={() => (ask ? onConfirm() : setAsk(true))}
      className={`inline-flex items-center gap-2 rounded border px-2.5 py-1.5 text-xs transition hover:bg-zinc-50 ${ask ? "border-red-300 text-red-700 bg-red-50" : "border-zinc-200"} ${className}`}
    >
      {ask ? "Sure?" : children}
    </button>
  );
}

export default function TeamAdminPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [data, setData] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");

  const search = sp.get("search") || "";
  const sort = sp.get("sort") || "order -createdAt";

  const q = useMemo(() => {
    const u = new URLSearchParams();
    if (search) u.set("search", search);
    if (sort) u.set("sort", sort);
    return u.toString();
  }, [search, sort]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/teams?${q}`, { cache: "no-store" });
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

  const updateQuery = (kv) => {
    const u = new URLSearchParams(sp.toString());
    Object.entries(kv).forEach(([k, v]) => (v ? u.set(k, v) : u.delete(k)));
    router.push(`/admin/dashboard/team?${u.toString()}`);
  };

  const handleDelete = async (slug) => {
    setBusy(slug);
    try {
      const res = await fetch(`/api/teams/${encodeURIComponent(slug)}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      await fetchData();
    } catch (e) {
      alert(e.message || "Delete failed");
    } finally {
      setBusy("");
    }
  };

  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-8 mt-20 text-sm text-neutral-500">Loading team…</div>}>
      <div className="mx-auto max-w-7xl px-4 py-8 mt-20">
        {/* header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Team <span className="text-sm align-top text-zinc-400">👥</span></h1>
            <p className="text-sm text-zinc-500">Create, edit and order your team cards.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchData} className="inline-flex items-center gap-2 rounded border border-zinc-200 px-3 py-2 text-sm hover:bg-zinc-50">
              <FiRefreshCw className={loading ? "animate-spin" : ""} /> Refresh
            </button>
            <Link href="/admin/dashboard/team/new" className="inline-flex items-center gap-2 rounded bg-zinc-900 px-3 py-2 text-sm text-white hover:bg-black">
              <FiPlus /> New Member
            </Link>
          </div>
        </div>

        {/* toolbar */}
        <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="relative">
            <FiSearch className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-zinc-400" />
            <input
              defaultValue={search}
              onKeyDown={(e) => e.key === "Enter" && updateQuery({ search: e.currentTarget.value })}
              placeholder="Search by name, position…"
              className="w-full rounded-lg border border-zinc-200 bg-white pl-10 pr-3 py-2.5 text-sm outline-none focus:border-zinc-300"
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <select
              defaultValue={sort}
              onChange={(e) => updateQuery({ sort: e.target.value })}
              className="w-full md:w-auto rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm"
            >
              <option value="order -createdAt">Manual order, newest</option>
              <option value="-createdAt">Newest first</option>
              <option value="createdAt">Oldest first</option>
              <option value="name">Name A–Z</option>
              <option value="-name">Name Z–A</option>
              <option value="position">Position A–Z</option>
            </select>
          </div>
        </div>

        {/* grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-zinc-200 bg-white p-4">
                <div className="mx-auto h-24 w-24 rounded-full bg-zinc-100" />
                <div className="mt-4 h-4 w-1/2 rounded bg-zinc-100 mx-auto" />
                <div className="mt-2 h-3 w-2/3 rounded bg-zinc-100 mx-auto" />
              </div>
            ))}
          </div>
        ) : !data.items?.length ? (
          <div className="rounded-xl border border-dashed border-zinc-300 p-10 text-center text-sm text-zinc-500">
            No team members yet. Click “New Member”.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((m) => (
              <article key={m.slug} className="overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5">
                <div className="flex flex-col items-center text-center">
                  <div className="h-24 w-24 overflow-hidden rounded-full border bg-zinc-50">
                    {m.image?.src ? (
                      <img src={m.image.src} alt={m.image.alt || m.name} className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <h3 className="mt-3 text-base font-semibold">{m.name}</h3>
                  <p className="text-xs text-emerald-700">{m.position}</p>
                  {m.description ? (
                    <p className="mt-2 line-clamp-3 text-xs text-zinc-600">{m.description}</p>
                  ) : null}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-zinc-500">Order: {m.order ?? 0}</span>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/dashboard/team/${encodeURIComponent(m.slug)}`}
                      className="inline-flex items-center gap-1.5 rounded border border-zinc-200 px-2.5 py-1.5 text-xs hover:bg-zinc-50"
                    >
                      <FiEdit2 /> Edit
                    </Link>
                    <ConfirmButton onConfirm={() => handleDelete(m.slug)}>
                      <FiTrash2 /> {busy === m.slug ? "Deleting…" : "Delete"}
                    </ConfirmButton>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </Suspense>
  );
}