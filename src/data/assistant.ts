import { CARS, FUELS, emiOf, lakh, rng, fuelsOf, effUnit, type Car } from "./catalog";
import { ISSUES } from "./mechanic";

export type Msg = { role: "user" | "assistant"; text: string; sources?: { title: string; url: string }[]; via?: string };

const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
export function findCars(q: string): Car[] {
  const n = " " + norm(q).replace(/[^a-z0-9+ -]/g, " ") + " ";
  const hits = CARS.filter(c => n.includes(" " + norm(c.model).replace(/[^a-z0-9+ -]/g, "") + " ") || n.includes(" " + norm(c.brand + " " + c.model) + " "));
  return hits.filter(a => !hits.some(b => b !== a && norm(b.model).includes(norm(a.model)) && norm(b.model).length > norm(a.model).length && n.includes(" " + norm(b.model) + " "))).slice(0, 3);
}
export function carFacts(c: Car) {
  return `${c.brand} ${c.model} (${c.body}, ${c.seats} seats): ex-showroom ${rng(c)} (indicative). Fuels: ${fuelsOf(c).join(", ")}. Trims: ` + c.vars.map(v => `${v.name} [${v.e.name}, ${v.tx}, ${v.e.ps} PS, ${v.e.nm} Nm, ${v.e.eff} ${effUnit(v.e)}, approx ${lakh(v.price)}]`).join("; ") + `. Boot ${c.boot || "n/a"} L, ground clearance ${c.gc || "n/a"} mm, length ${c.len} mm.`;
}
export const SYSTEM = "You are Veyra AI Pilot, a friendly expert on cars in India: buying, specs, engines, fuel types, resale value, car loans and EMI, insurance, ownership costs, maintenance and DIY roadside fixes. Answer clearly in simple language with short paragraphs or numbered steps. Use ₹ and Indian context (lakh, crore, RTO, FASTag). Prices change, so say they are approximate and to check with the dealer. For safety-critical repairs (brakes, airbags, high-voltage EV parts, fuel system) tell the user to see a professional. If you are unsure, say so. Stay on topic: cars, finance for cars and mechanics.";

