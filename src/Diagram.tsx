import type { ReactNode } from "react";
const P: Record<string, ReactNode> = {
  car: <><path d="M10 54h100V44l-16-6-10-12H44L32 38l-22 6z" /><circle cx="34" cy="56" r="8" /><circle cx="86" cy="56" r="8" /><path d="M48 28v10M72 28v10" /></>,
  tri: <><path d="M60 12 102 66H18z" /><path d="M60 30v20" /><circle cx="60" cy="58" r="1.8" /></>,
  nuts: <><circle cx="60" cy="40" r="30" /><circle cx="60" cy="40" r="8" />{[[60, 18], [81, 33], [73, 58], [47, 58], [39, 33]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="3.6" />)}<path d="M60 18 73 58 39 33 81 33 47 58z" strokeDasharray="2 3" /></>,
  jack: <><path d="M40 58 60 42 80 58 60 64z" /><path d="M46 34h28M60 34v8M24 68h72M92 58h16M40 58 24 68M80 58l16 10" /></>,
  wheel: <><circle cx="60" cy="40" r="30" /><circle cx="60" cy="40" r="19" /><circle cx="60" cy="40" r="5" /><path d="M60 21v14M60 45v14M41 40h14M65 40h14" /></>,
  wrench: <><path d="M26 62 62 26a16 16 0 0 0 22 22L48 84z" transform="translate(0 -6)" /><circle cx="36" cy="64" r="2" /></>,
  gauge: <><circle cx="60" cy="32" r="20" /><path d="M60 32 72 22M44 38h4M72 38h4M60 14v4" /><path d="M52 52h16v16H52zM60 68v8" /></>,
  pump: <><rect x="22" y="30" width="52" height="34" rx="5" /><circle cx="48" cy="47" r="9" /><path d="M74 44q22 0 22 16" /><path d="M30 64v6M66 64v6" /></>,
  plug: <><path d="M16 62Q60 8 104 62" /><path d="M30 60Q60 26 90 60" /><path d="M56 22 62 46" /><path d="M62 46v12" strokeWidth="3" /></>,
  batt: <><rect x="22" y="30" width="76" height="36" rx="4" /><path d="M36 30v-8h12v8M72 30v-8h12v8M38 48h8M42 44v8M74 48h8" /></>,
  cable: <><path d="M22 40h76" /><path d="M14 30l16 4v12l-16 4zM106 30l-16 4v12l16 4z" /><path d="M40 40v12M80 40v12" /></>,
  engine: <><path d="M22 60V30h58l14 12v18z" /><circle cx="48" cy="44" r="9" /><path d="M66 30v-9h14v9M30 60v8M84 60v8" /></>,
  dip: <><path d="M18 66 96 22" /><path d="M72 30l7 12M62 36l7 12" /><circle cx="102" cy="18" r="6" /></>,
  drop: <><path d="M60 12C44 32 40 42 40 52a20 20 0 0 0 40 0c0-10-4-20-20-40z" /><path d="M50 54a10 10 0 0 0 10 10" /></>,
  fuse: <><rect x="34" y="20" width="52" height="38" rx="4" /><rect x="46" y="28" width="28" height="14" rx="2" /><path d="M46 58v12M74 58v12M60 28v14" /></>,
  wiper: <><path d="M12 64Q60 4 108 64z" /><path d="M26 64 86 28" strokeWidth="3" /></>,
  key: <><rect x="38" y="12" width="44" height="58" rx="16" /><circle cx="60" cy="30" r="6" /><circle cx="50" cy="52" r="4" /><circle cx="70" cy="52" r="4" /></>,
  charge: <><path d="M44 10v18M76 10v18M34 28h52v12a26 26 0 0 1-52 0z" /><path d="M60 66v12" /></>,
  therm: <><path d="M54 12h12v38a14 14 0 1 1-12 0z" /><path d="M60 24v28" strokeWidth="3" /></>,
  phone: <><rect x="40" y="8" width="40" height="64" rx="7" /><path d="M54 62h12M54 14h12" /></>,
  bulb: <><path d="M60 10a22 22 0 0 1 12 40v10H48V50A22 22 0 0 1 60 10z" /><path d="M50 66h20M53 72h14" /></>,
  mud: <><path d="M10 50h100V42l-16-5-10-11H44L32 37l-22 5z" /><circle cx="34" cy="52" r="7" /><circle cx="86" cy="52" r="7" /><path d="M6 68q10-8 20 0t20 0 20 0 20 0 20 0" /></>,
  disc: <><circle cx="60" cy="40" r="30" /><circle cx="60" cy="40" r="9" />{[[60, 22], [78, 40], [60, 58], [42, 40]].map(([x, y]) => <circle key={x + "" + y} cx={x} cy={y} r="3" />)}<path d="M84 18q10 16 0 36" strokeWidth="4" /></>,
  fuel: <><rect x="30" y="14" width="34" height="52" rx="4" /><rect x="36" y="20" width="22" height="14" /><path d="M64 28h10l12 12v22a4 4 0 0 1-8 0V46" /></>,
  water: <><path d="M10 46h100V38l-16-5-10-10H44L32 33l-22 5z" /><circle cx="34" cy="48" r="7" /><circle cx="86" cy="48" r="7" /><path d="M6 58q10-8 20 0t20 0 20 0 20 0 20 0M6 68q10-8 20 0t20 0 20 0 20 0 20 0" /></>,
  ac: <><path d="M60 10v60M34 25l52 30M34 55l52-30" /><path d="M54 14l6 6 6-6M54 66l6-6 6 6" /></>,
  filter: <><rect x="24" y="22" width="72" height="40" rx="3" /><path d="M32 22v40M42 22v40M52 22v40M62 22v40M72 22v40M82 22v40" /></>,
  warn: <><circle cx="60" cy="38" r="28" /><path d="M60 22v20" /><circle cx="60" cy="52" r="2" /></>,
  tread: <><rect x="18" y="24" width="84" height="32" rx="6" /><path d="M32 24v32M48 24v32M64 24v32M80 24v32" /><circle cx="60" cy="68" r="6" /></>
};
export default function Diagram({ k, label }: { k: string; label: string }) {
  return <svg viewBox="0 0 120 80" className="dia" role="img" aria-label={label} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">{P[k] || P.warn}</svg>;
}
