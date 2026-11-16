import { useMemo, useState, type ReactNode } from "react";
import { ArrowRight, ArrowUpRight, BadgeIndianRupee, Bot, CircleHelp, Compass, Gauge, GitCompareArrows, IndianRupee, LayoutDashboard, Menu, Search, Sparkles, Wrench, X, Wallet, Plus, Target } from "lucide-react";
import { CARS, BRANDS, FUELS, lakh, rng, onRoad, runCosts, insurance, AGE_DEP, curve, fuelsOf, effUnit, type Car, type Eng, type PT } from "./data/catalog";
import type { Msg } from "./data/assistant";
import { DEFAULT_CFG, type AiCfg } from "./data/llm";
import { CarPhoto } from "./ui";
import Resale from "./Resale";
import Discover from "./Discover";
import Pilot from "./Pilot";
import Mechanic from "./Mechanic";
import Match from "./Match";
import EngineCutaway from "./EngineCutaway";
import { CarPage, VariantPage, type Ctx } from "./CarPages";

type Page = "Overview" | "Resale value" | "Discover cars" | "Car match" | "Financial planner" | "Ownership costs" | "Engine explorer" | "Compare cars" | "Mechanic" | "AI pilot";
const nav: { label: Page; icon: typeof LayoutDashboard; group: string }[] = [
  { label: "Overview", icon: LayoutDashboard, group: "WORKSPACE" }, { label: "Resale value", icon: BadgeIndianRupee, group: "INTELLIGENCE" }, { label: "Discover cars", icon: Compass, group: "INTELLIGENCE" }, { label: "Car match", icon: Target, group: "INTELLIGENCE" },
  { label: "Financial planner", icon: IndianRupee, group: "INTELLIGENCE" }, { label: "Ownership costs", icon: Wallet, group: "INTELLIGENCE" }, { label: "Engine explorer", icon: Gauge, group: "EXPLORE" },
  { label: "Compare cars", icon: GitCompareArrows, group: "EXPLORE" }, { label: "Mechanic", icon: Wrench, group: "OWNERSHIP" }, { label: "AI pilot", icon: Bot, group: "OWNERSHIP" }
];
const money = (n: number) => "₹" + Math.round(Number.isFinite(n) ? n : 0).toLocaleString("en-IN");
const fmt = (n: number) => new Intl.NumberFormat("en-IN").format(Number.isFinite(n) ? n : 0);
const effText = (e: Eng) => `${e.eff} ${effUnit(e)} (claimed)`;
const real = (e: Eng) => e.ev ? Math.round(e.eff * .75) + " km per charge" : (e.eff * (e.fuel === "CNG" ? .85 : .8)).toFixed(1) + " " + effUnit(e);
const SUNROOF = ["Not available", "Single-pane", "Panoramic"];

const KV = ({ k, v }: { k: string; v: ReactNode }) => <div className="kv"><span>{k}</span><b>{v}</b></div>;
const Sel = ({ label, value, set, opts }: { label: string; value: string; set: (v: string) => void; opts: (string | [string, string])[] }) => <Field label={label}><select value={value} onChange={e => set(e.target.value)}>{opts.map(o => { const [v, l] = Array.isArray(o) ? o : [o, o]; return <option key={v} value={v}>{l}</option>; })}</select></Field>;
const vLabel = (v: PT) => `${v.name} · ${v.e.fuel} · ${v.tx}`;
const firstOf = (b: string) => CARS.find(c => c.brand === b)!;

