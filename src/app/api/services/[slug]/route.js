// src/app/api/services/[slug]/route.js
import { NextResponse } from "next/server";
import Service from "@/models/Service";
import { connectDB } from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/services/:slug
export async function GET(_req, { params }) {
  try {
    await connectDB();
    const doc = await Service.findOne({ slug: params.slug }).lean();
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(doc);
  } catch (err) {
    console.error("GET /services/:slug error:", err);
    return NextResponse.json({ error: "Failed to fetch service" }, { status: 500 });
  }
}

// PATCH /api/services/:slug
export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const body = await req.json();

    if (body?.slug)
      body.slug = String(body.slug).trim().toLowerCase().replace(/\s+/g, "-");

    if (body?.points && (!Array.isArray(body.points) || body.points.length !== 3)) {
      return NextResponse.json({ error: "points must contain exactly three items" }, { status: 400 });
    }

    const updated = await Service.findOneAndUpdate(
      { slug: params.slug },
      { $set: body },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("PATCH /services/:slug error:", err);
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}

// DELETE /api/services/:slug
export async function DELETE(_req, { params }) {
  try {
    await connectDB();
    const res = await Service.findOneAndDelete({ slug: params.slug }).lean();
    if (!res) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /services/:slug error:", err);
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}