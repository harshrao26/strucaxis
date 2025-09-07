"use client";

import React, { useEffect, useState } from "react";

export default function ClientLogos({ limit = 12, className = "" }) {
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`/api/client-logos?limit=${limit}&sort=order`, { cache: "no-store" });
        const json = await res.json();
        if (alive) setLogos(json.items || []);
      } catch (e) {
        console.error("ClientLogos fetch error:", e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [limit]);

  return (
    <section className={`py-12 ${className}`}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <h2 className="text-center text-xl sm:text-2xl font-semibold text-gray-800">
          Trusted by leading brands
        </h2>
        {loading ? (
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="h-20 bg-zinc-200 animate-pulse rounded" />
            ))}
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center">
            {logos.map((logo) => (
              <div key={logo._id} className="flex justify-center">
                {logo.website ? (
                  <a
                    href={logo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block grayscale hover:grayscale-0 transition"
                  >
                    <img
                      src={logo.image?.src}
                      alt={logo.image?.alt || logo.name}
                      className="h-12 object-contain"
                    />
                  </a>
                ) : (
                  <img
                    src={logo.image?.src}
                    alt={logo.image?.alt || logo.name}
                    className="h-12 object-contain grayscale hover:grayscale-0 transition"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}