"use client";

import React, { useEffect, useState } from "react";
import { FiAlertCircle } from "react-icons/fi";

export default function TeamSection() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/teams?sort=order%20-createdAt", {
        cache: "no-store",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to fetch team");
      setTeam(Array.isArray(json.items) ? json.items.filter(t => t.active !== false) : []);
    } catch (e) {
      setErr(e.message || "Failed to load team");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <section className="bg-black text-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="grid md:grid-cols-2 gap-10 mb-12">
          <h2 className="text-4xl sm:text-5xl font-semibold leading-tight">
            Our dream <br /> team
          </h2>
          <p className="text-neutral-400 max-w-md">
            At StrucAxis, our multidisciplinary team of architects, engineers,
            designers, and managers collaborates to deliver projects on time,
            within budget, and with uncompromising quality.
          </p>
        </div>

        {/* state handling */}
        {loading ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[400px] animate-pulse rounded-lg bg-neutral-800"
              />
            ))}
          </div>
        ) : err ? (
          <div className="flex items-center gap-2 rounded bg-red-50 p-4 text-sm text-red-700">
            <FiAlertCircle /> {err}{" "}
            <button
              onClick={load}
              className="ml-2 underline text-red-800 hover:text-red-900"
            >
              retry
            </button>
          </div>
        ) : team.length === 0 ? (
          <p className="text-neutral-400">No team members yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <div
                key={member._id || member.slug}
                className="bg-neutral-800 rounded-lg overflow-hidden"
              >
                <div className="relative w-full aspect-[4/5]">
                  {member.image?.src ? (
                    <img
                      src={member.image.src}
                      alt={member.image.alt || member.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-neutral-700 flex items-center justify-center text-neutral-500 text-xs">
                      No image
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center px-4 py-3 text-sm">
                  <div>
                    <p className="font-medium">{member.name}</p>
                    {member.position && (
                      <p className="text-neutral-400 text-xs">
                        {member.position}
                      </p>
                    )}
                  </div>
                  <span className="text-neutral-500">
                    _{String(idx + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}