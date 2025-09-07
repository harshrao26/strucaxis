"use client";

import ServiceForm from "@/components/ServiceForm";

export default function NewServicePage() {
  const onSubmit = async (payload) => {
    const res = await fetch("/api/services", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error || "Create failed");
    return json;
  };
  return (
    <div className="mx-auto mt-20 max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">New Service</h1>
      <div className="mt-6 rounded-2xl border bg-white p-4 md:p-6">
        <ServiceForm mode="create" onSubmit={onSubmit} />
      </div>
    </div>
  );
}