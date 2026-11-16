import { useMemo, useState } from "react";
import { ArrowRight, CarFront, GitCompareArrows, Search, Zap } from "lucide-react";
import { CARS, BRANDS, BODIES, FUELS, lakh, onRoad, type Car, type PT } from "./data/catalog";
import { CarPhoto, Chip, Field, PageHead, Sel } from "./ui";
import type { Ctx } from "./CarPages";

const BUDGETS: [string, number, number][] = [["Under 5 L", 0, 5], ["5-10 L", 5, 10], ["10-15 L", 10, 15], ["15-25 L", 15, 25], ["25-50 L", 25, 50], ["50 L-1 Cr", 50, 100], ["1-2 Cr", 100, 200]];
export default function Discover({ open, addCompare }: { open: (c: Car, ctx: Ctx) => void; addCompare: (c: Car) => void }) {
  const [q, setQ] = useState(""); const [brand, setBrand] = useState("All"); const [fuel, setFuel] = useState("All"); const [body, setBody] = useState("All"); const [tx, setTx] = useState("All"); const [basis, setBasis] = useState("On-road"); const [lo, setLo] = useState("5"); const [hi, setHi] = useState("15"); const [sort, setSort] = useState("Price: low to high");
  const price = (v: PT) => basis === "On-road" ? onRoad(v.price, v.e.ev) : v.price;
  const rows = useMemo(() => CARS.filter(c => (brand === "All" || c.brand === brand) && (body === "All" || c.body === body) && `${c.brand} ${c.model}`.toLowerCase().includes(q.toLowerCase()))
    .map(c => { const vs = c.vars.filter(v => price(v) >= +lo * 1e5 && price(v) <= +hi * 1e5 && (fuel === "All" || v.e.fuel === fuel) && (tx === "All" || v.tx === tx)); return vs.length ? { c, vs, from: Math.min(...vs.map(price)), to: Math.max(...vs.map(price)) } : null; })
    .filter((r): r is { c: Car; vs: PT[]; from: number; to: number } => !!r).sort((a, b) => sort === "Price: high to low" ? b.from - a.from : sort === "Name" ? (a.c.brand + a.c.model).localeCompare(b.c.brand + b.c.model) : a.from - b.from), [q, brand, fuel, body, tx, basis, lo, hi, sort]);
  const ctx: Ctx = { basis, lo: +lo * 1e5, hi: +hi * 1e5 };
  return <><PageHead eyebrow="DISCOVER CARS" title="Cars in your budget." desc="Set your budget, filter by brand, fuel or body type, and open any car for its photos, every variant, specifications and features." />
    <div className="panel"><div className="form-grid four"><Field label="Budget from (₹ lakh)"><input type="number" min="0" value={lo} onChange={e => setLo(e.target.value)} /></Field><Field label="Budget up to (₹ lakh)"><input type="number" min="0" value={hi} onChange={e => setHi(e.target.value)} /></Field><Sel label="Budget means" value={basis} set={setBasis} opts={["On-road", "Ex-showroom"]} /><Sel label="Sort" value={sort} set={setSort} opts={["Price: low to high", "Price: high to low", "Name"]} /></div>
      <div className="chip-row" style={{ marginTop: 14, marginBottom: 0 }}>{BUDGETS.map(([l, a, b]) => <Chip key={l} on={+lo === a && +hi === b} onClick={() => { setLo(String(a)); setHi(String(b)); }}>{l}</Chip>)}</div></div>
    <div className="filter-bar"><div className="filter-search"><Search size={14} /><input placeholder="Search brand or model" value={q} onChange={e => setQ(e.target.value)} /></div>
      <select value={brand} onChange={e => setBrand(e.target.value)}><option value="All">All brands</option>{BRANDS.map(b => <option key={b}>{b}</option>)}</select><select value={fuel} onChange={e => setFuel(e.target.value)}><option value="All">All fuels</option>{FUELS.map(b => <option key={b}>{b}</option>)}</select>
      <select value={body} onChange={e => setBody(e.target.value)}><option value="All">All body types</option>{BODIES.map(b => <option key={b}>{b}</option>)}</select><select value={tx} onChange={e => setTx(e.target.value)}><option value="All">Any gearbox</option><option>Manual</option><option>Automatic</option></select></div>
    <div className="result-line"><span>{rows.length} cars, {rows.reduce((a, r) => a + r.vs.length, 0)} variants within {lakh(+lo * 1e5)} - {lakh(+hi * 1e5)} {basis.toLowerCase()}</span><span className="muted">{CARS.length} models · {BRANDS.length} brands</span></div>
    {rows.length === 0 ? <div className="empty-state"><CarFront size={25} /><h3>No cars in this range.</h3><p>Widen the budget or clear a filter.</p></div> :
      <div className="vehicle-grid">{rows.map(({ c, vs, from, to }) => <div className="vehicle-card" key={c.id}><button className="visual-button" onClick={() => open(c, ctx)} aria-label={`Open ${c.brand} ${c.model}`}><CarPhoto c={c} /></button><div className="vehicle-info"><div className="vehicle-make">{c.brand.toUpperCase()}</div><h3>{c.model}</h3><div className="vehicle-variant">{c.body} · {c.seats} seats</div>
        <div className="vehicle-price">{lakh(from)}{to > from ? " - " + lakh(to) : ""} <small>{basis.toLowerCase()}, in your budget</small></div><div className="tag-row">{FUELS.filter(f => vs.some(v => v.e.fuel === f)).map(f => <span className="tag" key={f}>{f}</span>)}</div>
        <div className="vehicle-specs"><span><CarFront size={13} />{vs.length} of {c.vars.length} variants</span><span><Zap size={13} />up to {Math.max(...vs.map(v => v.e.ps))} PS</span></div>
        <div className="vehicle-actions"><button className="text-action" onClick={() => open(c, ctx)}>View all variants <ArrowRight size={14} /></button><button className="text-action" onClick={() => addCompare(c)}><GitCompareArrows size={14} /> Compare</button></div></div></div>)}</div>}
    <div className="notice"><span>On-road price = ex-showroom + road tax + first-year insurance + other charges (about 5-25% extra). Exact figures vary by city.</span></div></>;
}
