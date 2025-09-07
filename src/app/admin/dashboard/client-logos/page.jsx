"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FiPlus, FiSearch, FiRefreshCw, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiArrowUp, FiArrowDown,
} from "react-icons/fi";

export const dynamic = "force-dynamic";

function ConfirmButton({ onConfirm, className = "", children }) {
  const [ask, setAsk] = useState(false);
  useEffect(() => {
    if (!ask) return;
    const t = setTimeout(() => setAsk(false), 1800);
    return () => clearTimeout(t);
  }, [ask]);
  return (
    <button
      onClick={() => (ask ? onConfirm() : setAsk(true))}
      className={`inline-flex items-center gap-2 rounded border px-2.5 py-1.5 text-xs transition ${ask ? "border-red-300 bg-red-50 text-red-700" : "border-zinc-200 hover:bg-zinc-50"} ${className}`}
    >
      {ask ? "Sure?" : children}
    </button>
  );
}

export default function ClientLogosAdmin() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl mt-20 px-4 py-8 text-sm text-neutral-500">Loading client logos…</div>}>
      <ClientLogosAdminInner />
    </Suspense>
  );
}

function ClientLogosAdminInner() {
  const router = useRouter();
  const sp = useSearchParams();

  const search = sp.get("search") || "";
  const sort = sp.get("sort") || "order createdAt";
  const limit = Number(sp.get("limit") || 200);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");

  const qs = useMemo(() => {
    const u = new URLSearchParams();
    u.set("sort", sort);
    u.set("limit", String(limit));
    return u.toString();
  }, [sort, limit]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/client-logos?${qs}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to load");
      let list = json.items || [];
      if (search) {
        const s = search.toLowerCase();
        list = list.filter((x) => x.name?.toLowerCase().includes(s) || x.website?.toLowerCase().includes(s));
      }
      setItems(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [qs, search]);

  const updateQuery = (kv) => {
    const u = new URLSearchParams(sp.toString());
    Object.entries(kv).forEach(([k, v]) => (v ? u.set(k, v) : u.delete(k)));
    router.push(`/admin/dashboard/client-logos?${u.toString()}`);
  };

  const toggleActive = async (logo) => {
    setBusy(logo._id);
    try {
      const res = await fetch(`/api/client-logos/${logo._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !logo.active }),
      });
      if (!res.ok) throw new Error("Toggle failed");
      load();
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy("");
    }
  };

  const bumpOrder = async (logo, dir) => {
    setBusy(logo._id);
    try {
      const res = await fetch(`/api/client-logos/${logo._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: Number(logo.order || 0) + dir }),
      });
      if (!res.ok) throw new Error("Update order failed");
      load();
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy("");
    }
  };

  const del = async (logo) => {
    setBusy(logo._id);
    try {
      const res = await fetch(`/api/client-logos/${logo._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      load();
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy("");
    }
  };

  return (
    <div className="mx-auto max-w-7xl mt-20 px-4 py-8">
      {/* header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Client Logos</h1>
          <p className="text-sm text-zinc-500">Upload client marks, set order, toggle visibility.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            className="inline-flex items-center gap-2 rounded border border-zinc-200 px-3 py-2 text-sm hover:bg-zinc-50"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} /> Refresh
          </button>
          <Link
            href="/admin/dashboard/client-logos/new"
            className="inline-flex items-center gap-2 rounded bg-[#FF6A00] px-3 py-2 text-sm text-white hover:opacity-90"
          >
            <FiPlus /> New Logo
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
            placeholder="Search by name or website…"
            className="w-full rounded-lg border border-zinc-200 bg-white pl-10 pr-3 py-2.5 text-sm outline-none focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00]/20"
          />
        </div>
        <div className="md:col-span-2 flex justify-end">
          <select
            defaultValue={sort}
            onChange={(e) => updateQuery({ sort: e.target.value })}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00]/20"
          >
            <option value="order createdAt">Order (asc)</option>
            <option value="-createdAt">Newest first</option>
            <option value="createdAt">Oldest first</option>
            <option value="name">Name A–Z</option>
            <option value="-name">Name Z–A</option>
          </select>
        </div>
      </div>

      {/* grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-white p-4">
              <div className="h-16 w-full animate-pulse rounded bg-zinc-100" />
              <div className="mt-3 h-3 w-1/2 animate-pulse rounded bg-zinc-100" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center text-sm text-zinc-500">
          No logos yet. Click “New Logo”.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((logo) => (
            <article key={logo._id} className="rounded-xl border bg-white p-4">
              <div className="flex h-20 items-center justify-center overflow-hidden rounded-lg bg-zinc-50">
                {logo.image?.src ? (
                  <img
                    src={logo.image.src}
                    alt={logo.image.alt || logo.name}
                    className="max-h-12 object-contain grayscale hover:grayscale-0 transition"
                  />
                ) : (
                  <div className="text-xs text-zinc-500">No image</div>
                )}
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">{logo.name}</h3>
                  <span className="text-xs text-zinc-500">#{logo.order ?? 0}</span>
                </div>
                {logo.website ? (
                  <a href={logo.website} target="_blank" rel="noopener noreferrer" className="text-xs text-[#FF6A00] hover:underline">
                    {logo.website.replace(/^https?:\/\//, "")}
                  </a>
                ) : (
                  <div className="text-xs text-zinc-500">—</div>
                )}
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => bumpOrder(logo, 1)}
                    className="rounded border border-zinc-200 p-1.5 text-xs hover:bg-zinc-50"
                    title="Move down"
                    disabled={busy === logo._id}
                  >
                    <FiArrowDown />
                  </button>
                  <button
                    onClick={() => bumpOrder(logo, -1)}
                    className="rounded border border-zinc-200 p-1.5 text-xs hover:bg-zinc-50"
                    title="Move up"
                    disabled={busy === logo._id}
                  >
                    <FiArrowUp />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(logo)}
                    className="rounded border border-zinc-200 px-2.5 py-1.5 text-xs hover:bg-zinc-50"
                    disabled={busy === logo._id}
                    title={logo.active ? "Hide" : "Show"}
                  >
                    {logo.active ? <FiEye /> : <FiEyeOff />}
                  </button>
                  <Link
                    href={`/admin/dashboard/client-logos/${logo._id}`}
                    className="rounded border border-zinc-200 px-2.5 py-1.5 text-xs hover:bg-zinc-50"
                    title="Edit"
                  >
                    <FiEdit2 />
                  </Link>
                  <ConfirmButton onConfirm={() => del(logo)}>
                    <FiTrash2 /> Delete
                  </ConfirmButton>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}