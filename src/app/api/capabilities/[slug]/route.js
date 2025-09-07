import { NextResponse } from "next/server";
import Capability from "@/models/Capability";
import { connectDB } from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(_req, { params }) {
  try {
    await connectDB();
    const doc = await Capability.findOne({ slug: params.slug }).lean();
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(doc);
  } catch (e) {
    console.error("GET /capabilities/:slug", e);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const body = await req.json();

    if (body?.slug) body.slug = body.slug.trim().toLowerCase().replace(/\s+/g, "-");
    if (body?.images && (!Array.isArray(body.images) || body.images.length !== 4 || body.images.some((i) => !i?.src))) {
      return NextResponse.json({ error: "images must have exactly 4 items with src" }, { status: 400 });
    }

    const updated = await Capability.findOneAndUpdate(
      { slug: params.slug },
      { $set: body },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (e) {
    console.error("PATCH /capabilities/:slug", e);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(_req, { params }) {
  try {
    await connectDB();
    const res = await Capability.findOneAndDelete({ slug: params.slug }).lean();
    if (!res) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE /capabilities/:slug", e);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}