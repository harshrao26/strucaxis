"use client";

import React, { useEffect, useState } from "react";
import { FaHammer, FaCouch, FaWarehouse, FaTools, FaShieldAlt } from "react-icons/fa";
import { MdOutlinePrecisionManufacturing } from "react-icons/md";

export default function CapabilitiesBlock({ slug, className = "" }) {
  const [cap, setCap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!slug) {
        setErr("No slug provided to CapabilitiesBlock.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setErr("");
      try {
        const url = `/api/capabilities/${encodeURIComponent(slug)}`;
        const res = await fetch(url, { cache: "no-store" });
        const json = await res.json();
        if (!res.ok) {
          console.error("CapabilitiesBlock fetch failed:", res.status, json);
          throw new Error(json?.error || `Failed to load: ${res.status}`);
        }
        if (alive) setCap(json?.active === false ? null : json);
      } catch (e) {
        if (alive) {
          console.error("CapabilitiesBlock error:", e);
          setErr(e.message || "Failed to load");
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [slug]);

  // skeleton
  if (loading) return (
    <section className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08),transparent_60%)]" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-20">
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <div className="h-8 w-2/3 rounded bg-zinc-200 animate-pulse" />
            <div className="mt-4 h-4 w-4/5 rounded bg-zinc-200 animate-pulse" />
            <div className="mt-6 space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-6 w-5/6 rounded bg-zinc-200 animate-pulse" />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] rounded-xl bg-zinc-200 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  // visible error state so you know what's wrong
  if (err) return (
    <section className={`relative overflow-hidden ${className}`}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {`CapabilitiesBlock: ${err}`} — check the slug you pass in. Try visiting
          <code className="ml-1 rounded bg-white px-1 py-0.5">/api/capabilities/{slug}</code> directly in your browser.
        </div>
      </div>
    </section>
  );

  if (!cap) return null;

  const icons = [
    <FaHammer key="hammer" />,
    <FaCouch key="couch" />,
    <FaWarehouse key="warehouse" />,
    <MdOutlinePrecisionManufacturing key="precision" />,
    <FaTools key="tools" />,
    <FaShieldAlt key="shield" />,
  ];

  return (
    <section className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08),transparent_60%)]" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-20">
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-semibold">{cap.title}</h2>
            {cap.subheading ? <p className="mt-4 text-gray-600">{cap.subheading}</p> : null}
            <ul className="mt-6 space-y-3 text-gray-800">
              {(cap.services || []).map((line, i) => (
                <LI key={i} icon={icons[i % icons.length]} text={line} />
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {(cap.images || []).slice(0, 4).map((im, i) => (
              <div key={i} className="aspect-[4/3] overflow-hidden rounded-xl">
                {im?.src ? (
                  <img
                    src={im.src}
                    alt={im.alt || cap.title}
                    className="h-full w-full object-cover hover:scale-105 transition"
                  />
                ) : (
                  <div className="h-full w-full bg-zinc-100" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function LI({ icon, text }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
        <span className="text-[14px]">{icon}</span>
      </span>
      <span className="font-medium">{text}</span>
    </li>
  );
}