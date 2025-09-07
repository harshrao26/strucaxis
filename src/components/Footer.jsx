"use client";

import React from "react";
import { HiArrowUpRight } from "react-icons/hi2";

export default function Footer() {
  return (
    <footer className="relative bg-black text-white">
      {/* Big brand word behind */}
      

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 pt-16 pb-28">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Newsletter / social */}
          <div className="md:col-span-1">
            <h3 className="text-2xl sm:text-3xl font-semibold">
              Stay in the loop — project updates & industry tips
            </h3>

            {/* Email pill */}
            

            {/* Socials */}
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/80">
              <a href="#" className="group inline-flex items-center gap-1 hover:text-white">
                LinkedIn <HiArrowUpRight className="h-4 w-4 opacity-70 group-hover:opacity-100" />
              </a>
              <a href="#" className="group inline-flex items-center gap-1 hover:text-white">
                Instagram <HiArrowUpRight className="h-4 w-4 opacity-70 group-hover:opacity-100" />
              </a>
              <a href="#" className="group inline-flex items-center gap-1 hover:text-white">
                Facebook <HiArrowUpRight className="h-4 w-4 opacity-70 group-hover:opacity-100" />
              </a>
              <a href="#" className="group inline-flex items-center gap-1 hover:text-white">
                Twitter <HiArrowUpRight className="h-4 w-4 opacity-70 group-hover:opacity-100" />
              </a>
            </div>
          </div>

          {/* Company blurb */}
          

          {/* Contact */}
          <div className="md:col-span-1">
            <h4 className="text-xl sm:text-2xl font-semibold">Contact</h4>
            <ul className="mt-4 space-y-3 text-white/80">
              <li>
                <a href="tel:+919554440400" className="hover:text-white transition-colors">+91 95544 40400</a>
              </li>
              <li>
                <a href="mailto:faisal.saif@trygvestudio.com" className="hover:text-white transition-colors">faisal.saif@trygvestudio.com</a>
              </li>
              <li>
                <span>Mon–Sat, 9:30am–6:00pm IST</span>
              </li>
              <li className="text-white/70">
                Bengaluru, Karnataka, India
              </li>
            </ul>
            <a
              href="/contact-us#project-form"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-white text-black px-5 py-2 font-medium hover:opacity-90"
            >
              Start a Project
              <HiArrowUpRight className="ml-2 h-4 w-4" />
            </a>
          </div>

          {/* Link columns with vertical separators */}
           <FooterCol
            titleList={[
              ["Home", "#"],
              ["About Us", "#about"],
              ["Projects", "#projects"],
              ["Services", "#services"],
              ["Machinery", "#machinery"],
              ["Blogs", "#blogs"],
              ["Career", "#career"],
            ]}
          />
        </div>
      </div>
      <p className="text-[16vw] -mt-40 -mb-20 text-center text-white/5">
        StrucAxis
      </p>

      {/* Bottom bar */}
      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8 py-5 text-sm text-white/70">
          <p>© {new Date().getFullYear()} StrucAxis. A Trygve Studio Pvt. Ltd Company. All Rights Reserved.</p>
         <div>
          Designed & Developed by <a href="https://genforgestudio.com/" className="text-[#ff4017]">GenForge Studio</a> — Global Web & App Development Agency
         </div>
        </div>
      </div>
      
      <p className="text-black">s</p>
    </footer>
  );
}

function FooterCol({ titleList }) {
  return (
    <nav className="md:pl-8 md:border-l md:border-white/20">
      <ul className="space-y-4 text-white/80 text-base">
        {titleList.map(([label, href]) => (
          <li key={label}>
            <a href={href} className="hover:text-white transition-colors duration-200">
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}