function Overview({ setPage }: { setPage: (p: Page) => void }) {
  const f: [Page, any, string, string][] = [["Resale value", BadgeIndianRupee, "What is your car worth?", "A machine learning model estimates your car's value and forecasts 5 years."], ["Discover cars", Compass, "Cars in your budget", "Set a price range, filter by brand, fuel and body, and open every variant and feature."], ["Car match", Target, "Find your match", "Answer 8 quick questions and get a ranked shortlist with reasons."], ["Engine explorer", Gauge, "Engines in action", "Animated engine cutaways, plus power and torque curves."], ["Mechanic", Wrench, "Fix it yourself", "Search a problem and follow step-by-step help with diagrams."]];
  return <><div className="hero-panel"><div className="hero-copy"><div className="hero-kicker"><Sparkles size={13} /> VEYRA AUTOMOTIVE INTELLIGENCE</div><h2>Know your car's <em>value</em>, cost and care.</h2><p>{CARS.length} models, {CARS.reduce((a, c) => a + c.vars.length, 0)} variants and {BRANDS.length} brands, from hatchbacks to luxury cars up to ₹1.6 crore.</p><button className="btn btn-primary" onClick={() => setPage("Discover cars")}>Discover cars <ArrowRight size={14} /></button></div><div className="hero-art"><div className="hero-orbit" /><div className="hero-orbit orbit-two" /><div className="hero-car">V</div></div></div>
    <div className="section-row"><h3 className="section-title">Start with</h3></div><div className="feature-grid">{f.map(([p, I, t, d], i) => <button className="feature-card" key={p} onClick={() => setPage(p)}><div className="feature-top"><span>0{i + 1}</span><I size={19} /></div><h3>{t}</h3><p>{d}</p><div className="feature-link">Open <ArrowUpRight size={15} /></div></button>)}</div>
    <div className="notice"><CircleHelp size={17} /><span>Prices and specifications are indicative reference values for India. Trim prices inside each model's range are estimates. Always confirm with the manufacturer or dealer.</span></div></>;
}

