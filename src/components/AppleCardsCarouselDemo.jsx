"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

export function AppleCardsCarouselDemo() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        setErr("");

        // pulls only non-featured (as per your route) & caps count a bit
        const res = await fetch(`/api/projects?limit=30`, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to fetch projects: ${res.status}`);
        const json = await res.json();

        const list = Array.isArray(json?.items) ? json.items : [];

        // choose the best available cover for each project
        const pickCover = (p) =>
          p?.coverImage ||
          (Array.isArray(p?.gallery) && p.gallery[0]?.src) ||
          (Array.isArray(p?.galleryImages) && p.galleryImages[0]) ||
          ""; // empty => filtered out

        const normalized = list
          .map((p, i) => {
            const src = pickCover(p);
            return src
              ? {
                  // Card expects a "card" object; we only pass src as requested
                  src,
                  // keep keys stable
                  _key: p.slug || p._id || p.id || `proj-${i}`,
                }
              : null;
          })
          .filter(Boolean);

        if (active) setItems(normalized);
      } catch (e) {
        if (active) setErr(e.message || "Unable to load projects.");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const cards = useMemo(
    () =>
      items.map((card, index) => (
        <Card key={card._key} card={{ src: card.src }} index={index} />
      )),
    [items]
  );

  return (
    <div className="w-full h-full py-20">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        Projects
      </h2>

      {/* loading / error states kept lightweight and inline */}
      {loading && (
        <div className="max-w-7xl mx-auto mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[16/10] rounded-3xl bg-neutral-200 dark:bg-neutral-800 animate-pulse"
            />
          ))}
        </div>
      )}

      {!loading && err && (
        <div className="max-w-7xl mx-auto mt-6 px-4">
          <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 p-4">
            {err}
          </div>
        </div>
      )}

      {!loading && !err && items.length > 0 && <Carousel items={cards} />}

      {!loading && !err && items.length === 0 && (
        <div className="max-w-7xl mx-auto mt-6 px-4">
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 p-6">
            No project images available.
          </div>
        </div>
      )}
    </div>
  );
}