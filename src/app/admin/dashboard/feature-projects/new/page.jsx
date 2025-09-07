"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiArrowLeftCircle } from "react-icons/fi";
import ProjectForm from "@/components/ProjectForm";

export default function NewFeatureProjectPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const onSubmit = async (payload) => {
    setSaving(true);
    const res = await fetch("/api/feature-projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    setSaving(false);
    if (!res.ok) throw new Error(json?.error || "Failed to create");
    return json;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 mt-20">
      <button onClick={() => router.back()} className="mb-4 inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900">
        <FiArrowLeftCircle /> Back
      </button>
      <h1 className="text-2xl font-semibold tracking-tight">New Featured Project ✨</h1>
      <p className="text-sm text-zinc-500">Fill in the details below and hit “Create Project”.</p>

      <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-4 md:p-6">
        <ProjectForm mode="create" onSubmit={onSubmit} />
        {saving && <div className="mt-4 text-sm text-zinc-500">Saving…</div>}
      </div>
    </div>
  );
}