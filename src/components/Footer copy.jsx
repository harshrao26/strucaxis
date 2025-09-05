"use client";
import Link from "next/link";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiGlobe,
  FiArrowRight,
} from "react-icons/fi";
import { FaInstagram, FaLinkedin, FaBehance, FaWhatsapp } from "react-icons/fa";
import FooterContactForm from "./FooterContactForm";

/**
 * variant: "bronze" | "emerald" | "oxblood" | "royal"
 */
export default function FooterPremium({ variant = "bronze" }) {
  const themes = {
    bronze: {
      base: "#F4F1EC",
      ink: "#101010",
      deep: "#1C1D21",
      accent: "#B7893C",
      chip: "#ECE7DF",
      line: "rgba(0,0,0,.12)",
    },
    emerald: {
      base: "#F7F5F2",
      ink: "#222427",
      deep: "#2E3135",
      accent: "#2C6E63",
      chip: "#ECE7DF",
      line: "rgba(0,0,0,.12)",
    },
    oxblood: {
      base: "#F4F1EC",
      ink: "#0F1112",
      deep: "#1B1C1E",
      accent: "#234D7E",
      chip: "#E9E3DA",
      line: "rgba(0,0,0,.12)",
    },
    royal: {
      base: "#F6F6F4",
      ink: "#2A2D33",
      deep: "#1D2026",
      accent: "#2F5CB4",
      chip: "#E7E6E3",
      line: "rgba(0,0,0,.12)",
    },
  };

  const c = themes[variant];

  return (
    <footer className="relative" style={{ background: c.base, color: c.ink }}>

      <FooterContactForm />
      {/* Top CTA strip */}
      <section
        className="border-y"
        style={{ borderColor: c.line, background: c.base }}
      >
        <div className="mx-auto max-w-7xl px-5 py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] opacity-70">
                Work with us
              </p>
              <h3 className="mt-1 text-2xl font-semibold tracking-tight">
                Architecture · Interiors · PMC · EPC · 3D Visualisation
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://wa.me/919554440400"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm text-white shadow-sm transition"
                style={{ background: c.accent }}
              >
                <FaWhatsapp /> Chat on WhatsApp
              </a>
              <a
                href="mailto:faisal.saif@trygvestudio.com"
                className="inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm transition hover:opacity-90"
                style={{ borderColor: c.line }}
              >
                <FiMail /> faisal.saif@trygvestudio.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main footer */}
      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-9">
          {/* Brand + socials */}
          <div className="md:col-span-4">
            <h4 className="text-[18px] font-semibold tracking-tight">
              TRYGVE STUDIO PRIVATE LIMITED
            </h4>
            <p className="mt-2 text-[15px] opacity-85">
              Full-fledged Architectural & allied Engineering firm based in
              Lucknow, India — executing projects worldwide. From concept to
              completion with design, documentation, and site coordination.
            </p>
            <div className="mt-4 flex items-center gap-3">
              {[
                {
                  Icon: FaInstagram,
                  label: "Instagram",
                  href: "https://www.instagram.com/trygvestudio/",
                },
                {
                  Icon: FaLinkedin,
                  label: "LinkedIn",
                  href: "https://in.linkedin.com/company/trygvestudio",
                },
                {
                  Icon: FaBehance,
                  label: "Behance",
                  href: "https://www.behance.net/trygvestudio",
                },
              ].map(({ Icon, label, href }, i) => (
                <a
                  key={i}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full transition hover:-translate-y-0.5"
                  style={{ border: `1px solid ${c.line}`, background: c.base }}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div className="md:col-span-3">
            <h5 className="text-sm font-semibold uppercase tracking-wide opacity-80">
              Explore
            </h5>
            <ul className="mt-3 space-y-2 text-[15px]">
              {[
                { label: "About Us", href: "/about-us" },
                { label: "Projects Gallery", href: "/projects" },
                { label: "Services", href: "/services" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 hover:underline"
                  >
                    <span>{link.label}</span>
                    <FiArrowRight className="h-4 w-4 translate-x-0 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Offices */}

          {/* Contact & Branches */}
          <div className="md:col-span-2">
            <h5 className="text-sm font-semibold uppercase tracking-wide opacity-80">
              Contact
            </h5>
            <ul className="mt-3 space-y-3 text-[15px]">
              <li className="flex items-start gap-2">
                <FiPhone className="mt-1" />{" "}
                <a href="tel:+919554440400" className="hover:underline">
                  +91 95544 40400
                </a>
              </li>
              <li className="flex items-start gap-2">
                <FiMail className="mt-1" />{" "}
                <a
                  href="mailto:faisal.saif@trygvestudio.com"
                  className="hover:underline"
                >
                  faisal.saif@trygvestudio.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <FiGlobe className="mt-1" />{" "}
                <span>Operating globally · APAC · EMEA · North America</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">

           <div
              className="rounded-xl border p-4"
              style={{ borderColor: c.line, background: c.chip }}
            >
              <h6 className="text-xs font-semibold uppercase opacity-80">
                Head Office
              </h6>
              <p className="mt-1 text-[14px] leading-relaxed">
                Plot No. 728, Khasra No. 21
               
                Eden Enclave, Phase 2, Kursi Road
               
                Gudamba, BKT, Lucknow
               
                Uttar Pradesh – 226026, India
              </p>
            </div>
          <div
            className="  rounded-xl border p-4"
            style={{ borderColor: c.line, background: c.chip }}
          >
            <h6 className="text-xs font-semibold uppercase opacity-80">
              Branch Offices
            </h6>
            <p className="mt-1 text-[14px] leading-relaxed">
              1. Honey Lite, 1st Floor
             
              5/72, Sector 5, Vikas Nagar
             
              Lucknow, Uttar Pradesh – 226022
            </p>
            <p className="mt-3 text-[14px] leading-relaxed">
              2. UGF, Rukshan Complex, Gata No. 112, Dasauli, Kursi Road
             
              Near Integral University Hospital Gate
             
              Lucknow, Uttar Pradesh – 226021
            </p>
          </div>

          <div
              className="rounded-xl border p-4"
              style={{ borderColor: c.line, background: c.chip }}
            >
              <h6 className="text-xs font-semibold uppercase opacity-80">
                Corporate Meeting Space
              </h6>
              <p className="mt-1 text-[14px] leading-relaxed">
                Levana Cyber Heights, 10th Floor – Regus
               
                Vibhuti Khand, Gomti Nagar
               
                Lucknow, Uttar Pradesh – 226010, India
              </p>
            </div>


        </div>
 
      </section>

      {/* Legal bar */}
      <section className="border-t" style={{ borderColor: c.line }}>
        <div
          className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-5 text-[13px] md:flex-row md:items-center md:justify-between"
          style={{ color: c.ink }}
        >
          <div className="flex items-center gap-3 opacity-80">
            <Link
              href="/privacy"
              className="hover:underline hover:opacity-100 transition-opacity"
            >
              Privacy
            </Link>
            <span className="opacity-40">•</span>
            <Link
              href="/terms"
              className="hover:underline hover:opacity-100 transition-opacity"
            >
              Terms
            </Link>
            <span className="opacity-40">•</span>
            <button
              onClick={() =>
                typeof window !== "undefined"
                  ? window.scrollTo({ top: 0, behavior: "smooth" })
                  : null
              }
              className="rounded-full border px-2.5 py-1 text-[12px] hover:bg-white/50"
              style={{ borderColor: c.line }}
            >
              Back to top
            </button>
            <span className="opacity-40">•</span>
            <span>© {new Date().getFullYear()} Trygve Studio</span>
          </div>

          <div className="opacity-80 text-center md:text-right">
             <p className="text-center">
    Designed & Developed by{" "}
    <a
      href="https://genforgestudio.com/"
      title="Web & App Development by GenForge Studio"
      className="text-indigo-400 font-medium hover:underline hover:text-indigo-300 transition-colors"
      target="_blank"
      rel="noopener noreferrer"
    >
      GenForge Studio
    </a>
    {" "}— Global Web & App Development Agency
  </p>
          </div>
        </div>
      </section>
    </footer>
  );
}
