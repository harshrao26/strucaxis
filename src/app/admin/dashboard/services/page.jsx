"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FiPlus, FiSearch, FiRefreshCw, FiTrash2, FiEdit2 } from "react-icons/fi";

export const dynamic = "force-dynamic";

export default function ServicesAdmin() {
  const router = useRouter();
  const sp = useSearchParams();
  const [data, setData] = useState({ items: [], page: 1, pages: 1, total: 0, limit: 24 });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");

  const page = Number(sp.get("page") || 1);
  const search = sp.get("search") || "";

  const q = useMemo(() => {
    const u = new URLSearchParams();
    u.set("page", String(page));
    u.set("limit", "24");
    if (search) u.set("search", search);
    return u.toString();
  }, [page, search]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/services?${q}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Load failed");
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
    router.push(`/admin/dashboard/services?${u.toString()}`);
  };

  const del = async (slug) => {
    setBusy(slug);
    try {
      const res = await fetch(`/api/services/${encodeURIComponent(slug)}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      fetchData();
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy("");
    }
  };

  return (
    <Suspense fallback={<div className="mx-auto mt-20 max-w-7xl px-4 py-8 text-sm text-neutral-500">Loading services…</div>}>
      <div className="mx-auto mt-20 max-w-7xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Services</h1>
          <div className="flex items-center gap-2">
            <button onClick={fetchData} className="rounded border border-zinc-200 px-3 py-2 text-sm hover:bg-zinc-50"><FiRefreshCw className={loading ? "animate-spin" : ""} /></button>
            <Link href="/admin/dashboard/services/new" className="rounded bg-zinc-900 px-3 py-2 text-sm text-white hover:bg-black"><FiPlus /> New</Link>
          </div>
        </div>

        <div className="mb-5">
          <div className="relative">
            <FiSearch className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-zinc-400" />
            <input
              defaultValue={search}
              onKeyDown={(e) => e.key === "Enter" && updateSearch({ search: e.currentTarget.value, page: "1" })}
              placeholder="Search services…"
              className="w-full rounded-lg border border-zinc-200 bg-white pl-10 pr-3 py-2.5 text-sm outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (<div key={i} className="h-64 animate-pulse rounded-xl border bg-white" />))}
          </div>
        ) : data.items.length === 0 ? (
          <div className="rounded-xl border border-dashed p-10 text-center text-sm text-zinc-500">No services yet.</div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((s) => (
              <article key={s.slug} className="overflow-hidden rounded-2xl border bg-white">
                <div className="aspect-[16/9] w-full overflow-hidden bg-zinc-100">
                  {s.image?.src ? <img src={s.image.src} alt={s.image.alt || s.title} className="h-full w-full object-cover" /> : null}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{s.title}</h3>
                  <ul className="mt-2 space-y-1 text-sm text-zinc-600">
                    {s.points?.map((p) => <li key={p}>✔️ {p}</li>)}
                  </ul>
                  <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
                    <span>Order: {s.order}</span>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/dashboard/services/${encodeURIComponent(s.slug)}`} className="rounded border border-zinc-200 px-2 py-1 hover:bg-zinc-50"><FiEdit2 /></Link>
                      <button onClick={() => del(s.slug)} className="rounded border border-zinc-200 px-2 py-1 hover:bg-zinc-50" disabled={busy===s.slug}>
                        {busy===s.slug ? "…" : <FiTrash2 />}
                      </button>
                    </div>
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