"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiArrowLeftCircle } from "react-icons/fi";
import ProjectForm from "@/components/ProjectForm";

export default function EditFeatureProjectPage() {
  const router = useRouter();
  const { slug } = useParams();
  const [initial, setInitial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/feature-projects/${encodeURIComponent(slug)}`, { cache: "no-store" });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "Not found");
        if (alive) setInitial(json);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [slug]);

  const onSubmit = async (payload) => {
    setSaving(true);
    const res = await fetch(`/api/feature-projects/${encodeURIComponent(slug)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    setSaving(false);
    if (!res.ok) throw new Error(json?.error || "Failed to update");
    return json;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 mt-20">
      <button onClick={() => router.back()} className="mb-4 inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900">
        <FiArrowLeftCircle /> Back
      </button>
      <h1 className="text-2xl font-semibold tracking-tight">Edit “{slug}” ✍️</h1>
      <p className="text-sm text-zinc-500">Update details and save changes.</p>

      <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-4 md:p-6">
        {loading ? (
          <div className="animate-pulse text-sm text-zinc-500">Loading…</div>
        ) : error ? (
          <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
        ) : (
          <ProjectForm mode="edit" initial={initial} onSubmit={onSubmit} />
        )}
        {saving && <div className="mt-4 text-sm text-zinc-500">Saving…</div>}
      </div>
    </div>
  );
}