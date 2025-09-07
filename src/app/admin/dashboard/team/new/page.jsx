"use client";

import TeamForm from "@/components/TeamForm";

export default function NewTeamMemberPage() {
  const onSubmit = async (payload) => {
    const res = await fetch("/api/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error || "Failed to create team member");
    return json;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 mt-20" >
      <h1 className="text-2xl font-semibold tracking-tight">New Team Member</h1>
      <p className="text-sm text-zinc-500">Add a new person to your team grid.</p>
      <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-4 md:p-6">
        <TeamForm mode="create" onSubmit={onSubmit} />
      </div>
    </div>
  );
}