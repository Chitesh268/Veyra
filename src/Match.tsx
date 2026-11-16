import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, GitCompareArrows, Sparkles } from "lucide-react";
import { CARS, lakh, onRoad, runCosts, svcBase, type Car, type PT } from "./data/catalog";
import { trimTier } from "./data/features";
import { DEP } from "./ml";
import { CarPhoto, Chip, PageHead } from "./ui";

type A = { budget: [number, number]; use: string; people: string; km: number; fuel: string; tx: string; body: string; pri: string[] };
const Q: { id: keyof A; t: string; multi?: boolean; o: [string, string, any][] }[] = [
  { id: "budget", t: "What is your on-road budget?", o: [["Under ₹8 lakh", "Entry hatchbacks and small SUVs", [0, 8]], ["₹8-12 lakh", "Compact cars and SUVs", [8, 12]], ["₹12-18 lakh", "Mid-size SUVs, sedans", [12, 18]], ["₹18-25 lakh", "Premium SUVs and MPVs", [18, 25]], ["₹25-40 lakh", "Top-end SUVs, EVs", [25, 40]], ["₹40 lakh - 1 crore", "Luxury", [40, 100]], ["₹1 - 2 crore", "Premium luxury", [100, 200]]] },
  { id: "use", t: "Where will you drive most?", o: [["City commute", "Traffic, short trips", "city"], ["Mixed", "City and some highway", "mixed"], ["Highway and long trips", "Frequent outstation", "highway"], ["Rough roads and off-road", "Ground clearance matters", "offroad"]] },
  { id: "people", t: "Who usually rides with you?", o: [["Mostly me or a partner", "1-2 people", "solo"], ["Small family", "Up to 5 people", "family"], ["Large family or group", "6-7 seats needed", "big"]] },
  { id: "km", t: "How far do you drive each month?", o: [["Under 500 km", "Occasional use", 400], ["500-1,500 km", "Regular commute", 1000], ["1,500-3,000 km", "Heavy use", 2200], ["Over 3,000 km", "Very heavy use", 3500]] },
  { id: "fuel", t: "Any fuel preference?", o: [["No preference", "Show everything", "Any"], ["Petrol", "", "Petrol"], ["Diesel", "", "Diesel"], ["CNG", "Lowest running cost", "CNG"], ["Hybrid", "No charging needed", "Hybrid"], ["Electric", "Home charging", "Electric"]] },
  { id: "tx", t: "Gearbox?", o: [["No preference", "", "Any"], ["Manual", "", "Manual"], ["Automatic", "Easier in traffic", "Automatic"]] },
  { id: "body", t: "Body type?", o: [["Open to anything", "", "Any"], ["Hatchback", "", "Hatchback"], ["Sedan", "", "Sedan"], ["SUV", "", "SUV"], ["MPV / people mover", "", "MPV"]] },
  { id: "pri", t: "What matters most? Pick up to 3", multi: true, o: [["Safety", "Crash rating and airbags", "safety"], ["Low running cost", "Mileage and fuel savings", "econ"], ["Performance", "Power and pull", "perf"], ["Space and comfort", "Seats, boot, wheelbase", "space"], ["Features and tech", "Sunroof, ADAS, screens", "tech"], ["Low maintenance", "Cheaper servicing", "maint"], ["Resale and reliability", "Holds value", "resale"], ["Ground clearance", "Bad roads", "clear"]] }
];
const cl = (x: number) => Math.max(0, Math.min(1, x));
function rate(a: A, c: Car, v: PT) {
  const on = onRoad(v.price, v.e.ev), tier = trimTier(c, v), rc = runCosts(c, v, a.km).total / a.km, f = c.f;
  const compact = cl(1 - (c.len - 3700) / 1000), four = /4x4|awd|4wd/i.test(v.name);
  const x: Record<string, number> = {
    price: cl(1 - Math.abs(on / (a.budget[1] * 1e5) - .85) * 1.3), safety: cl((c.ncap ? c.ncap / 5 : .55) + (c.airStd >= 6 ? .15 : 0) + (f.adas ? .1 * tier : 0)), econ: cl(1 - (rc - 2.5) / 9),
    perf: cl(.6 * (v.e.ps - 70) / 180 + .4 * (v.e.nm - 100) / 400), space: cl(.3 * (c.seats - 4) / 3 + .3 * c.boot / 500 + .4 * (c.wb - 2400) / 500),
    tech: cl((.6 * ([f.sunroof > 0, f.adas, f.cam360, f.vent, f.wireless, f.cruise].filter(Boolean).length / 6) + .4 * c.screen / 12) * (.4 + .6 * tier)), maint: cl(1 - (svcBase(c.brand) - 5000) / 60000 + (v.e.ev ? .1 : 0)),
    resale: cl(1 - ((DEP[c.brand] ?? .13) - .07) / .08), clear: cl((c.gc - 160) / 70 + (four ? .2 : 0)), compact
  };
  const w: Record<string, number> = { price: .8, safety: .8, econ: .6, perf: .35, space: .4, tech: .35, maint: .25, resale: .25, clear: .15, compact: 0 };
  a.pri.forEach(p => { w[p] += 1.1; });
  if (a.use === "city") { w.compact += .4; w.econ += .2; } if (a.use === "highway") { w.perf += .4; w.safety += .3; w.tech += .2; } if (a.use === "offroad") { w.clear += 1.2; w.perf += .2; }
  if (a.km >= 2200) w.econ *= 1.6; if (a.people === "big") w.space += .5;
  let tot = 0, ws = 0; const parts: [string, number][] = []; for (const k in w) { tot += w[k] * x[k]; ws += w[k]; parts.push([k, w[k] * x[k]]); }
  const text: Record<string, string> = { safety: `${c.ncap ? c.ncap + "-star crash rating, " : ""}${c.airStd} airbags as standard`, econ: `Runs at about ₹${rc.toFixed(1)} per km (fuel, service, tyres)`, perf: `${v.e.ps} PS and ${v.e.nm} Nm`, space: `${c.seats} seats${c.boot ? ", " + c.boot + " L boot" : ""}, ${c.wb} mm wheelbase`, tech: `Top variant offers ${[f.sunroof > 0 && "sunroof", f.adas && "ADAS", f.cam360 && "360° camera", f.vent && "ventilated seats", f.wireless && "wireless charging"].filter(Boolean).slice(0, 3).join(", ") || "a good touchscreen"}`, maint: `${c.brand} servicing is relatively affordable`, resale: `${c.brand} holds resale value well`, clear: `${c.gc ? c.gc + " mm" : "good"} ground clearance${four ? " and 4x4" : ""}`, price: `${v.name} at about ${lakh(on)} on-road sits well inside your budget`, compact: "Compact size for city traffic" };
  const why = parts.sort((p, q) => q[1] - p[1]).filter(p => x[p[0]] > .4).slice(0, 3).map(p => text[p[0]]);
  return { s: tot / ws, why, on };
}
export default function Match({ open, compare }: { open: (c: Car) => void; compare: (c: Car) => void }) {
  const [step, setStep] = useState(0); const [a, setA] = useState<Partial<A>>({ pri: [] }); const done = step >= Q.length;
  const res = useMemo(() => {
    if (!done) return []; const A = a as A, need = A.people === "big" ? 6 : A.people === "family" ? 5 : 2; const out: { c: Car; v: PT; s: number; why: string[]; on: number }[] = [];
    CARS.forEach(c => { if (c.seats < need || (A.body !== "Any" && c.body !== A.body) || (A.use === "offroad" && c.gc && c.gc < 180 && !/4x4|awd/i.test(c.vars.map(v => v.name).join(" ")))) return; let best: typeof out[number] | null = null;
      c.vars.forEach(v => { const on = onRoad(v.price, v.e.ev); if (on < A.budget[0] * 1e5 || on > A.budget[1] * 1e5 || (A.fuel !== "Any" && v.e.fuel !== A.fuel) || (A.tx !== "Any" && v.tx !== A.tx)) return; const r = rate(A, c, v); if (!best || r.s > best.s) best = { c, v, ...r }; }); if (best) out.push(best); });
    return out.sort((p, q) => q.s - p.s).slice(0, 6);
  }, [done, a]);
  const pick = (id: keyof A, val: any) => { setA({ ...a, [id]: val }); setStep(step + 1); };
  if (done) return <><PageHead eyebrow="CAR MATCH" title="Your best matches." desc="Ranked by how well each car fits your answers. The match is a relative fit, not a guarantee." action={<button className="btn btn-outline" onClick={() => { setStep(0); setA({ pri: [] }); }}>Retake quiz</button>} />
    {res.length === 0 ? <div className="empty-state"><Sparkles size={24} /><h3>No cars fit all your answers.</h3><p>Try a higher budget, or relax fuel, gearbox or body type.</p><button className="btn btn-primary" onClick={() => setStep(Q.length - 1)}><ArrowLeft size={14} /> Go back</button></div> :
      <div className="match-list">{res.map((r, i) => <div className="match-card" key={r.c.id}><div className="match-photo"><CarPhoto c={r.c} /><span className="match-rank">#{i + 1}</span></div><div className="match-body"><div className="match-top"><div><div className="vehicle-make">{r.c.brand.toUpperCase()}</div><h3>{r.c.model}</h3><p className="muted">{r.v.name} · {r.v.e.fuel} · {r.v.tx} · about {lakh(r.on)} on-road</p></div><div className="match-ring" style={{ ["--p" as any]: Math.round(30 + 70 * r.s) }}><b>{Math.round(30 + 70 * r.s)}%</b><span>match</span></div></div>
        <ul className="why">{r.why.map(w => <li key={w}>{w}</li>)}</ul><div className="vehicle-actions"><button className="text-action" onClick={() => open(r.c)}>All variants & details <ArrowRight size={14} /></button><button className="text-action" onClick={() => compare(r.c)}><GitCompareArrows size={14} /> Compare</button></div></div></div>)}</div>}</>;
  const q = Q[step], sel: string[] = (a.pri as string[]) || [];
  return <><PageHead eyebrow="CAR MATCH" title="Find the car that fits you." desc="Answer 8 quick questions and get a ranked shortlist with reasons." />
    <div className="quiz"><div className="quiz-bar"><i style={{ width: (step / Q.length) * 100 + "%" }} /></div><div className="quiz-step">Question {step + 1} of {Q.length}</div><h2 className="quiz-q">{q.t}</h2>
      <div className="quiz-opts">{q.o.map(([l, d, val]) => { const on = q.multi && sel.includes(val); return <button key={l} className={`quiz-opt ${on ? "on" : ""}`} onClick={() => q.multi ? setA({ ...a, pri: on ? sel.filter(s => s !== val) : sel.length < 3 ? [...sel, val] : sel }) : pick(q.id, val)}><b>{l}</b>{d && <span>{d}</span>}</button>; })}</div>
      <div className="quiz-nav">{step > 0 && <button className="btn btn-outline" onClick={() => setStep(step - 1)}><ArrowLeft size={14} /> Back</button>}{q.multi && <button className="btn btn-primary" onClick={() => setStep(step + 1)}>See my matches <ArrowRight size={14} /></button>}</div>{q.multi && <Chip on={false} onClick={() => setA({ ...a, pri: [] })}>Clear choices</Chip>}</div></>;
}
