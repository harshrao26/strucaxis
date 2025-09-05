"use client";

import React from "react";
import Image from "next/image";
import {
  HiOutlineBuildingOffice2,
  HiOutlineWrenchScrewdriver,
  HiOutlineShieldCheck,
  HiOutlineUsers,
  HiOutlineBolt,
  HiOutlineClipboardDocumentList,
  HiArrowRight,
} from "react-icons/hi2";
import TeamSection from "@/components/TeamSection";
import ContactCta from "@/components/ContactCta";

/**
 * Full-fledged "About Us" page for StrucAxis
 * - TailwindCSS + react-icons + next/image
 * - Sections: Hero, Mission, Differentiators, Stats, Capabilities, Timeline, Team Preview,
 *             Client Logos, CTA
 * - Replace links (#) as needed. All images use Unsplash for easy drop-in.
 */

export default function AboutPage() {
  return (
    <main className="bg-white text-gray-900  ">
      <AboutHero />

      <MissionBlock />
      <Differentiators />
      <StatsRow />
      <Capabilities />
      <Timeline />
      <TeamSection/>
       
      
      
            <ContactCta/>
      </main>
  );
}

/* ────────────────────────────── Sections ────────────────────────────── */

function AboutHero() {
  return (
    <section className="relative mx-auto w-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1559061512-72ec2d893fb6?q=80&w=1557&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Construction site"
          fill
          className="object-contain"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-28 sm:py-36">
        <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/25 backdrop-blur">
          About StrucAxis
        </span>
        <h1 className="mt-5 max-w-3xl text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight text-white">
          We turn drawings into reality — on time, within budget, snag-free.
        </h1>
        <p className="mt-5 max-w-2xl text-white/85 text-lg">
          A contractor-first team delivering civil, interior & turnkey fit-outs with
          disciplined workforce control, transparent procurement, and in-house production.
        </p>
        <div className="mt-8 flex gap-3">
          <a
            href="#mission"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-gray-900 font-medium hover:bg-gray-100"
          >
            Our Mission <HiArrowRight className="h-5 w-5" />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-white backdrop-blur hover:bg-white/20"
          >
            Talk to Us
          </a>
        </div>
      </div>
    </section>
  );
}

function MissionBlock() {
  return (
    <section id="mission" className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 grid gap-10 md:grid-cols-2 items-start">
        <div>
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">
            Built on precision, powered by people.
          </h2>
          <p className="mt-5 text-lg text-gray-700">
            For 12+ years, StrucAxis has partnered with architects, developers, brands,
            and owners to deliver spaces that perform as beautifully as they look.
            We solve the hard parts — manpower management, procurement, QA/QC,
            mall coordination — so you don’t have to.
          </p>
          <p className="mt-4 text-gray-600">
            As the execution arm of Trygve Studio Pvt. Ltd, we combine design empathy with
            contractor discipline to keep quality, time, and cost under control.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <MissionCard
            icon={<HiOutlineUsers className="h-6 w-6" />}
            title="Multidisciplinary Team"
            desc="Architects, Civil/MEP engineers, QS/Procurement, Safety & QA/QC."
          />
          <MissionCard
            icon={<HiOutlineWrenchScrewdriver className="h-6 w-6" />}
            title="In-house Facilities"
            desc="Machinery, carpentry, glass & UPVC for quality and speed."
          />
          <MissionCard
            icon={<HiOutlineShieldCheck className="h-6 w-6" />}
            title="Assured Delivery"
            desc="Tight labor control, checklists, safety, and documentation."
          />
          <MissionCard
            icon={<HiOutlineClipboardDocumentList className="h-6 w-6" />}
            title="Transparent BOQs"
            desc="Accurate costing, value engineering and procurement control."
          />
        </div>
      </div>
    </section>
  );
}

