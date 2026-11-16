import { useEffect, useState, type ReactNode } from "react";
import { CarFront, ChevronLeft, ChevronRight } from "lucide-react";
import type { Car } from "./data/catalog";

export const money = (n: number) => "₹" + Math.round(Number.isFinite(n) ? n : 0).toLocaleString("en-IN");
export const fmt = (n: number) => new Intl.NumberFormat("en-IN").format(Number.isFinite(n) ? n : 0);
export const PageHead = ({ eyebrow, title, desc, action }: { eyebrow: string; title: string; desc: string; action?: ReactNode }) => <div className="page-head"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{desc}</p></div>{action}</div>;
export const Field = ({ label, children }: { label: string; children: ReactNode }) => <label className="field"><span>{label}</span>{children}</label>;
export const Chip = ({ on, children, onClick }: { on?: boolean; children: ReactNode; onClick: () => void }) => <button className={`chip ${on ? "on" : ""}`} onClick={onClick}>{children}</button>;
export const KV = ({ k, v }: { k: string; v: ReactNode }) => <div className="kv"><span>{k}</span><b>{v}</b></div>;
export const Sel = ({ label, value, set, opts }: { label: string; value: string; set: (v: string) => void; opts: (string | [string, string])[] }) => <Field label={label}><select value={value} onChange={e => set(e.target.value)}>{opts.map(o => { const [v, l] = Array.isArray(o) ? o : [o, o]; return <option key={v} value={v}>{l}</option>; })}</select></Field>;

/* ---- Photos: Wikipedia thumbnail (cards) and Wikimedia Commons gallery (detail pages), both validated against the car name ---- */
const nz = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const SKIP = ["ev", "electric", "series", "class", "lwb", "gran", "coupe", "limousine", "line", "classic", "neo", "r"];
const modelToks = (c: Car) => nz(c.model).split(/[^a-z0-9]+/).filter(t => t.length >= 2 && !SKIP.includes(t));
const brandToks = (c: Car) => nz(c.brand).split(/[^a-z]+/).filter(t => t.length > 2);
function load<T>(k: string, d: T): T { try { return JSON.parse(localStorage.getItem(k) || "") as T; } catch { return d; } }
function save(k: string, v: unknown) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage full or blocked */ } }
const thumbStore: Record<string, string> = load("veyra-img-v3", {}); const thumbMem: Record<string, string> = {}; const pend: Record<string, Promise<string>> = {};
async function summ(t: string): Promise<any> { try { const r = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(t)}`); return r.ok ? await r.json() : null; } catch { return null; } }
function goodSummary(d: any, c: Car) {
  const src: string = d?.thumbnail?.source || ""; if (!src || /\.svg|logo|emblem|badge/i.test(src)) return false;
  const hay = nz((d.title || "") + " " + (d.extract || "").slice(0, 500)), mt = modelToks(c);
  return brandToks(c).some(b => hay.includes(b.slice(0, 5))) && (mt.length === 0 || mt.some(t => hay.includes(t)));
}
export function resolveThumb(c: Car): Promise<string> {
  const k = c.brand + "|" + c.model; if (thumbStore[k]) return Promise.resolve(thumbStore[k]); if (thumbMem[k] !== undefined) return Promise.resolve(thumbMem[k]);
  return pend[k] || (pend[k] = (async () => {
    let d = await summ(c.wiki); if (goodSummary(d, c)) return d.thumbnail.source as string;
    const sr = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(c.brand + " " + c.model + " car")}&srlimit=4&format=json&origin=*`).then(r => r.json()).catch(() => null);
    for (const h of sr?.query?.search || []) { d = await summ(h.title); if (goodSummary(d, c)) return d.thumbnail.source as string; }
    return "";
  })().then(u => { thumbMem[k] = u; if (u) { thumbStore[k] = u; save("veyra-img-v3", thumbStore); } return u; }));
}
export function CarPhoto({ c, big }: { c: Car; big?: boolean }) {
  const [src, setSrc] = useState<string | undefined>(undefined); const [fail, setFail] = useState(false);
  useEffect(() => { let on = true; setSrc(undefined); setFail(false); resolveThumb(c).then(u => { if (on) setSrc(u); }); return () => { on = false; }; }, [c.id]);
  const url = src && big && !fail ? src.replace(/\/(\d+)px-/, "/800px-") : src;
  return <div className={big ? "car-photo big" : "car-photo"}>{url ? <img className="wimg" src={url} alt={`${c.brand} ${c.model}`} loading="lazy" onError={() => { if (big && !fail) setFail(true); else setSrc(""); }} /> :
    <div className="wimg wimg-fb"><CarFront size={28} /><b>{c.brand}</b><span>{c.model}</span><small>{src === undefined ? "Loading photo…" : "Photo unavailable"}</small></div>}{url && <i>Representative photo · Wikipedia</i>}</div>;
}

