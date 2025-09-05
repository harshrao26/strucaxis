"use client";

import React from "react";
import { HiArrowRight } from "react-icons/hi2";
 import { ArrowRight, Globe } from "lucide-react"
import WrapButton from "./ui/wrap-button";

export default function ContactCta() {
  return (
    <section className="relative bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-5xl px-6 text-center">
        {/* Small overline */}
        <p className="text-xs font-semibold tracking-[0.2em] text-gray-900">
          CONTACT
        </p>

        {/* Headline wrapper for overlay effect */}
        <div className="relative mt-6">
          {/* Foreground line */}
          <h2 className="text-4xl sm:text-5xl md:text-5xl font-semibold leading-tight text-gray-900">
            Let’s Build Something
          </h2>

          {/* Oversized pale word behind/under */}
           <p className="text-9xl text-zinc-400" >
            Extraordinary
           </p>
        </div>

        {/* CTA */}
        <div className="">
 


           <WrapButton className="mt-10" href="/docs/components/card-carousel" >
            <Globe className="animate-spin " />
            Get started
        </WrapButton>
        </div>
      </div>
    </section>
  );
}