/* ---------- Ownership ---------- */
function Ownership() {
  const [brand, setBrand] = useState("Maruti Suzuki"); const [model, setModel] = useState("Swift"); const [vi, setVi] = useState(0); const [km, setKm] = useState("1000"); const [mil, setMil] = useState("");
  const [insOn, setInsOn] = useState(true); const [cover, setCover] = useState<"Comprehensive" | "Third-party only">("Comprehensive"); const [age, setAge] = useState(0); const [zd, setZd] = useState(false); const [ncb, setNcb] = useState(0);
  const cars = CARS.filter(c => c.brand === brand); const car = cars.find(c => c.model === model) || cars[0]; const v = car.vars[Math.min(vi, car.vars.length - 1)];
  const r = runCosts(car, v, +km || 0, +mil || undefined), ins = insurance(car, v, age, cover, zd, ncb), insM = insOn ? ins.total / 12 : 0, total = r.total + insM;
  const rows: [string, number][] = [[v.e.ev ? "Charging (electricity)" : v.e.fuel === "CNG" ? "CNG fuel" : "Fuel", r.fuel], ["Servicing (" + brand + " average)", r.service], ["Tyres", r.tyres], ["Wear, washing and misc.", r.misc]]; if (insOn) rows.push(["Insurance (yearly premium ÷ 12)", insM]);
  return <><PageHead eyebrow="OWNERSHIP COSTS" title="See the cost beyond the price." desc="Choose your car, variant and monthly kilometres. Mileage and service costs are estimated, and insurance is optional." />
    <div className="two-col"><div className="panel"><div className="panel-head"><div><h3>Your car</h3><p>Brand, car, engine and kilometres</p></div><Wallet size={18} /></div>
      <div className="form-grid"><Sel label="Brand" value={brand} set={b => { setBrand(b); setModel(firstOf(b).model); setVi(0); }} opts={BRANDS} /><Sel label="Car" value={car.model} set={m => { setModel(m); setVi(0); }} opts={cars.map(c => c.model)} />
        <div className="span2"><Sel label="Variant, engine and gearbox" value={String(vi)} set={x => setVi(+x)} opts={car.vars.map((x, i) => [String(i), `${x.name} · ${x.e.name} · ${x.tx}`] as [string, string])} /></div>
        <Field label="Kilometres per month"><input type="number" value={km} onChange={e => setKm(e.target.value)} /></Field><Field label={v.e.ev ? "Range (from battery)" : `Your mileage, ${effUnit(v.e)} (optional)`}><input type="number" disabled={v.e.ev} placeholder={v.e.ev ? "" : "Auto: " + r.real.toFixed(1)} value={mil} onChange={e => setMil(e.target.value)} /></Field></div>
      <label className="inline-check big"><input type="checkbox" checked={insOn} onChange={e => setInsOn(e.target.checked)} /> Include insurance in the monthly cost</label>
      {insOn && <div className="ins-box"><div className="form-grid"><Sel label="Cover type" value={cover} set={x => setCover(x as any)} opts={["Comprehensive", "Third-party only"]} /><Sel label="Car age (for insured value)" value={String(age)} set={x => setAge(+x)} opts={AGE_DEP.map((a, i) => [String(i), a[0]] as [string, string])} />
        <Sel label="No-claim bonus" value={String(ncb)} set={x => setNcb(+x)} opts={[["0", "None"], ["20", "20%"], ["25", "25%"], ["35", "35%"], ["45", "45%"], ["50", "50%"]]} /><label className="inline-check"><input type="checkbox" checked={zd} onChange={e => setZd(e.target.checked)} disabled={cover !== "Comprehensive"} /> Zero-depreciation add-on</label></div>
        <h4>How insurance is calculated</h4><div className="ins-rows">{ins.rows.map(([k, x]) => <div key={k}><span>{k}</span><b>{x < 0 ? "−" + money(-x) : money(x)}</b></div>)}<div className="tot"><span>Yearly premium</span><b>{money(ins.total)}</b></div></div>
        <p className="disclaimer">Own-damage = insured value × {(ins.odRate * 100).toFixed(2)}% (IRDAI-style base rate for this engine size). Third-party and owner-driver cover use the fixed IRDAI rates for the engine capacity (or motor kW for EVs). Real premiums differ by insurer, city and add-ons, so compare quotes.</p></div>}
      <div className="notice compact"><CircleHelp size={16} /><span>Estimated real-world {v.e.ev ? "range about " + r.real.toFixed(0) + " km per full charge" : "mileage about " + r.real.toFixed(1) + " " + effUnit(v.e)} (about {v.e.ev ? "75" : v.e.fuel === "CNG" ? "85" : "80"}% of the claimed figure). Service uses an average for {brand} and the {v.e.fuel.toLowerCase()} powertrain.</span></div></div>
    <div className="finance-result"><div className="eyebrow light-eyebrow">ESTIMATED MONTHLY EXPENSE</div><div className="emi-amount">{money(total)}</div><div className="finance-sub">Per year {money(total * 12)} · {insOn ? "includes insurance" : "excludes insurance"} · excludes EMI and depreciation</div>
      <div className="finance-breakdown">{rows.map(([k, x]) => <div key={k}><span>{k}</span><b>{money(x)}</b></div>)}</div><div className="bar-stack">{rows.map(([k, x], i) => <i key={k} title={k} style={{ width: x / total * 100 + "%", opacity: 1 - i * .15 }} />)}</div><div className="valuation-disclaimer">Cost per km: {money(total / Math.max(1, +km))}. Fuel prices used: petrol ₹105, diesel ₹92, CNG ₹76/kg, electricity ₹8/kWh.</div></div></div></>;
}

