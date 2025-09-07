"use client";

import CapabilityForm from "@/components/CapabilityForm";

export default function NewCapabilityPage() {
  const onSubmit = async (payload) => {
    const res = await fetch("/api/capabilities", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error || "Create failed"); return json;
  };
  return (
    <div className="mx-auto max-w-7xl mt-20 px-4 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">New Capability Section</h1>
      <div className="mt-6 rounded-2xl border bg-white p-4 md:p-6">
        <CapabilityForm mode="create" onSubmit={onSubmit} />
      </div>
    </div>
  );
}