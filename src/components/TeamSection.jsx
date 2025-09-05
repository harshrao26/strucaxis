"use client";

import React from "react";
import Image from "next/image";

const teamMembers = [
  {
    id: "01",
    name: "Liam Brown",
    role: "Project Manager",
    img: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "02",
    name: "Elijah Jones",
    role: "Civil Engineer",
    img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "03",
    name: "Isabella Garcia",
    role: "Sales Manager",
    company: "Linktree",
    img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "04",
    name: "Henry Lee",
    role: "Architect",
    img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "05",
    name: "Ava Williams",
    role: "Interior Designer",
    img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "06",
    name: "Olivia Miller",
    role: "Structural Engineer",
    img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
  },
];

export default function TeamSection() {
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

        {/* Team Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="bg-neutral-800 rounded-lg overflow-hidden"
            >
              <div className="relative w-full aspect-[4/5]">
                <img
                  src={member.img}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex justify-between items-center px-4 py-3 text-sm">
                <div>
                  <p className="font-medium">{member.name}</p>
                  {member.role && (
                    <p className="text-neutral-400 text-xs">
                      {member.role} {member.company && `• ${member.company}`}
                    </p>
                  )}
                </div>
                <span className="text-neutral-500">_{member.id}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}