export type GImg = { u: string; t: string; a: string; l: string; p: string; k: string };
const galStore: Record<string, GImg[]> = load("veyra-gal-v1", {}); const galPend: Record<string, Promise<GImg[]>> = {};
const clean = (s: string) => s.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
export function loadGallery(c: Car): Promise<GImg[]> {
  const key = c.brand + "|" + c.model; if (galStore[key]) return Promise.resolve(galStore[key]);
  return galPend[key] || (galPend[key] = (async () => {
    const q = `${c.brand} ${c.model}`, url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(q + " filetype:bitmap")}&gsrlimit=40&prop=imageinfo&iiprop=url|extmetadata|size|mime&iiurlwidth=900&format=json&origin=*`;
    const j = await fetch(url).then(r => r.json()).catch(() => null); const pages = (Object.values(j?.query?.pages || {}) as any[]).sort((a, b) => a.index - b.index);
    const mt = modelToks(c), bt = brandToks(c), ev = /\bev\b|electric/i.test(c.model); const out: (GImg & { s: number })[] = [];
    for (const p of pages) {
      const ii = p.imageinfo?.[0]; if (!ii?.thumburl || !/jpe?g|webp|png/.test(ii.mime || "") || (ii.width || 0) < 700) continue;
      const name = nz(String(p.title).replace(/^File:/i, "")).replace(/[_\-.()]/g, " "); if (/logo|emblem|badge|diagram|engine bay|crash|wreck|burn|key|sticker|toy|model car|scale|poster|interior of (a )?different/.test(name)) continue;
      if (!mt.every(t => name.includes(t)) || !(bt.some(b => name.includes(b.slice(0, 5))) || mt.join("").length >= 6)) continue;
      const k = /interior|dashboard|cockpit|cabin|seat|steering/.test(name) ? "Interior" : /rear|back|tail/.test(name) ? "Rear" : /side|profile/.test(name) ? "Side" : /front/.test(name) ? "Front" : "Exterior";
      out.push({ u: ii.thumburl, t: clean(String(p.title).replace(/^File:/i, "")), a: clean(ii.extmetadata?.Artist?.value || "Wikimedia Commons"), l: clean(ii.extmetadata?.LicenseShortName?.value || "CC"), p: ii.descriptionshorturl || ii.descriptionurl || "", k, s: (ev && /\bev\b|electric/.test(name) ? 2 : 0) + (k === "Front" || k === "Exterior" ? 1 : 0) });
    }
    return out.sort((a, b) => b.s - a.s).slice(0, 10).map(({ s, ...x }) => x);
  })().then(r => { if (r.length) { galStore[key] = r; save("veyra-gal-v1", galStore); } return r; }));
}
export function Gallery({ c }: { c: Car }) {
  const [imgs, setImgs] = useState<GImg[] | null>(null); const [i, setI] = useState(0);
  useEffect(() => { let on = true; setImgs(null); setI(0); loadGallery(c).then(r => { if (on) setImgs(r); }).catch(() => { if (on) setImgs([]); }); return () => { on = false; }; }, [c.id]);
  if (!imgs || imgs.length === 0) return <div className="gallery"><div className="gal-main"><CarPhoto c={c} big /></div>{imgs === null && <p className="gal-note">Loading more photos…</p>}{imgs && <p className="gal-note">No additional photos found for this model.</p>}</div>;
  const g = imgs[Math.min(i, imgs.length - 1)];
  return <div className="gallery"><div className="gal-main"><img src={g.u} alt={g.t} /><span className="gal-tag">{g.k}</span>{imgs.length > 1 && <><button className="gal-nav l" onClick={() => setI((i + imgs.length - 1) % imgs.length)} aria-label="Previous photo"><ChevronLeft size={18} /></button><button className="gal-nav r" onClick={() => setI((i + 1) % imgs.length)} aria-label="Next photo"><ChevronRight size={18} /></button></>}</div>
    <div className="gal-strip">{imgs.map((x, n) => <button key={x.u} className={n === i ? "on" : ""} onClick={() => setI(n)} aria-label={`Photo ${n + 1}`}><img src={x.u} alt="" loading="lazy" /></button>)}</div>
    <p className="gal-note">Photo {i + 1} of {imgs.length}: {g.a}, {g.l}, <a href={g.p} target="_blank" rel="noopener noreferrer">Wikimedia Commons</a>. Photos are representative and may show a different model year.</p></div>;
}
