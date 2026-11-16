export type AiCfg = { online: boolean; provider: "openai" | "anthropic"; endpoint: string; model: string; key: string; web: boolean; searchKey: string };
export const DEFAULT_CFG: AiCfg = { online: true, provider: "openai", endpoint: "https://text.pollinations.ai/openai", model: "openai", key: "", web: true, searchKey: "" };
export type Turn = { role: "user" | "assistant"; text: string; image?: string };
export type Source = { title: string; url: string; snippet: string };

export async function callLLM(cfg: AiCfg, system: string, turns: Turn[], maxTokens = 900): Promise<string> {
  const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 45000);
  try {
    if (cfg.provider === "anthropic") {
      const messages = turns.map(t => { const m = t.image?.match(/^data:(.+?);base64,(.+)$/); return { role: t.role, content: m ? [{ type: "image", source: { type: "base64", media_type: m[1], data: m[2] } }, { type: "text", text: t.text }] : t.text }; });
      const r = await fetch(cfg.endpoint || "https://api.anthropic.com/v1/messages", { method: "POST", signal: ctl.signal, headers: { "content-type": "application/json", "x-api-key": cfg.key, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" }, body: JSON.stringify({ model: cfg.model, max_tokens: maxTokens, system, messages }) });
      if (!r.ok) throw new Error("HTTP " + r.status); const j = await r.json(); const out = (j?.content || []).map((b: any) => b.text || "").join("").trim(); if (!out) throw new Error("empty"); return out;
    }
    const messages = [{ role: "system", content: system }, ...turns.map(t => ({ role: t.role, content: t.image ? [{ type: "text", text: t.text }, { type: "image_url", image_url: { url: t.image } }] : t.text }))];
    const r = await fetch(cfg.endpoint, { method: "POST", signal: ctl.signal, headers: { "Content-Type": "application/json", ...(cfg.key ? { Authorization: "Bearer " + cfg.key } : {}) }, body: JSON.stringify({ model: cfg.model, messages, temperature: .4, max_tokens: maxTokens }) });
    if (!r.ok) throw new Error("HTTP " + r.status); const j = await r.json(); const out = j?.choices?.[0]?.message?.content; if (!out || typeof out !== "string") throw new Error("empty"); return out.trim();
  } finally { clearTimeout(timer); }
}

const strip = (s: string) => s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
export async function webSources(q: string, cfg: AiCfg): Promise<Source[]> {
  const out: Source[] = [];
  const jobs: Promise<void>[] = [];
  jobs.push(fetch(`https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrlimit=3&prop=extracts|info&exintro=1&explaintext=1&exchars=900&inprop=url&format=json&origin=*`)
    .then(r => r.json()).then(j => { const p = Object.values(j?.query?.pages || {}) as any[]; p.sort((a, b) => a.index - b.index).forEach(x => { if (x.extract) out.push({ title: x.title + " (Wikipedia)", url: x.fullurl, snippet: x.extract }); }); }).catch(() => undefined));
  if (cfg.searchKey) jobs.push(fetch("https://api.tavily.com/search", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ api_key: cfg.searchKey, query: q, max_results: 5, search_depth: "basic" }) })
    .then(r => r.json()).then(j => { (j?.results || []).forEach((x: any) => out.unshift({ title: x.title, url: x.url, snippet: strip(x.content || "").slice(0, 700) })); }).catch(() => undefined));
  await Promise.all(jobs); return out.slice(0, 6);
}
