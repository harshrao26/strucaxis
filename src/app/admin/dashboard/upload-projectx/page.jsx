"use client";

import ProjectForm from "@/components/ProjectForm";

export default function Page() {
  return (
    <main className="min-h-screen bg-[#F4F1EC] pt-20">
      <section className="max-w-7xl mx-auto md:px-0 px-4 pt-12 pb-16">
        <header className="mb-8">
          <p className="text-xs tracking-[0.18em] uppercase text-neutral-600">Dashboard</p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">New Project</h1>
          <p className="mt-2 text-neutral-700">
            Upload your cover, add gallery images, tag the work, and publish.
          </p>
        </header>

        <div className="rounded-2xl border border-black/10 bg-white shadow-[0_20px_70px_rgba(0,0,0,0.08)] overflow-hidden">
          <ProjectForm />
        </div>
      </section>
    </main>
  );
}