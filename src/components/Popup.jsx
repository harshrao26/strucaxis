"use client";
import React, { useState } from "react";
import {
  FiMail, FiPhone, FiGlobe, FiClock, FiMapPin, FiArrowRight,
} from "react-icons/fi";
import {
  FaInstagram, FaLinkedin, FaBehance, FaWhatsapp,
} from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ state: "idle", message: "" });
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return; // guard against double-clicks

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Honeypot spam check
    if ((formData.get("_honey") || "").toString().trim() !== "") {
      // Pretend success to bots, but do nothing
      setStatus({ state: "success", message: "Thanks! Your enquiry has been saved." });
      return;
    }

    setSubmitting(true);
    setStatus({ state: "idle", message: "" });

    try {
      // Convert to plain object
      const data = Object.fromEntries(formData);

      const res = await fetch("/api/submitContact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      // Safely parse JSON
      let result = {};
      try {
        result = await res.json();
      } catch {
        // ignore; will fall back to generic errors below
      }

      if (!res.ok || !result?.success) {
        const msg = result?.error || `Failed to submit (HTTP ${res.status})`;
        throw new Error(msg);
      }

      form.reset();
      setStatus({ state: "success", message: "Thanks! Your enquiry has been saved." });

      // Navigate to thank-you. Use SPA replace, then hard fallback just in case.
      try {
        router.replace("/thankyou");
        setTimeout(() => {
          if (typeof window !== "undefined" && window.location.pathname !== "/thankyou") {
            window.location.assign("/thankyou");
          }
        }, 50);
      } catch {
        if (typeof window !== "undefined") window.location.assign("/thankyou");
      }
    } catch (err) {
      console.error(err);
      setStatus({
        state: "error",
        message:
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again or WhatsApp us.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="max-w-5xl   text-[#101010]">
      {/* ===== Contact + Form ===== */}
      <section className="max-w-5xl relative mt-20">
        <div className="mx-auto px-5 pb-20">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[0.9fr_1.1fr]">
            {/* Form */}
            <div
              id="project-form"
              className={`rounded-2xl max-w-5xl border border-black/10 bg-white p-6 md:p-8 ${
                submitting ? "opacity-90" : ""
              }`}
            >
              <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5" noValidate>
                {/* Honeypot */}
                <input
                  type="text"
                  name="_honey"
                  tabIndex="-1"
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <Field label="Full name" name="name" required disabled={submitting} />
                  <Field label="Email" name="email" type="email" required disabled={submitting} />
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <Field label="Phone / WhatsApp" name="phone" inputMode="tel" disabled={submitting} />
                  <Field label="Company / Brand (optional)" name="company" disabled={submitting} />
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <Select
                    label="Project type"
                    name="projectType"
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
                    required
                    disabled={submitting}
                  />
                  <Field
                    label="City & Country"
                    name="location"
                    placeholder="e.g., Mumbai, India / Dubai, UAE"
                    required
                    disabled={submitting}
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <Select
                    label="Estimated budget"
                    name="budget"
                    options={["To be discussed", "$25k – $50k", "$50k – $100k", "$100k – $250k", "$250k+"]}
                    disabled={submitting}
                  />
                  <Select
                    label="Timeline"
                    name="timeline"
                    options={[
                      "Immediate (0–1 month)",
                      "Soon (1–3 months)",
                      "Planning (3–6 months)",
                      "Exploring options",
                    ]}
                    disabled={submitting}
                  />
                </div>

                <Textarea
                  label="Tell us about your project"
                  name="message"
                  placeholder="Site details, area (sqft/sqm), style inspirations, constraints, goals…"
                  required
                  disabled={submitting}
                />

                <label className="flex items-start gap-3 text-sm text-neutral-700">
                  <input type="checkbox" name="consent" value="yes" className="mt-1" required disabled={submitting} />
                  I consent to Trygve Studio contacting me about this enquiry and agree to the privacy policy.
                </label>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center rounded-full bg-[#101010] text-white px-6 py-3 text-sm md:text-[15px] hover:opacity-90 disabled:opacity-50 transition"
                  >
                    {submitting ? "Sending…" : "Send Your Vision"}
                  </button>

                  <a
                    href="https://wa.me/919554440400"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-[#101010] px-5 py-3 text-sm md:text-[15px] hover:bg-black hover:text-white transition"
                  >
                    <FaWhatsapp className="text-green-600" />
                    Or chat on WhatsApp
                  </a>
                </div>

                <p className="text-xs text-neutral-500">We usually reply within 24 hours. For urgent requests, call us.</p>

                {/* Live region for status */}
                <div aria-live="polite" className="text-sm mt-2 min-h-[1.25rem]">
                  {status.state === "success" && <p className="text-green-700">{status.message}</p>}
                  {status.state === "error" && <p className="text-red-700">{status.message}</p>}
                </div>
              </form>
            </div>
            {/* (Left column content, if any, can go here) */}
          </div>
        </div>
      </section>
    </main>
  );
}

/* ---------- small reusable inputs ---------- */
function Field({
  label,
  name,
  type = "text",
  placeholder = "",
  required = false,
  disabled = false,
  inputMode,
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">
        {label}
        {required && <span aria-hidden className="text-red-600"> *</span>}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        disabled={disabled}
        inputMode={inputMode}
        className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none ring-0 focus:border-black/30 disabled:bg-black/5"
      />
    </label>
  );
}

function Select({ label, name, options = [], required = false, disabled = false }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">
        {label}
        {required && <span aria-hidden className="text-red-600"> *</span>}
      </span>
      <select
        name={name}
        required={required}
        disabled={disabled}
        className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none ring-0 focus:border-black/30 disabled:bg-black/5"
        defaultValue=""
      >
        <option value="" disabled>
          Choose…
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

function Textarea({ label, name, placeholder = "", required = false, disabled = false }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">
        {label}
        {required && <span aria-hidden className="text-red-600"> *</span>}
      </span>
      <textarea
        name={name}
        required={required}
        placeholder={placeholder}
        rows={6}
        disabled={disabled}
        className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none ring-0 focus:border-black/30 disabled:bg-black/5"
      />
    </label>
  );
}
