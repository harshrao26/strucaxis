"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaChevronDown, FaSearch, FaSortAmountDown } from "react-icons/fa";
import BlogCard from "@/components/BlogCard.jsx";
import BlogCardSkeleton from "@/components/BlogCardSkeleton";
import bloghero from "@/assets/logo.png";

const BRAND = {
  primary: "#ff4017",
  primaryDark: "#ff4017",
  primarySoft: "rgba(131, 61, 250, 0.10)",
};

export default function Page() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [filterType, setFilterType] = useState("Most Recent");
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`/api/blogs`);
        const data = await res.json();
        if (data && data.success) {
          const formatted = data.blogs.map((blog) => ({
            id: blog._id,
            image: blog.image,
            category: blog.category || "General",
            date: new Date(blog.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            readTime: blog.readTime || "5 mins read",
            title: blog.title,
            summary: blog.metaDescription,
            authorName: blog.author || "Unknown",
            authorImage: "/authors/default.jpg",
            timestamp: new Date(blog.createdAt).getTime(),
            views: blog.views || 0,
            slug: blog.urlSlug,
          }));
          setBlogs(formatted);
        }
      } catch (e) {
        console.error("❌ Failed to fetch blogs", e);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const categories = useMemo(() => {
    const set = new Set();
    blogs.forEach((b) => b.category && set.add(b.category));
    return ["All", ...Array.from(set).sort()];
  }, [blogs]);

  const filteredPosts = useMemo(() => {
    let filtered =
      selectedCategory === "All"
        ? [...blogs]
        : blogs.filter((p) => p.category === selectedCategory);

    if (submittedSearch.trim()) {
      const t = submittedSearch.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(t) ||
          (p.summary || "").toLowerCase().includes(t) ||
          (p.category || "").toLowerCase().includes(t)
      );
    }

    if (filterType === "Most Viewed") {
      filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (sortBy === "Newest") {
      filtered.sort((a, b) => b.timestamp - a.timestamp);
    } else {
      filtered.sort((a, b) => a.timestamp - b.timestamp);
    }

    return filtered;
  }, [blogs, selectedCategory, sortBy, submittedSearch, filterType]);

  return (
    <div className="relative bg-[#F3F1EB]  min-h-screen ">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 h-80 blur-3xl"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 40%, rgba(35,77,126,.25), rgba(35,77,126,0) 70%)",
        }}
      />
      <Hero
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={() => setSubmittedSearch(searchTerm)}
      />

      <Toolbar
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
        filterType={filterType}
        setFilterType={setFilterType}
        onSearch={() => setSubmittedSearch(searchTerm)}
      />

      <section className="max-w-7xl bg-[] mt-4 mx-auto px-4 sm:px-0 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <BlogCardSkeleton key={i} />
              ))
            : filteredPosts.length > 0
            ? filteredPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => router.push(`/blogs/${post.slug}`)}
                  className="cursor-pointer group"
                >
                  <div className="rounded-2xl border border-zinc-100/80 shadow-[0_4px_30px_rgba(17,17,26,0.04)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_14px_40px_rgba(35,77,126,0.15)] bg-white/90 backdrop-blur">
                    <BlogCard {...post} />
                  </div>
                </div>
              ))
            : (
              <EmptyState
                reset={() => {
                  setSearchTerm("");
                  setSubmittedSearch("");
                  setSelectedCategory("All");
                  setSortBy("Newest");
                  setFilterType("Most Recent");
                }}
              />
            )}
        </div>
      </section>
    </div>
  );
}

/* --------------------------------- HERO --------------------------------- */

function Hero({ searchTerm, setSearchTerm, onSearch }) {
  return (
    <header className="relative bg-[#F3F1EB] pt">
      <div className="max-w-7xl mx-auto px-4 sm:px-0 pt-16 md:pt-10 pb-10 md:pb-16">
        <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br   ring-1 ring-zinc-100">
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-transparent via-[rgba(59,59,59,0.4)] to-transparent"
          />
          <div className="relative z-10  flex justify-center mx-auto text-center items-center gap-8 p-6 md:p-12">
            <div>
              <p className="inline-flex items-center text-xs font-semibold tracking-wide uppercase text-zinc-600/70">
                Insights • Playbooks • Stories
              </p>
              <h1 className="mt-2 font-medium max-w-3xl leading-tight tracking-tight text-3xl sm:text-5xl md:text-6xl text-[#0F1222]">
                Strategies, Stories &{" "}
                <span
                  className="px-3  rounded-xl ml-1 bg-[#ff4017] text-white"
                 >
                  Solutions
                </span>{" "}
                of the Industry
              </h1>
              <p className="mt-4 mx-auto text-center max-w-2xl text-zinc-600">
                Practical growth, marketing, and product lessons from the trenches. Curated by StrucAxis.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onSearch();
                }}
                className="mt-6 flex w-full  items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-[rgba(35,77,126,0.25)]"
              >
                <FaSearch className="shrink-0 text-zinc-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search articles, tips & growth plays…"
                  className="w-full bg-transparent py-2 outline-none text-zinc-900 placeholder:text-zinc-400"
                />
                <button
                  type="submit"
                  className="ml-2 rounded-lg bg-[#ff4017] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#ff4017]"
                >
                  Search
                </button>
              </form>

              
            </div>

             
          </div>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------- TOOLBAR -------------------------------- */

function Toolbar({
  categories,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  filterType,
  setFilterType,
  onSearch,
}) {
  return (
    <div className="sticky py- top-0 z-30 border-b border-zinc-100 bg-[#F3F1EB] backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm transition ${
                  active
                    ? "border-transparent bg-[#ff4017] text-white shadow-sm"
                    : "border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Select
            label="Sort"
            value={sortBy}
            onChange={setSortBy}
            options={["Newest", "Oldest"]}
          />
          <Select
            label="Filter"
            value={filterType}
            onChange={setFilterType}
            options={["Most Recent", "Most Viewed"]}
          />
          <button
            onClick={onSearch}
            className="hidden md:inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            <FaSortAmountDown />
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <span className="text-zinc-500">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none rounded-lg border border-zinc-200 bg-white px-3 pr-8 py-2 text-sm font-medium text-zinc-800 shadow-sm hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-[rgba(35,77,126,0.25)]"
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <FaChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500" />
      </div>
    </label>
  );
}

/* ------------------------------ Empty State ------------------------------ */

function EmptyState({ reset }) {
  return (
    <div className="col-span-full">
      <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-10 text-center">
        <div
          className="mx-auto h-16 w-16 rounded-full"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 50%, rgba(35,77,126,.15), rgba(35,77,126,0))",
          }}
        />
        <h3 className="mt-4 text-lg font-semibold text-zinc-900">No results found</h3>
        <p className="mt-1 text-zinc-600">
          Try clearing filters or searching with different keywords.
        </p>
        <button
          onClick={reset}
          className="mt-4 rounded-lg bg-[#ff4017] px-4 py-2 text-sm font-semibold text-white hover:bg-[#ff4017]"
        >
          Reset filters
        </button>
      </div>
    </div>
  );
}