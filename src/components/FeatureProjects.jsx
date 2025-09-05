"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";

export default function FeatureProjects() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // lightbox state
  const [active, setActive] = useState(null); // the project object
  const [idx, setIdx] = useState(0);          // current slide index

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/feature-projects", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load projects");
        const data = await res.json();
        setItems(Array.isArray(data.items) ? data.items : []);
      } catch (e) {
        setErr(e.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // stop body scroll while modal open
  useEffect(() => {
    if (active) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => (document.body.style.overflow = prev);
    }
  }, [active]);

  const openLightbox = (project, startIndex = 0) => {
    setActive(project);
    setIdx(startIndex);
  };
  const closeLightbox = () => {
    setActive(null);
    setIdx(0);
  };

  return (
    <section className="relative mx-auto max-w-7xl md:px-0 px-4 py-24">
      {/* backdrop glows */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        aria-hidden
        style={{
          background:
            "radial-gradient(40% 35% at 20% 10%, rgba(124,92,255,0.18) 0%, rgba(11,11,15,0) 70%), radial-gradient(40% 35% at 80% 0%, rgba(255,77,141,0.15) 0%, rgba(11,11,15,0) 70%)",
          filter: "blur(20px)",
        }}
      />

      <div className="flex items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-semibold">Featured Projects</h2>
          <p className="mt-2 text-black/60">A selection of recent work — crafted with care.</p>
        </div>
        <Link href="/work" className="hidden md:inline-block rounded-lg border px-4 py-2 text-sm hover:bg-black/5">
          View all
        </Link>
      </div>

      {/* loading */}
      {loading && (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl border bg-white/50 p-4">
              <div className="h-48 rounded-xl bg-black/10" />
              <div className="mt-4 h-4 w-2/3 rounded bg-black/10" />
              <div className="mt-2 h-4 w-1/2 rounded bg-black/10" />
            </div>
          ))}
        </div>
      )}

      {!loading && err && (
        <div className="mt-10 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          Failed to load projects: {err}
        </div>
      )}

      {!loading && !err && items.length > 0 && (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <ProjectCard key={p._id} p={p} onOpen={openLightbox} />
          ))}
        </div>
      )}

      {!loading && !err && items.length === 0 && (
        <p className="mt-10 text-sm text-black/60">No featured projects yet.</p>
      )}

      {/* Lightbox */}
      {active && (
        <Lightbox
          project={active}
          index={idx}
          onChangeIndex={setIdx}
          onClose={closeLightbox}
        />
      )}
    </section>
  );
}

function ProjectCard({ p, onOpen }) {
  const vidRef = useRef(null);

  // Build slides: cover + galleryImages
  const slides = [
    ...(p.coverImage ? [p.coverImage] : []),
    ...((p.galleryImages || []).filter(Boolean)),
  ];

  return (
    <article
      className="group relative overflow-hidden rounded-2xl border border-black/10 bg-white hover:border-black/20 transition cursor-pointer"
      style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}
      onClick={() => onOpen(p, 0)}
      role="button"
      aria-label={`Open gallery for ${p.title}`}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onOpen(p, 0); }}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        {/* Cover image */}
        {p.mediaType !== "video" && (
          <img
            src={p.coverImage || "/placeholder.png"}
            alt={p.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        )}
        {/* Hover video preview (if provided) */}
        {p.mediaType === "video" && p.mediaUrl && (
          <video
            ref={vidRef}
            src={p.mediaUrl}
            className="h-full w-full object-cover"
            playsInline
            muted
            loop
            onMouseEnter={() => vidRef.current?.play()}
            onMouseLeave={() => vidRef.current?.pause()}
          />
        )}

        {/* soft gradient overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition"
          style={{ background: `linear-gradient(0deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 40%)` }}
        />
        {/* badge */}
        <div
          className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium"
          style={{ color: p.accentColor || "#7C5CFF" }}
          onClick={(e) => e.stopPropagation()}
        >
          {p.client || "Client"}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold tracking-tight">{p.title}</h3>
        <p className="mt-1 text-sm text-black/70 line-clamp-2">{p.blurb}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-black/70">
          {p.year && <span>{p.year}</span>}
          {p.tags?.slice(0, 3).map((t) => (
            <span key={t} className="rounded-full bg-black/5 px-2 py-1">{t}</span>
          ))}
          {p.tags?.length > 3 && <span className="opacity-60">+{p.tags.length - 3}</span>}
        </div>

        <div className="mt-4 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {p.caseStudyUrl ? (
            <a href={p.caseStudyUrl} className="rounded-lg bg-black text-white px-3 py-1.5 text-xs font-medium hover:opacity-90">
              Case Study
            </a>
          ) : p.liveUrl ? (
            <a href={p.liveUrl} className="rounded-lg bg-black text-white px-3 py-1.5 text-xs font-medium hover:opacity-90">
              View Live
            </a>
          ) : null}
          {p.dribbbleUrl && (
            <a href={p.dribbbleUrl} className="rounded-lg border px-3 py-1.5 text-xs hover:bg-black/5">Dribbble</a>
          )}
          {p.awwwardsUrl && (
            <a href={p.awwwardsUrl} className="rounded-lg border px-3 py-1.5 text-xs hover:bg-black/5">Awwwards</a>
          )}
        </div>
      </div>

      {/* glossy beam on hover */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100" aria-hidden>
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-transparent via-white/30 to-transparent blur-xl" />
      </div>
    </article>
  );
}

