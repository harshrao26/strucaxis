"use client";

import ContactCta from "@/components/ContactCta";
import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaCouch, FaHardHat, FaHammer, FaTools, FaWarehouse, FaWhatsapp, FaPhoneAlt, FaArrowRight, FaShieldAlt, FaClock } from "react-icons/fa";
import { MdOutlinePrecisionManufacturing } from "react-icons/md";
import Link from "next/link";
import MilestonesExact from "@/components/Milestones";
import CapabilitiesBlock from "@/components/CapabilitiesBlock.jsx";
import { LogoCarouselDemo } from "@/components/LogoCarouselDemo";
/**
 * In-House Fit-Out — StrucAxis
 * A full, production-ready page (JSX only; no TS) inspired by modern award sites.
 * - Hero with split marquee + value props
 * - Clients strip
 * - What “In-House” means (facilities, advantages)
 * - Capabilities grid
 * - Process timeline
 * - Featured work carousel (simple, client-side)
 * - Proof: metrics + badges
 * - Testimonials (animated fade)
 * - FAQs
 * - Big CTA
 *
 * TailwindCSS classes assume your project already has Tailwind configured.
 */

export default function InHouseFitoutPage() {

  // ---------- Featured Work: fetch from backend ----------

const [featuredWorks, setFeaturedWorks] = useState([]);
const [fwLoading, setFwLoading] = useState(true);
const [fwError, setFwError] = useState(null);
 
// normalize helper to support both /api/feature-projects and /api/projects
function normalizeFeatured(raw) {
  const arr = Array.isArray(raw?.items)
    ? raw.items
    : Array.isArray(raw?.data)
    ? raw.data
    : Array.isArray(raw)
    ? raw
    : [];

  return arr.map((p) => {
    const isFeature = "coverImage" in p || "galleryImages" in p;
    return {
      title: p.title || "Untitled",
      img: isFeature ? p.coverImage : p.cover,
      tag:
        (Array.isArray(p.tags) && p.tags[0]) ||
        p.type ||
        "Project",
      slug: p.slug || p._id || p.id || "",
      blurb: p.blurb || p.description || "",
    };
  }).filter(w => !!w.img); // ensure image exists
}

useEffect(() => {
  let canceled = false;

  async function loadFeatured() {
    try {
      setFwLoading(true);
      setFwError(null);

      // 1) Prefer feature-projects
      let res = await fetch("/api/feature-projects", { cache: "no-store" });
      let data = res.ok ? await res.json() : null;
      let list = normalizeFeatured(data);

      // 2) Fallback to /api/projects if empty
      if (!list.length) {
        res = await fetch("/api/projects", { cache: "no-store" });
        data = res.ok ? await res.json() : null;
        list = normalizeFeatured(data);
      }

      if (!canceled) {
        setFeaturedWorks(list.slice(0, 10)); // cap to first 10 for carousel
        setCurrent(0);
      }
    } catch (e) {
      if (!canceled) setFwError("Failed to load featured work.");
      console.error(e);
    } finally {
      if (!canceled) setFwLoading(false);
    }
  }

  loadFeatured();
  return () => {
    canceled = true;
  };
}, []);

// auto-rotate (3.5s)
useEffect(() => {
  if (!featuredWorks.length) return;
  const id = setInterval(
    () => setCurrent((i) => (i + 1) % featuredWorks.length),
    5000
  );
  return () => clearInterval(id);
}, [featuredWorks.length]);
  // ----- Simple carousel for "Featured Work"
  const works = [
    {
      title: "Retail Flagship – Mumbai",
      img: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1600&auto=format&fit=crop",
      tag: "Retail Interiors",
    },
    {
      title: "Boutique Hotel Lobby – Goa",
      img: "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1600&auto=format&fit=crop",
      tag: "Hospitality",
    },
    {
      title: "Corporate HQ – Pune",
      img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1600&auto=format&fit=crop",
      tag: "Office Fit-out",
    },
    {
      title: "Fine-Dine Restaurant – Bengaluru",
      img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600&auto=format&fit=crop",
      tag: "F&B",
    },
    {
      title: "Clinic & Diagnostics – Hyderabad",
      img: "https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=1600&auto=format&fit=crop",
      tag: "Healthcare",
    },
  ];
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setCurrent((i) => (i + 1) % works.length), 3500);
    return () => clearInterval(id);
  }, []);

  // ----- Testimonials rotator
  const testimonials = [
    {
      quote:
        "StrucAxis’ in-house joinery and glass unit gave us unmatched speed and consistency. Handover was exactly on the date promised.",
      name: "Ar. Meenakshi Rao",
      role: "Principal Architect, Bengaluru",
    },
    {
      quote:
        "For fast-track hospitality fit-outs, they’re simply reliable. Mall coordination, safety, and QA/QC were all handled end-to-end.",
      name: "Ms. Priya Verma",
      role: "GM Operations, Lemon Tree Hotels",
    },
    {
      quote:
        "Their workforce control and procurement discipline kept our budget tight. Finishes are premium, snag list was minimal.",
      name: "Mr. Nikhil Kapoor",
      role: "Facility Head, Infosys Pune",
    },
  ];
  const [tIndex, setTIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTIndex((i) => (i + 1) % testimonials.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="bg-[#F4F1EC] text-gray-900">
      {/* -------------------------------------------------- */}
      {/* HERO */}
      {/* -------------------------------------------------- */}
      <section className="relative overflow-hidden">
        {/* Background split marquee */}
        <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2">
          <MarqueeColumn
            images={[
              "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1400&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1400&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1400&auto=format&fit=crop",
            ]}
            direction="up"
          />
          <MarqueeColumn
            images={[
              "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=1400&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=1400&auto=format&fit=crop",
            ]}
            direction="down"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/20" />

        {/* Content */}
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 pt-28 pb-20 sm:pt-36 sm:pb-28">
          <div className="inline-flex items-center gap-2 rounded-full  -white/30 bg-white/10 px-3 py-1 text-xs text-white backdrop-blur">
            In-House Fit-Out · Joinery · Carpentry · Glass · UPVC · Metal
          </div>

          <h1 className="mt-6 text-4xl sm:text-6xl font-semibold leading-tight text-white">
            In-House Fit-Out for <span className="text-white/90">Speed, Precision & Control</span>
          </h1>

          <p className="mt-5 max-w-2xl text-lg sm:text-xl text-white/85">
            We combine multidisciplinary engineers with in-house production facilities to deliver
            retail, hospitality, office and healthcare interiors — faster, cleaner, and to spec.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="https://wa.me/0000000000?text=Hi%20StrucAxis%2C%20I'd%20like%20to%20discuss%20an%20in-house%20fit-out."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-white hover:bg-green-700"
            >
              <FaWhatsapp className="h-5 w-5" />
              WhatsApp Now
            </a>
            <a
              href="tel:+910000000000"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-gray-900 hover:bg-gray-100"
            >
              <FaPhoneAlt className="h-5 w-5" />
              Call Now
            </a>
            <a
              href="#capabilities"
              className="group inline-flex items-center gap-2 rounded-lg  -white/40 bg-white/10 px-5 py-3 text-white hover:bg-white/20"
            >
              Explore Capabilities <FaArrowRight className="h-4 w-4 transition -translate-x-0 group-hover:translate-x-1" />
            </a>
          </div>

          {/* Quick value props */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Badge title="In-house joinery" />
            <Badge title="Glass & UPVC" />
            <Badge title="Metal & powder-coat" />
            <Badge title="MEP-coordinated delivery" />
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* CLIENTS */}
      {/* -------------------------------------------------- */}
           <LogoCarouselDemo/>
     

      {/* -------------------------------------------------- */}
      {/* WHAT “IN-HOUSE” MEANS */}
      {/* -------------------------------------------------- */}
<CapabilitiesBlock slug="slug" />
      {/* -------------------------------------------------- */}
      {/* CAPABILITIES */}
      {/* -------------------------------------------------- */}
      <section id="capabilities" className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-20">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl sm:text-4xl font-semibold">Capabilities</h2>
            <p className="mt-3 text-gray-600 max-w-2xl">
              From BOQ to handover — our in-house stack covers structural, architectural and MEP-coordinated interiors
              for retail, hospitality, office, healthcare and institutional projects.
            </p>
          </div>
          <a href="#work" className="hidden sm:inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-900">
            See featured work <FaArrowRight />
          </a>
        </div>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Cap icon={<FaHardHat />} title="General Contracting (Turnkey)" points={["Shell & core", "Structural works", "Compliance & safety"]} />
          <Cap icon={<FaCouch />} title="Interior Fit-Out" points={["Retail • F&B • Office • Hospitality", "Luxury finishes", "Mock-ups & sampling"]} />
          <Cap icon={<FaTools />} title="Joinery & Furniture" points={["Custom millwork", "Modular systems", "Installation & QA/QC"]} />
          <Cap icon={<FaWarehouse />} title="Glass & UPVC" points={["Partitions & storefronts", "Windows/doors", "Glazing accessories"]} />
          <Cap icon={<MdOutlinePrecisionManufacturing />} title="Metal Works" points={["MS/SS fabrication", "Powder-coat", "Feature elements"]} />
          <Cap icon={<FaClock />} title="Fast-Track Delivery" points={["Sequencing & manpower control", "Night shifts where required", "Zero-surprise handovers"]} />
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* PROCESS */}
      {/* -------------------------------------------------- */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-20">
          <h2 className="text-3xl sm:text-4xl font-semibold">From Brief to Handover</h2>
          <div className="mt-10 grid md:grid-cols-4 gap-6">
            <Step n="01" title="Discovery & BOQ" text="Site visit, drawings review, BOQ & value engineering options." />
            <Step n="02" title="Technical Planning" text="Shop drawings, MEP coordination, long-lead procurement plan." />
            <Step n="03" title="In-House Production" text="Joinery, glass, metal and furniture manufactured to spec." />
            <Step n="04" title="Site Execution & QA" text="Sequenced installation, snag control, final QA/QC and handover." />
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* FEATURED WORK (Carousel) */}
      {/* -------------------------------------------------- */}
     <section id="work" className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-20">
  <div className="flex items-end justify-between">
    <h2 className="text-3xl sm:text-4xl font-semibold">Featured Work</h2>
    <div className="flex gap-3">
      <button
        onClick={() =>
          setCurrent((c) =>
            featuredWorks.length ? (c - 1 + featuredWorks.length) % featuredWorks.length : 0
          )
        }
        className="rounded-lg  bg-white px-3 py-2 hover:bg-gray-50 disabled:opacity-50"
        aria-label="Previous"
        disabled={!featuredWorks.length}
      >
        ‹
      </button>
      <button
        onClick={() =>
          setCurrent((c) =>
            featuredWorks.length ? (c + 1) % featuredWorks.length : 0
          )
        }
        className="rounded-lg  bg-white px-3 py-2 hover:bg-gray-50 disabled:opacity-50"
        aria-label="Next"
        disabled={!featuredWorks.length}
      >
        ›
      </button>
    </div>
  </div>

  {/* Loading / Error states */}
  {fwLoading && (
    <div className="mt-8 h-[460px] md:h-[520px] rounded-2xl bg-white  animate-pulse" />
  )}
  {fwError && !fwLoading && (
    <div className="mt-6 text-red-600">{fwError}</div>
  )}

  {!fwLoading && !fwError && (
    <div className="relative mt-8 overflow-hidden rounded-2xl">
      {featuredWorks.map((w, i) => (
        <article
          key={`${w.title}-${i}`}
          className={`absolute inset-0 grid md:grid-cols-2 bg-white transition-opacity duration-700 ${
            i === current ? "opacity-100 z-10" : "opacity-0"
          }`}
        >
          <div className="relative">
            <img src={w.img} alt={w.title} className="h-full w-full object-cover" />
          </div>
          <div className="p-8 sm:p-12 flex flex-col">
            {w.tag && (
              <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                {w.tag}
              </span>
            )}
            <h3 className="mt-4 text-2xl sm:text-3xl font-semisemibold">{w.title}</h3>

            {(w.blurb || "").length > 0 && (
              <p className="mt-3 text-gray-600">{w.blurb}</p>
            )}

            <ul className="mt-6 grid grid-cols-2 gap-2 text-sm">
              <li className="flex items-center gap-2 text-gray-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                In-house joinery
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                Glass & UPVC
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                Feature metal works
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                Fast-track schedule
              </li>
            </ul>

            <div className="mt-auto pt-6">
              <div className="flex items-center gap-4">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-900"
                >
                  View all projects
                  <svg width="16" height="16" viewBox="0 0 24 24" className="-mr-1">
                    <path fill="currentColor" d="M13.172 12L8.222 7.05l1.414-1.414L16 12l-6.364 6.364-1.414-1.414z"/>
                  </svg>
                </Link>

                {/* Deep-link to the current featured project if we have a slug */}
                {w.slug && (
                  <Link
                    href={`/projects/${encodeURIComponent(w.slug)}`}
                    className="inline-flex items-center gap-2 text-gray-700 hover:text-black"
                  >
                    View case
                    <svg width="16" height="16" viewBox="0 0 24 24" className="-mr-1">
                      <path fill="currentColor" d="M13.172 12L8.222 7.05l1.414-1.414L16 12l-6.364 6.364-1.414-1.414z"/>
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </article>
      ))}
      <div className="relative h-[460px] md:h-[520px]" />
    </div>
  )}
</section>

     
      <MilestonesExact/>



      {/* -------------------------------------------------- */}
      {/* TESTIMONIALS */}
      {/* -------------------------------------------------- */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-20">
        <h2 className="text-3xl sm:text-4xl font-semibold">What our partners say</h2>
        <div className="relative mt-8 rounded-2xl bord bg-white p-8">
          {testimonials.map((t, i) => (
            <blockquote
              key={t.name}
              className={`transition-opacity duration-700 ${i === tIndex ? "opacity-100" : "opacity-0 absolute inset-8"}`}
            >
              <p className="text-xl leading-relaxed">“{t.quote}”</p>
              <footer className="mt-6 text-sm text-gray-600">
                <span className="font-semisemibold text-gray-900">{t.name}</span> — {t.role}
              </footer>
            </blockquote>
          ))}
          <div className="mt-6 flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setTIndex(i)}
                className={`h-2 w-2 rounded-full ${i === tIndex ? "bg-emerald-600" : "bg-gray-300"}`}
                aria-label={`Show testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* FAQ */}
      {/* -------------------------------------------------- */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-20">
          <h2 className="text-3xl sm:text-4xl font-semibold">FAQs</h2>
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <FAQ
              q="What makes in-house fit-out faster?"
              a="Aligned teams and facilities under one roof reduce coordination loss, ensure material readiness, and enable parallel manufacturing and site prep."
            />
            <FAQ
              q="Do you handle MEP coordination?"
              a="Yes. We coordinate with consultants, produce shop drawings, and sequence installation to avoid rework."
            />
            <FAQ
              q="Can you work in live sites or malls?"
              a="Absolutely. We manage landlord/mall approvals and plan night shifts where required with strict HSE controls."
            />
            <FAQ
              q="Do you support green building requirements?"
              a="Yes, our team can support GRIHA/LEED documentation and material compliance."
            />
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* BIG CTA */}
      {/* -------------------------------------------------- */}
            <ContactCta/>
      
    </main>
  );
}

/* ------------------------ */
/* Tiny UI helpers          */
/* ------------------------ */

function Badge({ title }) {
  return (
    <div className="rounded-lg  -white/30 bg-white/10 px-3 py-2 text-sm text-white backdrop-blur">
      {title}
    </div>
  );
}

function LI({ icon, text }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-1 text-emerald-700">{icon}</span>
      <span>{text}</span>
    </li>
  );
}

function Cap({ icon, title, points }) {
  return (
    <div className="rounded-xl  bg-white p-6 hover:shadow-md transition">
      <div className="flex items-center gap-3">
        <span className="text-emerald-700 text-xl">{icon}</span>
        <h3 className="text-lg font-semisemibold">{title}</h3>
      </div>
      <ul className="mt-4 space-y-2 text-gray-600">
        {points.map((p) => (
          <li key={p} className="flex items-center gap-2">
            <FaCheckCircle className="text-emerald-500" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Step({ n, title, text }) {
  return (
    <div className="rounded-xl  bg-white p-6">
      <div className="text-sm font-semisemibold text-emerald-700">Step {n}</div>
      <h3 className="mt-2 text-lg font-semisemibold">{title}</h3>
      <p className="mt-2 text-gray-600">{text}</p>
    </div>
  );
}

function Bullet({ children }) {
  return (
    <li className="flex items-center gap-2 text-gray-700">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
      {children}
    </li>
  );
}

function Stat({ k, v }) {
  return (
    <div className="rounded-xl bg-gray-800 p-6 text-center">
      <div className="text-4xl font-semibold tracking-tight">{k}</div>
      <div className="mt-2 text-gray-300">{v}</div>
    </div>
  );
}

/* ------------------------ */
/* Background marquee cols  */
/* ------------------------ */
function MarqueeColumn({ images, direction = "up" }) {
  return (
    <div className="relative overflow-hidden">
      <div
        className={`absolute inset-0 animate-[marquee_20s_linear_infinite] ${
          direction === "down" ? "animate-[marquee-rev_20s_linear_infinite]" : ""
        }`}
      >
        {[...images, ...images].map((src, i) => (
          <div key={i} className="h-64 md:h-80">
            <img src={src} alt="" className="h-full w-full object-cover" />
          </div>
        ))}
      </div>

      {/* keyframes (inline via tailwind arbitrary if configured). 
         If your Tailwind doesn't allow arbitrary keyframes, add these to globals.css:

        @keyframes marquee { from { transform: translateY(0); } to { transform: translateY(-50%); } }
        @keyframes marquee-rev { from { transform: translateY(-50%); } to { transform: translateY(0); } }
      */}
      <style>{`
        @keyframes marquee { from { transform: translateY(0); } to { transform: translateY(-50%); } }
        @keyframes marquee-rev { from { transform: translateY(-50%); } to { transform: translateY(0); } }
      `}</style>
    </div>
  );
}
// Add this helper at the bottom of your file (before export if splitting, 
// or just after the other helper functions like Cap, Step, etc.)

function FAQ({ q, a }) {
  return (
    <div className="rounded-xl  bg-white p-6 hover:shadow-sm transition">
      <h3 className="text-lg font-semisemibold">{q}</h3>
      <p className="mt-3 text-gray-600">{a}</p>
    </div>
  );
}