"use client";

import React from "react";

export default function MilestonesExact() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-8 pt-16 pb-24">
        {/* Heading */}
        <h2 className="text-[34px] leading-tight sm:text-[44px] md:text-[56px] font-semibold text-neutral-900">
          Milestones That Reflect Our{" "}
          <span className="text-neutral-400 font-semibold">
            Passion for Architecture and Design Excellence
          </span>
        </h2>

        {/* Intro copy */}
        <div className="mt-8 max-w-3xl text-[15px] sm:text-base leading-6">
          <p className="text-neutral-800 font-semibold">
            Over the years, we’ve turned visions into reality, shaping spaces
            that inspire and endure.
          </p>
          <p className="mt-2 text-neutral-500">
            Our journey is marked by award-winning projects, trusted
            partnerships, and timeless designs. Every milestone reflects our
            passion for innovation, precision, and architectural excellence.
          </p>
        </div>

        {/* Stats grid */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-14 gap-y-14">
          <Stat kpi="150+" label="Projects Completed" />
          <Stat kpi="12+" label="Years of Experience" />
          <Stat kpi="25+" label="Locations" />
          <Stat kpi="5M+" label="Sq. Ft. Designed" />
        </div>
      </div>
    </section>
  );
}

function Stat({ kpi, label }) {
  return (
    <div className="flex flex-col">
      {/* thin divider on top like the mock */}
      <div className="h-px w-full bg-neutral-300 mb-6" />
      <div className="text-neutral-900 text-[64px] leading-none font-semibold">
        {kpi}
      </div>
      <div className="mt-3 text-neutral-600 text-[15px]">{label}</div>
    </div>
  );
}