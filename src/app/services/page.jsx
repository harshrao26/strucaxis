"use client";

import ContactCta from "@/components/ContactCta";
import React, { useEffect, useState } from "react";
import {
  FaCheckCircle, FaArrowRight, FaWhatsapp, FaPhoneAlt,
} from "react-icons/fa";

/**
 * StrucAxis — Services Page (connected to /api/services)
 * Fetches services from the backend and renders cards.
 */

export default function ServicesPage() {
  // simple hero background rotator
  const heroSlides = [
    {
      img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1920&auto=format&fit=crop",
      headline: "General Contracting & Interior Fit-Out",
      sub: "Turnkey execution with multidisciplinary engineers and in-house production.",
    },
    {
      img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1920&auto=format&fit=crop",
      headline: "Corporate, Retail & Hospitality",
      sub: "Precise MEP coordination and brand-accurate finishes delivered on time.",
    },
    {
      img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1920&auto=format&fit=crop",
      headline: "Fast-Track Projects",
      sub: "Night shifts, sequencing and tight workforce control for clean handovers.",
    },
  ];
  const [hi, setHi] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setHi((i) => (i + 1) % heroSlides.length), 3500);
    return () => clearInterval(id);
  }, []);

  // -------- fetch services from backend --------
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const loadServices = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/services?sort=order%20-createdAt&limit=100", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to load services");
      setServices(Array.isArray(json.items) ? json.items.filter(s => s?.active !== false) : []);
    } catch (e) {
      setErr(e.message || "Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadServices(); }, []);

  return (
    <main className="bg-[#F4F1EC] text-gray-900">
      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          {heroSlides.map((s, i) => (
            <img
              key={i}
              src={s.img}
              alt=""
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                i === hi ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 pt-28 pb-20 sm:pt-36 sm:pb-28">
          <span className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1 text-xs text-white backdrop-blur">
            Services · Turnkey · Fit-out · Design–Build · Retrofits
          </span>
          <h1 className="mt-6 text-4xl sm:text-6xl font-semibold leading-tight text-white">
            {heroSlides[hi].headline}
          </h1>
          <p className="mt-4 max-w-2xl text-lg sm:text-xl text-white/90">{heroSlides[hi].sub}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="https://wa.me/0000000000?text=Hi%20StrucAxis%2C%20I'm%20interested%20in%20your%20services."
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
              href="#all-services"
              className="group inline-flex items-center gap-2 rounded-lg bg-white/10 px-5 py-3 text-white hover:bg-white/20"
            >
              Explore Services{" "}
              <FaArrowRight className="h-4 w-4 transition -translate-x-0 group-hover:translate-x-1" />
            </a>
          </div>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Badge>ISO • MSME • HSE</Badge>
            <Badge>MEP Coordination</Badge>
            <Badge>In-house Joinery & Glass</Badge>
            <Badge>Fast-Track Delivery</Badge>
          </div>
        </div>
      </section>

      {/* --------------- SERVICE GRID --------------- */}
      <section id="all-services" className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-20">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl sm:text-4xl font-semibold">What we do</h2>
            <p className="mt-3 max-w-3xl text-gray-600">
              Execution-first partners for architects, developers and brand owners. Our multidisciplinary
              team and in-house facilities deliver quality and speed across sectors.
            </p>
          </div>
          <a href="/contact-us" className="hidden sm:inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-900">
            Get a BOQ estimate <FaArrowRight />
          </a>
        </div>

        {/* state: loading / error / empty / data */}
        {loading ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-2xl bg-white/70 ring-1 ring-zinc-200" />
            ))}
          </div>
        ) : err ? (
          <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {err} — <button className="underline" onClick={loadServices}>retry</button>
          </div>
        ) : services.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-zinc-300 p-10 text-center text-sm text-zinc-500">
            No services yet.
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <ServiceCard
                key={s._id || s.slug}
                title={s.title}
                img={s.image?.src}
                alt={s.image?.alt || s.title}
                points={Array.isArray(s.points) ? s.points.slice(0, 3) : []}
              />
            ))}
          </div>
        )}
      </section>

      {/* --------------- INDUSTRIES --------------- */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-20">
          <h2 className="text-3xl sm:text-4xl font-semibold">Sectors we serve</h2>
          <p className="mt-3 text-gray-600 max-w-3xl">
            From franchise rollouts to corporate HQs and villas — we tailor our approach to the program,
            brand and timelines.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Sector img="https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1400&auto=format&fit=crop" title="Hospitality & F&B" />
            <Sector img="https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1400&auto=format&fit=crop" title="Corporate Offices" />
            <Sector img="https://images.unsplash.com/photo-1562280963-8a5475740a10?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" title="Retail & Franchise" />
            <Sector img="https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=1400&auto=format&fit=crop" title="Healthcare & Clinics" />
            <Sector img="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop" title="Villas & Residences" />
            <Sector img="https://images.unsplash.com/photo-1694307771413-ab92ba77539b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" title="Institutions & Schools" />
          </div>
        </div>
      </section>

      {/* --------------- PROCESS --------------- */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-20">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl sm:text-4xl font-semibold">Our process</h2>
          <span className="text-sm text-gray-500">Crisp, contractor-driven</span>
        </div>
        <div className="mt-8 grid md:grid-cols-4 gap-6">
          <Step n="01" title="Discovery & BOQ" text="Drawings review, site visit, BOQ and alternates for VE." />
          <Step n="02" title="Planning & Coordination" text="Shop drawings, long-lead procurement, MEP sequencing." />
          <Step n="03" title="In-House Production" text="Joinery, glass, UPVC and metal manufactured to spec." />
          <Step n="04" title="Execution & Handover" text="Installation, QA/QC, testing & commissioning, snag closure." />
        </div>
      </section>

      {/* --------------- BIG CTA --------------- */}
      <ContactCta/>
    </main>
  );
}

/* ---------------- Helpers ---------------- */

function Badge({ children }) {
  return (
    <div className="rounded-lg bg-white/10 px-3 py-2 text-sm text-white backdrop-blur">
      {children}
    </div>
  );
}

function ServiceCard({ title, img, alt, points }) {
  return (
    <article className="group overflow-hidden rounded-2xl bg-white">
      <div className="relative h-48 w-full overflow-hidden">
        {img ? (
          <img src={img} alt={alt || title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="h-full w-full bg-zinc-100" aria-hidden />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold">{title}</h3>
        <ul className="mt-3 space-y-2 text-gray-600">
          {points.map((p) => (
            <li key={p} className="flex items-center gap-2">
              <FaCheckCircle className="text-emerald-500" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function Sector({ img, title }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white">
      <div className="relative h-44">
        <img src={img} alt={title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
      </div>
    </div>
  );
}

function Step({ n, title, text }) {
  return (
    <div className="rounded-xl bg-white p-6">
      <div className="text-sm font-semibold text-emerald-700">Step {n}</div>
      <h3 className="mt-2 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-gray-600">{text}</p>
    </div>
  );
}