import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import FeatureProject from "@/models/FeatureProject";

export async function GET(request) {
  await connectDB();
  const { searchParams } = new URL(request.url);

  const page  = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
  const limit = Math.min(parseInt(searchParams.get("limit") || "12", 10), 50);
  const skip  = (page - 1) * limit;

  const search   = searchParams.get("search");
  const featured = searchParams.get("featured");
  const sort     = searchParams.get("sort") || "order createdAt"; // order first, then createdAt desc-like

  const filters = {};
  if (featured === "true" || featured === "false") filters.featured = featured === "true";

  if (search) {
    const rx = new RegExp(search, "i");
    filters.$or = [
      { title: rx },
      { client: rx },
      { tags: rx },
      { blurb: rx },
      { description: rx },
    ];
  }

  const [items, total] = await Promise.all([
    FeatureProject.find(filters).sort(sort).skip(skip).limit(limit).lean(),
    FeatureProject.countDocuments(filters),
  ]);

  return NextResponse.json({
    page, limit, total, totalPages: Math.ceil(total / limit), items,
  });
}

export async function POST(request) {
  await connectDB();
  const body = await request.json();

  const required = ["title", "slug"];
  const missing = required.filter((k) => !body?.[k] || String(body[k]).trim() === "");
  if (missing.length) {
    return NextResponse.json({ error: `Missing required field(s): ${missing.join(", ")}` }, { status: 400 });
  }

  try {
    // Normalize tags
    let tags = body.tags;
    if (!Array.isArray(tags) && typeof tags === "string") {
      tags = tags.split(",").map((s) => s.trim()).filter(Boolean);
    }
    if (!Array.isArray(tags)) tags = [];

    // Normalize gallery (support strings or objects)
    let gallery = Array.isArray(body.gallery) ? body.gallery : [];
    gallery = gallery
      .map((g) => {
        if (typeof g === "string") return { src: g, alt: "" };
        if (g && typeof g === "object") return { src: g.src, alt: g.alt || "" };
        return null;
      })
      .filter((x) => x && x.src);

    // If gallery is empty but legacy galleryImages exist, use them
    if ((!gallery || gallery.length === 0) && Array.isArray(body.galleryImages)) {
      gallery = body.galleryImages.filter(Boolean).map((src) => ({ src, alt: "" }));
    }

    const doc = await FeatureProject.create({
      title:        String(body.title).trim(),
      slug:         String(body.slug).trim().toLowerCase(),
      client:       body.client || "",
      year:         body.year || undefined,
      tags,

      // Media
      coverImage:   body.coverImage || "",
      coverAlt:     body.coverAlt || "",        // NEW
      mediaType:    body.mediaType || "image",
      mediaUrl:     body.mediaUrl || "",
      gallery,                                   // NEW structured gallery
      galleryImages: Array.isArray(body.galleryImages) ? body.galleryImages : [], // legacy echo

      // Copy & links
      blurb:        body.blurb || "",
      description:  body.description || "",
      caseStudyUrl: body.caseStudyUrl || "",
      liveUrl:      body.liveUrl || "",
      dribbbleUrl:  body.dribbbleUrl || "",
      awwwardsUrl:  body.awwwardsUrl || "",

      // Presentation
      accentColor:  body.accentColor || "#7C5CFF",
      order:        typeof body.order === "number" ? body.order : 100,
      featured:     typeof body.featured === "boolean" ? body.featured : true,

      // Stats
      stats:        Array.isArray(body.stats) ? body.stats : [],

      // SEO
      schemaMarkup: body.schemaMarkup || "",     // NEW
    });

    return NextResponse.json(doc, { status: 201 });
  } catch (err) {
    console.error(err);
    if (err?.code === 11000) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}