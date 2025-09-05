"use client";

import React from "react";
import { HiArrowUpRight } from "react-icons/hi2";

export default function Footer() {
  return (
    <footer className="relative bg-black text-white">
      {/* Big brand word behind */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 select-none overflow-hidden"
      >
        <p className="mx-auto w-[120%] max-w-none translate-y-6 truncate text-center font-extrabold leading-none text-white/10 [font-kerning:none] text-[22vw] md:text-[18vw]">
          StrucAxis
        </p>
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 pt-16 pb-28">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Newsletter / social */}
          <div className="md:col-span-1">
            <h3 className="text-2xl sm:text-3xl font-semibold">
              Exclusive project insights, curated for you
            </h3>

            {/* Email pill */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-6 flex items-center rounded-full bg-white/10 pl-4 pr-2 py-2 ring-1 ring-white/20 focus-within:ring-white/40"
            >
              <input
                type="email"
                required
                placeholder="Your Email Address"
                className="w-full bg-transparent text-white placeholder-white/70 outline-none"
              />
              <button
                type="submit"
                className="grid h-10 w-10 place-items-center rounded-full bg-white text-black hover:opacity-90"
                aria-label="Subscribe"
              >
                <HiArrowUpRight className="h-5 w-5" />
              </button>
            </form>

            {/* Socials */}
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/80">
              {["Facebook", "LinkedIn", "Instagram", "Twitter"].map((s) => (
                <a key={s} href="#" className="group inline-flex items-center gap-1 hover:text-white">
                  {s}
                  <HiArrowUpRight className="h-4 w-4 opacity-70 group-hover:opacity-100" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns with vertical separators */}
          <div className="hidden md:block h-full border-l border-white/20" />
          <FooterCol
            titleList={[
              ["Home", "#"],
              ["About Us", "#about"],
              ["Projects", "#projects"],
              ["Culture", "#culture"],
            ]}
          />
          <FooterCol
            titleList={[
              ["Testimonial", "#testimonials"],
              ["Services", "#services"],
              ["Insights", "#blogs"],
              ["Career", "#career"],
            ]}
          />
          <FooterCol
            titleList={[
              ["Sheffield", "#"],
              ["Manchester", "#"],
              ["London", "#"],
              ["New York", "#"],
              ["Contact", "#contact"],
            ]}
          />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8 py-5 text-sm text-white/70">
          <p>© {new Date().getFullYear()} StrucAxis. All Rights Reserved.</p>
          <p>Designed with passion &amp; precision.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ titleList }) {
  return (
    <nav className="md:pl-6 md:border-l md:border-white/20">
      <ul className="space-y-3 text-white/90">
        {titleList.map(([label, href]) => (
          <li key={label}>
            <a href={href} className="hover:text-white">
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}