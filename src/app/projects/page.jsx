"use client";

import Link from "next/link";
import ProjectCardSkeleton from "@/components/ProjectCardSkeleton";
import { useEffect, useMemo, useState } from "react";
import {
  FiSearch,
  FiFilter,
  FiMapPin,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

/* ----------------------------- helpers ----------------------------- */

function slugify(s = "") {
  return s
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// normalize items from either /api/projects or /api/feature-projects
function normalizeProjects(raw) {
  const arr = Array.isArray(raw?.items)
    ? raw.items
    : Array.isArray(raw?.data)
    ? raw.data
    : Array.isArray(raw)
    ? raw
    : [];

  return arr.map((p) => {
    const isFeature = "coverImage" in p || "galleryImages" in p;

    const cover = isFeature ? p.coverImage : p.cover;
    const gallery = isFeature ? p.galleryImages || [] : p.gallery || [];
    const title = p.title || "Untitled";
    const slug = p.slug || p._id || p.id || slugify(title);
    const type =
      p.type ||
      (Array.isArray(p.tags) && p.tags.length ? p.tags[0] : "Project");
    const location = p.location || "";
    const description = p.description || p.blurb || "";
    const yearOrTimeline = isFeature ? p.year : p.timeline;

    return {
      id: p._id || p.id || slug,
      slug: String(slug),
      title,
      cover,
      gallery,
      type,
      location,
      description,
      tags: p.tags || [],
      timeline: yearOrTimeline || "",
      _raw: p,
    };
  });
}

/* ----------------------------- UI bits ----------------------------- */

function Pill({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-full text-sm border transition-all ${
        active
          ? "bg-black text-white border-black shadow-[0_6px_16px_rgba(0,0,0,0.15)]"
          : "bg-white text-neutral-700 border-black/10 hover:border-black/20 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
      }`}
    >
      {children}
    </button>
  );
}

function StatChip({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700 border border-black/10">
      <Icon className="opacity-70" /> {children}
    </span>
  );
}

/* ----------------------------- Card ----------------------------- */

function ProjectCard({ item }) {
  const href = `/projects/${encodeURIComponent(item.slug)}`;

  return (
    <Link
      href={href}
      className="group relative block rounded-2xl overflow-hidden bg-white border border-black/5 hover:border-black/10 shadow-[0_6px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_14px_36px_rgba(0,0,0,0.08)] transition-all"
      style={{ transform: "translateZ(0)" }}
    >
      {/* Media */}
      <figure className="relative overflow-hidden">
        <div className="relative aspect-[3/2] bg-neutral-100">
          <img
            src={item.cover}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            loading="lazy"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        </div>

        {/* Caption overlay */}
        <figcaption className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="text-white text-lg font-semibold drop-shadow">
            {item.title}
          </h3>
          <div className="mt-1 flex items-center gap-2">
            {item.location && <StatChip icon={FiMapPin}>{item.location}</StatChip>}
            {item.timeline && <StatChip icon={FiCalendar}>{item.timeline}</StatChip>}
          </div>
        </figcaption>

        {/* Type ribbon */}
        <div className="absolute left-4 top-4">
          <span className="px-2.5 py-1 rounded-full text-[11px] uppercase tracking-widest bg-white text-black font-semibold border border-black/10">
            {item.type}
          </span>
        </div>
      </figure>

      {/* Meta */}
      <div className="p-5">
        {item.description && (
          <p className="text-[15px] text-neutral-800 line-clamp-2">
            {item.description}
          </p>
        )}
        {!!(item.tags || []).length && (
          <div className="mt-3 flex flex-wrap gap-2">
            {(item.tags || []).slice(0, 4).map((t) => (
              <span
                key={t}
                className="text-xs px-2 py-1 rounded-full bg-neutral-100 text-neutral-700 border border-black/10"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Divider + CTA */}
        <div className="mt-5 flex items-center justify-between">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
          <span className="ml-4 text-xs font-semibold px-3 py-1 rounded-full border border-black/10 bg-neutral-50 text-neutral-800 group-hover:bg-black group-hover:text-white group-hover:border-black transition">
            View project
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ----------------------------- Page ----------------------------- */

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [tags, setTags] = useState([]);
  const [type, setType] = useState("All");
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const [loading, setLoading] = useState(true);

  async function fetchSafely(url) {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Fetch failed");
    return res.json();
  }

  async function load() {
    try {
      setLoading(true);

      // Prefer feature-projects for your latest schema
      let raw = await fetchSafely("/api/feature-projects");
      let list = normalizeProjects(raw);

      // Fallback to /api/projects if needed
      if (!list.length) {
        raw = await fetchSafely("/api/projects");
        list = normalizeProjects(raw);
      }

      setProjects(list);

      const uniqueTags = Array.from(
        new Set(list.flatMap((p) => (Array.isArray(p.tags) ? p.tags : [])))
      );
      setTags(uniqueTags);
    } catch (e) {
      console.error(e);
      setProjects([]);
      setTags([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    let list = Array.isArray(projects) ? [...projects] : [];
    if (type && type !== "All") list = list.filter((p) => p.type === type);
    if (q) {
      const s = q.toLowerCase();
      list = list.filter(
        (p) =>
          (p.title || "").toLowerCase().includes(s) ||
          (p.location || "").toLowerCase().includes(s) ||
          (Array.isArray(p.tags) ? p.tags.join(" ") : "").toLowerCase().includes(s)
      );
    }
    if (tag)
      list = list.filter((p) => Array.isArray(p.tags) && p.tags.includes(tag));
    return list;
  }, [projects, type, q, tag]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [pageCount, page]);

  const visible = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const typeTabs = ["All", "Interior", "Architecture"];

  return (
    <main className="min-h-screen bg-[#F7F7F5] text-[#101010]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#F7F7F5] to-[#EFEDE8]" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: "radial-gradient(#ddd 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
          <span className="inline-flex items-center text-[11px] tracking-[0.22em] font-semibold uppercase px-3 py-1 rounded-full border border-black/10 bg-white">
            Work Library
          </span>
          <h1 className="mt-4 text-4xl lg:text-6xl font-semibold tracking-tight">
            Projects
          </h1>
          <p className="mt-3 text-neutral-700 max-w-2xl">
            A curated sweep of hospitality &amp; residential builds — executed
            with transparency and an architect’s eye for detail.
          </p>

          {/* Controls Bar */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 bg-white/70 backdrop-blur rounded-2xl border border-black/10 p-3">
            <div className="relative flex-1 min-w-[220px]">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                placeholder="Search titles, locations, tags…"
                value={q}
                onChange={(e) => {
                  setPage(1);
                  setQ(e.target.value);
                }}
                className="w-full h-10 pl-9 pr-3 rounded-xl bg-white border border-black/10 outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-black/20"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-2 text-neutral-700 text-sm">
                <FiFilter />
                Filter
              </div>
              <select
                value={type}
                onChange={(e) => {
                  setPage(1);
                  setType(e.target.value);
                }}
                className="h-10 rounded-xl bg-white border border-black/10 px-3 text-neutral-800 focus:ring-2 focus:ring-black/20 outline-none"
              >
                {typeTabs.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div className="mt-4 overflow-x-auto">
            <div className="flex items-center gap-2 min-w-max">
              <Pill
                active={!tag}
                onClick={() => {
                  setTag("");
                  setPage(1);
                }}
              >
                All tags
              </Pill>
              {tags.map((t) => (
                <Pill
                  key={t}
                  active={tag === t}
                  onClick={() => {
                    setTag(t);
                    setPage(1);
                  }}
                >
                  {t}
                </Pill>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="relative max-w-7xl mx-auto px-6 lg:px-12 pb-14">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="text-neutral-600">No projects found.</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((p) => (
              <ProjectCard key={p.id} item={p} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {filtered.length > pageSize && (
          <div className="mt-10 flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((x) => Math.max(1, x - 1))}
              className="inline-flex items-center gap-2 rounded-full border border-black/20 px-4 py-2 text-sm text-neutral-800 bg-white hover:bg-black hover:text-white transition disabled:opacity-40"
              disabled={page <= 1}
            >
              <FiChevronLeft /> Prev
            </button>
            <span className="text-sm text-neutral-700">
              Page {page} of {Math.max(1, Math.ceil(filtered.length / pageSize))}
            </span>
            <button
              onClick={() =>
                setPage((x) =>
                  Math.min(Math.ceil(filtered.length / pageSize), x + 1)
                )
              }
              className="inline-flex items-center gap-2 rounded-full border border-black/20 px-4 py-2 text-sm text-neutral-800 bg-white hover:bg-black hover:text-white transition disabled:opacity-40"
              disabled={page >= Math.ceil(filtered.length / pageSize)}
            >
              Next <FiChevronRight />
            </button>
          </div>
        )}
      </section>
    </main>
  );
}