/* ---------- Engines ---------- */
function Curve({ e }: { e: Eng }) {
  const p = useMemo(() => curve(e), [e]); const W = 560, H = 250, L = 46, R = 46, T = 16, B = 34;
  const x1 = p[p.length - 1].rpm, x0 = e.ev ? 0 : 1000, mp = Math.max(...p.map(a => a.ps)) * 1.1, mn = Math.max(...p.map(a => a.nm)) * 1.1;
  const X = (r: number) => L + (r - x0) / (x1 - x0) * (W - L - R), path = (k: "ps" | "nm", m: number) => p.map((a, i) => `${i ? "L" : "M"}${X(a.rpm).toFixed(1)},${(T + (1 - a[k] / m) * (H - T - B)).toFixed(1)}`).join(" ");
  return <svg viewBox={`0 0 ${W} ${H}`} className="curve" role="img" aria-label="Power and torque curve">{[0, .25, .5, .75, 1].map(f => <line key={f} x1={L} x2={W - R} y1={T + f * (H - T - B)} y2={T + f * (H - T - B)} stroke="#d8cbac" />)}
    <path d={path("nm", mn)} fill="none" stroke="#68702f" strokeWidth="2.6" /><path d={path("ps", mp)} fill="none" stroke="#7a4f2a" strokeWidth="2.6" />
    {[0, .25, .5, .75, 1].map(f => { const t = x0 + (x1 - x0) * f; return <text key={f} x={X(t)} y={H - 14} fontSize="9" fill="#7b6a57" textAnchor="middle">{Math.round(t)}</text>; })}
    <text x={L - 6} y={T + 4} fontSize="9" fill="#7a4f2a" textAnchor="end">{Math.round(mp)} PS</text><text x={W - R + 6} y={T + 4} fontSize="9" fill="#68702f">{Math.round(mn)} Nm</text><text x={W / 2} y={H - 2} fontSize="9" fill="#7b6a57" textAnchor="middle">{e.ev ? "Motor speed (rpm)" : "Engine speed (rpm)"}</text></svg>;
}
function Engines() {
  const [budget, setBudget] = useState("20"); const [fuel, setFuel] = useState("All"); const [sel, setSel] = useState<string | null>(null);
  const list = useMemo(() => { const m: Record<string, { e: Eng; cars: Car[]; from: number }> = {}; CARS.forEach(c => c.vars.forEach(v => { if (onRoad(v.price, v.e.ev) <= +budget * 1e5 && (fuel === "All" || v.e.fuel === fuel)) { const o = m[v.e.id] || (m[v.e.id] = { e: v.e, cars: [], from: v.price }); if (!o.cars.includes(c)) o.cars.push(c); o.from = Math.min(o.from, v.price); } })); return Object.values(m).sort((a, b) => a.from - b.from); }, [budget, fuel]);
  const cur = list.find(x => x.e.id === sel) || null; const e = cur?.e; const trans = cur ? [...new Set(cur.cars.flatMap(c => c.vars.filter(v => v.e.id === e!.id).map(v => v.tx)))] : [];
  return <><PageHead eyebrow="ENGINE EXPLORER" title="Engines at your budget." desc="Enter your on-road budget to see every engine and motor in cars you can buy, then open one for every detail." />
    <div className="filter-bar"><Field label="On-road budget (₹ lakh)"><input type="number" value={budget} onChange={e2 => setBudget(e2.target.value)} /></Field><Field label="Fuel"><select value={fuel} onChange={e2 => setFuel(e2.target.value)}><option>All</option>{FUELS.map(f => <option key={f}>{f}</option>)}</select></Field></div>
    {e && cur && <div className="panel engine-detail"><div className="panel-head"><div><h3>{e.name}</h3><p>{e.fuel} · {e.asp}</p></div><button className="icon-btn" onClick={() => setSel(null)} aria-label="Close"><X size={16} /></button></div>
      <div className="engine-metrics four"><div><b>{e.ps} PS</b><span>Peak power{e.psRpm ? " @ " + fmt(e.psRpm) + " rpm" : ""}</span></div><div><b>{e.nm} Nm</b><span>Peak torque{e.nmRpm ? " @ " + fmt(e.nmRpm) + (e.nmRpm === 1000 ? "+" : "") + " rpm" : " (from 0 rpm)"}</span></div><div><b>{e.ev ? e.disp + " kWh" : fmt(e.disp) + " cc"}</b><span>{e.ev ? "Battery capacity" : "Displacement"}</span></div><div><b>{e.ev ? "—" : e.cyl}</b><span>Cylinders</span></div></div>
      <EngineCutaway e={e} /><div className="two-col"><div><Curve e={e} /><p className="legend"><i style={{ background: "#7a4f2a" }} /> Power (PS) <i style={{ background: "#68702f" }} /> Torque (Nm)</p><p className="disclaimer">Curves are modelled from the published peak power and torque figures, not dyno measurements.</p></div>
        <div className="kv-list"><KV k="Fuel" v={e.fuel} /><KV k="Induction / type" v={e.asp} /><KV k="Layout" v={e.ev ? "Electric motor + battery pack" : e.cyl + "-cylinder"} />{!e.ev && <KV k="Power per litre" v={(e.ps / (e.disp / 1000)).toFixed(0) + " PS/L"} />}{!e.ev && <KV k="Torque per litre" v={(e.nm / (e.disp / 1000)).toFixed(0) + " Nm/L"} />}<KV k="Claimed efficiency" v={effText(e)} /><KV k="Real-world estimate" v={real(e)} /><KV k="Power in kW" v={(e.ps * .7355).toFixed(0) + " kW"} /><KV k="Gearbox options" v={trans.join(" / ")} /><KV k="Cars at your budget" v={cur.cars.map(c => c.brand + " " + c.model).join(", ")} /></div></div></div>}
    <div className="result-line"><span>{list.length} engines available within ₹{budget} lakh on-road</span></div>
    <div className="engine-grid">{list.map(({ e: x, cars, from }) => <button className={`engine-card ${sel === x.id ? "sel" : ""}`} key={x.id} onClick={() => { setSel(x.id); window.scrollTo({ top: 0, behavior: "smooth" }); }}><div className="engine-top"><span>{x.fuel.toUpperCase()}</span><Gauge size={19} /></div><h3>{x.name}</h3><div className="engine-maker">From about {lakh(from)} · {cars.length} car{cars.length > 1 ? "s" : ""}</div><div className="engine-metrics"><div><b>{x.ps} PS</b><span>Power</span></div><div><b>{x.nm} Nm</b><span>Torque</span></div></div><div className="engine-maker">{cars.slice(0, 4).map(c => c.model).join(", ")}{cars.length > 4 ? "…" : ""}</div></button>)}</div></>;
}

