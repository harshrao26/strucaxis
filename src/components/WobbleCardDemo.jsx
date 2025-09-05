"use client";

import React from "react";
import { WobbleCard } from "./ui/wobble-card";

export function WobbleCardDemo() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
      {/* Core Promise */}
      <WobbleCard
        containerClassName="col-span-1 lg:col-span-2 h-full bg-emerald-800 min-h-[500px] lg:min-h-[300px]"
        className=""
      >
        <div className="max-w-xs">
          <h2 className="text-left text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            Building Trust. Delivering Quality.
          </h2>
          <p className="mt-4 text-left text-base/6 text-neutral-200">
            With 12+ years of expertise, StrucAxis ensures seamless workflows, 
            reliable manpower management, and end-to-end execution across construction, 
            interiors, and turnkey fit-outs.
          </p>
        </div>
        <img
          src="/images/construction.jpg"
          width={500}
          height={500}
          alt="Construction workflow"
          className="absolute -right-4 lg:-right-[40%] -bottom-10 object-contain rounded-2xl"
        />
      </WobbleCard>

      {/* Differentiator */}
      <WobbleCard containerClassName="col-span-1 min-h-[300px] bg-neutral-900">
        <h2 className="max-w-80 text-left text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
          Multidisciplinary Team Advantage
        </h2>
        <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
          From architects to engineers and procurement experts, our team 
          integrates skills to handle complex projects efficiently — 
          ensuring quality, speed, and compliance.
        </p>
      </WobbleCard>

      {/* Services CTA */}
      <WobbleCard
        containerClassName="col-span-1 lg:col-span-3 bg-blue-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]"
      >
        <div className="max-w-sm">
          <h2 className="max-w-sm md:max-w-lg text-left text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            General Contracting, Interior Fit-Outs & Beyond
          </h2>
          <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
            We deliver turnkey solutions across civil works, design-build, 
            renovations, MEP coordination, and joinery. Backed by in-house 
            machinery and production units for unmatched control and speed.
          </p>
        </div>
        <img
          src="/images/interior.jpg"
          width={500}
          height={500}
          alt="Interior fit-out"
          className="absolute -right-10 md:-right-[40%] lg:-right-[20%] -bottom-10 object-contain rounded-2xl"
        />
      </WobbleCard>
    </div>
  );
}