"use client";

import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { useRouter } from "next/navigation";

// small helper components for form fields
function Field({ label, name, type = "text", required = false, placeholder }) {
  return (
    <label className="block text-sm font-medium text-neutral-700">
      {label}
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
      />
    </label>
  );
}

function Select({ label, name, options = [], required = false }) {
  return (
    <label className="block text-sm font-medium text-neutral-700">
      {label}
      <select
        name={name}
        required={required}
        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function Textarea({ label, name, required = false, placeholder }) {
  return (
    <label className="block text-sm font-medium text-neutral-700">
      {label}
      <textarea
        name={name}
        rows={4}
        required={required}
        placeholder={placeholder}
        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
      />
    </label>
  );
}

export default function ContactForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ state: "", message: "" });

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    setSubmitting(true);
    setStatus({ state: "", message: "" });

    try {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);

      const payload = {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        company: data.company || "",
        location: data.location,
        projectType: data.projectType,
        budget: data.budget || "",
        timeline: data.timeline || "",
        message: data.message,

        // extras
        page: window.location.pathname,
        utm: {
          source: new URLSearchParams(window.location.search).get("utm_source") || "",
          medium: new URLSearchParams(window.location.search).get("utm_medium") || "",
          campaign: new URLSearchParams(window.location.search).get("utm_campaign") || "",
        },
        website: "", // honeypot
      };

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok || !result.ok) throw new Error(result.error || "Failed to submit");

      setSubmitting(false);
      form.reset();
      setStatus({ state: "success", message: "✅ Thanks! Your enquiry has been saved." });

      // redirect to thank-you
      router.replace("/thankyou");
      setTimeout(() => {
        if (window.location.pathname !== "/thankyou") {
          window.location.assign("/thankyou");
        }
      }, 100);
    } catch (err) {
      console.error("Submit error:", err);
      setSubmitting(false);
      setStatus({ state: "error", message: "❌ Something went wrong. Please try again." });
    }
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 md:p-8">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
        {/* Honeypot */}
        <input
          type="text"
          name="website"
          tabIndex="-1"
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field label="Full name *" name="fullName" required />
          <Field label="Email *" name="email" type="email" required />
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field label="Phone / WhatsApp" name="phone" />
          <Select
            label="Estimated budget"
            name="budget"
            options={[
              "To be discussed",
              "$25k – $50k",
              "$50k – $100k",
              "$100k – $250k",
              "$250k+",
            ]}
          />
         </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Select
            label="Project type *"
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
          />
          <Field
            label="City & Country *"
            name="location"
            required
            placeholder="e.g., Mumbai, India / Dubai, UAE"
          />
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          
          {/* <Select
            label="Timeline"
            name="timeline"
            options={[
              "Immediate (0–1 month)",
              "Soon (1–3 months)",
              "Planning (3–6 months)",
              "Exploring options",
            ]}
          /> */}
        </div>

        <Textarea
          label="Tell us about your project *"
          name="message"
          required
          placeholder="Site details, area (sqft/sqm), style inspirations, constraints, goals…"
        />

        <label className="flex items-start gap-3 text-xs text-neutral-700">
          <input type="checkbox" name="consent" value="yes" className="mt-1" required />
          I consent to StrucAxis Pvt. Ltd contacting me about this enquiry and agree to the
          privacy policy.
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

        <p className="text-xs text-neutral-500">
          We usually reply within 24 hours. For urgent requests, call us.
        </p>

        <div aria-live="polite" className="text-sm mt-2">
          {status.state === "success" && (
            <p className="text-green-700">{status.message}</p>
          )}
          {status.state === "error" && (
            <p className="text-red-700">{status.message}</p>
          )}
        </div>
      </form>
    </div>
  );
}