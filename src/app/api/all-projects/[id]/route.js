// /app/api/feature-projects/[id]/route.js
import { NextResponse } from "next/server";
import FeatureProject from "@/models/FeatureProject";
import { connectDB } from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/feature-projects/:slug   (only featured:true)
export async function GET(_req, { params }) {
  try {
    await connectDB();
    const slug = params.id; // treat the dynamic segment as slug

    const doc = await FeatureProject.findOne({ slug }).lean();
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(doc);
  } catch (err) {
    console.error("GET /feature-projects/:slug error:", err);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

// PATCH /api/feature-projects/:slug   (only featured:true)
export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const slug = params.id;
    const body = await req.json();

    // Normalize legacy galleryImages -> gallery if needed
    if ((!body.gallery || body.gallery.length === 0) && Array.isArray(body.galleryImages)) {
      body.gallery = body.galleryImages.map((src) => ({ src, alt: "" }));
    }

    const updated = await FeatureProject.findOneAndUpdate(
      { slug,  },
      { $set: body },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("PATCH /feature-projects/:slug error:", err);
    if (err?.code === 11000) {
      return NextResponse.json(
        { error: "Duplicate key", fields: err.keyValue },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

// DELETE /api/feature-projects/:slug   (only featured:true)
export async function DELETE(_req, { params }) {
  try {
    await connectDB();
    const slug = params.id;

    const res = await FeatureProject.findOneAndDelete({ slug}).lean();
    if (!res) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /feature-projects/:slug error:", err);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}