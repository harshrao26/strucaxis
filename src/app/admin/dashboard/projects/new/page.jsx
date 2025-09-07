"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiArrowLeftCircle } from "react-icons/fi";
import ProjectForm from "@/components/ProjectForm";

export default function NewProjectPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const onSubmit = async (payload) => {
    setSaving(true);
    // hard-lock to non-featured for /api/projects
    const body = { ...payload, featured: false };
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    setSaving(false);
    if (!res.ok) throw new Error(json?.error || "Failed to create");
    return json;
  };

  return (
    <div className="mx-auto max-w-7xl mt-20 px-4 py-8">
      <button onClick={() => router.back()} className="mb-4 inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900">
        <FiArrowLeftCircle /> Back
      </button>
      <h1 className="text-2xl font-semibold tracking-tight">New Project 🧩</h1>
      <p className="text-sm text-zinc-500">Fill in the details below and hit “Create Project”.</p>

      <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-4 md:p-6">
        {/* Pass initial featured:false so the toggle starts off */}
        <ProjectForm mode="create" initial={{ featured: false }} onSubmit={onSubmit} />
        {saving && <div className="mt-4 text-sm text-zinc-500">Saving…</div>}
      </div>
    </div>
  );
}