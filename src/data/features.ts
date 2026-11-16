import type { Car, PT } from "./catalog";
// Variant features are ESTIMATED from the variant's position in the model's trim ladder plus the model's top-variant flags
// (sunroof, ADAS, 360 camera, ventilated seats, wireless charger, cruise). Always confirm with the brochure or dealer.
const STRIP = new Set(["at", "mt", "amt", "cvt", "dct", "ivt", "dsg", "imt", "diesel", "petrol", "cng", "s-cng", "turbo", "hybrid", "ehev", "tgdi", "4x4", "4x2", "rwd", "awd", "4wd", "7s", "8s", "5s", "6s", "lr", "mr", "45", "55", "65", "75", "1.0", "1.2", "dca", "ps"]);
export const baseTrim = (n: string) => n.split(" ").filter(w => !STRIP.has(w.toLowerCase())).join(" ") || n;
export function trimTier(c: Car, v: PT) { const b = [...new Set(c.vars.map(x => baseTrim(x.name)))]; return b.length > 1 ? b.indexOf(baseTrim(v.name)) / (b.length - 1) : 1; }
export type Item = { k: string; v: string | boolean };
export type Group = { cat: string; items: Item[] };
const SUN = ["No", "Single-pane sunroof", "Panoramic sunroof"];
export function features(c: Car, v: PT): Group[] {
  const t0 = trimTier(c, v), lux = c.min > 3e6, t = lux ? .6 + .4 * t0 : t0, hatch = c.body === "Hatchback", cheap = c.min < 7e5, auto = v.tx === "Automatic";
  const air = t < .3 ? c.airStd : t < .65 ? Math.round((c.airStd + c.airMax) / 2 / 2) * 2 : c.airMax;
  const lo = hatch ? 14 : c.body === "Sedan" ? 15 : 16, hi = lux ? 19 : hatch ? 16 : c.body === "Sedan" ? 17 : 18, inch = lo + Math.round((hi - lo) * Math.min(1, t * 1.1));
  const scr = !c.screen || t < .2 ? 0 : t < .5 ? Math.min(7, c.screen) : t < .75 ? (c.screen >= 10 ? 8 : c.screen) : c.screen;
  const spk = lux ? 12 : t < .2 ? 2 : t < .5 ? 4 : t < .8 ? 6 : c.min > 1.2e6 ? 8 : 6;
  const sr = c.f.sunroof > 0 && t >= (c.f.sunroof === 2 ? .88 : .7) ? c.f.sunroof : 0;
  return [
    { cat: "Safety", items: [{ k: "Airbags", v: String(air) }, { k: "ABS with EBD", v: true }, { k: "Electronic stability control (ESC)", v: c.ncap >= 4 || c.airStd >= 6 || t >= .3 }, { k: "ISOFIX child-seat anchors", v: true }, { k: "Seat-belt reminder", v: true }, { k: "Rear parking sensors", v: t >= .15 }, { k: "Rear camera", v: t >= .45 || (c.f.cam360 && t >= .85) }, { k: "360-degree camera", v: c.f.cam360 && t >= .85 }, { k: "Tyre pressure monitoring (TPMS)", v: t >= .5 }, { k: "Hill-hold assist", v: t >= .4 || auto }, { k: "ADAS (driver assistance)", v: c.f.adas && t >= .85 }] },
    { cat: "Comfort and convenience", items: [{ k: "Air conditioning", v: cheap && hatch ? "Manual" : t < .4 ? "Manual" : "Automatic climate control" }, { k: "Rear AC vents", v: (t >= .35 && !hatch) || t >= .6 }, { k: "Cruise control", v: c.f.cruise && t >= .6 }, { k: "Keyless entry", v: t >= .3 }, { k: "Push-button start", v: t >= .45 }, { k: "Steering adjustment", v: t >= .4 ? "Tilt and telescopic" : "Tilt" }, { k: "Power windows", v: t < .2 ? "Front only" : "All four" }, { k: "Electric adjust and folding mirrors", v: t >= .45 }, { k: "Sunroof", v: SUN[sr] }, { k: "Ventilated front seats", v: c.f.vent && t >= .9 }, { k: "Wireless phone charging", v: c.f.wireless && t >= .8 }, { k: "Auto headlamps and rain-sensing wipers", v: t >= .55 }, { k: "Electric parking brake", v: lux || (c.min > 1.5e6 && t >= .8) }] },
    { cat: "Exterior", items: [{ k: "Wheels", v: t < .25 ? "Steel wheels with covers" : `${inch}-inch alloy wheels` }, { k: "LED headlamps", v: t >= .45 }, { k: "LED daytime running lamps", v: t >= .3 }, { k: "LED tail lamps", v: t >= .5 }, { k: "Fog lamps", v: t >= .35 }, { k: "Roof rails", v: c.body !== "Sedan" && !hatch && t >= .45 }, { k: "Shark-fin antenna", v: t >= .4 }, { k: "Rear spoiler", v: (hatch || c.body === "Sedan") && t >= .5 }] },
    { cat: "Interior", items: [{ k: "Seat upholstery", v: lux ? "Leather" : t < .55 ? "Fabric" : "Leatherette" }, { k: "Leather-wrapped steering wheel", v: t >= .35 }, { k: "Instrument cluster", v: t >= .85 && c.screen >= 10 ? "Full digital" : t >= .3 ? "Analogue with colour display" : "Analogue" }, { k: "Ambient lighting", v: t >= .7 }, { k: "Rear armrest with cup holders", v: t >= .4 && c.seats <= 5 }, { k: "60:40 split rear seat", v: t >= .35 && c.boot > 0 }] },
    { cat: "Infotainment and connectivity", items: [{ k: "Touchscreen", v: scr ? `${scr}-inch` : "No" }, { k: "Android Auto and Apple CarPlay", v: t >= .3 ? (t >= .7 ? "Wireless" : "Wired") : "No" }, { k: "Speakers", v: String(spk) }, { k: "Bluetooth and USB", v: t >= .15 }, { k: "Connected car technology", v: t >= .6 }, { k: "Built-in navigation", v: t >= .65 }] }
  ];
}
export function highlights(c: Car, v: PT): string[] {
  const g = features(c, v).flatMap(x => x.items), has = (k: string) => { const i = g.find(x => x.k === k); return !!i && i.v !== false && i.v !== "No"; }; const out: string[] = [];
  if (has("ADAS (driver assistance)")) out.push("ADAS"); const sun = g.find(x => x.k === "Sunroof"); if (sun && sun.v !== "No") out.push(String(sun.v).replace(" sunroof", " sunroof"));
  if (has("360-degree camera")) out.push("360° camera"); if (has("Ventilated front seats")) out.push("Ventilated seats"); if (has("Wireless phone charging")) out.push("Wireless charger"); if (has("Cruise control")) out.push("Cruise control");
  const ts = g.find(x => x.k === "Touchscreen"); if (ts && ts.v !== "No") out.push(`${ts.v} touchscreen`); const w = g.find(x => x.k === "Wheels"); if (w && String(w.v).includes("alloy")) out.push(String(w.v).replace("-inch alloy wheels", "\" alloys")); if (has("Automatic climate control") || g.find(x => x.k === "Air conditioning")?.v === "Automatic climate control") out.push("Auto climate");
  return out.slice(0, 4);
}
