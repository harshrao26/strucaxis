"use client";

import { useEffect, useState } from "react";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/testimonials?sort=order", { cache: "no-store" });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "Failed to load");

        if (alive) {
          const mapped = (json.items || []).map((t) => ({
            quote: t.message,
            name: t.name,
            designation: [t.role, t.location].filter(Boolean).join(", "),
            src: t.image?.src || "https://via.placeholder.com/150",
          }));
          setTestimonials(mapped);
        }
      } catch (e) {
        console.error("Testimonials fetch error:", e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  if (loading) {
    return <div className="py-20 text-center text-gray-500">Loading testimonials…</div>;
  }

  if (!testimonials.length) {
    return <div className="py-20 text-center text-gray-500">No testimonials found.</div>;
  }

  return (
    <section className="mx-auto max-w-6xl px-5 sm:px-8 py-20">
      {/* Heading */}
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900">
          What Our Clients Say
        </h2>
        <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
          We’re proud to have earned the trust of architects, developers, and business owners
          across sectors. Here’s what they say about working with <span className="font-semibold">StrucAxis</span>.
        </p>
      </div>

      {/* Testimonials Carousel */}
      <AnimatedTestimonials testimonials={testimonials} />
    </section>
  );
}