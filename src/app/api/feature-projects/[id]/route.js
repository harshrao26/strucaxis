// my-app/src/app/api/feature-projects/[id]/route.js
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import FeatureProject from "@/models/FeatureProject";

const isObjectId = (v) => mongoose.Types.ObjectId.isValid(v);
const isValidSlug = (slug) => /^[a-z0-9-]+$/.test(String(slug || ""));

function buildMatch(idParam) {
  // If it's an ObjectId, allow matching by _id OR slug equal to that string (just in case).
  // If not an ObjectId, treat it as a slug-only match.
  if (isObjectId(idParam)) return { $or: [{ _id: idParam }, { slug: String(idParam).toLowerCase() }] };
  return { slug: String(idParam).toLowerCase() };
}

/** GET /api/feature-projects/:id  (id = slug or _id) */
export async function GET(_req, { params }) {
  await connectDB();
  const { id } = params;

  // If it's not an ObjectId, enforce slug shape
  if (!isObjectId(id) && !isValidSlug(id)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const doc = await FeatureProject.findOne(buildMatch(id)).lean();
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(doc);
}

/** PATCH /api/feature-projects/:id  (id = slug or _id) */
export async function PATCH(request, { params }) {
  await connectDB();
  const { id } = params;

  if (!isObjectId(id) && !isValidSlug(id)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const body = await request.json();

  // If client tries to change slug, validate it
  if (typeof body.slug === "string" && !isValidSlug(body.slug)) {
    return NextResponse.json({ error: "Invalid slug in payload" }, { status: 400 });
  }

  // Normalize slug (and some fields) if provided
  if (typeof body.slug === "string") body.slug = body.slug.toLowerCase();

  try {
    const doc = await FeatureProject.findOneAndUpdate(
      buildMatch(id),
      { $set: body },
      { new: true, runValidators: true }
    ).lean();

    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(doc);
  } catch (err) {
    console.error(err);
    if (err?.code === 11000) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

/** DELETE /api/feature-projects/:id  (id = slug or _id) */
export async function DELETE(_req, { params }) {
  await connectDB();
  const { id } = params;

  if (!isObjectId(id) && !isValidSlug(id)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const deleted = await FeatureProject.findOneAndDelete(buildMatch(id)).lean();
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ ok: true });
}