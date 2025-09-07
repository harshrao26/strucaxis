import { NextResponse } from "next/server";
import Capability from "@/models/Capability";
import { connectDB } from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const q = {};
    const search = searchParams.get("search");
    if (search) {
      q.$or = [
        { title: { $regex: search, $options: "i" } },
        { subheading: { $regex: search, $options: "i" } },
        { services: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
      ];
    }
    const sort = searchParams.get("sort") || "order -createdAt";
    const items = await Capability.find(q).sort(sort).lean();
    return NextResponse.json({ items });
  } catch (e) {
    console.error("GET /capabilities error:", e);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body?.title || !body?.slug) {
      return NextResponse.json({ error: "title and slug are required" }, { status: 400 });
    }
    if (!Array.isArray(body?.services) || body.services.length < 1) {
      return NextResponse.json({ error: "services must have at least 1 item" }, { status: 400 });
    }
    if (!Array.isArray(body?.images) || body.images.length !== 4 || body.images.some((i) => !i?.src)) {
      return NextResponse.json({ error: "images must have exactly 4 items with src" }, { status: 400 });
    }

    body.slug = String(body.slug).trim().toLowerCase().replace(/\s+/g, "-");

    const created = await Capability.create(body);
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    console.error("POST /capabilities error:", e);
    if (e?.code === 11000) return NextResponse.json({ error: "Duplicate slug" }, { status: 409 });
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}