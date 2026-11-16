import type { Car, PT } from "./data/catalog";
export type Tree = { l: number[]; r: number[]; f: number[]; t: number[]; v: number[] };
export type MLModel = { meta: { source: string; rows: number; real: boolean; r2_holdout: number; r2_cv5: number; mae_retention: number; resid_lo: number; resid_hi: number; importances: Record<string, number>; algorithm: string; target: string; r2_price_cv5?: number; mae_lakh_cv5?: number; fuels?: string[] }; features: string[]; base: number; lr: number; trees: Tree[] };
export const DEP: Record<string, number> = { Toyota: .07, "Maruti Suzuki": .08, Mahindra: .08, Honda: .085, Hyundai: .09, Kia: .09, Tata: .1, Skoda: .11, Volkswagen: .11, MG: .12, Renault: .12, Nissan: .12, Jeep: .12, Citroen: .13, BYD: .14 };
let cache: Promise<MLModel | null> | null = null;
export function loadModel(): Promise<MLModel | null> {
  return cache || (cache = fetch(new URL("ml/resale-model.json", document.baseURI).href).then(r => r.ok ? r.json() : null).catch(() => null));
}
export type Inp = { c: Car; v: PT; year: number; km: number; owners: number };
export function vec({ c, v, year, km, owners }: Inp, ageOff = 0, kmOff = 0, ownOff = 0): number[] {
  const age = Math.max(0, new Date().getFullYear() - year) + ageOff, k = km + kmOff, f = v.e.fuel;
  return [age, k / 1000, k / Math.max(age, 1) / 1000, Math.log10(Math.max(v.price, 1e4)), +(f === "Diesel"), +(f === "CNG"), +(f === "Electric"), +(f === "Hybrid"), +(v.tx === "Automatic" && !v.e.ev), Math.min(4, owners + ownOff), DEP[c.brand] ?? .12, +(v.price > 3e6)];
}
export function ratio(m: MLModel, x: number[]) {
  let s = m.base; for (const t of m.trees) { let i = 0; while (t.f[i] >= 0) i = x[t.f[i]] <= t.t[i] ? t.l[i] : t.r[i]; s += m.lr * t.v[i]; } return Math.max(.03, s);
}
export function predict(m: MLModel, i: Inp, ageOff = 0, kmOff = 0, ownOff = 0) { return i.v.price * ratio(m, vec(i, ageOff, kmOff, ownOff)); }
export function whatIf(m: MLModel, i: Inp) {
  const base = predict(m, i); const sc: [string, number][] = [["10,000 km more driven", predict(m, i, 0, 10000)], ["10,000 km less driven", predict(m, i, 0, Math.max(-i.km, -10000))], ["One year older", predict(m, i, 1)], ["One more owner", predict(m, i, 0, 0, 1)]];
  return sc.map(([k, p]) => [k, p - base] as [string, number]);
}
