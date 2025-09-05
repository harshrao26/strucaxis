"use client";
import React, { useEffect, useState } from "react";
import { CardCarousel } from "./ui/card-carousel";

export default function CardCaroursalDemo() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("http://localhost:3000/api/feature-projects", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch projects");

        const data = await res.json();
        const projects = data.items || [];

        // map projects → images array
        const imgs = projects.map((p) => ({
          src: p.coverImage,
          alt: p.title,
        }));

        setImages(imgs);
      } catch (err) {
        console.error(err);
      }
    }

    fetchProjects();
  }, []);

  return (
    <div className="w-full">
      {images.length > 0 ? (
        <CardCarousel
          images={images}
          autoplayDelay={2000}
          showPagination={true}
          showNavigation={true}
        />
      ) : (
        <p className="text-center py-8 text-neutral-500">Loading carousel...</p>
      )}
    </div>
  );
}