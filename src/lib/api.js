export async function apiGet(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(await safeMsg(res));
  return res.json();
}
export async function apiJSON(path, method, body) {
  const res = await fetch(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await safeMsg(res));
  return res.json();
}
async function safeMsg(res) {
  try { const j = await res.json(); return j?.error || res.statusText; } catch { return res.statusText; }
}