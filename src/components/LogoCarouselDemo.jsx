"use client"

import React from "react"
import LogoCarousel from "./ui/logo-carousel"

export function LogoCarouselDemo() {
  return (
    <div className="space-y-8 py-24 bg-[#F4F1EC]">
      <div className="w-full max-w-screen-lg mx-auto flex flex-col items-center space-y-8">
        {/* Heading and description */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-gray-900">
            Clients  {" "}
            <span className=" text-gray-400">
              We’ve Served
            </span>
          </h2>
          <p className="max-w-2xl text-gray-600">
            Over the years, StrucAxis has partnered with architects, developers,
            retail brands, hospitality groups, and corporate offices to deliver
            high-quality projects with precision and trust.
          </p>
        </div>

        {/* Carousel */}
        <LogoCarousel columnCount={3} />
      </div>
    </div>
  )
}