/* ---------- Compare ---------- */
type Slot = { id: string; vi: number };
function Compare({ slots, setSlots }: { slots: Slot[]; setSlots: (x: Slot[]) => void }) {
  const [q, setQ] = useState(""); const [diff, setDiff] = useState(false);
  const cars = slots.map(s => { const c = CARS.find(x => x.id === s.id)!; return { c, v: c.vars[Math.min(s.vi, c.vars.length - 1)] }; });
  const found = q.trim().length > 1 ? CARS.filter(c => `${c.brand} ${c.model}`.toLowerCase().includes(q.toLowerCase())).slice(0, 8) : [];
  const upd = (n: number, p: Partial<Slot>) => setSlots(slots.map((s, i) => i === n ? { ...s, ...p } : s));
  const add = (id: string) => { if (slots.length < 4 && !slots.find(s => s.id === id)) setSlots([...slots, { id, vi: 0 }]); setQ(""); };
  type R = [string, (c: Car, v: PT) => string];
  const secs: [string, R[]][] = [
    ["Overview", [["Ex-showroom price range", c => rng(c)], ["Body type", c => c.body], ["Seats", c => String(c.seats)], ["Fuel options", c => fuelsOf(c).join(", ")], ["Gearbox options", c => [...new Set(c.vars.map(v => v.tx))].join(", ")], ["Number of variants", c => String(c.vars.length)]]],
    ["Selected variant", [["Variant", (_c, v) => v.name], ["Ex-showroom price (estimated)", (_c, v) => lakh(v.price)], ["On-road price (estimated)", (_c, v) => lakh(onRoad(v.price, v.e.ev))]]],
    ["Engine and transmission", [["Engine / motor", (_c, v) => v.e.name], ["Fuel", (_c, v) => v.e.fuel], ["Displacement / battery", (_c, v) => v.e.ev ? v.e.disp + " kWh" : fmt(v.e.disp) + " cc"], ["Cylinders", (_c, v) => v.e.ev ? "—" : String(v.e.cyl)], ["Induction / type", (_c, v) => v.e.asp], ["Max power", (_c, v) => `${v.e.ps} PS (${(v.e.ps * .7355).toFixed(0)} kW)`], ["Max torque", (_c, v) => v.e.nm + " Nm"], ["Power per litre", (_c, v) => v.e.ev ? "—" : (v.e.ps / (v.e.disp / 1000)).toFixed(0) + " PS/L"], ["Gearbox", (_c, v) => v.tx], ["Claimed mileage / range", (_c, v) => effText(v.e)], ["Real-world estimate", (_c, v) => real(v.e)]]],
    ["Dimensions and capacity", [["Length", c => c.len + " mm"], ["Width", c => c.wid + " mm"], ["Height", c => c.hgt + " mm"], ["Wheelbase", c => c.wb + " mm"], ["Ground clearance", c => c.gc ? c.gc + " mm" : "—"], ["Boot space", c => c.boot ? c.boot + " L" : "—"], ["Fuel tank", c => c.tank ? c.tank + " L" : "—"]]],
    ["Safety", [["Airbags (standard / max)", c => `${c.airStd} / ${c.airMax}`], ["Crash-test rating", c => c.ncap ? c.ncap + " star NCAP" : "Not listed"], ["ADAS", c => c.f.adas ? "Yes (top variant)" : "No"], ["360-degree camera", c => c.f.cam360 ? "Yes (top variant)" : "No"]]],
    ["Comfort and features (top variant)", [["Infotainment screen", c => c.screen ? c.screen + " inch" : "—"], ["Sunroof", c => SUNROOF[c.f.sunroof]], ["Ventilated front seats", c => c.f.vent ? "Yes" : "No"], ["Wireless phone charging", c => c.f.wireless ? "Yes" : "No"], ["Cruise control", c => c.f.cruise ? "Yes" : "No"]]],
    ["Running cost (estimate)", [["Per month at 1,000 km (excl. insurance)", (c, v) => money(runCosts(c, v, 1000).total)]]],
    ["All variants", [["Trims", c => c.vars.map(v => v.name).join(", ")]]]];
  return <><PageHead eyebrow="COMPARE CARS" title="Compare with every detail." desc="Search or pick a brand and car for each slot, choose the variant, and compare up to four cars." />
    <div className="panel"><div className="compare-search"><Field label="Search to add a car"><div className="filter-search boxed"><Search size={14} /><input placeholder="Type a brand or model, for example Creta" value={q} onChange={e => setQ(e.target.value)} /></div></Field>{found.length > 0 && <div className="search-pop">{found.map(c => <button key={c.id} onClick={() => add(c.id)}><b>{c.brand} {c.model}</b><span>{rng(c)}</span></button>)}</div>}</div></div>
    <div className="slot-grid">{slots.map((s, n) => { const c = CARS.find(x => x.id === s.id)!; const cs = CARS.filter(x => x.brand === c.brand); return <div className="panel slot" key={n}><div className="slot-head"><b>Car {n + 1}</b>{slots.length > 2 && <button className="icon-btn" onClick={() => setSlots(slots.filter((_, i) => i !== n))} aria-label="Remove car"><X size={15} /></button>}</div>
      <Sel label="Brand" value={c.brand} set={b => setSlots(slots.map((x, i) => i === n ? { id: firstOf(b).id, vi: 0 } : x))} opts={BRANDS} /><Sel label="Car" value={c.id} set={id => upd(n, { id, vi: 0 })} opts={cs.map(x => [x.id, x.model] as [string, string])} /><Sel label="Variant" value={String(s.vi)} set={x => upd(n, { vi: +x })} opts={c.vars.map((v, i) => [String(i), vLabel(v)] as [string, string])} /></div>; })}
      {slots.length < 4 && <button className="panel slot add" onClick={() => add(CARS.find(c => !slots.find(s => s.id === c.id))!.id)}><Plus size={22} /><span>Add another car</span></button>}</div>
    <div className="panel compare-panel"><div className="compare-top"><label className="inline-check"><input type="checkbox" checked={diff} onChange={e => setDiff(e.target.checked)} /> Show differences only</label></div><div className="compare-table" style={{ ["--n" as any]: cars.length }}>
      <div className="compare-head"><div className="compare-label">CAR</div>{cars.map(({ c }, i) => <div className="compare-car" key={i}><CarPhoto c={c} /><b>{c.brand} {c.model}</b><span>{rng(c)}</span></div>)}</div>
      {secs.map(([title, rows]) => { const shown = rows.filter(([, f]) => !diff || new Set(cars.map(({ c, v }) => f(c, v))).size > 1); return shown.length === 0 ? null : <div key={title}><div className="compare-sec">{title}</div>{shown.map(([l, f]) => <div className="compare-row" key={l}><span>{l}</span>{cars.map(({ c, v }, i) => <b key={i}>{f(c, v)}</b>)}</div>)}</div>; })}</div></div>
    <div className="notice"><CircleHelp size={16} /><span>Features reflect each model's top variant and lower trims may lack some. Trim prices are estimates inside the model's range. Verify with the dealer.</span></div></>;
}

