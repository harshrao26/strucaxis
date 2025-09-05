import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Project from "@/models/Project";

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI, { bufferCommands: false });
}

// Optional: lightweight admin guard (set ADMIN_SECRET in .env.local)
// Send header: x-admin-secret: <your secret> from your admin UI fetches
function assertAdmin(request) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return true;
  const token = request.headers.get("x-admin-secret");
  if (token !== secret) throw new Error("UNAUTHORIZED");
  return true;
}

// GET /api/projects/[id]
export async function GET(_req, { params }) {
  try {
    await connectDB();
    const doc = await Project.findById(params.id);
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(doc);
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// PUT /api/projects/[id]
export async function PUT(request, { params }) {
  try {
    assertAdmin(request);
    await connectDB();
    const body = await request.json();
    const updated = await Project.findByIdAndUpdate(params.id, body, { new: true });
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (e) {
    const status = e.message === "UNAUTHORIZED" ? 401 : 500;
    return NextResponse.json({ error: "Failed to update" }, { status });
  }
}

// DELETE /api/projects/[id]
export async function DELETE(request, { params }) {
  try {
    assertAdmin(request);
    await connectDB();
    await Project.findByIdAndDelete(params.id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const status = e.message === "UNAUTHORIZED" ? 401 : 500;
    return NextResponse.json({ error: "Failed to delete" }, { status });
  }
}