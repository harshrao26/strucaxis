"use client";
import { FiPhone, FiMail } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

export default function TrygveAnnouncement() {
  return (
    <section className="relative overflow-hidden">
    
      {/* Background: soft gradient + grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-white to-zinc-50"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background:radial-gradient(circle_at_20%_-10%,rgba(99,102,241,.15),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(16,185,129,.12),transparent_40%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] [background-size:36px_36px]"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24">
        {/* Glass card */}
        <div className="mx-auto max-w-4xl rounded-3xl border border-zinc-200/70 bg-white/100 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
          <div className="p-6 sm:p-10 md:p-12">
            {/* Eyebrow */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-3 py-1 text-xs font-medium tracking-wide text-zinc-700">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              Architectural & Allied Engineering Services — Lucknow, UP
            </div>

            {/* Headline */}
            <h1 className="text-3xl leading-tight font-semibold tracking-tight md:text-5xl">
              Trygve Studio, promoted by{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent">
                Trygve Engineering Pvt. Ltd
              </span>
              , is a full-fledged Architectural & allied Engineering service
              company based in Lucknow, India.
            </h1>

            {/* Subhead */}
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 md:text-lg">
              We focus on delivering the best{" "}
              <span className="font-semibold text-zinc-800">
                3D Architectural Design Services
              </span>{" "}
              in the region. Our experienced team of{" "}
              <span className="font-medium">Architects, Engineers & Visualisers</span>{" "}
              crafts high-impact spaces, visuals, and documentation end-to-end.
            </p>

            {/* CTA block */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="tel:+919554440400"
                className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                <FiPhone className="h-4 w-4" />
                Call: +91 95544 40400
              </a>

              <a
                href="https://wa.me/919554440400"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-5 py-3 text-sm font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-50"
              >
                <FaWhatsapp className="h-4 w-4" />
                WhatsApp
              </a>

              <a
                href="mailto:faisal.saif@trygvestudio.com"
                className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-50"
              >
                <FiMail className="h-4 w-4" />
                faisal.saif@trygvestudio.com
              </a>
            </div>

            {/* Micro badges */}
            <div className="mt-6 flex flex-wrap gap-2">
              {["Architecture", "3D Visualization", "Engineering", "BIM-ready", "End-to-end Delivery"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>
        </div>


        

        {/* Decorative corner accents (Awwwards vibe) */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-indigo-500/20 to-emerald-500/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-tr from-emerald-500/20 to-indigo-500/10 blur-3xl"
        />
      </div>
    </section>
  );
}