/* ---------- App ---------- */
function App() {
  const [page, setPage] = useState<Page>("Overview"); const [mobileOpen, setMobileOpen] = useState(false);
  const [view, setView] = useState<{ c: Car; ctx: Ctx; vi: number | null } | null>(null);
  const idOf = (m: string) => String(CARS.findIndex(c => c.model === m)); const [slots, setSlots] = useState<Slot[]>([{ id: idOf("Creta"), vi: 7 }, { id: idOf("Seltos"), vi: 4 }]);
  const [loan, setLoan] = useState({ price: "1500000", down: "300000", rate: "9.5", years: "5" });
  const [chat, setChat] = useState<Msg[]>([{ role: "assistant", text: "Hi, I'm the Veyra AI Pilot. Ask me anything about cars: models and specs, which car fits your budget, EMI and loans, insurance, running costs, or how to fix a problem. When you're online I also search the web for current information.", via: "Built-in knowledge" }]);
  const [cfg, setCfgState] = useState<AiCfg>(() => { try { return { ...DEFAULT_CFG, ...JSON.parse(localStorage.getItem("veyra-ai-cfg2") || "{}") }; } catch { return DEFAULT_CFG; } });
  const setCfg = (c: AiCfg) => { setCfgState(c); try { localStorage.setItem("veyra-ai-cfg2", JSON.stringify(c)); } catch { /* ignore */ } };
  const principal = Math.max(0, Number(loan.price) - Number(loan.down)); const months = Math.max(1, Number(loan.years) * 12); const mr = Number(loan.rate) / 1200;
  const emi = mr === 0 ? principal / months : principal * mr * Math.pow(1 + mr, months) / (Math.pow(1 + mr, months) - 1); const interest = Math.max(0, emi * months - principal);
  const top = () => window.scrollTo({ top: 0 });
  const go = (p: Page) => { setPage(p); setView(null); setMobileOpen(false); top(); };
  const addCompare = (c: Car) => { setSlots(x => x.find(y => y.id === c.id) || x.length >= 4 ? x : [...x, { id: c.id, vi: 0 }]); setPage("Compare cars"); setView(null); top(); };
  const openCar = (c: Car, ctx: Ctx = { basis: "On-road", lo: 0, hi: 0 }) => { setPage("Discover cars"); setView({ c, ctx, vi: null }); top(); };
  const goFinance = (price: number) => { setLoan({ ...loan, price: String(Math.round(price)), down: String(Math.round(price * .2)) }); go("Financial planner"); };
  return <div className="app-shell">
    <aside className={`sidebar ${mobileOpen ? "open" : ""}`}><div className="brand"><div className="brand-mark">V</div><div><div className="brand-name">VEYRA</div><div className="brand-sub">AUTOMOTIVE INTELLIGENCE</div></div><button className="icon-btn mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={18} /></button></div>
      {["WORKSPACE", "INTELLIGENCE", "EXPLORE", "OWNERSHIP"].map(g => <div className="nav-group" key={g}><div className="nav-label">{g}</div>{nav.filter(n => n.group === g).map(it => { const I = it.icon; return <button key={it.label} className={`nav-item ${page === it.label ? "active" : ""}`} onClick={() => go(it.label)}><I size={16} /><span>{it.label}</span></button>; })}</div>)}</aside>
    {mobileOpen && <div className="scrim" onClick={() => setMobileOpen(false)} />}
    <main className="main"><header className="topbar"><button className="icon-btn menu-btn" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu size={20} /></button><div className="breadcrumbs">Veyra <span>/</span> <b>{page}</b>{view && <><span>/</span><b>{view.c.model}</b></>}</div></header>
      <div className="content">
        {page === "Overview" && <Overview setPage={go} />}{page === "Resale value" && <Resale />}
        {page === "Discover cars" && <div style={{ display: view ? "none" : undefined }}><Discover open={openCar} addCompare={addCompare} /></div>}
        {page === "Discover cars" && view && view.vi === null && <CarPage c={view.c} ctx={view.ctx} back={() => { setView(null); top(); }} openVar={(c, vi) => { setView({ c, ctx: view.ctx, vi }); top(); }} openCar={x => openCar(x, view.ctx)} addCompare={addCompare} goFinance={goFinance} />}
        {page === "Discover cars" && view && view.vi !== null && <VariantPage c={view.c} vi={view.vi} setVi={vi => setView({ ...view, vi })} ctx={view.ctx} back={() => { setView({ ...view, vi: null }); top(); }} addCompare={addCompare} />}
        {page === "Car match" && <Match open={c => openCar(c)} compare={addCompare} />}
        {page === "Financial planner" && <Finance loan={loan} setLoan={setLoan} principal={principal} emi={emi} interest={interest} />}{page === "Ownership costs" && <Ownership />}{page === "Engine explorer" && <Engines />}
        {page === "Compare cars" && <Compare slots={slots} setSlots={setSlots} />}{page === "Mechanic" && <Mechanic cfg={cfg} />}{page === "AI pilot" && <Pilot chat={chat} setChat={setChat} cfg={cfg} setCfg={setCfg} />}
        <footer className="footer"><span>VEYRA © 2026</span><span>Automotive intelligence, made clear.</span><span>Indicative reference data</span></footer></div></main>
  </div>;
}
function PageHead({ eyebrow, title, desc, action }: { eyebrow: string; title: string; desc: string; action?: ReactNode }) { return <div className="page-head"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{desc}</p></div>{action}</div>; }
function Field({ label, children }: any) { return <label className="field"><span>{label}</span>{children}</label>; }
function Finance({ loan, setLoan, principal, emi, interest }: any) { return <><PageHead eyebrow="FINANCIAL INTELLIGENCE" title="Make the numbers clear." desc="Calculate a reducing-balance EMI, total interest and repayment from your assumptions."/><div className="two-col"><div className="panel"><div className="panel-head"><div><h3>Loan assumptions</h3><p>Adjust values to explore a scenario</p></div><span className="step-pill">CALCULATOR</span></div><div className="form-grid single"><Field label="Vehicle price (₹)"><input type="number" min="0" value={loan.price} onChange={e => setLoan({...loan,price:e.target.value})}/></Field><Field label="Down payment (₹)"><input type="number" min="0" value={loan.down} onChange={e => setLoan({...loan,down:e.target.value})}/></Field><Field label="Annual interest rate (%)"><input type="number" min="0" step=".1" value={loan.rate} onChange={e => setLoan({...loan,rate:e.target.value})}/></Field><Field label="Loan tenure"><select value={loan.years} onChange={e => setLoan({...loan,years:e.target.value})}>{[1,2,3,4,5,6,7].map(x=><option key={x} value={x}>{x} year(s)</option>)}</select></Field></div></div><div className="finance-result"><div className="eyebrow light-eyebrow">ESTIMATED MONTHLY EMI</div><div className="emi-amount">{money(emi)}</div><div className="finance-sub">{loan.years} years · {loan.rate}% annual interest</div><div className="repayment-bar"><div style={{width:`${Math.max(0,Math.min(100,principal/(principal+interest||1)*100))}%`}}/></div><div className="finance-breakdown"><div><span>Loan principal</span><b>{money(principal)}</b></div><div><span>Total interest</span><b>{money(interest)}</b></div><div><span>Total repayment</span><b>{money(principal+interest)}</b></div><div><span>Down payment</span><b>{money(Number(loan.down))}</b></div></div><div className="valuation-disclaimer">Illustrative calculation only. Actual lender EMI may include fees, insurance and other charges.</div></div></div></>; }
export default App;
