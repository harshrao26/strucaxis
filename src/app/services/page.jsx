"use client";

import ContactCta from "@/components/ContactCta";
import React, { useEffect, useState } from "react";
import {
  FaTools,
  FaHardHat,
  FaCouch,
  FaDraftingCompass,
  FaRulerCombined,
  FaWater,
  FaIndustry,
  FaCity,
  FaBuilding,
  FaRecycle,
  FaCheckCircle,
  FaArrowRight,
  FaWhatsapp,
  FaPhoneAlt,
} from "react-icons/fa";

/**
 * StrucAxis — Services Page (JSX only, TailwindCSS)
 * Drop this into: src/app/services/page.jsx
 * No TypeScript, no external components required.
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
          <span className="inline-flex items-center gap-2 rounded-full  -white/30 bg-white/10 px-3 py-1 text-xs text-white backdrop-blur">
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
              className="group inline-flex items-center gap-2 rounded-lg  -white/40 bg-white/10 px-5 py-3 text-white hover:bg-white/20"
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

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ServiceCard
            icon={<FaHardHat />}
            title="General Contracting (Turnkey)"
            img="https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=1400&auto=format&fit=crop"
            points={["Shell & core", "Site management & HSE", "Quality assurance / QA-QC"]}
          />
          <ServiceCard
            icon={<FaCouch />}
            title="Interior Fit-out (Retail • F&B • Office • Hospitality)"
            img="https://images.unsplash.com/photo-1521783988139-893ce8e2c6d6?q=80&w=1400&auto=format&fit=crop"
            points={["Brand-accurate finishes", "Sequenced installation", "Snag-free handover"]}
          />
          <ServiceCard
            icon={<FaDraftingCompass />}
            title="Design–Build (with Trygve Studio)"
            img="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=1400&auto=format&fit=crop"
            points={["Single-window delivery", "Shop drawings", "Value engineering"]}
          />
          <ServiceCard
            icon={<FaTools />}
            title="Joinery & Furniture Packages"
            img="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1400&auto=format&fit=crop"
            points={["CNC-enabled carpentry", "PU/veneer/laminate finishes", "On-site installation"]}
          />
          <ServiceCard
            icon={<FaIndustry />}
            title="Glass, UPVC & Metal Fabrication"
            img="https://images.unsplash.com/photo-1541976076758-347942db1970?q=80&w=1400&auto=format&fit=crop"
            points={["Glazing & storefronts", "Windows/doors", "MS/SS & powder-coat"]}
          />
          <ServiceCard
            icon={<FaRulerCombined />}
            title="Costing/BOQ & Value Engineering"
            img="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1400&auto=format&fit=crop"
            points={["Transparent BOQs", "Alternates & equivalences", "Procurement planning"]}
          />
          <ServiceCard
            icon={<FaWater />}
            title="Specialized Waterproofing"
            img="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1400&auto=format&fit=crop"
            points={["Roofs & wet areas", "Terraces & basements", "Material warranties"]}
          />
          <ServiceCard
            icon={<FaRecycle />}
            title="Renovation & Retrofits"
            img="https://images.unsplash.com/photo-1523419409543-8f8d3fd7e69d?q=80&w=1400&auto=format&fit=crop"
            points={["Live-site works", "Phased execution", "Minimum downtime"]}
          />
          <ServiceCard
            icon={<FaCity />}
            title="MEP Coordination"
            img="https://images.unsplash.com/photo-1581090700227-1e37b190418e?q=80&w=1400&auto=format&fit=crop"
            points={["Shop drawings", "Services sequencing", "Testing & commissioning"]}
          />
        </div>
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
            <Sector img="https://images.unsplash.com/photo-1519710164239-da123dc03ef4e?q=80&w=1400&auto=format&fit=crop" title="Retail & Franchise" />
            <Sector img="https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=1400&auto=format&fit=crop" title="Healthcare & Clinics" />
            <Sector img="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop" title="Villas & Residences" />
            <Sector img="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=1400&auto=format&fit=crop" title="Institutions & Schools" />
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
    <div className="rounded-lg  -white/30 bg-white/10 px-3 py-2 text-sm text-white backdrop-blur">
      {children}
    </div>
  );
}

function ServiceCard({ icon, title, img, points }) {
  return (
    <article className="group overflow-hidden rounded-2xl  bg-white">
      <div className="relative h-48 w-full overflow-hidden">
        <img src={img} alt={title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
        {/* <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-md bg-white/90 px-3 py-1 text-sm">
          <span className="text-emerald-700">{icon}</span>
          <span className="font-medium">StrucAxis</span>
        </div> */}
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
        {/* <a href="/projects" className="mt-5 inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-900">
          View related projects <FaArrowRight />
        </a> */}
      </div>
    </article>
  );
}

function Sector({ img, title }) {
  return (
    <div className="overflow-hidden rounded-2xl  bg-white">
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
    <div className="rounded-xl  bg-white p-6">
      <div className="text-sm font-semibold text-emerald-700">Step {n}</div>
      <h3 className="mt-2 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-gray-600">{text}</p>
    </div>
  );
}

function Stat({ num, label }) {
  return (
    <div className="rounded-xl bg-gray-800 p-6 text-center">
      <div className="text-4xl font-semibold tracking-tight">{num}</div>
      <div className="mt-2 text-gray-300">{label}</div>
    </div>
  );
}

function FAQ({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl  bg-white p-6">
      <button
        className="flex w-full items-center justify-between text-left"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="text-lg font-semibold">{q}</span>
        <span className={`transition ${open ? "rotate-90" : ""}`}>›</span>
      </button>
      <div className={`grid transition-all duration-300 ${open ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <p className="text-gray-600">{a}</p>
        </div>
      </div>
    </div>
  );
}