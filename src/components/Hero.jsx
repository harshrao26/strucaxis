"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { FaWhatsapp, FaPhoneAlt } from "react-icons/fa";
import h1 from "@/assets/hero/h1.png"
import h2 from "@/assets/hero/h2.png"
import h3 from "@/assets/hero/h3.png"
import h4 from "@/assets/hero/h4.png"
import h5 from "@/assets/hero/h5.png"

/**
 * Background Marquee + Dynamic Copy
 * - Rotates slides every 3s (fade transition)
 * - Headline & subcopy change with the active slide
 * - CTAs unchanged
 */
export default function Hero() {
  const slides = useMemo(
    () => [
      {
        key: "civil",
        src:
          h1,
        headline: "Civil Construction (Shell & Core)",
        subcopy:
          "RCC, masonry, structural coordination and QA/QC for dependable shell & core delivery.",
      },
      {
        key: "hospitality",
        src:
          h2,
        headline: "Hospitality Fit-outs (Hotels • Resorts • F&B)",
        subcopy:
          "Fast-track interior execution with landlord/mall coordination and high safety standards.",
      },
      {
        key: "office",
        src:
          h4,
        headline: "Corporate Interiors & MEP Coordination",
        subcopy:
          "Precise MEP, sequencing and procurement management for modern workspaces.",
      },
      {
        key: "architecture",
        src:
          h3,
        headline: "Design–Build with Architects",
        subcopy:
          "Single-window delivery with Trygve Studio Pvt. Ltd — drawings to handover, minus friction.",
      },
      {
        key: "interior",
        src:
          h5,
        headline: "Retail • Café • Experiential Interiors",
        subcopy:
          "In-house joinery & furniture for speed, consistency and brand-accurate finishes.",
      }
     
    ],
    []
  );

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 3000);
    return () => clearInterval(id);
  }, [slides.length]);

  const active = slides[index];

  return (
    <section className="relative overflow-hidden">
      {/* Background marquee (cross-fade) */}
      <div className="absolute inset-0">
        {slides.map((s, i) => (
          <Image
            key={s.key}
            src={s.src}
            alt={s.headline}
            fill
            priority={i === 0}
            sizes="100vw"
            className={`object-cover transition-opacity duration-700 ease-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20" />
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 pt-28 pb-16 sm:pt-36 min-h-[80vh] sm:pb-24">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-white/10 border border-white/30 px-3 py-1 text-xs text-white backdrop-blur-sm">
            Execution arm of Trygve Studio Pvt. Ltd.
          </span>
          <span className="rounded-full bg-emerald-600/90 px-3 py-1 text-xs text-white">
            12+ Years • ISO • MSME • HSE
          </span>
        </div>

        {/* Headline (dynamic) */}
        <h1
          className="mt-6 text-4xl sm:text-6xl md:text-5xl font-semibold text-white leading-tight"
          aria-live="polite"
        >
          {active.headline}
          <span className="block text-white/90">
            trusted by architects, brands & owners
          </span>
        </h1>

        {/* Subcopy (dynamic) */}
        <p className="mt-5 max-w-2xl text-lg sm:text-xl text-white/80" aria-live="polite">
          {active.subcopy}
        </p>

        {/* CTAs (unchanged) */}
        <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
          <a
            href="https://wa.me/0000000000?text=Hi%20StrucAxis%2C%20I'd%20like%20to%20discuss%20a%20project."
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
        </div>

        {/* USPs */}
        {/* <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm sm:text-base">
          <USP title="Multidisciplinary Team" desc="Architects • Civil • MEP • QA/QC" />
          <USP title="Seamless Workflow" desc="Workforce control • Safety" />
          <USP title="In-house Facilities" desc="Machinery • Carpentry • Glass • UPVC" />
          <USP title="Fast-Track Experts" desc="Schools • Hospitality • Exhibits" />
        </div> */}

        {/* (Optional) small dot indicators */}
        {/* <div className="mt-6 flex gap-2">
          {slides.map((s, i) => (
            <button
              key={s.key}
              aria-label={`Go to ${s.key}`}
              onClick={() => setIndex(i)}
              className={`h-2 w-2 rounded-full transition ${
                i === index ? "bg-white" : "bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div> */}
      </div>
    </section>
  );
}

function USP({ title, desc }) {
  return (
    <div className="rounded-lg border border-white/20 bg-black/40 p-4 backdrop-blur-sm">
      <p className="font-semibold text-white">{title}</p>
      <p className="mt-1 text-white/70">{desc}</p>
    </div>
  );
}