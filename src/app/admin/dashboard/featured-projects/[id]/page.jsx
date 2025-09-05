"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditProjectPage() {
  const { id } = useParams();
  const router = useRouter();
  const [p, setP] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [okMsg, setOkMsg] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/feature-projects/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        setP(data);
      } catch (e) { setError(e.message || "Error"); }
      finally { setLoading(false); }
    })();
  }, [id]);

  const update = (k, v) => setP(s => (s ? { ...s, [k]: v } : s));

  const save = async (e) => {
    e.preventDefault();
    if (!p?.title?.trim() || !p?.slug?.trim()) { setError("Title and Slug are required"); return; }
    setError(null); setOkMsg(null); setSaving(true);
    try {
      const res = await fetch(`/api/feature-projects/${p._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p),
      });
      if (!res.ok) {
        const j = await res.json().catch(()=>({}));
        throw new Error(j?.error || "Failed to save");
      }
      setOkMsg("Saved");
      setTimeout(()=>router.push("/admin/dashboard"), 500);
    } catch (e) { setError(e.message || "Error"); }
    finally { setSaving(false); }
  };

  if (loading) return <p>Loading…</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!p) return <p>Not found.</p>;

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-semibold">Edit Project</h2>
      {okMsg && <p className="mt-4 rounded bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{okMsg}</p>}
      {error && <p className="mt-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <form onSubmit={save} className="mt-6 space-y-5">
        <Row>
          <Field label="Title *"><input className="input" value={p.title} onChange={e=>update("title", e.target.value)} /></Field>
          <Field label="Slug *"><input className="input" value={p.slug} onChange={e=>update("slug", e.target.value)} /></Field>
          <Field label="Client"><input className="input" value={p.client||""} onChange={e=>update("client", e.target.value)} /></Field>
        </Row>

        <Row>
          <Field label="Year"><input className="input" value={p.year||""} onChange={e=>update("year", e.target.value)} /></Field>
          <Field label="Order"><input className="input" value={p.order||100} onChange={e=>update("order", Number(e.target.value)||100)} /></Field>
          <Field label="Featured">
            <select className="input" value={String(p.featured)} onChange={e=>update("featured", e.target.value === "true")}>
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          </Field>
        </Row>

        <Field label="Tags (comma separated)">
          <input className="input" value={(p.tags||[]).join(", ")} onChange={e=>update("tags", e.target.value.split(",").map(s=>s.trim()).filter(Boolean))} />
        </Field>

        <Field label="Blurb">
          <textarea className="input min-h-[80px]" value={p.blurb||""} onChange={e=>update("blurb", e.target.value)} />
        </Field>

        <Field label="Description">
          <textarea className="input min-h-[160px]" value={p.description||""} onChange={e=>update("description", e.target.value)} />
        </Field>

        <Row>
          <Field label="Cover Image URL"><input className="input" value={p.coverImage||""} onChange={e=>update("coverImage", e.target.value)} /></Field>
          <Field label="Media Type">
            <select className="input" value={p.mediaType||"image"} onChange={e=>update("mediaType", e.target.value)}>
              <option value="image">image</option>
              <option value="video">video</option>
            </select>
          </Field>
          <Field label="Media URL"><input className="input" value={p.mediaUrl||""} onChange={e=>update("mediaUrl", e.target.value)} /></Field>
        </Row>

        <Field label="Gallery Images (comma separated URLs)">
          <input className="input" value={(p.galleryImages||[]).join(", ")} onChange={e=>update("galleryImages", e.target.value.split(",").map(s=>s.trim()).filter(Boolean))} />
        </Field>

        <Row>
          <Field label="Case Study URL"><input className="input" value={p.caseStudyUrl||""} onChange={e=>update("caseStudyUrl", e.target.value)} /></Field>
          <Field label="Live URL"><input className="input" value={p.liveUrl||""} onChange={e=>update("liveUrl", e.target.value)} /></Field>
          <Field label="Accent Color"><input className="input" value={p.accentColor||"#7C5CFF"} onChange={e=>update("accentColor", e.target.value)} /></Field>
        </Row>

        <Row>
          <Field label="Dribbble URL"><input className="input" value={p.dribbbleUrl||""} onChange={e=>update("dribbbleUrl", e.target.value)} /></Field>
          <Field label="Awwwards URL"><input className="input" value={p.awwwardsUrl||""} onChange={e=>update("awwwardsUrl", e.target.value)} /></Field>
        </Row>

        <Field label="Stats (VALUE - LABEL lines)">
          <textarea className="input min-h-[90px]" value={(p.stats||[]).map(s=>`${s.value||""} - ${s.label||""}`).join("\n")}
            onChange={e=>{
              const arr = e.target.value.split("\n").map(line=>{
                const [value, ...rest] = line.split(" - ");
                return { value:(value||"").trim(), label:(rest.join(" - ")||"").trim() };
              }).filter(x=>x.value || x.label);
              update("stats", arr);
            }} />
        </Field>

        <div className="flex items-center gap-3">
          <button disabled={saving} className="rounded bg-zinc-900 text-white px-4 py-2 text-sm disabled:opacity-50">
            {saving ? "Saving…" : "Save Changes"}
          </button>
          <button type="button" onClick={()=>history.back()} className="rounded border px-4 py-2 text-sm">Back</button>
        </div>
      </form>
    </div>
  );
}

function Row({ children }) { return <div className="grid gap-5 md:grid-cols-3">{children}</div>; }
function Field({ label, children }) {
  return (
    <label className="block">
      <div className="mb-1 text-sm font-medium">{label}</div>
      {children}
      <style jsx>{`
        .input {
          all: unset;
          display: block;
          width: 100%;
          background: white;
          padding: 0.5rem 0.75rem;
          border: 1px solid rgb(212 212 216);
          border-radius: 0.5rem;
          font-size: 0.875rem;
        }
        .input:focus { outline: 2px solid rgb(24 24 27 / 0.1); }
      `}</style>
    </label>
  );
}