/* ----------------- Lightbox ----------------- */

function Lightbox({ project, index, onChangeIndex, onClose }) {
  const slides = [
    ...(project.coverImage ? [project.coverImage] : []),
    ...((project.galleryImages || []).filter(Boolean)),
  ];
  const total = slides.length || 1;

  const clamp = (i) => (i + total) % total;
  const next = useCallback(() => onChangeIndex((i) => clamp(i + 1)), [onChangeIndex, total]);
  const prev = useCallback(() => onChangeIndex((i) => clamp(i - 1)), [onChangeIndex, total]);

  // keyboard controls
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      {/* container (stops propagation so clicks inside don't close) */}
      <div
        className="relative mx-auto w-full max-w-6xl px-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="mb-3 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-2 w-2 rounded-full" style={{ background: project.accentColor || "#7C5CFF" }} />
            <h3 className="text-lg font-medium">{project.title}</h3>
           
          </div>
          <button
            onClick={onClose}
            className="rounded-md border border-white/20 px-3 py-1.5 text-sm text-white hover:bg-white/10"
          >
             ×
          </button>
        </div>

        {/* media viewer */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-black/40">
          <img
            src={slides[index] || project.coverImage || "/placeholder.png"}
            alt={`${project.title} - ${index + 1}`}
            className="h-full w-full object-contain"
          />

          {/* arrows */}
          {total > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-3 py-2 text-white hover:bg-white/20"
                aria-label="Previous"
              >
                ‹
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-3 py-2 text-white hover:bg-white/20"
                aria-label="Next"
              >
                ›
              </button>
            </>
          )}

          {/* index pill */}
        
        </div>

        {/* thumbnails */}
        {total > 1 && (
          <div className="mt-4 grid grid-cols-6 gap-2 md:grid-cols-8">
            {slides.map((src, i) => (
              <button
                key={src + i}
                onClick={() => onChangeIndex(i)}
                className={`relative aspect-[16/10] overflow-hidden rounded-lg border ${i === index ? "border-white" : "border-white/20"} hover:border-white/60`}
                aria-label={`Go to slide ${i + 1}`}
              >
                <img src={src} alt={`thumb ${i + 1}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* actions */}
        {/* <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          {project.caseStudyUrl && (
            <a href={project.caseStudyUrl} className="rounded-lg bg-white text-black px-3 py-1.5 hover:opacity-90">Case Study</a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} className="rounded-lg border border-white/30 text-white px-3 py-1.5 hover:bg-white/10">View Live</a>
          )}
          {project.dribbbleUrl && (
            <a href={project.dribbbleUrl} className="rounded-lg border border-white/30 text-white px-3 py-1.5 hover:bg-white/10">Dribbble</a>
          )}
          {project.awwwardsUrl && (
            <a href={project.awwwardsUrl} className="rounded-lg border border-white/30 text-white px-3 py-1.5 hover:bg-white/10">Awwwards</a>
          )}
        </div> */}
      </div>
    </div>
  );
}