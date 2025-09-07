// src/app/api/services/route.js
import { NextResponse } from "next/server";
import Service from "@/models/Service";
import { connectDB } from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/services?page=&limit=&search=
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const page  = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "24", 10)));
    const skip  = (page - 1) * limit;

    const q = {};
    const search = searchParams.get("search");
    if (search) {
      q.$or = [
        { title:  { $regex: search, $options: "i" } },
        { summary:{ $regex: search, $options: "i" } },
        { points: { $regex: search, $options: "i" } },
        { slug:   { $regex: search, $options: "i" } },
      ];
    }

    const sort = searchParams.get("sort") || "order -createdAt";

    const [items, total] = await Promise.all([
      Service.find(q).sort(sort).skip(skip).limit(limit).lean(),
      Service.countDocuments(q),
    ]);

    return NextResponse.json({
      page, limit, total, pages: Math.ceil(total / limit), items,
    });
  } catch (err) {
    console.error("GET /services error:", err);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

// POST /api/services
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body?.title || !body?.slug) {
      return NextResponse.json({ error: "title and slug are required" }, { status: 400 });
    }
    if (!body?.image?.src) {
      return NextResponse.json({ error: "image.src is required" }, { status: 400 });
    }
    if (!Array.isArray(body?.points) || body.points.length !== 3) {
      return NextResponse.json({ error: "points must contain exactly three items" }, { status: 400 });
    }

    // normalize
    body.slug = String(body.slug).trim().toLowerCase().replace(/\s+/g, "-");

    const created = await Service.create(body);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("POST /services error:", err);
    if (err?.code === 11000) {
      return NextResponse.json({ error: "Duplicate slug" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}