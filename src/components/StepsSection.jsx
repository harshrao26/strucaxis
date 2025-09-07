"use client";

import React from "react";
import {
  HiOutlineChatBubbleLeftRight,
  HiOutlineClipboardDocumentList,
  HiOutlineBolt,
  HiOutlineCheckBadge,
  HiArrowRight,
} from "react-icons/hi2";

/**
 * Fancy Steps / Process Section
 * - TailwindCSS + react-icons only
 * - Dribbble/Awwwards-inspired: gradient glow, glass cards, dotted connectors
 * - Drop anywhere in your page
 */
export default function FancyProcess() {
  const steps = [
    {
      id: "01",
      title: "Discovery & Brief",
      desc:
        "Share your requirements via call, WhatsApp, or our intake form. We align on scope, goals, budget and timeline.",
      icon: <HiOutlineChatBubbleLeftRight className="h-6 w-6" />,
      accent: "from-emerald-400 to-cyan-400",
    },
    {
      id: "02",
      title: "Proposal & VE",
      desc:
        "We study drawings, run BOQ/estimations and present a value-engineered proposal with clear deliverables.",
      icon: <HiOutlineClipboardDocumentList className="h-6 w-6" />,
      accent: "from-cyan-400 to-sky-400",
    },
    {
      id: "03",
      title: "Execution Sprint",
      desc:
        "Site mobilization, disciplined workforce control, procurement, and MEP coordination—tracked to milestones.",
      icon: <HiOutlineBolt className="h-6 w-6" />,
      accent: "from-sky-400 to-indigo-400",
    },
    {
      id: "04",
      title: "Snag-Free Handover",
      desc:
        "QA/QC, documentation and training. We hand over a clean site—and stay available for post-project support.",
      icon: <HiOutlineCheckBadge className="h-6 w-6" />,
      accent: "from-indigo-400 to-violet-400",
    },
  ];

  return (
    <section className="relative overflow-hidden py-24">
      {/* Background: soft gradient, grid + blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(56,189,248,0.18),transparent),radial-gradient(900px_500px_at_10%_110%,rgba(16,185,129,0.15),transparent)]"
      />
      <div aria-hidden className="absolute inset-0 -z-10 [mask-image:radial-gradient(60%_60%_at_50%_50%,black,transparent)]">
        <svg
          className="h-full w-full opacity-20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <path d="M32 0H0V32" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full border border-black/10 bg-white/60 px-3 py-1 text-xs font-medium backdrop-blur">
            Process
          </span>
          <h2 className="mt-5 text-4xl sm:text-5xl font-semibold tracking-tight text-gray-900">
            A Seamless Path from Brief to Handover
          </h2>
          <p className="mt-4 text-gray-600">
            Built for speed, clarity and control—so you always know what’s
            happening, what’s next, and who’s accountable.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-14">
          {/* vertical dotted connector (desktop) */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 hidden h-full -translate-x-1/2 border-l-2 border-dashed border-gray-300 lg:block"
          />

          <div className="grid gap-8 lg:grid-cols-2">
            {steps.map((s, i) => (
              <StepCard key={s.id} step={s} index={i} />
            ))}
          </div>
        </div>

        {/* CTA */}
         
      </div>
    </section>
  );
}

function StepCard({ step, index }) {
  // alternate alignment for desktop: L/R along the center line
  const isLeft = index % 2 === 0;

  return (
    <div
      className={`relative lg:col-span-1 ${isLeft ? "lg:pr-12" : "lg:pl-12"}`}
    >
      {/* node on the center line (desktop) */}
      <div
        aria-hidden
        className={`absolute top-10 hidden h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white lg:block ${
          isLeft ? "right-[-7px]" : "left-[-7px]"
        }`}
        style={{ background: "linear-gradient(to bottom right,#10B981,#60A5FA)" }}
      />

      {/* Card */}
      <div className="group relative overflow-hidden rounded-2xl border border-black/5 bg-white/70 p-5 shadow-[0_10px_40px_rgba(0,0,0,.06)] backdrop-blur transition hover:shadow-[0_18px_60px_rgba(0,0,0,.10)]">
        {/* glow accent */}
        <div
          aria-hidden
          className={`absolute -inset-1 opacity-0 blur-2xl transition group-hover:opacity-40 bg-gradient-to-r ${step.accent}`}
        />
        <div className="relative z-10 flex items-start gap-4">
          {/* icon stack */}
          <div className="relative">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-gray-900 text-white shadow">
              {step.icon}
            </div>
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/80 px-2 py-0.5 text-[10px] font-semibold text-white">
              {step.id}
            </span>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {step.title}
            </h3>
            <p className="mt-1.5 text-gray-600">{step.desc}</p>
          </div>
        </div>

        {/* pill badge accent line */}
        <div className="relative z-10 mt-5 h-px w-full bg-gradient-to-r from-black/10 via-black/5 to-transparent" />
      </div>
    </div>
  );
}