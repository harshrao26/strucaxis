import { headers } from "next/headers";
import ProjectDetailClient from "./ProjectDetailClient";

/** Build absolute base URL for SSR (works on localhost and prod) */
function getBaseUrl() {
  const h = headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  const proto = h.get("x-forwarded-proto") || "http";
  return `${proto}://${host}`;
}

/** Normalize a project to the shape the client expects */
function normalizeOne(p = {}) {
  const isFeature = "coverImage" in p || "galleryImages" in p || "gallery" in p;

  const coverImage = isFeature ? p.coverImage : p.cover;

  // gallery: accept legacy string[] and structured [{src, alt}]
  let galleryImages = [];
  if (Array.isArray(p.galleryImages)) {
    galleryImages = p.galleryImages;
  } else if (Array.isArray(p.gallery)) {
    galleryImages = p.gallery
      .map((g) => (typeof g === "string" ? g : g?.src))
      .filter(Boolean);
  }

  return {
    ...p,
    slug: String(p.slug || p._id || p.id || "").toLowerCase(),
    title: p.title || "Untitled",
    coverImage: coverImage || "",
    galleryImages,
    description: p.description || p.blurb || "",
    client: p.client || p.location || "",
    year: p.year || p.timeline || "",
    tags: Array.isArray(p.tags) ? p.tags : [],
    stats: Array.isArray(p.stats) ? p.stats : [],
    liveUrl: p.liveUrl || "",
    caseStudyUrl: p.caseStudyUrl || "",
    accentColor: p.accentColor || "#111",
  };
}

async function fetchJson(url, init) {
  const res = await fetch(url, { cache: "no-store", ...init });
  if (!res.ok) return { ok: false, status: res.status, data: null };
  return { ok: true, status: 200, data: await res.json() };
}

async function getProject(slug) {
  const base = getBaseUrl();
  const slugLc = String(slug).toLowerCase();

  // 1) Try the feature-project detail endpoint (you configured this to return featured:true by slug)
  const detail = await fetchJson(`${base}/api/feature-projects/${encodeURIComponent(slugLc)}`);
  if (detail.ok && detail.data) {
    return normalizeOne(detail.data);
  }

  // 2) Fall back to searching the lists:
  // - /api/feature-projects → your list returns featured:false (non-featured)
  // - /api/projects → your other collection
  const [nonFeatured, other] = await Promise.all([
    fetchJson(`${base}/api/feature-projects`), // featured:false
    fetchJson(`${base}/api/projects`),
  ]);

  const listA = Array.isArray(nonFeatured.data?.items)
    ? nonFeatured.data.items
    : Array.isArray(nonFeatured.data?.data)
    ? nonFeatured.data.data
    : Array.isArray(nonFeatured.data)
    ? nonFeatured.data
    : [];

  const listB = Array.isArray(other.data?.items)
    ? other.data.items
    : Array.isArray(other.data?.data)
    ? other.data.data
    : Array.isArray(other.data)
    ? other.data
    : [];

  const hit =
    listA.find((p) => String(p.slug || "").toLowerCase() === slugLc) ||
    listB.find((p) => String(p.slug || "").toLowerCase() === slugLc);

  return hit ? normalizeOne(hit) : null;
}

export default async function ProjectPage({ params }) {
  const project = await getProject(params.slug);

  if (!project) {
    return <div className="p-12">Project not found</div>;
  }

  return <ProjectDetailClient project={project} />;
}