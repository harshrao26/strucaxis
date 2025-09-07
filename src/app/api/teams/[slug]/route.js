import { NextResponse } from "next/server";
import Team from "@/models/Team";
import { connectDB } from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/teams/:slug
export async function GET(_req, { params }) {
  try {
    await connectDB();
    const doc = await Team.findOne({ slug: params.slug }).lean();
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(doc);
  } catch (err) {
    console.error("GET /teams/:slug error:", err);
    return NextResponse.json({ error: "Failed to fetch team member" }, { status: 500 });
  }
}

// PATCH /api/teams/:slug
export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const body = await req.json();

    if (body?.slug) {
      body.slug = body.slug.trim().toLowerCase().replace(/\s+/g, "-");
    }

    const updated = await Team.findOneAndUpdate(
      { slug: params.slug },
      { $set: body },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("PATCH /teams/:slug error:", err);
    return NextResponse.json({ error: "Failed to update team member" }, { status: 500 });
  }
}

// DELETE /api/teams/:slug
export async function DELETE(_req, { params }) {
  try {
    await connectDB();
    const res = await Team.findOneAndDelete({ slug: params.slug }).lean();
    if (!res) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /teams/:slug error:", err);
    return NextResponse.json({ error: "Failed to delete team member" }, { status: 500 });
  }
}