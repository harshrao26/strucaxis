"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import ProjectForm from "@/components/ProjectForm";
import { apiGet, apiJSON } from "@/lib/api";

export default function EditProjectPage() {
  const { id } = useParams();
  const [initial, setInitial] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let ok = true;
    (async () => {
      try {
        const data = await apiGet(`/api/feature-projects/${id}`);
        if (ok) setInitial(data);
      } catch (e) {
        setErr(e.message || "Failed to load");
      }
    })();
    return () => { ok = false; };
  }, [id]);

  if (err?.includes("Not found")) return notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-0 pt-32 py-4">
      <h2 className="text-2xl font-semibold">Edit Project</h2>
      {initial ? (
        <ProjectForm
          mode="edit"
          initial={initial}
          onSubmit={(payload) => apiJSON(`/api/feature-projects/${id}`, "PATCH", payload)}
        />
      ) : (
        <div className="mt-8 text-sm text-neutral-600">Loading…</div>
      )}
    </div>
  );
}