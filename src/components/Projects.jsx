// components/RecentProjects.tsx
"use client";
import Image from "next/image";
import ca from "@/assets/ca3.png";
import r3 from '@/assets/r3.png'
import h1 from '@/assets/h3.png'
const projects = [
  {
    tag: "COMMERCIAL SPACES",
    lines: ["hotels | cafe | salons"],
    img: ca,
    alt: "Commercial glass volume at night"
  },
  {
    tag: "RESIDENTIAL",
    lines: ["apartments | villas |", "bungalows"],
    img: r3,
    alt: "Minimal white residence"
  },
  {
    tag: "OFFICE DESIGN",
    lines: ["corporate | co-working |", "studios"],
    img: h1,
    alt: "Office portico driveway"
  }
];

export default function RecentProjects() {
  return (
    <section className="bg-bgWarm text-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-0 py-8 sm:py-12">
        <h2 className="text-3xl md:text-4xl font-semibold mb-6">
          Recent Projects
        </h2>

        <div className="grid gap-8 sm:gap-10 md:grid-cols-3">
          {projects.map((p) => (
            <article key={p.tag} className="select-none">
              <div className="relative w-full h-[260px] sm:h-[320px]">
                <Image
                  src={p.img}
                  alt={p.alt}
                  fill
                  className="object-cover grayscale"
                  sizes="(min-width:1024px) 360px,  (min-width:768px) 33vw, 100vw"
                  priority
                />
              </div>

              <div className="mt-3">
                <p className="text-[11px] tracking-[0.18em] text-black/70">
                  {p.tag}
                </p>
                {p.lines.map((line, i) => (
                  <p
                    key={i}
                    className="text-[18px] sm:text-[20px] leading-snug font-normal"
                  >
                    {line}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}