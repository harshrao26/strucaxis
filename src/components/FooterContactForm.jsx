"use client";

import { useState } from "react";
import {
  FiUser, FiMail, FiPhone, FiBriefcase, FiMapPin, FiDollarSign, FiCalendar, FiMessageCircle, FiSend
} from "react-icons/fi";

export default function FooterProjectForm() {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ state: "idle", message: "" });

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData);

      const res = await fetch("/api/submitContact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || "Failed to submit");
      }

      setStatus({ state: "success", message: "Thanks! We’ll reply soon." });
      e.currentTarget.reset();
    } catch (err) {
      console.error(err);
      setStatus({ state: "error", message: "Something went wrong." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="relative mb-10 px-4">
      {/* Ambient gradient glows */}
      <div
        aria-hidden
        className="pointer-events-none  absolute inset-0 -z-10 opacity-80"
        style={{
          background:
            "radial-gradient(40% 60% at 10% 10%, rgba(35,77,126,0.18) 0%, rgba(0,0,0,0) 60%), radial-gradient(35% 55% at 90% 20%, rgba(255,134,98,0.15) 0%, rgba(0,0,0,0) 60%)",
          filter: "blur(24px)",
        }}
      />

      {/* Gradient 1px border wrapper (glassy card) */}
      <div className="rounded-2xl p-[1px] max-w-7xl mx-auto bg-gradient-to-br from-black/10 via-white/40 to-black/10">
        <div className="rounded-[calc(1rem-1px)] bg-white/70 backdrop-blur-md border border-white/30 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          {/* Heading row */}
          <div className="flex flex-col gap-2 px-5 pt-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs tracking-wide uppercase text-neutral-600">
              
              </p>
              <h3 className="text-xl md:text-2xl font-semibold tracking-tight">
  Start a project              </h3>
            </div>
            <div className="hidden md:block text-sm text-neutral-600 pr-1">
              Avg. response: <span className="font-medium">within 24 hours</span>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="w-full grid grid-cols-1 gap-4 px-5 pb-5 pt-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {/* Row 1 */}
            <Input icon={<FiUser className="text-zinc-800" />} name="name" placeholder="Full name *" required />
            <Input icon={<FiMail className="text-zinc-800" />} name="email" type="email" placeholder="Email *" required />
            <Input icon={<FiPhone className="text-zinc-800" />} name="phone" placeholder="Phone / WhatsApp" />

            {/* Row 2 */}
            {/* <Input icon={<FiBriefcase />} name="company" placeholder="Company / Brand (optional)" />
            <Select
              icon={<FiBriefcase />}
              name="projectType"
              required
              options={[
                "Residential",
                "Commercial / Office",
                "Retail / F&B",
                "Hospitality",
                "Landscape",
                "Interior Renovation",
                "Concept / Feasibility",
                "Others",
              ]}
              placeholder="Project type *"
            />
            <Input icon={<FiMapPin />} name="location" placeholder="City & Country *" required /> */}

            {/* Row 3 */}
            {/* <Select
              icon={<FiDollarSign />}
              name="budget"
              options={[
                "To be discussed",
                "$25k – $50k",
                "$50k – $100k",
                "$100k – $250k",
                "$250k+",
              ]}
              placeholder="Estimated budget"
            />
            <Select
              icon={<FiCalendar />}
              name="timeline"
              options={[
                "Immediate (0–1 month)",
                "Soon (1–3 months)",
                "Planning (3–6 months)",
                "Exploring options",
              ]}
              placeholder="Timeline"
            />
            <Textarea
              icon={<FiMessageCircle />}
              name="message"
              placeholder="Tell us about your project *"
              required
            /> */}

            {/* Honeypot (spam trap) */}
            <input type="text" name="_honey" tabIndex="-1" autoComplete="off" className="hidden" aria-hidden="true" />

            {/* Submit row */}
            <div className="lg:col-span-3 md:col-span-2 flex flex-col md:flex-row items-start md:items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="group inline-flex items-center justify-center rounded-full bg-[#244D7E] text-white px-6 py-3 text-sm md:text-[15px] font-medium hover:opacity-90 disabled:opacity-50 transition shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
              >
                {submitting ? "Sending…" : (
                  <>
                    Send
                    <FiSend className="ml-2 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>

              {/* Inline status */}
              {status.state !== "idle" && (
                <p
                  aria-live="polite"
                  className={`text-sm ${
                    status.state === "success" ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {status.message}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

/* ---------- Premium input primitives (with icons) ---------- */

function FieldShell({ children, icon }) {
  return (
    <div className="relative group focus-within:ring-2 focus-within:ring-[#234D7E]/25 rounded-xl">
      {/* Icon */}
      {icon && (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-[#234D7E]">
          {icon}
        </span>
      )}
      {children}
      {/* Soft inner shadow / divider */}
      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-black/10 group-hover:ring-black/20 transition" />
    </div>
  );
}

function Input({ name, type = "text", placeholder, required = false, icon }) {
  return (
    <FieldShell icon={icon}>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className={`w-full rounded-xl bg-white/70 backdrop-blur-sm px-11 py-3 text-sm outline-none 
                    placeholder:text-neutral-500 text-neutral-900
                    focus:bg-white/90 border border-transparent`}
      />
    </FieldShell>
  );
}

function Select({ name, options = [], placeholder, required = false, icon }) {
  return (
    <FieldShell icon={icon}>
      <select
        name={name}
        required={required}
        defaultValue=""
        className="w-full appearance-none rounded-xl bg-white/70 backdrop-blur-sm px-11 py-3 text-sm outline-none text-neutral-900 placeholder:text-neutral-500 focus:bg-white/90 border border-transparent"
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      {/* chevron */}
      <svg
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500 group-focus-within:text-[#234D7E]"
        viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
      >
        <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z" />
      </svg>
    </FieldShell>
  );
}

function Textarea({ name, placeholder, required = false, icon }) {
  return (
    <FieldShell icon={icon}>
      <textarea
        name={name}
        required={required}
        placeholder={placeholder}
        rows={4}
        className="w-full rounded-xl bg-white/70 backdrop-blur-sm px-11 py-3 text-sm outline-none placeholder:text-neutral-500 text-neutral-900 focus:bg-white/90 border border-transparent"
      />
    </FieldShell>
  );
}