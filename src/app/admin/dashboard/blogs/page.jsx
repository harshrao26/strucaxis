"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiCalendar,
  FiUser,
  FiFileText,
  FiTag,
} from "react-icons/fi";
import logo from "@/assets/logo.png";

/** -------------------------- Small utilities -------------------------- **/
function classNames(...s) {
  return s.filter(Boolean).join(" ");
}
function useDebouncedValue(value, delay = 350) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

/** ----------------------------- Skeleton ------------------------------ **/
function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl overflow-hidden border border-black/10 bg-white">
      <div className="aspect-[16/9] bg-neutral-200" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-24 bg-neutral-200 rounded" />
        <div className="h-5 w-3/4 bg-neutral-200 rounded" />
        <div className="h-3 w-full bg-neutral-200 rounded" />
        <div className="h-3 w-2/3 bg-neutral-200 rounded" />
        <div className="flex gap-2 pt-2">
          <div className="h-5 w-16 bg-neutral-200 rounded-full" />
          <div className="h-5 w-16 bg-neutral-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/** --------------------------- Empty state ----------------------------- **/
function EmptyState({ onCreate, onRefresh }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F4F1EC]">
        <FiFileText />
      </div>
      <h3 className="text-lg font-semibold">No blog posts yet</h3>
      <p className="mt-1 text-neutral-600">
        Create your first article or refresh if you think this is a mistake.
      </p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-2 rounded-full border border-black/20 px-4 py-2 text-sm hover:bg-black/5"
        >
          <FiRefreshCw /> Refresh
        </button>
        <Link
          href="/admin/dashboard/blogs/new"
          className="inline-flex items-center gap-2 rounded-full border border-black px-5 py-2 text-sm hover:bg-black hover:text-white"
        >
          <FiPlus /> New Blog
        </Link>
      </div>
    </div>
  );
}

/** ----------------------------- Badge ------------------------------- **/
function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#F4F1EC] border border-black/10 px-2 py-0.5 text-[11px]">
      {children}
    </span>
  );
}

