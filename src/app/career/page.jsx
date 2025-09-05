"use client";

import ContactCta from "@/components/ContactCta";
import React, { useMemo, useState } from "react";
import {
  FaHardHat,
  FaTools,
  FaRulerCombined,
  FaProjectDiagram,
  FaClipboardList,
  FaShieldAlt,
  FaPhoneAlt,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaUserTie,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";

/**
 * StrucAxis — Careers Page (JSX only, TailwindCSS)
 * Drop this into: src/app/career/page.jsx
 * No TypeScript, no external components required.
 */

export default function CareerPage() {
  // ----------------- JOB DATA -----------------
  const jobs = [
    {
      id: "SE-01",
      title: "Site Engineer (Civil)",
      dept: "Execution",
      icon: <FaHardHat />,
      location: "Bengaluru",
      type: "Full-time",
      exp: "2–5 years",
      summary:
        "Handle day-to-day site execution, subcontractor coordination, and QA/QC as per drawings and specs.",
      bullets: [
        "Daily progress tracking & reporting",
        "Labour/workforce management",
        "Coordinate with MEP & vendors",
        "Check levels, line-out & finishes",
      ],
    },
    {
      id: "PM-01",
      title: "Project Manager",
      dept: "Projects",
      icon: <FaProjectDiagram />,
      location: "Hyderabad",
      type: "Full-time",
      exp: "7–12 years",
      summary:
        "Own project delivery across cost, time and quality. Interface with architects, clients and internal teams.",
      bullets: [
        "Master schedule & sequencing",
        "Risk management & approvals",
        "Commercial tracking & BOQ control",
        "Client/consultant coordination",
      ],
    },
    {
      id: "QS-01",
      title: "QS / Estimator",
      dept: "Commercial",
      icon: <FaRulerCombined />,
      location: "Remote / Pune",
      type: "Full-time",
      exp: "3–6 years",
      summary:
        "Prepare BOQs and estimates, analyse alternates for VE, validate vendor quotes and rate analysis.",
      bullets: [
        "BOQ take-offs from drawings",
        "Material reconciliation",
        "Compare alternates & VE options",
        "Support procurement",
      ],
    },
    {
      id: "MEP-01",
      title: "MEP Coordinator",
      dept: "MEP",
      icon: <FaClipboardList />,
      location: "Bengaluru",
      type: "Full-time",
      exp: "4–8 years",
      summary:
        "Coordinate services drawings, clash resolution and sequencing with site team for snag-free finish.",
      bullets: [
        "Shop drawings & RFIs",
        "Interface with HVAC/Fire vendors",
        "T&C, test reports & as-builts",
        "Align with civil/interior schedules",
      ],
    },
    {
      id: "HSE-01",
      title: "HSE Officer",
      dept: "Safety",
      icon: <FaShieldAlt />,
      location: "Multiple Cities",
      type: "Full-time",
      exp: "2–6 years",
      summary:
        "Implement and monitor project safety plans in line with StrucAxis HSE standards and ISO guidelines.",
      bullets: [
        "Toolbox talks & site inductions",
        "PPE compliance & audits",
        "Permit-to-work systems",
        "Incident reporting & CAPA",
      ],
    },
    {
      id: "SUP-01",
      title: "Carpentry / Joinery Supervisor",
      dept: "Production",
      icon: <FaTools />,
      location: "Hyderabad (Factory)",
      type: "Full-time",
      exp: "4–8 years",
      summary:
        "Supervise in-house joinery & furniture production including CNC, finishing and dispatch.",
      bullets: [
        "Read & brief shop drawings",
        "Finishes: PU/veneer/laminate",
        "Quality checks & packing",
        "Dispatch coordination",
      ],
    },
    {
      id: "PROC-01",
      title: "Procurement Executive",
      dept: "Commercial",
      icon: <FaClipboardList />,
      location: "Bengaluru",
      type: "Full-time",
      exp: "2–5 years",
      summary:
        "Source materials/vendors, negotiate rates, track deliveries and maintain cost/quality benchmarks.",
      bullets: [
        "RFQs & quote comparisons",
        "POs & delivery tracking",
        "Vendor onboarding & SLAs",
        "Inventory coordination",
      ],
    },
    {
      id: "DR-01",
      title: "AutoCAD Draughtsman",
      dept: "Design Support",
      icon: <FaRulerCombined />,
      location: "Hyderabad",
      type: "Full-time",
      exp: "2–4 years",
      summary:
        "Prepare detailed shop drawings for joinery, interiors and coordination with architectural sets.",
      bullets: [
        "Detailing & BOQ support",
        "Drawing revisions & logs",
        "Coordination with site teams",
        "As-built documentation",
      ],
    },
  ];

  // ----------------- FILTERS -----------------
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("All");
  const [loc, setLoc] = useState("All");

  const departments = useMemo(
    () => ["All", ...Array.from(new Set(jobs.map((j) => j.dept)))],
    [jobs]
  );
  const locations = useMemo(
    () => ["All", ...Array.from(new Set(jobs.map((j) => j.location)))],
    [jobs]
  );

  const filtered = jobs.filter((j) => {
    const okDept = dept === "All" || j.dept === dept;
    const okLoc = loc === "All" || j.location === loc;
    const okQ =
      !q ||
      j.title.toLowerCase().includes(q.toLowerCase()) ||
      j.summary.toLowerCase().includes(q.toLowerCase());
    return okDept && okLoc && okQ;
  });

  // ----------------- HELPERS -----------------
  const mail = "hr@strucaxis.com"; // change to your HR email
  const whatsapp = "0000000000"; // change to your WA number (country code without +)
  const applyMailTo = (job) =>
    `mailto:${mail}?subject=Application%20for%20${encodeURIComponent(
      job.title
    )}%20(${job.id})&body=Hi%20StrucAxis%2C%0A%0AI'm%20interested%20in%20${
      job.title
    }%20(${job.id}).%0A%0AName%3A%20%0APhone%3A%20%0ALocation%3A%20%0AExperience%3A%20${
      job.exp
    }%2B%0ANotice%20Period%3A%20%0A%0APlease%20find%20my%20CV%20attached.%0A%0AThanks.`;

  const applyWhatsApp = (job) =>
    `https://wa.me/${whatsapp}?text=${encodeURIComponent(
      `Hi StrucAxis, I'm interested in ${job.title} (${job.id}).\nName:\nExperience:\nNotice Period:\nLocation:\n`
    )}`;

  // ----------------- RENDER -----------------
  return (
    <main className="bg-[#F4F1EC] text-gray-900">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2000&auto=format&fit=crop"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10" />
        </div>
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 pt-28 pb-20 sm:pt-36 sm:pb-28">
          <span className="inline-flex items-center gap-2 rounded-full  -white/30 bg-white/10 px-3 py-1 text-xs text-white backdrop-blur">
            We’re hiring across projects & factories
          </span>
          <h1 className="mt-6 text-4xl sm:text-6xl font-semibold leading-tight text-white">
            Build careers that build spaces
          </h1>
          <p className="mt-4 max-w-2xl text-lg sm:text-xl text-white/90">
            At StrucAxis, engineers, supervisors and managers work shoulder-to-shoulder with our
            in-house joinery, glass and UPVC units to deliver exceptional outcomes.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(
                "Hi StrucAxis, I'd like to apply / know more about careers."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-white hover:bg-green-700"
            >
              <FaWhatsapp className="h-5 w-5" />
              WhatsApp HR
            </a>
            <a
              href={`tel:+91${whatsapp}`}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-gray-900 hover:bg-gray-100"
            >
              <FaPhoneAlt className="h-5 w-5" />
              Call HR
            </a>
            <a
              href="#openings"
              className="group inline-flex items-center gap-2 rounded-lg  -white/40 bg-white/10 px-5 py-3 text-white hover:bg-white/20"
            >
              View Open Roles <FaArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </a>
          </div>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Badge>ISO • MSME • HSE</Badge>
            <Badge>On-the-job learning</Badge>
            <Badge>Fast-track projects</Badge>
            <Badge>Growth with responsibility</Badge>
          </div>
        </div>
      </section>

      {/* CULTURE / PERKS */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-14">
          <h2 className="text-3xl sm:text-4xl font-semibold">Why StrucAxis</h2>
          <p className="mt-3 text-gray-600 max-w-3xl">
            A crisp, contractor-driven culture that values safety, ownership and clear communication. We
            give you the responsibility to deliver — and the support to grow.
          </p>
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Perk title="Real Responsibility" text="Lead packages and handovers early in your career." />
            <Perk title="In-House Learning" text="Understand manufacturing and site execution together." />
            <Perk title="Safety First" text="ISO/HSE standards, toolbox talks, and audits that matter." />
            <Perk title="Transparent Growth" text="Clear KRAs, performance feedback and timely appraisals." />
          </div>
        </div>
      </section>

      {/* OPENINGS */}
      <section id="openings" className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-20">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl sm:text-4xl font-semibold">Open Positions</h2>
            <p className="mt-3 text-gray-600">
              Can’t find a fit? Write to <a className="underline" href="mailto:hr@strucaxis.com">hr@strucaxis.com</a>{" "}
              with your role in the subject.
            </p>
          </div>
          
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          {filtered.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              applyMailTo={applyMailTo(job)}
              applyWhatsApp={applyWhatsApp(job)}
            />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full rounded-xl  bg-white p-8 text-center">
              <p className="text-gray-600">No roles match your filters. Try clearing them.</p>
            </div>
          )}
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-20">
          <h2 className="text-3xl sm:text-4xl font-semibold">Hiring Process</h2>
          <div className="mt-8 grid md:grid-cols-4 gap-6">
            <Step n="01" title="Apply" text="Share your CV via email or WhatsApp." />
            <Step n="02" title="Screening" text="Quick call to align role, location and expectations." />
            <Step n="03" title="Tech + Manager Round" text="Discuss past projects, site scenarios and ownership." />
            <Step n="04" title="Offer & Onboarding" text="Documentation, safety induction and project assignment." />
          </div>
        </div>
      </section>

      {/* REFERRALS */}
      <section className="bg-black text-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-semibold">Refer great people</h2>
              <p className="mt-3 text-white/90">
                We value referrals from architects, PMs and vendors. If we hire your referral, we’ll send a
                thank-you bonus after successful onboarding.
              </p>
              <ul className="mt-6 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-emerald-400" /> Execution, QS, MEP, HSE, Production & Planning
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-emerald-400" /> Locations: Bengaluru, Hyderabad, Pune (and project-based)
                </li>
              </ul>
            </div>
            <div className="rounded-2xl bg-white/10 p-6">
              <div className="grid sm:grid-cols-2 gap-3">
                <a
                  href="mailto:hr@strucaxis.com?subject=Referral%20for%20StrucAxis"
                  className="rounded-lg bg-white px-4 py-3 text-gray-900 hover:bg-gray-100 text-center"
                >
                  Email a referral
                </a>
                <a
                  href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(
                    "Referral for StrucAxis — Name, Role, Location, Experience:"
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg  -white/70 bg-white/10 px-4 py-3 text-white hover:bg-white/20"
                >
                  <FaWhatsapp />
                  WhatsApp referral
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BIG CTA */}
                <ContactCta/>
     
    </main>
  );
}

/* ----------------- SMALL COMPONENTS ----------------- */

function Badge({ children }) {
  return (
    <div className="rounded-lg  -white/30 bg-white/10 px-3 py-2 text-sm text-white backdrop-blur">
      {children}
    </div>
  );
}

function Perk({ title, text }) {
  return (
    <div className="rounded-2xl  bg-white p-6">
      <div className="flex items-center gap-3">
        <span className="text-emerald-700 text-xl">
          <FaUserTie />
        </span>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="mt-3 text-gray-600">{text}</p>
    </div>
  );
}

function Filters({ q, setQ, dept, setDept, departments, loc, setLoc, locations }) {
  return (
    <div className="w-full max-w-xl rounded-xl  bg-white p-4">
      <div className="grid sm:grid-cols-3 gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search role or keyword"
          className="rounded-lg  px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <select
          value={dept}
          onChange={(e) => setDept(e.target.value)}
          className="rounded-lg  px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <select
          value={loc}
          onChange={(e) => setLoc(e.target.value)}
          className="rounded-lg  px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {locations.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function JobCard({ job, applyMailTo, applyWhatsApp }) {
  return (
    <article className="group flex flex-col rounded-2xl  bg-white p-6 hover:shadow-md transition">
      <div className="flex items-start gap-3">
        {/* <span className="text-emerald-700 text-2xl">{job.icon}</span> */}
        <div>
          <h3 className="text-xl font-semibold">{job.title}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-600">
            <span className="inline-flex items-center gap-1">
              <FaMapMarkerAlt /> {job.location}
            </span>
            <span className="inline-flex items-center gap-1">
              <FaUserTie /> {job.dept}
            </span>
            <span>{job.type}</span>
            <span>{job.exp}</span>
            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700">{job.id}</span>
          </div>
        </div>
      </div>

      <p className="mt-4 text-gray-700">{job.summary}</p>

      <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
        {job.bullets.map((b) => (
          <li key={b} className="flex items-center gap-2 text-gray-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" /> {b}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <a
          href={applyMailTo}
          className="inline-flex items-center gap-2 rounded-lg bg-[#FF4017]  px-4 py-2 text-white hover:bg-emerald-700"
        >
          Apply via Email <FaArrowRight />
        </a>
        
      </div>
    </article>
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