"use client";

import ContactCta from "@/components/ContactCta";
import React, { useEffect, useMemo, useState } from "react";
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
import {
  HiBolt,
  HiBriefcase,
  HiCheckCircle,
  HiChevronDown,
  HiGlobeAlt,
  HiHeart,
  HiInbox,
  HiMapPin,
  HiRocketLaunch,
  HiShieldCheck,
  HiSparkles,
  HiStar,
  HiUsers,
} from "react-icons/hi2";
/**
 * StrucAxis — Careers Page (JSX only, TailwindCSS)
 * Fetches jobs from http://localhost:3000/api/jobs
 * No TypeScript, no external components required.
 */

export default function CareerPage() {
  // ----------------- JOB DATA (from API) -----------------
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadJobs() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/jobs", {
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch jobs: ${res.status}`);
        }

        const payload = await res.json();
        const list = Array.isArray(payload?.jobs) ? payload.jobs : payload;

        // Normalize incoming jobs to your UI shape safely
        const normalized = (list || []).map((j, idx) => {
          const id = j.id || j._id || `JOB-${idx + 1}`;
          // default icons by dept (optional nicety)
          const iconByDept = {
            Execution: <FaHardHat />,
            Projects: <FaProjectDiagram />,
            Commercial: <FaClipboardList />,
            MEP: <FaClipboardList />,
            Safety: <FaShieldAlt />,
            Production: <FaTools />,
            "Design Support": <FaRulerCombined />,
          };

          let bullets = j.bullets;
          if (typeof bullets === "string") {
            // support "a|b|c" or "a;b;c" or "a, b, c"
            const sep = bullets.includes("|")
              ? "|"
              : bullets.includes(";")
              ? ";"
              : ",";
            bullets = bullets
              .split(sep)
              .map((s) => s.trim())
              .filter(Boolean);
          }
          if (!Array.isArray(bullets)) bullets = [];

          return {
            id,
            title: j.title || "Untitled Role",
            dept: j.dept || "General",
            icon: iconByDept[j.dept] || <FaUserTie />,
            location: j.location || "Multiple",
            type: j.type || "Full-time",
            exp: j.exp || "—",
            summary:
              j.summary ||
              j.description ||
              "Role description coming soon. Reach out to HR for details.",
            bullets:
              bullets.length > 0
                ? bullets
                : ["Responsibilities shared during interview"],
          };
        });

        if (active) setJobs(normalized);
      } catch (err) {
        if (active) setError(err.message || "Unable to fetch jobs.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadJobs();
    return () => {
      active = false;
    };
  }, []);

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
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white backdrop-blur">
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
              className="group inline-flex items-center gap-2 rounded-lg bg-white/10 px-5 py-3 text-white hover:bg-white/20"
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
      <Careers />

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
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/10 px-4 py-3 text-white hover:bg-white/20"
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
      <ContactCta />
    </main>
  );
}

/* ----------------- SMALL COMPONENTS ----------------- */

function Badge({ children }) {
  return (
    <div className="rounded-lg bg-white/10 px-3 py-2 text-sm text-white backdrop-blur">
      {children}
    </div>
  );
}

function Perk({ title, text }) {
  return (
    <div className="rounded-2xl bg-white p-6">
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
    <div className="w-full max-w-xl rounded-xl bg-white p-4">
      <div className="grid sm:grid-cols-3 gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search role or keyword"
          className="rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <select
          value={dept}
          onChange={(e) => setDept(e.target.value)}
          className="rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
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
          className="rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
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
    <article className="group flex flex-col rounded-2xl bg-white p-6 hover:shadow-md transition">
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
          className="inline-flex items-center gap-2 rounded-lg bg-[#FF4017] px-4 py-2 text-white hover:bg-emerald-700"
        >
          Apply via Email <FaArrowRight />
        </a>
        {/* Keep WA if you need it */}
        {/* <a href={applyWhatsApp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">
          WhatsApp HR <FaWhatsapp />
        </a> */}
      </div>
    </article>
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


  function Careers() {
  const [openings, setOpenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/jobs?active=true&limit=50", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load jobs");
        const data = await res.json();
        setOpenings(Array.isArray(data.items) ? data.items : []);
      } catch (e) {
        setError(e.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  
 
  

 
  return (
    <div className="min-h-screen bg-[#F3F1EB] text-black">
      {/* Hero */}
     
      {/* Trust bar */}
     

      {/* Openings */}
      <section id="openings" className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-semibold md:text-4xl">Open Positions</h2>
            <p className="mt-2 text-black/60">We hire for craft, curiosity, and ownership.</p>
          </div>
          <a
            href="mailto:careers@trygvestudio.com?subject=General%20Application"
            className="hidden rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-black/90 hover:bg-white/10 md:inline-block"
          >
            Send open application
          </a>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-black/10 bg-black/5 p-6">
                <div className="h-6 w-2/3 rounded bg-black/10" />
                <div className="mt-3 h-4 w-full rounded bg-black/10" />
                <div className="mt-2 h-4 w-5/6 rounded bg-black/10" />
                <div className="mt-4 flex gap-2">
                  <div className="h-6 w-20 rounded-full bg-black/10" />
                  <div className="h-6 w-24 rounded-full bg-black/10" />
                </div>
                <div className="mt-6 h-9 w-28 rounded bg-black/10" />
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="mt-10 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            Failed to load jobs: {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && openings.length === 0 && (
          <div className="mt-10 rounded-2xl border border-black/10 bg-white p-10 text-center">
            <h3 className="text-xl font-semibold">No open roles right now</h3>
            <p className="mt-2 text-black/60">We update this page as new positions open. You can still send an open application.</p>
            <a
              href="mailto:careers@trygvestudio.com?subject=Open%20application"
              className="mt-6 inline-flex rounded-lg bg-[#234D7E] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Send resume
            </a>
          </div>
        )}

        {openings.length > 0 && (<div className="mt-10 grid  gap-6 md:grid-cols-2">
          {openings.map((job) => (
            <article
              key={job.id}
              className="group  relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-50 hover:bg-zinc-100  shadow  p-6 transition hover:border-white/20 hover:bg-white/[0.05] "
            >
              <div className="flex items-start justify-between  gap-4">
                <div>
                  <h3 className="text-xl font-semibold tracking-tight">{job.title}</h3>
                  <p className="mt-2 text-sm text-black/70">{job.blurb}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-black/70">
                    <span className="inline-flex items-center gap-1"><HiBriefcase className="h-4 w-4" />{job.type}</span>
                    <span className="inline-flex items-center gap-1"><HiMapPin className="h-4 w-4" />{job.location}</span>
                    <span className="inline-flex items-center gap-1"><HiUsers className="h-4 w-4" />{job.team}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-black"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Accent badge */}
                <div className="shrink-0 rounded-xl   p-[1px]">
                  <div className="rounded-[10px] bg-[#ff ffff] px-3 py-2 text-xs text-black/80">Hiring</div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <a
                  className="rounded-lg bg-[#234D7E] text-white px-4 py-2 text-sm font-semibold shadow-[0_0_0_1px_rgba(255,255,255,0.12)] transition hover:opacity-90"
                  href={`mailto:careers@trygvestudio.com?subject=${encodeURIComponent(job.title)}%20-%20Application`}
                >
                  Share CV at careers@trygvestudio.com
                </a>
                {/* <button className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-black/90 transition hover:bg-white/10">
                  View details
                </button> */}
              </div>

              {/* Card glow on hover */}
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden>
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent blur-xl" />
              </div>
            </article>
          ))}
        </div>)}
      </section>

    
    </div>
  );
}