/** ----------------------------- Main Page ---------------------------- **/
export default function BlogListPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // controls
  const [q, setQ] = useState("");
  const dq = useDebouncedValue(q, 300);
  const [category, setCategory] = useState("All");
  const [author, setAuthor] = useState("All");
  const [sort, setSort] = useState("updated-desc");

  const [deleting, setDeleting] = useState(null);

  const fetchBlogs = async () => {
    setLoading(true);
    const res = await fetch("/api/blogs", { cache: "no-store" });
    const data = await res.json();
    if (data?.success && Array.isArray(data.blogs)) {
      setBlogs(data.blogs);
    } else if (Array.isArray(data)) {
      setBlogs(data);
    } else {
      setBlogs([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (slug) => {
    if (!confirm("Delete this blog?")) return;
    setDeleting(slug);
    const prev = blogs;
    setBlogs((arr) => arr.filter((b) => b.urlSlug !== slug));
    try {
      const res = await fetch(`/api/blogs/${slug}`, { method: "DELETE" });
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        alert("Error deleting: " + (error?.error || "Unknown error"));
        setBlogs(prev);
      }
    } finally {
      setDeleting(null);
    }
  };

  // facet data
  const categories = useMemo(() => {
    const set = new Set(blogs.map((b) => b.category).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [blogs]);

  const authors = useMemo(() => {
    const set = new Set(blogs.map((b) => b.author).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [blogs]);

  // filtering
  const filtered = useMemo(() => {
    const s = (dq || "").toLowerCase();
    let list = [...blogs];

    if (s) {
      list = list.filter(
        (b) =>
          (b.title || "").toLowerCase().includes(s) ||
          (b.description || "").toLowerCase().includes(s) ||
          (b.category || "").toLowerCase().includes(s) ||
          (b.author || "").toLowerCase().includes(s)
      );
    }
    if (category !== "All") list = list.filter((b) => b.category === category);
    if (author !== "All") list = list.filter((b) => b.author === author);

    switch (sort) {
      case "updated-asc":
        list.sort(
          (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt)
        );
        break;
      case "title-asc":
        list.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        break;
      case "title-desc":
        list.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
        break;
      default:
        // updated-desc
        list.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
    }
    return list;
  }, [blogs, dq, category, author, sort]);

  return (
    <main className="min-h-screen pt-20 bg-[#F4F1EC]">
      {/* Header */}
      <header className=" -b bg-[#F4F1EC]/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            
          </div>
          <Link
            href="/admin/dashboard/blogs/new"
            className="inline-flex bg-[#FF4017] items-center gap-2 rounded-full   border-  px-4 h-10 text-white transition"
          >
            <FiPlus /> New Post
          </Link>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-5 py-6">
        {/* Controls */}
        <div className="rounded-2xl border border-black/10 bg-white p-4 md:p-5 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-5 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search title, description, author, category…"
                className="w-full pl-9 pr-3 h-10 rounded-full border border-black/15 bg-white outline-none focus:ring-2 focus:ring-black/20"
              />
            </div>
            <div className="md:col-span-2 flex items-center gap-2">
              <FiFilter className="text-neutral-500" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-10 w-full rounded-full border border-black/15 bg-white px-3 focus:ring-2 focus:ring-black/20"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <select
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="h-10 w-full rounded-full border border-black/15 bg-white px-3 focus:ring-2 focus:ring-black/20"
              >
                {authors.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-3">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-10 w-full rounded-full border border-black/15 bg-white px-3 focus:ring-2 focus:ring-black/20"
              >
                <option value="updated-desc">Newest updated</option>
                <option value="updated-asc">Oldest updated</option>
                <option value="title-asc">Title A–Z</option>
                <option value="title-desc">Title Z–A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Metrics row */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          <Metric label="Total Posts" value={blogs.length} />
          <Metric label="Visible Now" value={filtered.length} />
          <Metric
            label="Unique Authors"
            value={authors.filter((a) => a !== "All").length}
          />
          <Metric
            label="Categories"
            value={categories.filter((c) => c !== "All").length}
          />
        </div>

        {/* Grid */}
        <div className="mt-6">
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState onCreate={() => {}} onRefresh={fetchBlogs} />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((blog) => (
                <article
                  key={blog._id}
                  className="rounded-2xl overflow-hidden border border-black/10 bg-white group shadow-[0_6px_18px_rgba(0,0,0,0.05)] hover:shadow-[0_14px_40px_rgba(0,0,0,0.10)] transition-shadow"
                >
                  <figure className="relative aspect-[16/9] overflow-hidden">
                    <img
                      src={blog.image || "/placeholder.png"}
                      alt={blog.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                    <figcaption className="absolute left-3 top-3 flex items-center gap-2">
                      <Badge><FiTag className="mr-1" /> {blog.category || "General"}</Badge>
                    </figcaption>
                  </figure>

                  <div className="p-4">
                    <h2 className="text-lg font-semibold leading-snug line-clamp-2">
                      {blog.title}
                    </h2>
                    <p className="mt-1 text-[13px] text-neutral-600 line-clamp-2">
                      {blog.description || "No description"}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-xs text-neutral-600">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1">
                          <FiCalendar />
                          {blog.updatedAt
                            ? new Date(blog.updatedAt).toLocaleDateString()
                            : "—"}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <FiUser />
                          {blog.author || "Unknown"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-end gap-2 border-t pt-3">
                      <Link
                        href={`/admin/dashboard/blogs/${blog.urlSlug}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-black/20 px-3 py-1.5 text-sm hover:bg-black/5"
                        title="Edit"
                      >
                        <FiEdit2 /> Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(blog.urlSlug)}
                        disabled={deleting === blog.urlSlug}
                        className={classNames(
                          "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition",
                          deleting === blog.urlSlug
                            ? "border-black/20 text-neutral-500 cursor-wait"
                            : "border-black hover:bg-black hover:text-white"
                        )}
                        title="Delete"
                      >
                        <FiTrash2 />
                        {deleting === blog.urlSlug ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Local styles */}
      <style jsx>{`
        .chip {
          @apply rounded-full bg-[#F4F1EC] border border-black/10 px-3 py-1 text-xs;
        }
      `}</style>
    </main>
  );
}

/** --------------------------- Metric component --------------------------- **/
function Metric({ label, value }) {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-4 flex items-center gap-3 shadow-[0_8px_26px_rgba(0,0,0,0.05)]">
      <div className="h-9 w-9 rounded-full bg-[#F4F1EC] border border-black/10 flex items-center justify-center text-[13px]">
        {String(label).slice(0, 1)}
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-neutral-600">{label}</div>
        <div className="text-lg font-semibold">{value}</div>
      </div>
    </div>
  );
}