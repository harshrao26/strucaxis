"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaUser,
  FaTags,
  FaSearch,
  FaClock,
  FaShareAlt,
  FaTimes,
} from "react-icons/fa";

/**
 * StrucAxis — Blogs Page (Enhanced, JSX-only, TailwindCSS)
 * Drop into: src/app/blogs/page.jsx
 * - Featured post hero
 * - Category filters + search + sort
 * - Masonry-like responsive grid
 * - Load more + skeletons
 * - Modal reader with share + related posts
 * - Newsletter card + sidebar popular posts
 */

export default function BlogsPage() {
  // -------------------- DATA --------------------
  const allBlogs = [
    {
      id: "blog-1",
      title: "Managing Workforce in Construction Projects",
      author: "Team StrucAxis",
      avatar: "https://i.pravatar.cc/80?img=12",
      date: "Aug 20, 2025",
      read: "6 min",
      category: "Execution",
      tags: ["Execution", "Workforce"],
      img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1400&auto=format&fit=crop",
      excerpt:
        "Workforce management is one of the biggest challenges in contracting. Here’s our playbook for manpower allocation, attendance, and productivity on fast-track sites.",
      content:
        "At StrucAxis, we segment crews by skill and package, align them to a daily micro-schedule, and track progress via simple site dashboards. Clear fronts, early RFIs and night-shift buffers keep milestones intact. We also maintain a rolling lookahead for procurement and vendor readiness...",
      popular: true,
      featured: true,
    },
    {
      id: "blog-2",
      title: "Fast-Track Fit-Outs: Lessons from Hospitality Projects",
      author: "Project Delivery Team",
      avatar: "https://i.pravatar.cc/80?img=24",
      date: "Jul 15, 2025",
      read: "7 min",
      category: "Hospitality",
      tags: ["Hospitality", "Fit-Out"],
      img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1400&auto=format&fit=crop",
      excerpt:
        "Hotels and restaurants open on fixed dates. Learn how sequencing, night shifts, and in-house joinery de-risk launch day.",
      content:
        "Fast-track hospitality fit-outs demand tight sequencing. We lock MEP shop drawings early, prefabricate joinery, and run parallel painting/ceiling/floor cycles. Landlord coordination and mock-ups are done week 1 to avoid late surprises...",
      popular: true,
    },
    {
      id: "blog-3",
      title: "Why In-House Facilities Matter in Interiors",
      author: "Production Team",
      avatar: "https://i.pravatar.cc/80?img=3",
      date: "Jun 10, 2025",
      read: "5 min",
      category: "Production",
      tags: ["Joinery", "Glass", "UPVC"],
      img: "https://images.unsplash.com/photo-1541976076758-347942db1970?q=80&w=1400&auto=format&fit=crop",
      excerpt:
        "Vendor dependencies derail timelines. In-house carpentry, glass, and UPVC give speed, quality and control.",
      content:
        "With in-house units, we run controlled mock-ups, finalize finishes with architects early, and buffer long-lead items. It shortens the procurement critical path and compresses site durations...",
      popular: true,
    },
    {
      id: "blog-4",
      title: "MEP Coordination for Snag-Free Handover",
      author: "MEP Coordination Cell",
      avatar: "https://i.pravatar.cc/80?img=18",
      date: "May 02, 2025",
      read: "8 min",
      category: "MEP",
      tags: ["MEP", "Coordination"],
      img: "https://images.unsplash.com/photo-1581090700227-1e37b190418e?q=80&w=1400&auto=format&fit=crop",
      excerpt:
        "MEP clashes are expensive. Here’s our process to get drawings, approvals and sequencing right the first time.",
      content:
        "We start with a clash matrix and RFI tracker, align the ceiling grid with services, and lock the inspection plan. Drywall closures are sequenced after pressure testing and T&C witnesses...",
    },
    {
      id: "blog-5",
      title: "Green Building Support at StrucAxis",
      author: "Sustainability Team",
      avatar: "https://i.pravatar.cc/80?img=40",
      date: "Apr 05, 2025",
      read: "5 min",
      category: "Sustainability",
      tags: ["Green Building", "GRIHA", "LEED"],
      img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop",
      excerpt:
        "GRIHA/LEED compliance needs planning. From material documentation to waste management — our approach.",
      content:
        "We align submittals to credit requirements, maintain material cut-sheets with certificates, and train crews on segregation. Early buy-in from vendors avoids last-minute gaps...",
    },
    {
      id: "blog-6",
      title: "Costing/BOQ & Value Engineering in Practice",
      author: "Commercial Team",
      avatar: "https://i.pravatar.cc/80?img=7",
      date: "Mar 12, 2025",
      read: "6 min",
      category: "Commercial",
      tags: ["BOQ", "Value Engineering"],
      img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1400&auto=format&fit=crop",
      excerpt:
        "VE is not about making things cheaper — it’s about smarter choices that preserve design intent.",
      content:
        "Alternates are benchmarked on lifecycle cost, availability, and install speed. We propose equivalences with mock-up validation and vendor warranties...",
    },
    {
      id: "blog-7",
      title: "Working in Live Sites & Malls: Playbook",
      author: "Site Leadership",
      avatar: "https://i.pravatar.cc/80?img=54",
      date: "Feb 01, 2025",
      read: "7 min",
      category: "Execution",
      tags: ["Mall Approvals", "Live Sites"],
      img: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4e?q=80&w=1400&auto=format&fit=crop",
      excerpt:
        "HSE, permits, and night-shift logistics — how we minimise downtime and complaints.",
      content:
        "We align with mall SOPs, apply permit-to-work, plan noisy activities in blocks, and use protection systems to keep public areas safe...",
    },
  ];

  // -------------------- STATE --------------------
  const [selected, setSelected] = useState(null);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("Newest");
  const [visible, setVisible] = useState(6);
  const [loadingMore, setLoadingMore] = useState(false);

  // -------------------- DERIVED --------------------
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(allBlogs.map((b) => b.category)))],
    [allBlogs]
  );

  const filtered = allBlogs
    .filter((b) => (category === "All" ? true : b.category === category))
    .filter(
      (b) =>
        !query ||
        b.title.toLowerCase().includes(query.toLowerCase()) ||
        b.excerpt.toLowerCase().includes(query.toLowerCase()) ||
        b.tags.join(" ").toLowerCase().includes(query.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "Newest") return new Date(b.date) - new Date(a.date);
      if (sort === "Oldest") return new Date(a.date) - new Date(b.date);
      if (sort === "Popular") return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
      return 0;
    });

  const featured = filtered.find((b) => b.featured) || filtered[0];
  const gridBlogs = filtered.filter((b) => b.id !== featured?.id).slice(0, visible - 1);

  // -------------------- EFFECTS --------------------
  useEffect(() => {
    // reset visible when filters change
    setVisible(6);
  }, [category, query, sort]);

  // -------------------- HANDLERS --------------------
  const loadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisible((v) => Math.min(v + 6, filtered.length));
      setLoadingMore(false);
    }, 600); // tiny fake delay for skeleton feel
  };

  // -------------------- RENDER --------------------
  return (
    <main className="bg-gray-50 text-gray-900">
      {/* HERO / FEATURED */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={featured?.img}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/10" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 pt-28 pb-16 sm:pt-36 sm:pb-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs text-white backdrop-blur">
            Insights · Execution · Fit-out · MEP · VE · Green Building
          </span>
          <h1 className="mt-6 text-4xl sm:text-6xl font-bold leading-tight text-white">
            StrucAxis Insights & Case Notes
          </h1>
          {featured && (
            <article className="mt-8 grid lg:grid-cols-2 gap-6 rounded-2xl bg-white/10 p-6 backdrop-blur-sm ring-1 ring-white/20">
              <div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-white/90">
                  <Chip>{featured.category}</Chip>
                  <span className="inline-flex items-center gap-1">
                    <FaCalendarAlt /> {featured.date}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <FaClock /> {featured.read}
                  </span>
                </div>
                <h2 className="mt-3 text-2xl sm:text-3xl font-semibold text-white">
                  {featured.title}
                </h2>
                <p className="mt-3 max-w-2xl text-white/90">
                  {featured.excerpt}
                </p>
                <button
                  onClick={() => setSelected(featured)}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-gray-900 hover:bg-gray-100"
                >
                  Read featured <FaArrowRight />
                </button>
              </div>
              <div className="flex items-end gap-3">
                <img
                  src={featured.avatar}
                  alt={featured.author}
                  className="h-10 w-10 rounded-full border border-white/50"
                />
                <div className="text-white/90 text-sm">
                  <div className="font-medium">{featured.author}</div>
                  <div>StrucAxis</div>
                </div>
              </div>
            </article>
          )}
        </div>
      </section>

      {/* FILTER BAR */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full px-3 py-1 text-sm transition ${
                  c === category
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search topics, tags…"
                className="rounded-lg border pl-9 pr-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {["Newest", "Oldest", "Popular"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* GRID + SIDEBAR */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-12   gap-8">
        {/* Masonry-ish grid */}
        <div>
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
            {gridBlogs.slice(0, visible - 1).map((blog) => (
              <Card key={blog.id} blog={blog} onOpen={() => setSelected(blog)} />
            ))}

            {/* skeletons when loading more */}
            {loadingMore &&
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={`s-${i}`} />
              ))}
          </div>

          {/* Load more */}
          {visible < filtered.length && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={loadMore}
                className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-3 text-white hover:bg-black"
              >
                {loadingMore ? "Loading…" : "Load more"} <FaArrowRight />
              </button>
            </div>
          )}
          {filtered.length === 0 && (
            <div className="mt-8 rounded-xl border bg-white p-8 text-center text-gray-600">
              No results. Try a different category or search.
            </div>
          )}
        </div>

        {/* Sidebar */}
        
      </section>

      {/* MODAL READER */}
      {selected && (
        <ReaderModal
          blog={selected}
          all={allBlogs}
          onClose={() => setSelected(null)}
          onOpen={(b) => setSelected(b)}
        />
      )}
    </main>
  );
}

