"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiHash, FiType, FiUser, FiImage, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import CloudinaryUploader from "./CloudinaryUploader";

export default function TeamForm({ mode = "create", initial = {}, onSubmit }) {
  const router = useRouter();
  const si = initial ?? {};
  const [f, setF] = useState({
    name: si.name || "",
    slug: si.slug || "",
    position: si.position || "",
    description: si.description || "",
    image: si.image || { src: "", alt: "" },
    order: typeof si.order === "number" ? si.order : 0,
    active: typeof si.active === "boolean" ? si.active : true,
  });

  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!f.slug && f.name && mode === "create") {
      const s = f.name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      setF((p) => ({ ...p, slug: s }));
    }
  }, [f.name, f.slug, mode]);

  const onChange = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const validate = () => {
    if (!f.name.trim()) return "Name is required.";
    if (!f.slug.trim()) return "Slug is required.";
    if (!f.position.trim()) return "Position is required.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(""); setOk("");
    const v = validate();
    if (v) { setErr(v); return; }

    setSubmitting(true);
    try {
      const payload = { ...f, slug: f.slug.trim().toLowerCase() };
      await onSubmit(payload);
      setOk(mode === "create" ? "Team member created!" : "Team member updated!");
      setTimeout(() => router.push("/admin/dashboard/teams"), 600);
    } catch (e2) {
      setErr(e2?.message || "Error saving team member.");
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

      <section className="rounded-2xl border border-zinc-200 bg-white p-4 md:p-6 space-y-3">
        <label className="block">
          <div className="mb-1 flex items-center gap-2 text-sm font-medium"><FiUser /> Name *</div>
          <input className="input w-full" value={f.name} onChange={(e) => onChange("name", e.target.value)} />
        </label>

        <label className="block">
          <div className="mb-1 flex items-center gap-2 text-sm font-medium"><FiHash /> Slug *</div>
          <input className="input w-full" value={f.slug} onChange={(e) => onChange("slug", e.target.value)} />
        </label>

        <label className="block">
          <div className="mb-1 flex items-center gap-2 text-sm font-medium"><FiType /> Position *</div>
          <input className="input w-full" value={f.position} onChange={(e) => onChange("position", e.target.value)} />
        </label>

        <label className="block">
          <div className="mb-1 text-sm font-medium">Description</div>
          <textarea className="input w-full min-h-[120px]" value={f.description} onChange={(e) => onChange("description", e.target.value)} />
        </label>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-4 md:p-6">
        <h2 className="mb-3 flex items-center gap-2 text-base font-semibold"><FiImage /> Profile Image</h2>
        <CloudinaryUploader
          label="Upload profile image"
          multiple={false}
          value={f.image?.src || ""}
          onChange={(url) => onChange("image", { ...(f.image || {}), src: url })}
        />
        {f.image?.src && (
          <div className="mt-3 overflow-hidden rounded-xl border w-40 h-40">
            <img src={f.image.src} alt={f.image.alt || f.name} className="h-full w-full object-cover" />
          </div>
        )}
        <label className="block mt-2">
          <div className="mb-1 text-sm font-medium">Alt text</div>
          <input className="input w-full" value={f.image?.alt || ""} onChange={(e) => onChange("image", { ...(f.image || {}), alt: e.target.value })} />
        </label>
      </section>

      <button disabled={submitting} className="btn-primary">
        {submitting ? (mode === "create" ? "Creating…" : "Saving…") : (mode === "create" ? "Create Member" : "Save Changes")}
      </button>
    </form>
  );
}