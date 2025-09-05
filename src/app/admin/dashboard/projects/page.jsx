"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FiEdit2, FiPlus, FiSearch, FiTrash2, FiX, FiUploadCloud, FiCheck } from "react-icons/fi";

// ------------ Config ------------
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = "trygve-studio";
const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || ""; // optional: mirrors ADMIN_SECRET

// ------------ Helpers ------------
async function uploadToCloudinary(file, onProgress) {
  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", UPLOAD_PRESET);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", endpoint);
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
          } catch {
            reject(new Error("Cloudinary parse error"));
          }
        } else reject(new Error("Cloudinary upload failed"));
      }
    };
    xhr.send(fd);
  });
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl overflow-hidden border border-black/10 bg-white">
      <div className="aspect-[4/3] bg-neutral-200" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-20 bg-neutral-200 rounded" />
        <div className="h-4 w-2/3 bg-neutral-200 rounded" />
        <div className="h-3 w-full bg-neutral-200 rounded" />
        <div className="flex gap-2 mt-3">
          <div className="h-5 w-12 bg-neutral-200 rounded-full" />
          <div className="h-5 w-12 bg-neutral-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// ------------ Editor Modal ------------
function Editor({ open, onClose, initial, onSaved }) {
  const editing = Boolean(initial?._id);
  const [form, setForm] = useState(() => ({
    title: initial?.title || "",
    type: initial?.type || "Interior",
    location: initial?.location || "",
    timeline: initial?.timeline || "",
    tags: (initial?.tags || []).join(", "),
    description: initial?.description || "",
    cover: initial?.cover || "",
    gallery: initial?.gallery || [],
  }));

  const [coverFile, setCoverFile] = useState(null);
  const [coverProg, setCoverProg] = useState(0);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryProg, setGalleryProg] = useState({});

  useEffect(() => {
    if (!open) return;
    setForm({
      title: initial?.title || "",
      type: initial?.type || "Interior",
      location: initial?.location || "",
      timeline: initial?.timeline || "",
      tags: (initial?.tags || []).join(", "),
      description: initial?.description || "",
      cover: initial?.cover || "",
      gallery: initial?.gallery || [],
    });
    setCoverFile(null);
    setCoverProg(0);
    setGalleryFiles([]);
    setGalleryProg({});
  }, [open, initial]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    // Upload cover if selected
    let coverUrl = form.cover;
    if (coverFile) {
      coverUrl = await uploadToCloudinary(coverFile, setCoverProg);
    }
    // Upload any new gallery files
    const newGalleryUrls = [];
    for (let i = 0; i < galleryFiles.length; i++) {
      const u = await uploadToCloudinary(galleryFiles[i], (p) =>
        setGalleryProg((prev) => ({ ...prev, [i]: p }))
      );
      newGalleryUrls.push(u);
    }

    const payload = {
      title: form.title.trim(),
      type: form.type,
      location: form.location.trim(),
      timeline: form.timeline.trim(),
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      cover: coverUrl,
      gallery: [...form.gallery, ...newGalleryUrls],
      description: form.description.trim(),
    };

    const url = editing ? `/api/projects/${initial._id}` : `/api/projects`;
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(ADMIN_SECRET ? { "x-admin-secret": ADMIN_SECRET } : {}),
      },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error || "Save failed");
    onSaved(json);
    onClose();
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[200]   bg-black/60 backdrop-blur-sm flex items-start justify-center md:px-0 px-4">
      <div className="w-full max-w-7xl mt-10 bg-white rounded-2xl overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.25)]">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div>
            <div className="text-xs uppercase tracking-wider text-neutral-600">
              {editing ? "Edit Project" : "New Project"}
            </div>
            <h3 className="text-xl font-semibold">{form.title || "Untitled"}</h3>
          </div>
          <button onClick={onClose} className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-black/10 hover:bg-neutral-50">
            <FiX />
          </button>
        </div>

        <div className="p-5 grid md:grid-cols-2 gap-5">
          <div className="space-y-3">
            <Field label="Title">
              <input className="input  border-zinc-300 border-[1px] rounded w-full px-2 mb-4 py-1" value={form.title} onChange={(e) => set("title", e.target.value)} />
            </Field>
            <Field label="Type">
              <select className="input  border-zinc-300 border-[1px] rounded w-full px-2 mb-4 py-1" value={form.type} onChange={(e) => set("type", e.target.value)}>
                <option>Interior</option>
                <option>Architecture</option>
              </select>
            </Field>
            <Field label="Location">
              <input className="input  border-zinc-300 border-[1px] rounded w-full px-2 mb-4 py-1" value={form.location} onChange={(e) => set("location", e.target.value)} />
            </Field>
            <Field label="Timeline">
              <input className="input  border-zinc-300 border-[1px] rounded w-full px-2 mb-4 py-1" value={form.timeline} onChange={(e) => set("timeline", e.target.value)} placeholder="Jan 2024 – Jun 2024" />
            </Field>
            <Field label="Tags (Comma Seperated)">
              <input className="input   border-zinc-300 border-[1px] rounded w-full px-2 mb-4 py-1" value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="Residence, Wood, USA" />
              <div className="mt-2 flex flex-wrap gap-2">
                {form.tags.split(",").map((t) => t.trim()).filter(Boolean).map((t) => (
                  <span key={t} className="rounded-full bg-[#F4F1EC] border border-black/10 px-3 py-1 text-xs">{t}</span>
                ))}
              </div>
            </Field>
          </div>

          <div className="space-y-3">
            <Field label="Description">
              <textarea className="input min-h-[120px] border-zinc-300 border-[1px] rounded w-full px-2 mb-4 py-1" value={form.description} onChange={(e) => set("description", e.target.value)} />
            </Field>

            <Field label="Cover">
              <div className="rounded-xl border border-dashed border-black/20 bg-[#F4F1EC] px-3 py-3">
                <div className="flex items-center gap-2">
                  <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} />
                  <span className="text-xs text-neutral-600">Pick a new file to replace cover</span>
                </div>
                {(form.cover || coverFile) && (
                  <div className="mt-2">
                    <img src={coverFile ? URL.createObjectURL(coverFile) : form.cover} alt="cover" className="h-28 w-full object-cover rounded-md border border-black/10" />
                    {!!coverFile && coverProg > 0 && coverProg < 100 && (
                      <div className="mt-1 h-1.5 bg-black/10">
                        <div className="h-full bg-black/80" style={{ width: `${coverProg}%` }} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Field>

            <Field label="Gallery">
              <div className="rounded-xl border border-dashed border-black/20 bg-[#F4F1EC] px-3 py-3">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setGalleryFiles(files);
                  }}
                />
                {(form.gallery.length > 0 || galleryFiles.length > 0) && (
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {form.gallery.map((src, i) => (
                      <img key={`old-${i}`} src={src} className="h-20 w-full object-cover rounded border border-black/10" alt="" />
                    ))}
                    {galleryFiles.map((f, i) => (
                      <div key={`new-${i}`}>
                        <img src={URL.createObjectURL(f)} className="h-20 w-full object-cover rounded border border-black/10" alt="" />
                        {galleryProg[i] > 0 && galleryProg[i] < 100 && (
                          <div className="mt-1 h-1.5 bg-black/10">
                            <div className="h-full bg-black/80" style={{ width: `${galleryProg[i]}%` }} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Field>
          </div>
        </div>

        <div className="px-5 py-4 border-t flex items-center justify-end gap-3">
          <button onClick={onClose} className="rounded-full border border-black/20 px-4 py-2 text-sm hover:bg-black/5">Cancel</button>
          <button onClick={handleSave} className="inline-flex items-center gap-2 rounded-full border border-black px-5 py-2 text-sm hover:bg-black hover:text-white">
            <FiUploadCloud /> Save
          </button>
        </div>
      </div>

      <style jsx>{`
        .input { @apply w-full rounded-lg border border-black/15 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-black/20; }
      `}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <div className="text-sm  text-neutral-800 mb-1">{label}</div>
      {children}
    </label>
  );
}

// ------------ Admin Page ------------
export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [current, setCurrent] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    const res = await fetch("/api/projects", { cache: "no-store" });
    const json = await res.json();
    const arr = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
    setProjects(arr);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return projects;
    return projects.filter((p) =>
      (p.title || "").toLowerCase().includes(s) ||
      (p.location || "").toLowerCase().includes(s) ||
      (Array.isArray(p.tags) ? p.tags.join(" ") : "").toLowerCase().includes(s)
    );
  }, [projects, q]);

  const onCreate = () => { setCurrent(null); setEditorOpen(true); };
  const onEdit = (p) => { setCurrent(p); setEditorOpen(true); };

  const onDelete = async (p) => {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    // optimistic
    const prev = projects;
    setProjects((arr) => arr.filter((x) => x._id !== p._id));
    const res = await fetch(`/api/projects/${p._id}`, {
      method: "DELETE",
      headers: ADMIN_SECRET ? { "x-admin-secret": ADMIN_SECRET } : {},
    });
    if (!res.ok) {
      alert("Failed to delete");
      setProjects(prev);
    }
  };

  const onSaved = (saved) => {
    // merge into list
    setProjects((arr) => {
      const id = saved._id;
      const idx = arr.findIndex((p) => p._id === id);
      if (idx === -1) return [saved, ...arr];
      const next = [...arr];
      next[idx] = saved;
      return next;
    });
  };

  return (
    <main className="min-h-screen bg-[#F4F1EC]">
      <section className="max-w-7xl mx-auto md:px-0 px-4 pt-10 pb-12">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <p className="text-xs tracking-wider uppercase text-neutral-600">Dashboard</p>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Projects</h1>
            <p className="mt-2 text-neutral-700">Create, edit, or delete projects.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                placeholder="Search projects…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="pl-9 pr-3 h-10 rounded-full border border-black/15 bg-white outline-none focus:ring-2 focus:ring-black/20"
              />
            </div>
            <Link
            href="/admin/dashboard/upload-project"
               className="inline-flex items-center gap-2 rounded-full border border-black px-4 h-10 hover:bg-black hover:text-white transition"
            >
              <FiPlus /> New
            </Link>
          </div>
        </header>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-neutral-600">No projects found.</div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <article key={p._id} className="rounded-2xl overflow-hidden border border-black/10 bg-white group shadow-[0_6px_18px_rgba(0,0,0,0.05)]">
                <figure className="relative aspect-[4/3] overflow-hidden">
                  <img src={p.cover} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                </figure>
                <div className="p-4">
                  <div className="text-xs uppercase tracking-wide text-neutral-600">{p.type}</div>
                  <h3 className="mt-1 text-lg font-semibold">{p.title}</h3>
                  <p className="mt-1 text-neutral-700 line-clamp-2">{p.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {(p.tags || []).slice(0, 5).map((t) => (
                      <span key={t} className="rounded-full bg-[#F4F1EC] border border-black/10 px-2 py-1 text-[12px]">{t}</span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-end gap-2">
                    <button onClick={() => onEdit(p)} className="inline-flex items-center gap-1.5 rounded-full border border-black/20 px-3 py-1.5 text-sm hover:bg-black/5">
                      <FiEdit2 /> Edit
                    </button>
                    <button onClick={() => onDelete(p)} className="inline-flex items-center gap-1.5 rounded-full border border-black px-3 py-1.5 text-sm hover:bg-black hover:text-white">
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <Editor
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        initial={current}
        onSaved={onSaved}
      />
    </main>
  );
}