/* -------------------- SMALL COMPONENTS -------------------- */

function Chip({ children }) {
  return (
    <span className="inline-flex items-center rounded bg-white/90 px-2 py-0.5 text-xs font-medium text-gray-800">
      {children}
    </span>
  );
}

function Card({ blog, onOpen }) {
  return (
    <article className="mb-6 break-inside-avoid overflow-hidden rounded-2xl border bg-white hover:shadow-md transition">
      <div className="relative">
        <img
          src={blog.img}
          alt={blog.title}
          className="h-52 w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
          <Chip>{blog.category}</Chip>
          {blog.tags.slice(0, 2).map((t) => (
            <span key={t} className="rounded bg-white/80 px-2 py-0.5 text-xs font-medium text-gray-800">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold hover:text-emerald-700 cursor-pointer" onClick={onOpen}>
          {blog.title}
        </h3>
        <p className="mt-2 text-gray-600">{blog.excerpt}</p>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <span className="inline-flex items-center gap-1">
            <FaCalendarAlt /> {blog.date}
          </span>
          <span className="inline-flex items-center gap-1">
            <FaClock /> {blog.read}
          </span>
          <span className="inline-flex items-center gap-2">
            <img src={blog.avatar} alt={blog.author} className="h-5 w-5 rounded-full" />
            {blog.author}
          </span>
        </div>
        <button
          onClick={onOpen}
          className="mt-4 inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-900"
        >
          Read more <FaArrowRight />
        </button>
      </div>
    </article>
  );
}

function Skeleton() {
  return (
    <div className="mb-6 break-inside-avoid overflow-hidden rounded-2xl border bg-white">
      <div className="h-52 w-full animate-pulse bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-3/4 animate-pulse bg-gray-200 rounded" />
        <div className="h-4 w-5/6 animate-pulse bg-gray-200 rounded" />
        <div className="h-4 w-2/3 animate-pulse bg-gray-200 rounded" />
      </div>
    </div>
  );
}

function Newsletter() {
  return (
    <div className="rounded-2xl border bg-white p-6">
      <h3 className="text-lg font-semibold">Get new posts in your inbox</h3>
      <p className="mt-2 text-gray-600">
        Monthly digest on execution, fit-out and MEP coordination.
      </p>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="mt-4 flex gap-2"
      >
        <input
          type="email"
          placeholder="your@email.com"
          className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">
          Subscribe
        </button>
      </form>
      <p className="mt-2 text-xs text-gray-500">
        By subscribing you agree to receive emails from StrucAxis.
      </p>
    </div>
  );
}

function Popular({ posts, onOpen }) {
  return (
    <div className="rounded-2xl border bg-white p-6">
      <h3 className="text-lg font-semibold">Popular posts</h3>
      <div className="mt-4 space-y-4">
        {posts.map((p) => (
          <button
            key={p.id}
            onClick={() => onOpen(p)}
            className="group flex w-full items-center gap-3 text-left"
          >
            <img src={p.img} alt="" className="h-14 w-20 rounded object-cover" />
            <div>
              <div className="text-sm font-medium group-hover:text-emerald-700">
                {p.title}
              </div>
              <div className="mt-1 text-xs text-gray-500 flex items-center gap-2">
                <FaCalendarAlt /> {p.date} <span>•</span> <FaClock /> {p.read}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function TagCloud({ tags, onPick }) {
  return (
    <div className="rounded-2xl border bg-white p-6">
      <h3 className="text-lg font-semibold">Tags</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((t) => (
          <button
            key={t}
            onClick={() => onPick(t)}
            className="rounded-full bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
          >
            #{t}
          </button>
        ))}
      </div>
    </div>
  );
}

function collectTags(posts) {
  const set = new Set();
  posts.forEach((p) => p.tags.forEach((t) => set.add(t)));
  return Array.from(set).slice(0, 18);
}

function ReaderModal({ blog, all, onClose, onOpen }) {
  const related = all
    .filter((b) => b.id !== blog.id && (b.category === blog.category || b.tags.some((t) => blog.tags.includes(t))))
    .slice(0, 3);

  const shareText = encodeURIComponent(`${blog.title} — by ${blog.author}`);
  const shareUrl = typeof window !== "undefined" ? encodeURIComponent(window.location.href) : "";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-4 sm:p-8">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full bg-gray-100 p-2 hover:bg-gray-200"
          aria-label="Close"
        >
          <FaTimes />
        </button>

        <img src={blog.img} alt={blog.title} className="h-64 w-full object-cover" />

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <Chip>{blog.category}</Chip>
            <span className="inline-flex items-center gap-1">
              <FaCalendarAlt /> {blog.date}
            </span>
            <span className="inline-flex items-center gap-1">
              <FaClock /> {blog.read}
            </span>
            <span className="inline-flex items-center gap-2">
              <img src={blog.avatar} alt={blog.author} className="h-5 w-5 rounded-full" />
              {blog.author}
            </span>
            <span className="ml-auto inline-flex items-center gap-2 text-gray-700">
              <FaShareAlt />
              <a
                className="underline"
                href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Share
              </a>
            </span>
          </div>

          <h2 className="mt-4 text-2xl sm:text-3xl font-bold">{blog.title}</h2>
          <div className="prose prose-neutral max-w-none mt-4">
            <p>{blog.content}</p>
            <p>{blog.content}</p>
          </div>

          {blog.tags?.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {blog.tags.map((t) => (
                <span key={t} className="rounded-full bg-gray-100 px-3 py-1 text-sm">#{t}</span>
              ))}
            </div>
          )}

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-10">
              <h3 className="text-lg font-semibold">Related posts</h3>
              <div className="mt-4 grid sm:grid-cols-3 gap-4">
                {related.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => onOpen(r)}
                    className="text-left rounded-xl border bg-white hover:shadow-sm transition overflow-hidden"
                  >
                    <img src={r.img} alt="" className="h-28 w-full object-cover" />
                    <div className="p-3">
                      <div className="text-sm font-medium">{r.title}</div>
                      <div className="mt-1 text-xs text-gray-500 flex items-center gap-2">
                        <FaCalendarAlt /> {r.date} <span>•</span> <FaClock /> {r.read}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}