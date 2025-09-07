"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiPlus, FiRefreshCw, FiEdit2, FiTrash2, FiEye, FiEyeOff } from "react-icons/fi";

export default function TestimonialsListPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      // include inactive too:
      const res = await fetch("/api/testimonials?limit=200&sort=order&active=false", { cache: "no-store" });
      const json = await res.json();
      setItems(json.items || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const toggle = async (t) => {
    await fetch(`/api/testimonials/${t._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !t.active }),
    });
    load();
  };

  const del = async (t) => {
    if (!confirm("Delete this testimonial?")) return;
    await fetch(`/api/testimonials/${t._id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="mx-auto max-w-7xl mt-20 px-5 sm:px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Testimonials</h1>
        <div className="flex items-center gap-2">
          <button onClick={load} className="rounded border px-3 py-2 text-sm">
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
          </button>
          <Link href="/admin/dashboard/testimonials/new" className="rounded bg-zinc-900 px-3 py-2 text-sm text-white">
            <FiPlus /> New
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-white p-4">
              <div className="h-24 w-full rounded bg-zinc-100 animate-pulse" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center text-sm text-zinc-500">
          No testimonials yet. Click “New”.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((t) => (
            <article key={t._id} className="rounded-xl border bg-white p-4">
              <div className="flex gap-4">
                <div className="h-16 w-16 overflow-hidden rounded-lg bg-zinc-50">
                  {t.image?.src ? (
                    <img src={t.image.src} alt={t.image.alt || t.name} className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium">{t.name}</div>
                      <div className="text-xs text-zinc-500">
                        {[t.role, t.location].filter(Boolean).join(", ")}
                      </div>
                    </div>
                    <div className="text-xs text-zinc-500">#{t.order ?? 0}</div>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-zinc-700">{t.message}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button onClick={() => toggle(t)} className="rounded border px-2 py-1 text-xs">
                    {t.active ? <><FiEye /> Hide</> : <><FiEyeOff /> Show</>}
                  </button>
                  <Link href={`/admin/dashboard/testimonials/${t._id}`} className="rounded border px-2 py-1 text-xs">
                    <FiEdit2 /> Edit
                  </Link>
                </div>
                <button onClick={() => del(t)} className="rounded border px-2 py-1 text-xs text-red-600">
                  <FiTrash2 /> Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}