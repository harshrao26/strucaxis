"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

/**
 * ProjectsShowcase — premium strip (4 items)
 * - Fetches /api/projects?limit=4&sort=-createdAt
 * - Elegant header + right-aligned "All projects →"
 * - Vertical separators, hover zoom, soft gradient, title reveal
 */
export default function ProjectsShowcase({ className = "" }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`/api/projects?limit=4&sort=-createdAt`, { cache: "no-store" });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "Failed to load projects");
        if (alive) setProjects((json.items || []).slice(0, 4));
      } catch (e) {
        console.error("ProjectsShowcase fetch error:", e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  return (
    <section className={`relative ${className}`}>
      <div className="mx-auto max-w-7xl px-5 my-16 sm:px-8">
        {/* Header */}
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-2xl sm:text-4xl font-semibold  ">
            Latest projects
             <p className="text-base mt-2 text-medium text-zinc-500">
            Projects delivered by us


          </p>
          </h2>
         
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-800 hover:text-black"
          >
            All projects
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>

        {/* Strip */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="relative overflow-hidden rounded-xl bg-zinc-200">
                <div className="animate-pulse aspect-[3/4]" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {projects.map((p, idx) => (
              <Card key={p._id || p.slug} project={p} showDivider={idx < 3} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* --- Single card with Awwwards-style polish --- */
function Card({ project, showDivider }) {
  const { slug, title, client, coverImage, coverAlt } = project || {};
  return (
    <Link
      href={`/projects/${slug}`}
      className="group relative block overflow-hidden rounded-xl bg-white ring-1 ring-zinc-200"
    >
      {/* image */}
      {coverImage ? (
        <img
          src={coverImage}
          alt={coverAlt || title}
          className="aspect-[3/4] w-full object-cover transition-transform duration-[700ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.04]"
        />
      ) : (
        <div className="aspect-[3/4] grid place-items-center bg-zinc-100 text-zinc-500 text-xs">No image</div>
      )}

      {/* soft gradient + caption reveal */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3 sm:p-4">
        <div className="translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <p className="line-clamp-1 text-sm font-medium text-white/95">{title}</p>
          {client ? <p className="mt-0.5 text-xs text-white/80">{client}</p> : null}
        </div>
      </div>

      {/* subtle vertical divider to mimic magazine layout */}
      {showDivider && (
        <span className="absolute right-[-6px] top-[6%] hidden h-[88%] w-px bg-zinc-200 md:block" aria-hidden />
      )}
    </Link>
  );
}