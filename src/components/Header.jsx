"use client";

import Link from "next/link";
import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const email = "hello@strucaxis.com";
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {}
  };

  const links = [
    { href: "/", label: "Home" },
    { href: "/about-us", label: "About Us" },
    { href: "/projects", label: "Projects" },
    { href: "/services", label: "Services" },
    { href: "/inhouse-facilities", label: "Machinery" },
      { href: "/blogs", label: "Blogs" },
    { href: "/career", label: "Career" },
  
   ];

  return (
    <header className="fixed z-[1000] top-4 left-1/2 -translate-x-1/2   w-full px-3 md:px-0">
      {/* Floating pill container */}
      <div className="mx-auto max-w-7xl">
        <div className="relative flex items-center justify-between rounded-full bg-black/90 text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] ring-1 ring-black/30 backdrop-blur-md">

          {/* Left circular logo/button */}
          <a
            href="/"
            className="m-1 ml-2 flex h-12 w-12 items-center justify-center rounded-full bg-white text-black font-semibold tracking-wide select-none hover:scale-105 transition"
            aria-label="StrucAxis home"
            title="StrucAxis"
          >
            SA
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 font-medium px-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="hover:text-[#FF4017]/100 transition"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Right CTA + mobile toggle */}
          <div className="flex items-center gap-2 pr-2">
            {/* Copy email pill (desktop) */}
              <Link 
             href="/contact-us"
            className=" w-full rounded-full bg-[#FF4017] text-white font-medium px-5 py-3   transition"
           >
            Contact Us
          </Link >

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsOpen((v) => !v)}
              className="md:hidden mr-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/15 transition"
              aria-label="Toggle menu"
            >
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sheet */}
      {isOpen && (
        <div className="md:hidden mt-3 mx-auto max-w-7xl rounded-2xl bg-black/90 text-white ring-1 ring-black/30 backdrop-blur-md px-5 py-6 space-y-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="block text-lg hover:text-emerald-300 transition"
              onClick={() => setIsOpen(false)}
            >
              {l.label}
            </a>
          ))}

          <Link 
             href="/contact-us"
            className="mt-2 w-full rounded-full bg-[#FF4017] text-white font-medium px-5 py-3 h  transition"
           >
            Contact Us
          </Link >
        </div>
      )}
    </header>
  );
}