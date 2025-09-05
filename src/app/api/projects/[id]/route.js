// /app/api/feature-projects/[id]/route.js
import { NextResponse } from "next/server";
import FeatureProject from "@/models/FeatureProject";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function asQuery(ref) {
  // If it looks like a 24-hex ObjectId, query by _id; otherwise by slug
  const isId = /^[0-9a-fA-F]{24}$/.test(ref);
  return isId ? { _id: new mongoose.Types.ObjectId(ref) } : { slug: ref };
}

// GET /api/feature-projects/:id-or-slug   (only featured:false)
export async function GET(_req, { params }) {
  try {
    await connectDB();
    const ref = params.id;

    const doc = await FeatureProject.findOne({ ...asQuery(ref), featured: false }).lean();
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(doc);
  } catch (err) {
    console.error("GET /feature-projects/:id error:", err);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

// PATCH /api/feature-projects/:id-or-slug   (only featured:false)
export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const ref = params.id;
    const body = await req.json();

    // Normalize legacy galleryImages -> gallery if needed
    if ((!body.gallery || body.gallery.length === 0) && Array.isArray(body.galleryImages)) {
      body.gallery = body.galleryImages.map((src) => ({ src, alt: "" }));
    }

    const updated = await FeatureProject.findOneAndUpdate(
      { ...asQuery(ref), featured: false },
      { $set: body },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("PATCH /feature-projects/:id error:", err);
    if (err?.code === 11000) {
      return NextResponse.json(
        { error: "Duplicate key", fields: err.keyValue },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

// DELETE /api/feature-projects/:id-or-slug   (only featured:false)
export async function DELETE(_req, { params }) {
  try {
    await connectDB();
    const ref = params.id;

    const res = await FeatureProject.findOneAndDelete({ ...asQuery(ref), featured: false }).lean();
    if (!res) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /feature-projects/:id error:", err);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}