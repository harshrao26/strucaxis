"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiHash, FiImage, FiTrash2, FiPlus, FiType, FiList, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import CloudinaryUploader from "./CloudinaryUploader";

export default function ServiceForm({ mode = "create", initial = {}, onSubmit }) {
  const router = useRouter();
  const si = initial ?? {};
  const [f, setF] = useState({
    title: si.title || "",
    slug: si.slug || "",
    summary: si.summary || "",
    image: si.image || { src: "", alt: "" },
    points: Array.isArray(si.points) && si.points.length === 3 ? si.points : ["", "", ""],
    order: typeof si.order === "number" ? si.order : 0,
    active: typeof si.active === "boolean" ? si.active : true,
  });

  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!f.slug && f.title && mode === "create") {
      const s = f.title.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      setF((p) => ({ ...p, slug: s }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [f.title]);

  const onChange = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const validate = () => {
    if (!f.title.trim()) return "Title is required.";
    if (!f.slug.trim()) return "Slug is required.";
    if (!f.image?.src) return "Please upload a cover image.";
    if (!Array.isArray(f.points) || f.points.filter(Boolean).length !== 3) return "Please provide all three points.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(""); setOk("");
    const v = validate();
    if (v) { setErr(v); return; }

    setSubmitting(true);
    try {
      const payload = {
        title: f.title.trim(),
        slug: f.slug.trim().toLowerCase(),
        summary: f.summary.trim(),
        image: { src: f.image.src, alt: (f.image.alt || "").trim() },
        points: f.points.map((s) => s.trim()),
        order: Number(f.order) || 0,
        active: !!f.active,
      };
      await onSubmit(payload);
      setOk(mode === "create" ? "Service created!" : "Service updated!");
      setTimeout(() => router.push("/admin/services"), 600);
    } catch (e2) {
      setErr(e2?.message || "Error saving service.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {err && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <FiAlertCircle /> {err}
        </div>
      )}
      {ok && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          <FiCheckCircle /> {ok}
        </div>
      )}

      <section className="rounded-2xl border border-zinc-200 bg-white p-4 md:p-6">
        <h2 className="mb-4 flex items-center gap-2 text-base font-semibold"><FiType /> Basics</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <label className="block">
            <div className="mb-1 text-sm font-medium">Title *</div>
            <input className="input w-full" value={f.title} onChange={(e) => onChange("title", e.target.value)} placeholder="General Contracting (Turnkey)" />
          </label>
          <label className="block">
            <div className="mb-1 flex items-center gap-2 text-sm font-medium"><FiHash /> Slug *</div>
            <input className="input w-full" value={f.slug} onChange={(e) => onChange("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))} placeholder="general-contracting-turnkey" />
          </label>
          <label className="block">
            <div className="mb-1 text-sm font-medium">Order</div>
            <input className="input w-full" value={f.order} onChange={(e) => onChange("order", e.target.value.replace(/[^\d-]/g, ""))} placeholder="0" inputMode="numeric" />
          </label>
        </div>

        <label className="mt-3 block">
          <div className="mb-1 text-sm font-medium">Short Summary (optional)</div>
          <input className="input w-full" value={f.summary} onChange={(e) => onChange("summary", e.target.value)} placeholder="Shell & core, site management, QA-QC" />
        </label>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-4 md:p-6">
        <h2 className="mb-4 flex items-center gap-2 text-base font-semibold"><FiImage /> Image</h2>
        <div className="grid gap-3 md:grid-cols-[1fr,2fr]">
          <div>
            <CloudinaryUploader
              label="Upload service image"
              multiple={false}
              value={f.image?.src || ""}
              onChange={(url) => onChange("image", { ...(f.image || {}), src: url })}
            />
            {f.image?.src && (
              <div className="mt-3 overflow-hidden rounded-xl border">
                <img src={f.image.src} alt="" className="aspect-[16/9] w-full object-cover" />
              </div>
            )}
          </div>
          <label className="block">
            <div className="mb-1 text-sm font-medium">Alt text (SEO)</div>
            <input className="input w-full" value={f.image?.alt || ""} onChange={(e) => onChange("image", { ...(f.image || {}), alt: e.target.value })} placeholder="Snowy mountain range background for service card" />
            <p className="mt-1 text-xs text-zinc-500">Describe the image for accessibility and SEO.</p>
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-4 md:p-6">
        <h2 className="mb-4 flex items-center gap-2 text-base font-semibold"><FiList /> Three bullet points</h2>
        <div className="space-y-3">
          {f.points.map((p, i) => (
            <div key={i} className="grid grid-cols-[1fr_auto] items-center gap-2">
              <input
                className="input"
                value={p}
                onChange={(e) => {
                  const next = [...f.points]; next[i] = e.target.value; onChange("points", next);
                }}
                placeholder={i === 0 ? "Shell & core" : i === 1 ? "Site management & HSE" : "Quality assurance / QA-QC"}
              />
              <button
                type="button"
                onClick={() => {
                  const next = [...f.points]; next[i] = ""; onChange("points", next);
                }}
                className="btn-danger"
                title="Clear"
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
          <div className="text-xs text-zinc-500">Exactly 3 points are required for the card layout.</div>
        </div>
      </section>

      <div className="sticky bottom-3 z-10">
        <div className="flex items-center gap-3 rounded-xl border bg-white/90 p-3 shadow-lg backdrop-blur">
          <button disabled={submitting} className="btn-primary">
            {submitting ? (mode === "create" ? "Creating…" : "Saving…") : (mode === "create" ? "Create Service" : "Save Changes")}
          </button>
          <button type="button" onClick={() => history.back()} className="btn-plain">Cancel</button>
        </div>
      </div>
    </form>
  );
}

 