"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CloudinaryUploader from "@/components/CloudinaryUploader";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";

export default function EditClientLogoPage({ params }) {
  const router = useRouter();
  const { id } = params;

  const [f, setF] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState("");
  const [err, setErr] = useState("");

  const onChange = (k, v) => setF((s) => ({ ...s, [k]: v }));

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/client-logos/${id}`, { cache: "no-store" });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "Not found");
        setF({
          name: json.name || "",
          website: json.website || "",
          image: json.image || { src: "", alt: "" },
          order: typeof json.order === "number" ? json.order : 0,
          active: json.active !== false,
        });
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const save = async (e) => {
    e.preventDefault(); setErr(""); setOk(""); setSaving(true);
    try {
      const res = await fetch(`/api/client-logos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, image: { src: f.image?.src || "", alt: f.image?.alt || f.name } }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Update failed");
      setOk("Saved!");
      setTimeout(() => router.push("/admin/dashboard/client-logos"), 650);
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="mx-auto max-w-7xl mt-20 px-4 py-8 text-sm text-zinc-500">Loading…</div>;
  if (err) return <div className="mx-auto max-w-3xl px-4 py-8 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{err}</div>;
  if (!f) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Edit Client Logo</h1>
      <form onSubmit={save} className="mt-6 space-y-5 rounded-2xl border bg-white p-4 md:p-6">
        {err && <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"><FiAlertCircle /> {err}</div>}
        {ok && <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700"><FiCheckCircle /> {ok}</div>}

        <label className="block">
          <div className="mb-1 text-sm font-medium">Client name *</div>
          <input className="input w-full" value={f.name} onChange={(e) => onChange("name", e.target.value)} />
        </label>

        <label className="block">
          <div className="mb-1 text-sm font-medium">Website (optional)</div>
          <input className="input w-full" value={f.website} onChange={(e) => onChange("website", e.target.value)} placeholder="https://client.com" />
        </label>

        <div>
          <div className="mb-1 text-sm font-medium">Logo image *</div>
          <CloudinaryUploader
            label="Upload logo"
            multiple={false}
            value={f.image?.src || ""}
            onChange={(url) => onChange("image", { ...(f.image || {}), src: url })}
          />
          {f.image?.src && (
            <div className="mt-3 flex h-20 items-center justify-center rounded-lg border bg-zinc-50">
              <img src={f.image.src} alt={f.image.alt || f.name} className="max-h-12 object-contain" />
            </div>
          )}
          <div className="mt-2">
            <div className="mb-1 text-sm font-medium">Alt text (SEO)</div>
            <input className="input w-full" value={f.image?.alt || ""} onChange={(e) => onChange("image", { ...(f.image || {}), alt: e.target.value })} />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <label className="block">
            <div className="mb-1 text-sm font-medium">Order</div>
            <input className="input w-full" value={f.order} onChange={(e) => onChange("order", e.target.value.replace(/[^\d-]/g, ""))} placeholder="0" />
          </label>
          <label className="block">
            <div className="mb-1 text-sm font-medium">Active</div>
            <select className="input w-full" value={String(f.active)} onChange={(e) => onChange("active", e.target.value === "true")}>
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button disabled={saving} className="btn-primary">{saving ? "Saving…" : "Save changes"}</button>
          <button type="button" className="btn-plain" onClick={() => history.back()}>Cancel</button>
        </div>
      </form>
    </div>
  );
}