function Differentiators() {
  const items = [
    {
      title: "General Contracting (Turnkey)",
      img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
      desc: "Single-point responsibility from mobilization to handover.",
    },
    {
      title: "Interior Fit-out",
      img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
      desc: "Retail, F&B, office & hospitality with precise finish standards.",
    },
    {
      title: "Civil Construction",
      img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
      desc: "Shell & core with rigorous QA/QC and safety protocols.",
    },
  ];

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between">
          <div>
            <h3 className="text-3xl sm:text-4xl font-semibold">What sets us apart</h3>
            <p className="mt-2 max-w-xl text-gray-600">
              Discipline on site, clarity in documents, and the advantage of in-house production.
            </p>
          </div>
          <a href="#contact" className="hidden sm:inline text-gray-800 font-medium hover:underline">
            Discuss your project →
          </a>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {items.map((s) => (
            <article key={s.title} className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="relative aspect-[4/3] w-full">
                <img src={s.img} alt={s.title} fill className="object-cover" />
              </div>
              <div className="px-5 py-4">
                <h4 className="font-semibold">{s.title}</h4>
                <p className="mt-1 text-gray-600 text-sm">{s.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsRow() {
  const stats = [
    ["12+", "Years of Experience"],
    ["150+", "Projects Delivered"],
    ["25+", "Locations"],
    ["5M+", "Sq. Ft. Executed"],
  ];
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([kpi, label]) => (
          <div key={label} className="flex flex-col">
            <div className="h-px w-full bg-gray-300 mb-6" />
            <div className="text-5xl font-semibold">{kpi}</div>
            <div className="mt-2 text-gray-600">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Capabilities() {
  const caps = [
    { icon: <HiOutlineBolt className="h-5 w-5" />, title: "Fast-Track Projects", desc: "Schools, hospitality, exhibitions & events." },
    { icon: <HiOutlineBuildingOffice2 className="h-5 w-5" />, title: "Mall Coordination", desc: "Landlord approvals and execution inside malls." },
    { icon: <HiOutlineShieldCheck className="h-5 w-5" />, title: "Green Support", desc: "GRIHA & LEED compliance assistance." },
    { icon: <HiOutlineWrenchScrewdriver className="h-5 w-5" />, title: "In-house Machinery", desc: "Faster, controlled execution." },
  ];
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h3 className="text-3xl sm:text-4xl font-semibold">Special Capabilities</h3>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {caps.map((c) => (
            <div key={c.title} className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-900 text-white">
                {c.icon}
              </div>
              <p className="font-semibold">{c.title}</p>
              <p className="mt-1 text-gray-600 text-sm">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Timeline() {
  const items = [
    {
      year: "2012",
      title: "Started Operations",
      desc: "Launched with core GC capability and a small but mighty site team.",
    },
    {
      year: "2016",
      title: "In-house Units",
      desc: "Added carpentry and glass manufacturing for quality control.",
    },
    {
      year: "2019",
      title: "UPVC Factory & Fast-Track",
      desc: "Scaled to fast-track work; strengthened MEP coordination.",
    },
    {
      year: "2023",
      title: "Integrated with Trygve Studio  Pvt. Ltd",
      desc: "Design–Build offerings matured with single-window delivery.",
    },
  ];
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h3 className="text-3xl sm:text-4xl font-semibold">Our Journey</h3>
        <ol className="relative mt-8 border-l-2 border-dashed border-gray-300 pl-6">
          {items.map((t, i) => (
            <li key={t.year} className="mb-8">
              <div className="absolute -left-2.5 mt-1 h-4 w-4 rounded-full bg-gray-900" />
              <p className="text-sm text-gray-500">{t.year}</p>
              <p className="font-semibold">{t.title}</p>
              <p className="text-gray-600">{t.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function TeamPreview() {
  const team = [
    { name: "Project Management", img: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=800&q=80" },
    { name: "Engineering & QA/QC", img: "https://images.unsplash.com/photo-1591453089816-0fbb971b3a3c?auto=format&fit=crop&w=800&q=80" },
    { name: "Procurement & Accounts", img: "https://images.unsplash.com/photo-1553729784-e91953dec042?auto=format&fit=crop&w=800&q=80" },
  ];
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between">
          <h3 className="text-3xl sm:text-4xl font-semibold">The Team Behind the Delivery</h3>
          <a href="#team" className="hidden sm:inline text-gray-800 font-medium hover:underline">
            Meet the team →
          </a>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {team.map((m) => (
            <figure key={m.name} className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="relative aspect-[4/3]">
                <img src={m.img} alt={m.name} fill className="object-cover" />
              </div>
              <figcaption className="px-5 py-4 font-medium">{m.name}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClientLogos() {
  const logos = [
    "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=60",
    "https://images.unsplash.com/photo-1542744173-05336fcc7ad4?auto=format&fit=crop&w=200&q=60",
    "https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&w=200&q=60",
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=200&q=60",
    "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=200&q=60",
    "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=200&q=60",
  ];
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-center text-gray-600">Trusted by architects, brands & owners</p>
        <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-6">
          {logos.map((src, i) => (
            <div key={i} className="flex items-center justify-center rounded-xl border border-gray-200 bg-white p-4">
              <img src={src} alt={`Client ${i + 1}`} width={120} height={60} className="object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="py-24 sm:py-28">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-gray-900">CONTACT</p>
        <div className="relative mt-6">
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-semibold leading-tight">
            Let’s Build Something
          </h2>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -bottom-6 block text-[16vw] sm:text-[12vw] md:text-[10vw] font-semibold leading-none text-gray-300/70 select-none"
          >
            Extraordinary
          </span>
        </div>
        <div className="mt-24">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-2xl bg-gray-900 px-6 py-3 text-white text-lg hover:bg-gray-800"
          >
            Get in Touch <HiArrowRight className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────── Bits ────────────────────────────── */

function MissionCard({ icon, title, desc }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-900 text-white">
        {icon}
      </div>
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-gray-600 text-sm">{desc}</p>
    </div>
  );
}