"use client";

import { useEffect, useState } from "react";
import TeamForm from "@/components/TeamForm";

export default function EditTeamMemberPage({ params }) {
  const { slug } = params;
  const [initial, setInitial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`/api/teams/${encodeURIComponent(slug)}`, { cache: "no-store" });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "Not found");
        if (alive) setInitial(json);
      } catch (e) {
        setErr(e.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [slug]);

  const onSubmit = async (payload) => {
    const res = await fetch(`/api/teams/${encodeURIComponent(slug)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error || "Failed to update");
    return json;
  };

  return (
    <div className="mx-auto max-w-7xl mt-20 px-4 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Edit Team Member</h1>
      <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-4 md:p-6">
        {loading ? (
          <div className="animate-pulse text-sm text-zinc-500">Loading…</div>
        ) : err ? (
          <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{err}</div>
        ) : (
          <TeamForm mode="edit" initial={initial} onSubmit={onSubmit} />
        )}
      </div>
    </div>
  );
}