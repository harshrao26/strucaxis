"use client";

import ProjectForm from "@/components/ProjectForm";
import { apiJSON } from "@/lib/api";

export default function NewProjectPage() {
  async function create(payload) {
    await apiJSON("/api/feature-projects", "POST", payload);
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-0 pt-32 py-4">
      <h2 className="text-2xl font-semibold">New Project</h2>
      <ProjectForm mode="create" onSubmit={create} />
    </div>
  );
}