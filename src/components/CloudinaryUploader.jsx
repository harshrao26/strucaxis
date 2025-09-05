"use client";

import { useState, useRef } from "react";
import { FiImage, FiTrash2 } from "react-icons/fi";

// Cloudinary unsigned upload config (set in .env.local)
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "trygve-studio";

function uploadToCloudinary(file, onProgress) {
  return new Promise((resolve, reject) => {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      reject(new Error("Cloudinary env missing"));
      return;
    }
    const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", UPLOAD_PRESET);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", endpoint);
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && typeof onProgress === "function") {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        try {
          const ok = xhr.status >= 200 && xhr.status < 300;
          const json = JSON.parse(xhr.responseText || "{}");
          if (!ok) return reject(new Error(json?.error?.message || "Upload failed"));
          resolve(json.secure_url);
        } catch (e) {
          reject(new Error("Upload parse error"));
        }
      }
    };
    xhr.send(fd);
  });
}

export default function CloudinaryUploader({ label = "Upload image", multiple = false, value, onChange }) {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef(null);

  const openPicker = () => inputRef.current?.click();

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    setProgress(0);
    try {
      if (multiple) {
        const urls = [];
        for (let i = 0; i < files.length; i++) {
          const f = files[i];
          if (!f.type.startsWith("image/")) continue;
          const url = await uploadToCloudinary(f, setProgress);
          urls.push(url);
        }
        const next = Array.isArray(value) ? [...value, ...urls] : urls;
        onChange?.(next);
      } else {
        const file = files[0];
        if (file && file.type.startsWith("image/")) {
          const url = await uploadToCloudinary(file, setProgress);
          onChange?.(url);
        }
      }
    } catch (e) {
      alert(e.message || "Upload failed");
    } finally {
      setBusy(false);
      setProgress(0);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  return (
    <div>
      <div
        onClick={openPicker}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="rounded-xl border border-dashed border-black/20 bg-[#F4F1EC] px-4 py-8 text-center cursor-pointer hover:bg-[#EEE9E1] transition"
      >
        <div className="flex items-center justify-center gap-2 text-neutral-700">
          <FiImage />
          <span className="text-sm">Drag & drop or click to {label.toLowerCase()}</span>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
      {busy && (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded bg-black/10">
          <div className="h-full bg-black" style={{ width: `${progress}%` }} />
        </div>
      )}

      {/* Previews */}
      {!multiple && typeof value === "string" && value && (
        <div className="mt-3 rounded-xl overflow-hidden border border-black/10 bg-white">
          <img src={value} alt="preview" className="h-40 w-full object-cover" />
        </div>
      )}
      {multiple && Array.isArray(value) && value.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {value.map((src, i) => (
            <div key={src + i} className="relative rounded-lg overflow-hidden border">
              <img src={src} alt={`img-${i}`} className="h-24 w-full object-cover" />
              <button
                type="button"
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                className="absolute right-1 top-1 inline-flex items-center justify-center rounded bg-white/90 p-1 text-xs shadow"
                aria-label="Remove image"
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}