function money(q: string) { const m = norm(q).match(/(\d+(?:\.\d+)?)\s*(lakh|lakhs|lac|lacs|l|crore|crores|cr|k)\b/); if (!m) return null; const v = +m[1], u = m[2]; return u.startsWith("c") ? v * 1e7 : u === "k" ? v * 1e3 : v * 1e5; }
const KB: [RegExp, string][] = [
  [/petrol.*diesel|diesel.*petrol|which fuel|cng.*petrol|fuel type/, "Petrol: cheaper car, smooth and quiet, best for under about 1,000 km a month. Diesel: costlier car but better mileage and torque, best for 1,500+ km a month or highway use. CNG: lowest running cost (about ₹3 to ₹4/km) but less boot space and fewer pumps. Hybrid: great mileage in the city with no charging. EV: lowest running cost (about ₹1 to ₹1.5/km at home) if you can charge at home. Choose by your monthly km and where you can refuel or charge."],
  [/hybrid/, "Mild hybrid: a small battery assists the engine slightly, with a small mileage gain. Strong hybrid (Toyota Hyryder, Grand Vitara, Honda City e:HEV): can drive on the motor alone at low speed, and gives about 25 to 28 km/l with no plugging in. Plug-in hybrid: bigger battery you charge. Strong hybrids pay off most in stop-and-go city driving."],
  [/\bev\b|electric (car|vehicle)|charging|range anxiety|battery warranty/, "EVs cost about ₹1 to ₹1.5 per km at home charging and need little servicing. Real-world range is about 70 to 80% of the claimed figure. Charge between 20 and 80% daily and use fast charging sparingly. Most brands give an 8-year or 1.6 lakh km battery warranty. An EV suits you best if you have a parking spot with a charging point."],
  [/mileage|fuel efficiency|improve.*mileage|better mileage/, "To improve mileage: keep tyre pressure right, drive smoothly, avoid hard acceleration and braking, keep within 60-80 km/h on highways, remove roof load, service on time, switch off at long signals, and use the AC wisely. Real-world mileage is usually about 80% of the claimed ARAI figure."],
  [/engine oil|oil change|oil interval/, "Change engine oil as per your manual, usually every 10,000 km or 1 year for petrol cars with synthetic oil (5,000-7,500 km for older engines and heavy city use), and every 10,000-15,000 km for most diesels. Always use the recommended grade."],
  [/service (interval|schedule|cost)|how often.*service|free service/, "Most cars need a service every 10,000 km or 12 months (some 15,000 km). Periodic servicing in India typically costs ₹3,000-₹8,000 for hatchbacks and compact SUVs, more for diesel and premium brands. Keep the service record, it helps resale."],
  [/tyre pressure|tire pressure|psi/, "Use the pressure on the door placard or fuel flap, not the number on the tyre. Check monthly when tyres are cold. Typical values are 30-36 psi, and more with a full load. Low pressure hurts mileage and grip."],
  [/car loan|loan tip|down payment|tenure|foreclos|processing fee|cibil|credit score/, "Car loan tips: pay 20-25% down, keep the tenure at 3-5 years, compare rates across banks (new car loans are usually about 8.5-11% a year, used cars higher), keep a CIBIL score above 750 for the best rates, and check processing fees and foreclosure charges. A shorter tenure means a higher EMI but far less interest. Keep the EMI under about 15% of your monthly income."],
  [/emi formula|how.*emi.*calculated/, "EMI = P × r × (1+r)^n ÷ ((1+r)^n − 1), where P is the loan amount, r is the monthly interest rate (annual rate ÷ 12 ÷ 100) and n is the number of months. Try the Financial planner tab."],
  [/zero dep|zero-dep|ncb|no claim|idv|insurance|third.party|comprehensive/, "Third-party insurance is mandatory by law and covers damage to others. Comprehensive adds own-damage cover, based on your car's IDV (insured declared value). Zero-depreciation pays full part costs at claim time and is worth it for cars under 5 years. No-claim bonus (NCB) gives 20-50% discount on own-damage premium for claim-free years. Compare insurers each year and check cashless garages."],
  [/ncap|safety rating|crash test|airbag|esc|abs/, "NCAP crash tests (Global NCAP and Bharat NCAP) rate adult and child occupant protection out of 5 stars. Look for 6 airbags, ESC (electronic stability control), ABS with EBD, ISOFIX child seat anchors and a 4 or 5 star rating. Ratings apply to the tested variant."],
  [/adas|lane keep|adaptive cruise|autonomous/, "ADAS (Advanced Driver Assistance Systems) include adaptive cruise control, lane keep assist, forward collision warning and auto emergency braking. They work best on highways with clear lane markings and are an aid, not a replacement for driver attention."],
  [/turbo|naturally aspirated|dct|cvt|amt|torque converter|imt|gearbox|transmission/, "Turbo engines give more power from a small engine, with strong mid-range pull. Gearboxes: AMT (cheap, can feel jerky), CVT (smooth, good mileage), torque-converter AT (smooth and reliable), DCT (quick shifts, sporty, more complex in heavy traffic), iMT (manual without a clutch pedal). In city traffic CVT or torque-converter AT feels the best."],
  [/depreciation|resale|used car|second hand|sell my car/, "Cars lose about 15-20% in year one and 8-12% a year afterwards. Toyota, Maruti and Hyundai usually hold value best. Resale improves with low kilometres, full service history, one owner, no accidents and good condition. Use the Resale value tab for an estimate."],
  [/buy.*used|used car checklist|inspect.*used|second hand.*check/, "Used car checklist: check RC, insurance and service history, verify odometer and chassis number, look for accident repairs (panel gaps, paint mismatch), test drive for noises and clutch or gearbox feel, check tyres, AC and electricals, run a loan or hypothecation check and get a mechanic inspection."],
  [/road tax|registration|rto|on.?road price|on road/, "On-road price = ex-showroom price + RTO/road tax (varies by state, about 8-20%) + insurance + other charges (FASTag, handling, extended warranty). Electric cars often have lower or no road tax in many states."],
  [/clutch/, "Look after the clutch: do not rest your foot on it, use neutral at long stops, do not ride the clutch on slopes and shift smoothly. A slipping clutch or a very high bite point means it may need replacement."],
  [/e20|ethanol|petrol quality/, "E20 petrol (20% ethanol) is now widely sold in India. Modern cars are designed for it, though mileage may drop 1-3%. Older cars may need compatible rubber parts. Check your manual for E20 compatibility."],
  [/warranty|extended warranty/, "Most new cars come with 3 years/1 lakh km (some 2 years or unlimited km) standard warranty. EV batteries typically get 8 years. Extended warranty can help for premium or complex cars, but read the terms."],
  [/alignment|balancing|steering.*(shake|vibrat)|pulls to/, "A steering wheel that shakes usually means wheel balancing, and a car that pulls to one side usually needs wheel alignment or a tyre pressure check. Get both done every 10,000 km or after hitting a pothole."],
  [/warm up|warm-up|idle/, "Modern fuel-injected cars need only 20 to 30 seconds of idling. Drive gently for the first few minutes, since the engine warms up faster while driving."],
  [/coolant|brake fluid interval|fluid change/, "Coolant: top up as needed and replace every 2-4 years. Brake fluid: replace every 2-3 years because it absorbs moisture. Always use the type your manual specifies."],
  [/break.?in|new car.*first/, "For a new car, avoid hard acceleration and sustained very high revs for the first 1,000 km, vary your speed, and do the first free service on time."]
];
export function localAnswer(q: string): string {
  const n = norm(q);
  const cars = findCars(q);
  const budget = money(q);
  const fuelWord = FUELS.find(f => n.includes(f.toLowerCase())) || (n.includes("ev") && !n.includes("every") ? "Electric" : "");
  const bodyWord = ["suv", "sedan", "hatchback", "mpv", "pickup"].find(b => n.includes(b));
  if (/under|below|within|upto|up to|budget|less than|best car/.test(n) && budget && cars.length === 0 && budget >= 3e5) {
    const list = CARS.filter(c => c.min <= budget && (!fuelWord || fuelsOf(c).includes(fuelWord)) && (!bodyWord || c.body.toLowerCase() === bodyWord)).sort((a, b) => b.min - a.min).slice(0, 10);
    if (list.length) return `Cars starting at or below ${lakh(budget)} ex-showroom${fuelWord ? " (" + fuelWord + ")" : ""}${bodyWord ? " (" + bodyWord.toUpperCase() + ")" : ""}:\n` + list.map(c => `• ${c.brand} ${c.model}: ${rng(c)} · ${fuelsOf(c).join("/")}`).join("\n") + "\nOpen Discover cars to see every trim and its features. Prices are indicative.";
  }
  if (cars.length >= 2 && /vs|versus|compare|or |better|difference/.test(n)) {
    return cars.slice(0, 2).map(c => { const t = [...c.vars].sort((a, b) => b.e.ps - a.e.ps)[0]; return `${c.brand} ${c.model}: ${rng(c)}, ${c.body}, ${c.seats} seats, fuels ${fuelsOf(c).join("/")}, top engine ${t.e.name} ${t.e.ps} PS/${t.e.nm} Nm, boot ${c.boot || "n/a"} L, ${c.ncap ? c.ncap + "-star NCAP" : "NCAP n/a"}, ${c.airStd} airbags standard.`; }).join("\n\n") + "\n\nOpen Compare cars for a full side-by-side comparison.";
  }
  if (cars.length === 1) {
    const c = cars[0];
    if (/emi|loan/.test(n)) { return `${c.brand} ${c.model} starts around ${lakh(c.min)} ex-showroom. For a ${lakh(c.min * 1.13)} on-road price with 20% down, 9.5% for 5 years, the EMI is about ₹${Math.round(emiOf(c.min * 1.13 * .8, 9.5, 5)).toLocaleString("en-IN")} a month.`; }
    return carFacts(c) + "\nOpen Discover cars for photos and the complete variant list.";
  }
  const issue = ISSUES.map(i => ({ i, s: new Set(norm(i.title + " " + i.tags).split(/\s+/).filter(w => w.length > 3 && n.includes(w))).size })).sort((a, b) => b.s - a.s)[0];
  if (/^(hi|hello|hey|namaste|good (morning|evening))\b/.test(n)) return "Hello! I can help with car models and specs, budgets, EMI and loans, insurance, running costs, resale value and DIY fixes. What would you like to know?";
  if (issue && issue.s >= 3) return `${issue.i.title} (${issue.i.time}, ${issue.i.level}). Safety: ${issue.i.warn}\n` + issue.i.steps.map((s, k) => `${k + 1}. ${s.t}: ${s.d}`).join("\n") + `\nCall for help if: ${issue.i.help}`;
  if (/emi|loan/.test(n) && budget) { const r = n.match(/(\d+(?:\.\d+)?)\s*%/), y = n.match(/(\d+)\s*(?:year|yr)/); const rate = r ? +r[1] : 9.5, yrs = y ? +y[1] : 5, e = emiOf(budget, rate, yrs); return `A loan of ${lakh(budget)} at ${rate}% for ${yrs} years has an EMI of about ₹${Math.round(e).toLocaleString("en-IN")} a month. Total interest is about ₹${Math.round(e * yrs * 12 - budget).toLocaleString("en-IN")} and total repayment about ₹${Math.round(e * yrs * 12).toLocaleString("en-IN")}.`; }
  const kb = KB.find(([re]) => re.test(n)); if (kb) return kb[1];
  if (issue && issue.s >= 2) return `${issue.i.title} (${issue.i.time}, ${issue.i.level}). Safety: ${issue.i.warn}\n` + issue.i.steps.map((s, k) => `${k + 1}. ${s.t}: ${s.d}`).join("\n") + `\nCall for help if: ${issue.i.help}`;
  if (issue && issue.s >= 1) return `The closest guide is "${issue.i.title}". Open the Mechanic tab for the full step-by-step diagrams. Safety: ${issue.i.warn}`;
  return "";
}
