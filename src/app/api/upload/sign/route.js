import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request) {
  try {
    const { folder } = await request.json(); // optional override
    const timestamp = Math.round(new Date().getTime() / 1000);
    const upload_preset = undefined; // if you use presets, set here and include in the string_to_sign

    const paramsToSign = {
      timestamp,
      folder: folder || process.env.CLOUDINARY_UPLOAD_FOLDER,
      // If using upload presets: upload_preset,
    };

    // Build the string to sign in key-sorted order
    const sortedKeys = Object.keys(paramsToSign).sort();
    const toSign = sortedKeys
      .map((k) => `${k}=${paramsToSign[k]}`)
      .join("&");

    const signature = crypto
      .createHash("sha1")
      .update(toSign + process.env.CLOUDINARY_API_SECRET)
      .digest("hex");

    return NextResponse.json({
      timestamp,
      signature,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      folder: paramsToSign.folder,
      // uploadPreset: upload_preset,
    });
  } catch (e) {
    return NextResponse.json({ error: "Sign error" }, { status: 500 });
  }
}