"use client";

import React from "react";
import Image from "next/image";
import { HiArrowUpRight } from "react-icons/hi2";
import f1 from "@/assets/fservices/f1.png"

export default function FeaturedServices() {
  const services = [
    {
      title: "GENERAL CONTRACTING (TURNKEY)",
      subtitle: "Single-point delivery — quality, time & cost control",
      img: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
      href: "#services/turnkey",
    },
    {
      title: "INTERIOR FIT-OUT",
      subtitle: "Retail, F&B, Office, Hospitality — ready for handover",
      img: 'https://images.unsplash.com/photo-1675756688096-f3fcf590de9b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      href: "#services/fitout",
    },
    {
      title: "CIVIL CONSTRUCTION",
      subtitle: "Shell & core with rigorous QA/QC and safety",
      img: "https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?q=80&w=1397&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      href: "#services/civil",
    },
    {
      title: "DESIGN–BUILD",
      subtitle: "Integrated with Trygve Studio Pvt. Ltd for speed & clarity",
      img: "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1200&q=80",
      href: "#services/design-build",
    },
  ];

  return (
    <section className="bg-[#F4F1EC] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header row */}
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-4xl sm:text-5xl font-semibold text-gray-900 leading-tight">
              Featured <br className="hidden sm:block" />
              Services
            </h2>
            <p className="mt-4 max-w-md text-sm text-gray-600">
              Our core execution capabilities: turnkey contracting, interior fit-out,
              civil works and integrated design–build — delivered with disciplined
              workforce control and in-house production.
            </p>
          </div>

          <a
            href="#services"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-gray-800 hover:text-gray-900"
          >
            See all Services
            <HiArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        {/* Grid */}
        <div className="mt-8 grid gap-6 sm:gap-8 md:grid-cols-2">
          {services.map((s) => (
            <a
              key={s.title}
              href={s.href}
              className="group block overflow-hidden rounded-md bg-gray-100"
            >
              <div className="relative aspect-[4/3] w-full">
                <img
                  src={s.img}
                  alt={s.title}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  priority={false}
                />
              </div>

              <div className="px-4 sm:px-5 py-4">
                <h3 className="text- text-2xl font-semibold tracking-wide text-gray-900">
                  {s.title}
                </h3>
                <p className="mt-1 text-base text-gray-600">{s.subtitle}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Mobile "See all" */}
        <div className="mt-6 sm:hidden">
          <a
            href="#services"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-800 hover:text-gray-900"
          >
            See all Services
            <HiArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}