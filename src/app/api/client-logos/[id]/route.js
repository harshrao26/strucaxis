import { NextResponse } from "next/server";
import ClientLogo from "@/models/ClientLogo";
import { connectDB } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET(_req, { params }) {
  try {
    await connectDB();
    const logo = await ClientLogo.findById(params.id).lean();
    if (!logo) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(logo);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch logo" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const body = await req.json();
    const updated = await ClientLogo.findByIdAndUpdate(params.id, { $set: body }, { new: true }).lean();
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: "Failed to update logo" }, { status: 500 });
  }
}

export async function DELETE(_req, { params }) {
  try {
    await connectDB();
    const removed = await ClientLogo.findByIdAndDelete(params.id).lean();
    if (!removed) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to delete logo" }, { status: 500 });
  }
}