"use client";
import { useState } from "react";
import Image from "next/image";

export default function ProjectDetailClient({ project }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const accent = project.accentColor?.split(" ")[0] || "#111";
  const images = project.galleryImages || [];

  const openLightbox = (i) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () =>
    setLightboxIndex((i) => (i > 0 ? i - 1 : images.length - 1));
  const nextImage = () =>
    setLightboxIndex((i) => (i < images.length - 1 ? i + 1 : 0));

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <div className="relative w-full h-[60vh] lg:h-[75vh] overflow-hidden">
        <img
          src={project.coverImage}
          alt={project.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center text-white max-w-3xl px-4">
          <h1 className="text-xl lg:text-6xl font-semibold mb-4">
            {project.title}
          </h1>
          <p className="text-lg opacity-90">
            {project.client} • {project.year}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-16 grid lg:grid-cols-3 gap-12">
        {/* Main description & Gallery */}
        <div className="lg:col-span-2">
          <p className="text-lg leading-relaxed text-neutral-700 whitespace-pre-line mb-12">
            {project.description}
          </p>

          {/* Gallery */}
          {images.length > 0 && (
            <div className="columns-1 sm:columns-2 gap-6 space-y-6">
              {images.map((img, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-xl shadow-md cursor-pointer group"
                  onClick={() => openLightbox(i)}
                >
                  <img
                    src={img}
                    alt={`${project.title} image ${i + 1}`}
                    width={1000}
                    height={800}
                    className="hover:scale-105 transition-transform duration-500 object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-10">
          {/* Tags */}
          {project.tags?.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide mb-3">
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-sm px-3 py-1 rounded-full bg-neutral-200 text-neutral-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          {project.stats?.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide mb-3">
                Key Highlights
              </h3>
              <div className="grid gap-4">
                {project.stats.map((stat, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl border bg-white shadow-sm"
                    style={{ borderColor: accent }}
                  >
                    <p className="text-lg font-bold" style={{ color: accent }}>
                      {stat.value}
                    </p>
                    {stat.label && (
                      <p className="text-sm text-neutral-600">{stat.label}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* External Links */}
          <div className="space-y-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                className="block w-full text-center py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition"
                style={{ backgroundColor: accent, color: "#fff" }}
              >
                Visit Website
              </a>
            )}
            {project.caseStudyUrl && (
              <a
                href={project.caseStudyUrl}
                target="_blank"
                className="block w-full text-center py-3 rounded-lg font-medium border border-neutral-300 hover:border-neutral-500 transition"
              >
                View Case Study
              </a>
            )}
          </div>
        </aside>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div className="fixed z-[100000000] inset-0 bg-black/90 flex items-center justify-center z-50">
          <button
            className="absolute top-6 right-6 text-white text-3xl"
            onClick={closeLightbox}
          >
            ✕
          </button>
          <button
            className="absolute left-6 text-white text-4xl"
            onClick={prevImage}
          >
            ‹
          </button>
          <button
            className="absolute right-6 text-white text-4xl"
            onClick={nextImage}
          >
            ›
          </button>
          <div className="max-w-5xl max-h-[85vh] px-6">
            <img
              src={images[lightboxIndex]}
              alt={`Project image ${lightboxIndex + 1}`}
              width={1600}
              height={1200}
              className="object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}