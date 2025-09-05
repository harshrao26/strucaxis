"use client";

import { useMemo, useRef, useState } from "react";
import { FiUploadCloud, FiX, FiImage, FiCheck, FiTrash2 } from "react-icons/fi";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME; // e.g. "your-cloud"
const UPLOAD_PRESET = "trygve-studio"; // your preset name

export default function ProjectForm() {
  const [form, setForm] = useState({
    title: "",
    type: "Interior",
    location: "",
    timeline: "",
    tags: "", // we’ll still submit as CSV, but show chips live
    description: "",
  });

  const tagsChips = useMemo(
    () =>
      form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    [form.tags]
  );

  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [coverUrl, setCoverUrl] = useState("");
  const [coverProgress, setCoverProgress] = useState(0);

  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [galleryUrls, setGalleryUrls] = useState([]);
  const [galleryProgress, setGalleryProgress] = useState({}); // index -> %

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);

  const coverInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  /* ------------------------------ Form handlers ----------------------------- */

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onRemoveTag = (t) => {
    const next = tagsChips.filter((x) => x !== t);
    setForm((f) => ({ ...f, tags: next.join(", ") }));
  };

  /* ----------------------------- Upload helpers ----------------------------- */

  const uploadToCloudinary = (file, onProgress) =>
    new Promise((resolve, reject) => {
      const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", UPLOAD_PRESET);
      // fd.append("folder", "trygve/projects"); // optional folder

      const xhr = new XMLHttpRequest();
      xhr.open("POST", url);

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable && typeof onProgress === "function") {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      });

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const json = JSON.parse(xhr.responseText);
              resolve(json.secure_url);
            } catch (err) {
              reject(new Error("Cloudinary response parse error"));
            }
          } else {
            reject(new Error("Cloudinary upload failed"));
          }
        }
      };

      xhr.send(fd);
    });

  const handleCoverSelect = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setCoverFile(f);
    setCoverPreview(URL.createObjectURL(f));
    setCoverUrl("");
    setCoverProgress(0);
    setOk(false);
  };

  const handleGallerySelect = (e) => {
    const files = Array.from(e.target.files || []);
    setGalleryFiles(files);
    setGalleryPreviews(files.map((f) => URL.createObjectURL(f)));
    setGalleryUrls([]);
    setGalleryProgress({});
    setOk(false);
  };

  const uploadImages = async () => {
    if (!coverFile) throw new Error("Please select a cover image");

    setUploading(true);
    setError("");
    try {
      // Cover
      const coverSecure = await uploadToCloudinary(coverFile, setCoverProgress);
      setCoverUrl(coverSecure);

      // Gallery
      const urls = [];
      for (let i = 0; i < galleryFiles.length; i++) {
        const f = galleryFiles[i];
        // progress updater per file
        const onProg = (p) =>
          setGalleryProgress((prev) => ({ ...prev, [i]: p }));
        const u = await uploadToCloudinary(f, onProg);
        urls.push(u);
      }
      setGalleryUrls(urls);
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryIndex = (idx) => {
    const nextFiles = [...galleryFiles];
    const nextPrevs = [...galleryPreviews];
    nextFiles.splice(idx, 1);
    nextPrevs.splice(idx, 1);
    setGalleryFiles(nextFiles);
    setGalleryPreviews(nextPrevs);
    if (galleryUrls.length) {
      const nextUrls = [...galleryUrls];
      nextUrls.splice(idx, 1);
      setGalleryUrls(nextUrls);
    }
    setGalleryProgress((prev) => {
      const copy = { ...prev };
      delete copy[idx];
      return copy;
    });
  };

  /* -------------------------------- Submit --------------------------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setOk(false);
    try {
      // ensure uploads done
      if (!coverUrl || (galleryFiles.length && galleryUrls.length !== galleryFiles.length)) {
        await uploadImages();
      }

      setSaving(true);

      const payload = {
        title: form.title.trim(),
        type: form.type,
        location: form.location.trim(),
        timeline: form.timeline.trim(),
        tags: tagsChips, // send as array to your API (it already accepts array)
        cover: coverUrl,
        gallery: galleryUrls,
        description: form.description.trim(),
      };

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to save project");

      // success
      setOk(true);

      // reset
      setForm({
        title: "",
        type: "Interior",
        location: "",
        timeline: "",
        tags: "",
        description: "",
      });
      setCoverFile(null);
      setCoverPreview(null);
      setCoverUrl("");
      setCoverProgress(0);
      setGalleryFiles([]);
      setGalleryPreviews([]);
      setGalleryUrls([]);
      setGalleryProgress({});
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  /* --------------------------------- UI ------------------------------------ */

  return (
    <form onSubmit={handleSubmit} className="p-6 md:p-8">
      {/* Status banners */}
      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 text-red-800 px-4 py-3 text-sm">
          {error}
        </div>
      )}
      {ok && (
        <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 px-4 py-3 text-sm flex items-center gap-2">
          <FiCheck className="shrink-0" /> Project saved successfully.
        </div>
      )}

      {/* Form grid */}
      <div className="grid md:grid-cols-5 gap-6">
        {/* Left column */}
        <div className="md:col-span-3">
          {/* Basics */}
          <div className="rounded-2xl border border-black/10 bg-white/80 p-5">
            <h2 className="text-base font-medium">Basics</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Title">
                <input
                  name="title"
                  value={form.title}
                  onChange={onChange}
                  className="input border-zinc-300 border-[1px] rounded w-full px-2 mb-4 py-1"
                  required
                />
              </Field>

              <Field label="Type">
                <select
                  name="type"
                  value={form.type}
                  onChange={onChange}
                  className="input border-zinc-300 border-[1px] rounded w-full px-2 mb-4 py-1"
                >
                  <option>Interior</option>
                  <option>Architecture</option>
                </select>
              </Field>

              <Field label="Location">
                <input
                  name="location"
                  value={form.location}
                  onChange={onChange}
                  className="input border-zinc-300 border-[1px] rounded w-full px-2 mb-4 py-1"
                  required
                />
              </Field>

              <Field label="Timeline">
                <input
                  name="timeline"
                  value={form.timeline}
                  onChange={onChange}
                  placeholder="Jan 2024 – Jun 2024"
                  className="input border-zinc-300 border-[1px] rounded w-full px-2 mb-4 py-1"
                  required
                />
              </Field>
            </div>

            <Field label="Tags" hint="Comma or Enter to add">
              <TagInput
                value={form.tags}
                onChange={(v) => setForm((f) => ({ ...f, tags: v }))}
                onRemove={onRemoveTag}
                chips={tagsChips}
                className="border-zinc-300 border-[1px] rounded"
              />
            </Field>

            <Field label="Description ">
              <textarea
                name="description"
                value={form.description}
                onChange={onChange}
                className="input p-4 border-zinc-300 border-[1px] rounded min-h-[120px] w-full "
                required
              />
            </Field>
          </div>

          {/* Gallery */}
          <div className="rounded-2xl border border-black/10 bg-white/80 p-5 mt-6">
            <h2 className="text-base font-medium">Gallery</h2>
            <div
              onClick={() => galleryInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const files = Array.from(e.dataTransfer.files || []).filter((f) =>
                  f.type.startsWith("image/")
                );
                if (files.length) {
                  setGalleryFiles(files);
                  setGalleryPreviews(files.map((f) => URL.createObjectURL(f)));
                  setGalleryUrls([]);
                  setGalleryProgress({});
                }
              }}
              className="mt-4 rounded-xl border border-dashed border-black/20 bg-[#F4F1EC] px-4 py-8 text-center cursor-pointer hover:bg-[#EFEAE2] transition"
            >
              <div className="flex items-center justify-center gap-2 text-neutral-700">
                <FiImage />
                <span className="text-sm">Drag & drop images here, or click to browse</span>
              </div>
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setGalleryFiles(files);
                  setGalleryPreviews(files.map((f) => URL.createObjectURL(f)));
                  setGalleryUrls([]);
                  setGalleryProgress({});
                }}
              />
            </div>

            {(galleryPreviews.length > 0 || galleryUrls.length > 0) && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {(galleryUrls.length ? galleryUrls : galleryPreviews).map((src, i) => {
                  const done = Boolean(galleryUrls[i]);
                  const prog = galleryProgress[i] ?? (done ? 100 : 0);
                  return (
                    <div key={i} className="group relative rounded-xl overflow-hidden border border-black/10 bg-white">
                      <img src={src} alt={`Gallery ${i + 1}`} className="h-28 w-full object-cover" />
                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => removeGalleryIndex(i)}
                        className="absolute top-2 right-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 border border-black/10 opacity-0 group-hover:opacity-100 transition"
                        aria-label="Remove image"
                      >
                        <FiTrash2 className="text-neutral-700" />
                      </button>
                      {/* Progress */}
                      {!done && (uploading || prog > 0) && (
                        <div className="absolute inset-x-0 bottom-0 h-1.5 bg-black/10">
                          <div className="h-full bg-black/80 transition-[width] duration-150" style={{ width: `${prog}%` }} />
                        </div>
                      )}
                      {/* Done badge */}
                      {done && (
                        <span className="absolute top-2 left-2 rounded-full bg-black text-white text-[10px] px-2 py-1 flex items-center gap-1">
                          <FiCheck /> Uploaded
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="md:col-span-2">
          {/* Cover */}
          <div className="rounded-2xl border border-black/10 bg-white/80 p-5">
            <h2 className="text-base font-medium">Cover</h2>
            <div
              onClick={() => coverInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (f && f.type.startsWith("image/")) {
                  setCoverFile(f);
                  setCoverPreview(URL.createObjectURL(f));
                  setCoverUrl("");
                  setCoverProgress(0);
                }
              }}
              className="mt-4 rounded-xl border border-dashed border-black/20 bg-[#F4F1EC] px-4 py-10 text-center cursor-pointer hover:bg-[#EFEAE2] transition"
            >
              <div className="flex items-center justify-center gap-2 text-neutral-700">
                <FiUploadCloud />
                <span className="text-sm">
                  Drag & drop cover image here, or click to browse
                </span>
              </div>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverSelect}
              />
            </div>

            {(coverPreview || coverUrl) && (
              <div className="mt-4 relative rounded-xl overflow-hidden border border-black/10 bg-white">
                <img
                  src={coverUrl || coverPreview}
                  alt="Cover preview"
                  className="h-40 w-full object-cover"
                />
                {/* progress bar */}
                {!coverUrl && (uploading || coverProgress > 0) && (
                  <div className="absolute inset-x-0 bottom-0 h-1.5 bg-black/10">
                    <div
                      className="h-full bg-black/80 transition-[width] duration-150"
                      style={{ width: `${coverProgress}%` }}
                    />
                  </div>
                )}
                {coverUrl && (
                  <span className="absolute top-2 left-2 rounded-full bg-black text-white text-[10px] px-2 py-1 flex items-center gap-1">
                    <FiCheck /> Uploaded
                  </span>
                )}
              </div>
            )}

            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                onClick={uploadImages}
                disabled={!coverFile || uploading}
                className="inline-flex items-center gap-2 rounded-full border border-black px-4 py-2 text-sm hover:bg-black hover:text-white transition disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <span className="inline-block h-3 w-3 rounded-full border-2 border-black/40 border-t-black animate-spin" />
                    Uploading…
                  </>
                ) : (
                  <>
                    <FiUploadCloud />
                    Upload Images
                  </>
                )}
              </button>

              {(coverFile || galleryFiles.length > 0) && !uploading && (
                <span className="text-xs text-neutral-600">
                  Ready to upload {coverFile ? "cover" : ""}{galleryFiles.length ? ` + ${galleryFiles.length} gallery` : ""}.
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="rounded-2xl border border-black/10 bg-white/80 p-5 mt-6">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={saving || uploading || !coverFile}
                className="inline-flex items-center gap-2 rounded-full border border-black px-5 py-2.5 text-sm hover:bg-black hover:text-white transition disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <span className="inline-block h-3 w-3 rounded-full border-2 border-black/40 border-t-black animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <FiCheck /> Save Project
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setForm({
                    title: "",
                    type: "Interior",
                    location: "",
                    timeline: "",
                    tags: "",
                    description: "",
                  });
                  setCoverFile(null);
                  setCoverPreview(null);
                  setCoverUrl("");
                  setCoverProgress(0);
                  setGalleryFiles([]);
                  setGalleryPreviews([]);
                  setGalleryUrls([]);
                  setGalleryProgress({});
                  setError("");
                  setOk(false);
                }}
                className="inline-flex items-center gap-2 rounded-full border border-black/20 px-5 py-2.5 text-sm hover:bg-black/5 transition"
              >
                <FiX /> Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Local styles for inputs (premium, consistent) */}
      <style jsx>{`
        .input {
          @apply w-full rounded-lg border border-black/15 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-black/20;
        }
      `}</style>
    </form>
  );
}

/* --------------------------------- Sub UI ---------------------------------- */

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <div className="flex items-center gap-2">
        <span className="text-sm text-neutral-800">{label}</span>
        {hint && <span className="text-xs text-neutral-500">{hint}</span>}
      </div>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function TagInput({ value, onChange, onRemove, chips }) {
  return (
    <>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input border-zinc-300 border-[1px] rounded w-full px-2 py-1 mb-4"
        placeholder="Residence, Contemporary, Warm Wood"
        
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            const v = e.currentTarget.value.trim();
            if (!v) return;
            const next = [...new Set(v.split(",").map((x) => x.trim()).filter(Boolean))];
            onChange(next.join(", "));
          }
        }}
      />
      {chips.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {chips.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-2 rounded-full bg-[#F4F1EC] border border-black/10 px-3 py-1 text-xs"
            >
              {t}
              <button
                type="button"
                onClick={() => onRemove(t)}
                className="rounded-full p-0.5 hover:bg-black/10"
                aria-label={`Remove ${t}`}
              >
                <FiX className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </>
  );
}