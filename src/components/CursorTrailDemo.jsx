"use client"

import React from "react"
import { SparklesIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import ImageCursorTrail from "./ui/image-cursortrail"

const images = [
  // Architecture, interiors, construction-related images
  "https://images.unsplash.com/photo-1581090700227-4c4c8ef1b7a9?q=80&w=1200&auto=format", // construction site
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format", // modern villa interior
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format", // office interiors
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1200&auto=format", // cranes / civil site
  "https://images.unsplash.com/photo-1598300053650-9cdb6eb16f21?q=80&w=1200&auto=format", // hospitality interiors
  "https://images.unsplash.com/photo-1529429617124-95b109e86bb8?q=80&w=1200&auto=format", // retail/café design
  "https://images.unsplash.com/photo-1620050047384-5f1dfbec20b9?q=80&w=1200&auto=format", // carpentry/joinery
  "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200&auto=format", // glass/UPVC facade
  "https://images.unsplash.com/photo-1581092160562-40aa08e78834?q=80&w=1200&auto=format", // machinery / site
  "https://images.unsplash.com/photo-1596422846543-75c6fc197f3d?q=80&w=1200&auto=format", // interior fit-out
]

export function CursorTrailDemo() {
  return (
    <section className="mx-auto   max-w-7xl  ">
      <div className="  ">
        <ImageCursorTrail
          items={images}
          maxNumberOfImages={5}
          distance={25}
          imgClass="sm:w-40 w-28 sm:h-48 h-36 object-cover rounded-xl"
          className="max-w-7xl rounded-3xl"
        >
          <article className="relative bg-white/70 rounded-3xl z-50 flex flex-col items-center justify-center text-center">
            <Badge
              variant="outline"
              className="mb-3 rounded-[14px] border border-black/10 bg-white text-base"
            >
              <SparklesIcon className="fill-emerald-400 stroke-1 text-neutral-800" />
              StrucAxis Services
            </Badge>
            <h1 className="max-w-4xl text-4xl md:text-5xl font-semibold tracking-tight">
              From Civil Works to Interior Fit-Outs,<br /> We Deliver End-to-End Excellence
            </h1>
            <p className="mt-4 max-w-xl text-neutral-600 text-base md:text-lg">
              Explore our portfolio of projects across schools, hospitality,
              retail, offices, and villas — powered by in-house facilities and
              a multidisciplinary team.
            </p>
          </article>
        </ImageCursorTrail>
      </div>
    </section>
  )
}