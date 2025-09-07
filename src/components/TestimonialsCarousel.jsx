"use client";

import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export default function TestimonialsCarousel({ limit = 6 }) {
  const [testimonials, setTestimonials] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`/api/testimonials?limit=${limit}&sort=order`, { cache: "no-store" });
        const json = await res.json();
        if (alive) setTestimonials(json.items || []);
      } catch (e) {
        console.error("Testimonials fetch error:", e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [limit]);

  const next = () => setIndex((i) => (i + 1) % testimonials.length);
  const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="h-40 w-80 bg-zinc-200 animate-pulse rounded-xl" />
      </div>
    );
  }

  if (!testimonials.length) return null;

  const t = testimonials[index];

  return (
    <section className="mx-auto max-w-5xl px-5 sm:px-8 py-16">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        {/* left: image stack */}
        <div className="relative h-80">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-64 h-64">
              <img
                src={t.image?.src}
                alt={t.image?.alt || t.name}
                className="h-full w-full object-cover rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>

        {/* right: text */}
        <div>
          <h3 className="text-xl font-semibold">
            {t.name}
          </h3>
          <p className="text-gray-500">{t.role}{t.location && `, ${t.location}`}</p>
          <p className="mt-4 text-gray-700 leading-relaxed">{t.message}</p>

          <div className="mt-6 flex gap-3">
            <button
              onClick={prev}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200"
            >
              <FaArrowLeft />
            </button>
            <button
              onClick={next}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200"
            >
              <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}