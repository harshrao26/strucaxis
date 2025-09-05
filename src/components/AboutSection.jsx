"use client";

import React from "react";
import { HiArrowRight } from "react-icons/hi2";

export default function AboutSection() {
  return (
    <section className="bg-[#F4F1EC] py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 grid md:grid-cols-2 gap-12 items-center">
        {/* Left Column */}
        <div>
          <h2 className="text-4xl sm:text-5xl font-bold leading-tight text-gray-900">
            We build spaces where{" "}
            <span className="text-gray-500">precision meets performance</span>,{" "}
            creating environments{" "}
            <span className="text-gray-500">that endure.</span>
          </h2>

          <p className="mt-6 text-gray-700 text-lg">
            At <span className="font-semibold">StrucAxis</span>, we believe
            contracting is about more than just execution—it's about delivering
            trust. Our mission is to create spaces that are delivered on time,
            within budget, and with uncompromising quality.
          </p>

          <p className="mt-4 text-gray-500">
            With in-house facilities and a multidisciplinary team, we craft{" "}
            <span className="font-medium text-gray-700">projects that last</span>{" "}
            — from civil works and interiors to turnkey fit-outs.
          </p>

          <button className="mt-6 inline-flex items-center gap-2 rounded-md bg-gray-900 px-5 py-3 text-white hover:bg-gray-800">
            Learn More
            <HiArrowRight className="h-5 w-5" />
          </button>
        </div>

        {/* Right Column */}
        <div className="space-y-4 text-gray-800">
          <Feature text="Experienced Multidisciplinary Team" />
          <Feature text="Seamless Project Workflow" />
          <Feature text="In-house Carpentry, Glass & UPVC Facilities" />
          <Feature text="Fast-Track Delivery Capability" />
          <Feature text="Client-Centric & Transparent Approach" />
        </div>
      </div>
    </section>
  );
}

function Feature({ text }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 pb-3">
      <span className="flex items-center gap-2 text-lg text-gray-700">
        <HiArrowRight className="h-5 w-5 text-gray-500" />
        {text}
      </span>
    </div>
  );
}