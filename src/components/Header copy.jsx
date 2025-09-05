"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import logo from "@/assets/logo.png";
import Script from "next/script";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (menuOpen && !isClosing) document.body.style.overflow = "hidden";
    else document.body.style.overflow = prev || "";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [menuOpen, isClosing]);

  // Close helpers
  const closeMenu = useCallback(() => {
    setIsClosing(true);
  }, []);

  const toggleMenu = () => {
    if (menuOpen) closeMenu();
    else setMenuOpen(true);
  };

  // Close on ESC
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, closeMenu]);

  // Unmount after close animation ends
  const handleSheetAnimEnd = () => {
    if (isClosing) {
      setMenuOpen(false);
      setIsClosing(false);
    }
  };
  const handleBackdropAnimEnd = () => {
    /* no-op; keep for symmetry/future */
  };

  return (
    <header className="bg-[#F4F1EC] pt-[14px] border-b border-zinc-300 shadow-sm fixed w-full z-[100]  backdrop-blur-[0.5px]">
      <Script
    src="https://www.googletagmanager.com/gtag/js?id=G-8GJTSNR2BP"
    strategy="afterInteractive"
  />
  <Script id="gtag-init" strategy="afterInteractive">
    {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-8GJTSNR2BP');
    `}
  </Script>
      <div className="max-w-7xl mx-auto md:px-0 px-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-6">
        {/* Left block (logo + title) — preserved exactly per your layout */}
        <div className="flex flex-col items-center md:grid md:grid-cols-[auto_1fr] md:items-center md:gap-[18px] md:min-h-[68px]">
          {/* Logo */}
          <Link
            href="/"
            className="relative inline-block leading-none md:justify-self-start"
          >
            <Image
              src={logo}
              alt="TRYGVE STUDIO logo"
              width={90}
              height={90}
              priority
              className="w-[70px] h-[70px] md:w-[70px] md:h-[70px]"
            />
          </Link>

          {/* Company name */}
          <Link
            href="/"
            className="
              m-0 font-medium text-ink tracking-[0.02em]
              text-center md:text-left
              leading-[1.1]
              text-[clamp(20px,6vw,18px)]
              mt-2 md:mt-0
            "
          >
            TRYGVE STUDIO PRIVATE
            {' '}
            LIMITED
          </Link>
        </div>

        {/* Right block */}
        <div className="flex items-center justify-end flex-1">
          {/* Desktop nav */}
          <nav className="hidden md:flex gap-8 items-center justify-center">
            <Link href="/" className="text-[15px] md:text-[16px] text-ink underline-offset-4 hover:underline">
              Home
            </Link>
            <Link href="/about-us" className="text-[15px] md:text-[16px] text-ink underline-offset-4 hover:underline">
              About Us
            </Link>
            <Link href="/projects" className="text-[15px] md:text-[16px] text-ink underline-offset-4 hover:underline">
              Projects
            </Link>
            <Link href="/blogs" className="text-[15px] md:text-[16px] text-ink underline-offset-4 hover:underline">
              Blogs
            </Link>
            <Link href="/services" className="text-[15px] md:text-[16px] text-ink underline-offset-4 hover:underline">
              Services
            </Link>

            <Link href="/career" className="text-[15px] md:text-[16px] text-ink underline-offset-4 hover:underline">
              Career
            </Link>
            
                 
             <Link href="/contact-us" className="text-[15px] text-white md:text-[16px] text-ink underline-offset-4 hover:underline bg-[#234D7E] px-3 py-1 rounded-[4px]">
              Contact Us
            </Link>
          </nav>

          {/* Mobile hamburger — top-right */}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={toggleMenu}
            className="md:hidden  fixed top-4 right-0  items-cen ter justify-cen ter h-11 w-11 rounded-full bor der border-black/15 bg- white/80 backdrop-blur hover:b g-white transition sh adow-[0_6px_16px_rgba(0,0,0,0.08)] ml-auto"
          >
            {menuOpen && !isClosing ? <FiX className="h-5 w-5" /> : <FiMenu className="h-10 w-6" />}
          </button>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-0 h-[1px] bg-rule max-w-7xl mx-auto mt-[10px]" />

      {/* Mobile Menu Overlay — mounted while open or closing, with elastic animations */}
      {(menuOpen || isClosing) && (
        <>
          {/* Backdrop */}
          <div
            role="button"
            aria-label="Close menu"
            onClick={closeMenu}
            className={`fixed inset-0 top-0 z-[1000000] h-screen md:hidden ${
              isClosing
                ? "animate-[fade-out_220ms_ease-in_forwards]"
                : "animate-[fade-in_240ms_ease-out_forwards]"
            } bg-black/70 backdrop-blur-sm`}
            onAnimationEnd={handleBackdropAnimEnd}
          />

          {/* Elastic sheet from top-right */}
          <div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            className={`fixed top-6 right-4 z-[100000000] md:hidden w-[84%] max-w-sm rounded-2xl border border-black/10 bg-white shadow-[0_30px_80px_rgba(0,0,0,0.28)] overflow-hidden origin-top-right ${
              isClosing
                ? "animate-[sheet-elastic-out_460ms_cubic-bezier(0.2,0.8,0.25,1.2)_forwards]"
                : "animate-[sheet-elastic-in_520ms_cubic-bezier(0.2,0.8,0.25,1.2)_forwards]"
            }`}
            onAnimationEnd={handleSheetAnimEnd}
          >
            <div className="px-5 py-4 border-b border-black/10 flex items-center justify-between">
              <span className="text-sm tracking-wider uppercase text-neutral-600">Menu</span>
              <button
                onClick={closeMenu}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-[#234D7E] text-white "
                aria-label="Close menu"
              >
                <FiX />
              </button>
            </div>

            <ul className="p-2">
              <li>
                <Link
                  href="/"
                  onClick={closeMenu}
                  className="block rounded-xl px-4 py-3 text-[16px] text-ink hover:bg-[#F4F1EC] transition flex items-center justify-between"
                >
                  <span>Home</span>
                  <span className="text-xs text-neutral-500">Go to homepage</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/about-us"
                  onClick={closeMenu}
                  className="block rounded-xl px-4 py-3 text-[16px] text-ink hover:bg-[#F4F1EC] transition flex items-center justify-between"
                >
                  <span>About Us</span>
                  <span className="text-xs text-neutral-500">Know our story</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  onClick={closeMenu}
                  className="block rounded-xl px-4 py-3 text-[16px] text-ink hover:bg-[#F4F1EC] transition flex items-center justify-between"
                >
                  <span>Projects</span>
                  <span className="text-xs text-neutral-500">See the work</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/blogs"
                  onClick={closeMenu}
                  className="block  rounded-xl px-4 py-3 text-[16px] text-ink hover:bg-[#F4F1EC] transition flex items-center justify-between"
                >
                  <span>Blogs</span>
                  <span className="text-xs text-neutral-500">Know industry insights</span>
                </Link>
              </li>
               <li>
                <Link
                  href="/services"
                  onClick={closeMenu}
                  className="block  rounded-xl px-4 py-3 text-[16px] text-ink hover:bg-[#F4F1EC] transition flex items-center justify-between"
                >
                  <span>Services</span>
                  <span className="text-xs text-neutral-500">Work with us</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/career"
                  onClick={closeMenu}
                  className="block  rounded-xl px-4 py-3 text-[16px] text-ink hover:bg-[#F4F1EC] transition flex items-center justify-between"
                >
                  <span>Career</span>
                  <span className="text-xs text-neutral-500">Work with us</span>
                </Link>
              </li>
             
              <li>
                <Link
                  href="/contact-us"
                  onClick={closeMenu}
                  className="block  rounded-xl px-4 py-3 text-[16px] text-ink hover:bg-[#F4F1EC] transition flex items-center justify-between"
                >
                  <span>Contact Us</span>
                  <span className="text-xs text-neutral-500">Start a project</span>
                </Link>
              </li>
            </ul>

            {/* Fancy footer chips */}
            {/* <div className="px-4 pb-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-black/10 bg-[#F4F1EC] px-3 py-1 text-xs">Interior</span>
              <span className="rounded-full border border-black/10 bg-[#F4F1EC] px-3 py-1 text-xs">Architecture</span>
              <span className="rounded-full border border-black/10 bg-[#F4F1EC] px-3 py-1 text-xs">Global</span>
            </div> */}
          </div>
        </>
      )}

      {/* Elastic keyframes */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0 }
          to { opacity: 1 }
        }
        @keyframes fade-out {
          from { opacity: 1 }
          to { opacity: 0 }
        }

        /* Enters with a little overshoot + subtle scale */
        @keyframes sheet-elastic-in {
          0%   { transform: translateY(-8px) scaleY(0.9); opacity: 0; }
          55%  { transform: translateY(2px)  scaleY(1.03); opacity: 1; }
          75%  { transform: translateY(-1px) scaleY(0.995); }
          100% { transform: translateY(0)    scaleY(1); }
        }
        /* Exits with a quick compress-up */
        @keyframes sheet-elastic-out {
          0%   { transform: translateY(0)    scaleY(1); opacity: 1; }
          20%  { transform: translateY(1px)  scaleY(1.02); }
          100% { transform: translateY(-8px) scaleY(0.9); opacity: 0; }
        }
      `}</style>
    </header>
  );
}