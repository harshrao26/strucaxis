"use client";

import React, { useEffect, useState } from "react";
import { FiTool, FiCheckCircle, FiShield, FiCpu, FiPackage, FiLoader } from "react-icons/fi";

export default function CapabilitiesSection({ slug = "everything-under-one-roof" }) {
  const [cap, setCap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true); setErr("");
      try {
        const res = await fetch(`/api/capabilities/${encodeURIComponent(slug)}`, { cache: "no-store" });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "Failed to load");
        if (json?.active === false) { setCap(null); } else { setCap(json); }
      } catch (e) { setErr(e.message || "Failed to load"); }
      finally { setLoading(false); }
    })();
  }, [slug]);

  if (loading) {
    return (
      <section className="bg-[#F4F1EC] py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="h-8 w-2/3 rounded bg-zinc-200 animate-pulse" />
          <div className="mt-3 h-4 w-2/3 rounded bg-zinc-200 animate-pulse" />
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_,i)=><div key={i} className="h-6 w-3/4 rounded bg-zinc-200 animate-pulse" />)}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_,i)=> <div key={i} className="aspect-video rounded-xl bg-zinc-200 animate-pulse" />)}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (err || !cap) return null;

  const icons = [<FiTool/>, <FiCpu/>, <FiPackage/>, <FiShield/>, <FiLoader/>, <FiCheckCircle/>];

  return (
    <section className="bg-[#F4F1EC] py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* left: heading + sub + services list */}
          <div>
            <h2 className="text-4xl sm:text-5xl font-semibold leading-tight">
              {cap.title}
            </h2>
            {cap.subheading ? (
              <p className="mt-4 text-lg text-zinc-700 max-w-2xl">{cap.subheading}</p>
            ) : null}

            <ul className="mt-8 space-y-4 text-[18px] sm:text-[20px] text-zinc-800">
              {(cap.services || []).map((line, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-[3px] inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    {icons[i % icons.length]}
                  </span>
                  <span className="font-medium">{line}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* right: 2x2 images */}
          <div className="grid grid-cols-2 gap-4">
            {(cap.images || []).slice(0,4).map((im, i) => (
              <div key={i} className="overflow-hidden rounded-2xl bg-white ring-1 ring-zinc-200">
                {im?.src ? (
                  <img src={im.src} alt={im.alt || cap.title} className="aspect-video w-full object-cover" />
                ) : (
                  <div className="aspect-video bg-zinc-100" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}