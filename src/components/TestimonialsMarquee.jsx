"use client";
import { useEffect, useRef } from "react";

export default function TestimonialsCarousel() {
  const trackRef = useRef(null);

  // Seamless infinite scroll with CSS + JS clone
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let scrollAmount = 0;
    let req;

    const animate = () => {
      scrollAmount += 0.5; // speed
      if (scrollAmount >= track.scrollWidth / 2) {
        scrollAmount = 0; // reset halfway
      }
      track.style.transform = `translateX(-${scrollAmount}px)`;
      req = requestAnimationFrame(animate);
    };

    req = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(req);
  }, []);

  const testimonials = [
    {
      name: "Aisha Verma",
      role: "Founder, Atelier A",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=640&auto=format&fit=crop",
      quote:
        "They translated our abstract moodboard into a refined, timeless space.",
      location: "Dubai, UAE",
    },
    {
      name: "Daniel Carter",
      role: "GM, Nordic Hospitality",
      avatar:
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=640&auto=format&fit=crop",
      quote:
        "Every decision felt intentional. The team balanced brand consistency with local constraints beautifully.",
      location: "Stockholm, Sweden",
    },
    {
      name: "Rhea Kapoor",
      role: "Creative Director, RK Studio",
      avatar:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=640&auto=format&fit=crop",
      quote:
        "Our retail launch timeline didn’t slip by a day—rare, and deeply appreciated.",
      location: "Mumbai, India",
    },
    {
      name: "Kenji Watanabe",
      role: "Head of Design, Haru",
      avatar:
        "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=640&auto=format&fit=crop",
      quote:
        "The space feels effortless yet profoundly considered. Materiality and light are handled with mastery.",
      location: "Kyoto, Japan",
    },
    {
      name: "Sofia Martinez",
      role: "COO, Casa Nova",
      avatar:
        "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=640&auto=format&fit=crop",
      quote:
        "They delivered a warm, modern hospitality experience across continents.",
      location: "Barcelona, Spain",
    },
  ];

  // Duplicate data for seamless looping
  const doubled = [...testimonials, ...testimonials];

  return (
    <section className="bg-[#F4F1EC] py-16">
      <div className="max-w-7xl mx-auto px -6">
        <header className="mb-10 text-center">
          <p className="text-xs tracking-wider uppercase text-neutral-600">
            Testimonials
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#101010]">
            Our clients love working with us
          </h2>
        </header>

        {/* Carousel */}
        <div className="overflow-hidden relative">
          <div
            ref={trackRef}
            className="flex gap-6 will-change-transform transition-transform"
          >
            {doubled.map((t, i) => (
              <div
                key={i}
                className="w-[300px] md:w-[360px] shrink-0 bg-white border border-black/10 rounded-2xl shadow-sm hover:shadow-md transition relative overflow-hidden"
              >
                {/* Avatar + Quote */}
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-3">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="h-12 w-12 rounded-full object-cover ring-1 ring-black/10"
                    />
                    <div>
                      <div className="font-semibold text-[15px] leading-tight">
                        {t.name}
                      </div>
                      <div className="text-xs text-neutral-600">
                        {t.role}
                      </div>
                      <div className="text-xs text-neutral-500">
                        {t.location}
                      </div>
                    </div>
                  </div>
                  <blockquote className="mt-4 text-[15px] text-neutral-800 leading-relaxed flex-1">
                    “{t.quote}”
                  </blockquote>
                  <div className="mt-4 text-xs text-neutral-500">
                    Verified feedback
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Edge fade for effect */}
          <div className="pointer-events-none hidden md:absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#F4F1EC] to-transparent" />
          <div className="pointer-events-none hidden md:absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#F4F1EC] to-transparent" />
        </div>
      </div>
    </section>
  );
}