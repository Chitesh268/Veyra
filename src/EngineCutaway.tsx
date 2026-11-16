import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import type { Eng } from "./data/catalog";

const STROKES = ["Intake", "Compression", "Power", "Exhaust"], COL = ["#c9d17c", "#9aa84a", "#e08a3c", "#9a8f7e"];
export default function EngineCutaway({ e }: { e: Eng }) {
  const [rpm, setRpm] = useState(e.ev ? 50 : 2000); const [play, setPlay] = useState(!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches); const [regen, setRegen] = useState(false); const [th, setTh] = useState(0);
  const last = useRef(0); const speed = useRef(rpm); speed.current = rpm;
  useEffect(() => { setRpm(e.ev ? 50 : 2000); }, [e.id]);
  useEffect(() => {
    if (!play) return; let raf = 0; last.current = performance.now();
    const loop = (t: number) => { const dt = Math.min(.05, (t - last.current) / 1000); last.current = t; const deg = e.ev ? speed.current * 5 : speed.current / 60 * 360 / 40; setTh(a => (a + deg * dt * (regen ? -1 : 1) + 7200) % 7200); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop); return () => cancelAnimationFrame(raf);
  }, [play, e.ev, regen]);
  const turbo = /turbo/i.test(e.asp), hyb = /hybrid|electric motor|mild/i.test(e.asp) || e.fuel === "Hybrid", diesel = e.fuel === "Diesel", cng = e.fuel === "CNG";
  const live = !e.ev ? <Ice e={e} th={th} turbo={turbo} hyb={hyb} diesel={diesel} cng={cng} /> : <Ev e={e} th={th} regen={regen} rpm={rpm} />;
  const stroke = !e.ev ? Math.floor((th % 720) / 180) : -1;
  return <div className="cutaway"><div className="cut-head"><div><b>{e.ev ? "Electric drivetrain" : "Animated engine cutaway"}</b><span>{e.ev ? "Energy flow from battery to wheels" : `${e.cyl}-cylinder four-stroke${turbo ? ", turbocharged" : ""}${diesel ? ", compression ignition" : ""}`}. Shown in slow motion.</span></div>
    <button className="icon-btn" onClick={() => setPlay(!play)} aria-label={play ? "Pause animation" : "Play animation"}>{play ? <Pause size={16} /> : <Play size={16} />}</button></div>
    <div className="cut-stage">{live}</div>
    <div className="cut-ctl"><label>{e.ev ? "Throttle" : "Engine speed"}: <b>{e.ev ? Math.round(rpm) + "%" : Math.round(rpm) + " rpm"}</b><input type="range" min={e.ev ? 0 : 800} max={e.ev ? 100 : Math.round(e.psRpm * 1.1 / 100) * 100} step={e.ev ? 1 : 100} value={rpm} onChange={x => setRpm(+x.target.value)} /></label>
      {e.ev ? <button className={`chip ${regen ? "on" : ""}`} onClick={() => setRegen(!regen)}>Regenerative braking</button> : <div className="stroke-legend">{STROKES.map((s, i) => <span key={s} className={stroke === i ? "on" : ""}><i style={{ background: COL[i] }} />{s}</span>)}<small>cylinder 1</small></div>}</div></div>;
}
function Ice({ e, th, turbo, hyb, diesel, cng }: { e: Eng; th: number; turbo: boolean; hyb: boolean; diesel: boolean; cng: boolean }) {
  const n = Math.max(3, e.cyl), bw = n > 4 ? 38 : 46, gap = 12, W = 600, total = n * bw + (n - 1) * gap, x0 = (W - total) / 2 + (turbo ? -20 : 0), cy = 262, r = 17, L = 74;
  const cyls = Array.from({ length: n }, (_, i) => {
    const cx = x0 + i * (bw + gap) + bw / 2, t = (th + i * 720 / n) % 720, a = (t % 360) * Math.PI / 180, py = cy - r * Math.cos(a) - Math.sqrt(L * L - r * r * Math.sin(a) ** 2), s = Math.floor(t / 180);
    const px = cx + r * Math.sin(a), pyc = cy - r * Math.cos(a), spark = t > 352 && t < 378, intake = t < 190, exh = t > 530;
    return <g key={i}><rect x={cx - bw / 2} y="108" width={bw} height="96" fill="#faf5e8" stroke="#52392a" strokeWidth="2" rx="3" />
      <rect x={cx - bw / 2 + 2} y="116" width={bw - 4} height={Math.max(0, py - 12 - 116)} fill={COL[s]} opacity={s === 2 ? Math.max(.35, 1 - (t - 360) / 220) : .55} />
      <rect x={cx - bw / 2 - 2} y="92" width={bw + 4} height="18" fill="#52392a" rx="3" />
      <rect x={cx - bw / 2 + 5} y={intake ? 100 : 94} width="3" height="22" fill="#68702f" /><rect x={cx + bw / 2 - 8} y={exh ? 100 : 94} width="3" height="22" fill="#7a4f2a" />
      {diesel ? <rect x={cx - 2} y="96" width="4" height="20" fill="#3a2a1d" /> : <path d={`M${cx} 90V112`} stroke="#3a2a1d" strokeWidth="3" />}
      {(spark || (diesel && t > 352 && t < 372)) && <circle cx={cx} cy="116" r="8" fill="#f5c542" opacity=".9" />}
      <rect x={cx - bw / 2 + 3} y={py - 11} width={bw - 6} height="20" rx="3" fill="#68702f" stroke="#3a2a1d" /><line x1={cx} y1={py} x2={px} y2={pyc} stroke="#3a2a1d" strokeWidth="5" strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={px} y2={pyc} stroke="#7a4f2a" strokeWidth="7" strokeLinecap="round" /><circle cx={px} cy={pyc} r="6" fill="#52392a" /><circle cx={cx} cy={cy} r="7" fill="#3a2a1d" /></g>;
  });
  const ex = x0 + total + 34, tb = turbo ? (th * 3) % 360 : 0;
  return <svg viewBox="0 0 600 310" className="cut-svg" role="img" aria-label="Animated engine cutaway"><rect x={x0 - 14} y="84" width={total + 28} height="150" rx="10" fill="#e6dbc2" stroke="#d8cbac" /><rect x={x0 - 14} y="226" width={total + 28} height="68" rx="10" fill="#d9ccae" />{cyls}
    <path d={`M${x0 + 6} 232H${x0 + total - 6}`} stroke="#3a2a1d" strokeWidth="2" opacity=".35" /><text x={x0} y="80" fontSize="10" fill="#7b6a57">Intake ← | → Exhaust</text>
    {turbo && <g transform={`translate(${ex + 20} 120)`}><circle r="30" fill="#faf5e8" stroke="#52392a" strokeWidth="2" /><g transform={`rotate(${tb})`}>{[0, 60, 120, 180, 240, 300].map(d => <path key={d} d="M0 0L6 -26L-6 -26Z" transform={`rotate(${d})`} fill="#7a4f2a" />)}</g><circle r="4" fill="#3a2a1d" /><text y="46" textAnchor="middle" fontSize="10" fill="#52392a">Turbocharger</text></g>}
    {hyb && <g transform="translate(26 118)"><rect width="74" height="46" rx="8" fill="#e1e2b8" stroke="#68702f" strokeWidth="2" /><text x="37" y="20" textAnchor="middle" fontSize="10" fill="#4b4a1f">Electric</text><text x="37" y="34" textAnchor="middle" fontSize="10" fill="#4b4a1f">motor + battery</text><path d="M76 23H100" stroke="#68702f" strokeWidth="3" strokeDasharray="5 5" className="flow" /></g>}
    {cng && <g transform="translate(24 188)"><rect width="78" height="40" rx="20" fill="#e1e2b8" stroke="#68702f" strokeWidth="2" /><text x="39" y="25" textAnchor="middle" fontSize="10" fill="#4b4a1f">CNG tank</text></g>}
    <text x="300" y="304" textAnchor="middle" fontSize="10" fill="#7b6a57">{diesel ? "Diesel: air is compressed so hot that injected fuel ignites without a spark." : "Petrol/CNG: a spark plug ignites the compressed fuel-air mix."}</text></svg>;
}
function Ev({ e, th, regen, rpm }: { e: Eng; th: number; regen: boolean; rpm: number }) {
  const dur = Math.max(.35, 3.2 - rpm / 40), cells = Array.from({ length: 24 }, (_, i) => i);
  return <svg viewBox="0 0 600 260" className="cut-svg" role="img" aria-label="Electric drivetrain animation"><style>{`.evflow{animation:evdash ${dur}s linear infinite;animation-direction:${regen ? "reverse" : "normal"}}@keyframes evdash{to{stroke-dashoffset:-26}}`}</style>
    <g transform="translate(30 70)"><rect width="170" height="120" rx="12" fill="#e1e2b8" stroke="#68702f" strokeWidth="2" />{cells.map(i => <rect key={i} x={14 + (i % 6) * 24} y={16 + Math.floor(i / 6) * 22} width="18" height="14" rx="3" fill="#68702f" opacity={.45 + .5 * Math.abs(Math.sin(i * .6 + th / 120))} />)}<text x="85" y="112" textAnchor="middle" fontSize="11" fill="#4b4a1f">{e.disp} kWh battery</text></g>
    <path d="M200 130H258" stroke="#7a4f2a" strokeWidth="4" strokeDasharray="8 5" className="evflow" /><g transform="translate(258 100)"><rect width="84" height="60" rx="10" fill="#faf5e8" stroke="#52392a" strokeWidth="2" /><text x="42" y="26" textAnchor="middle" fontSize="11" fill="#52392a">Inverter</text><text x="42" y="42" textAnchor="middle" fontSize="9" fill="#7b6a57">DC ⇄ AC</text></g>
    <path d="M342 130H392" stroke="#7a4f2a" strokeWidth="4" strokeDasharray="8 5" className="evflow" /><g transform="translate(392 80)"><circle cx="60" cy="50" r="50" fill="#faf5e8" stroke="#52392a" strokeWidth="2" /><g transform={`rotate(${th} 60 50)`}><circle cx="60" cy="50" r="26" fill="#d9ccae" stroke="#52392a" />{[0, 90, 180, 270].map(d => <rect key={d} x="56" y="26" width="8" height="14" fill="#68702f" transform={`rotate(${d} 60 50)`} />)}</g><text x="60" y="122" textAnchor="middle" fontSize="11" fill="#52392a">{Math.round(e.ps * .7355)} kW motor</text></g>
    <path d="M510 130H560" stroke="#7a4f2a" strokeWidth="4" strokeDasharray="8 5" className="evflow" /><g transform={`translate(560 130) rotate(${th * .6})`}><circle r="20" fill="#3a2a1d" /><circle r="9" fill="#d9ccae" />{[0, 72, 144, 216, 288].map(d => <line key={d} y2="-17" stroke="#d9ccae" strokeWidth="3" transform={`rotate(${d})`} />)}</g>
    <text x="300" y="240" textAnchor="middle" fontSize="11" fill="#7b6a57">{regen ? "Regenerative braking: the motor acts as a generator and sends energy back to the battery." : "Driving: the inverter turns battery DC into AC and the motor turns the wheels."}</text></svg>;
}
