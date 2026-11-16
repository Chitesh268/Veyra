import { Fragment, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowUpRight, Globe, Settings, Sparkles } from "lucide-react";
import { callLLM, webSources, type AiCfg, type Source } from "./data/llm";
import { carFacts, findCars, localAnswer, SYSTEM, type Msg } from "./data/assistant";
import { Chip, Field, PageHead } from "./ui";

const SUGGEST = ["What is the latest on the new Seltos?", "Best SUV under 15 lakh", "Seltos vs Creta", "How to use a puncture repair kit", "EMI for 12 lakh at 9% for 5 years", "Petrol vs diesel vs CNG: which should I buy?", "What is zero depreciation insurance?"];
export const rich = (t: string): ReactNode => t.split("\n").map((l, i) => <Fragment key={i}>{l.split(/(\*\*[^*]+\*\*)/).map((p, j) => p.startsWith("**") ? <b key={j}>{p.slice(2, -2)}</b> : p)}{"\n"}</Fragment>);
export default function Pilot({ chat, setChat, cfg, setCfg }: { chat: Msg[]; setChat: (f: (m: Msg[]) => Msg[]) => void; cfg: AiCfg; setCfg: (c: AiCfg) => void }) {
  const [input, setInput] = useState(""); const [busy, setBusy] = useState(false); const [show, setShow] = useState(false); const [net, setNet] = useState(navigator.onLine); const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ block: "end" }); }, [chat, busy]);
  useEffect(() => { const a = () => setNet(true), b = () => setNet(false); window.addEventListener("online", a); window.addEventListener("offline", b); return () => { window.removeEventListener("online", a); window.removeEventListener("offline", b); }; }, []);
  async function send(text: string) {
    const t = text.trim(); if (!t || busy) return; setInput(""); const hist: Msg[] = [...chat, { role: "user", text: t }]; setChat(() => hist); setBusy(true);
    const local = localAnswer(t), cars = findCars(t); let sources: Source[] = []; let ans = "", via = "Built-in knowledge";
    if (cfg.online && cfg.web && net) { const q = cars[0] ? `${cars[0].brand} ${cars[0].model} ${t.replace(new RegExp(cars[0].model, "ig"), "")}`.trim() : t; sources = await webSources(q, cfg).catch(() => []); }
    if (cfg.online && net) {
      try {
        const data = [local && "Veyra built-in answer: " + local, ...cars.map(carFacts)].filter(Boolean).join("\n"), src = sources.map((s, i) => `[${i + 1}] ${s.title} (${s.url}): ${s.snippet.slice(0, 600)}`).join("\n");
        const sys = SYSTEM + "\n\nUse the numbered web sources when they are relevant and cite them like [1]. The Veyra data comes from the app's catalogue (prices approximate). If neither covers the question, answer from general knowledge and say that you are doing so. Today's date: " + new Date().toDateString() + "." + (data ? "\n\nVeyra data:\n" + data : "") + (src ? "\n\nWeb sources:\n" + src : "");
        ans = await callLLM(cfg, sys, hist.slice(-8).map(m => ({ role: m.role, text: m.text }))); via = sources.length ? "AI with web sources" : "AI";
      } catch { ans = ""; }
    }
    if (!ans) {
      if (local) { ans = local; via = net && cfg.online ? "Built-in knowledge (AI unavailable)" : "Built-in knowledge"; }
      else if (sources[0]) { ans = `The AI service did not respond, but here is what I found online.\n\n**${sources[0].title}**\n${sources[0].snippet.slice(0, 700)}`; via = "Web (AI unavailable)"; }
      else ans = !net ? "You appear to be offline. I can still answer from built-in car knowledge, but this question needs an internet connection." : cfg.online ? "I couldn't reach the AI or web sources just now. Please try again, or check the AI settings." : "That is outside my built-in knowledge. Turn on Online AI in the settings to ask open questions.";
    }
    setChat(m => [...m, { role: "assistant", text: ans, via, sources: via.startsWith("Built-in") ? undefined : sources.slice(0, 4).map(s => ({ title: s.title, url: s.url })) }]); setBusy(false);
  }
  const upd = (p: Partial<AiCfg>) => setCfg({ ...cfg, ...p });
  const status = !cfg.online ? "Built-in knowledge only" : net ? (cfg.web ? "Online: AI + live web sources" : "Online AI") : "Offline: built-in knowledge";
  return <><PageHead eyebrow="AI PILOT" title="Ask anything about cars." desc="Cars, specs, finance, insurance, ownership and mechanics. When you are online it also searches the web for current information." />
    <div className="copilot-shell"><div className="copilot-head"><div className="copilot-avatar"><Sparkles size={18} /></div><div><b>Veyra AI Pilot</b><span><i className={cfg.online && net ? "" : "off"} />{status}</span></div><button className="icon-btn" onClick={() => setShow(!show)} aria-label="AI settings"><Settings size={17} /></button></div>
      {show && <div className="ai-settings"><div className="form-grid"><label className="inline-check"><input type="checkbox" checked={cfg.online} onChange={e => upd({ online: e.target.checked })} /> Use Online AI</label><label className="inline-check"><input type="checkbox" checked={cfg.web} onChange={e => upd({ web: e.target.checked })} /> Search the web for sources</label>
        <Field label="Provider"><select value={cfg.provider} onChange={e => { const p = e.target.value as AiCfg["provider"]; upd(p === "anthropic" ? { provider: p, endpoint: "https://api.anthropic.com/v1/messages", model: "claude-sonnet-5-5" } : { provider: p, endpoint: "https://text.pollinations.ai/openai", model: "openai" }); }}><option value="openai">OpenAI-compatible (free default or your own)</option><option value="anthropic">Anthropic Claude (your API key)</option></select></Field><Field label="Model"><input value={cfg.model} onChange={e => upd({ model: e.target.value })} /></Field>
        <div className="span2"><Field label="Endpoint"><input value={cfg.endpoint} onChange={e => upd({ endpoint: e.target.value })} /></Field></div><Field label="API key (optional for the free default)"><input type="password" value={cfg.key} onChange={e => upd({ key: e.target.value })} /></Field><Field label="Web search key (Tavily, optional)"><input type="password" value={cfg.searchKey} onChange={e => upd({ searchKey: e.target.value })} placeholder="Adds Google-style web results" /></Field></div>
        <p className="disclaimer">Keys are stored only in this browser. Your questions are sent to the endpoint you choose. Web sources always include Wikipedia; add a Tavily key for broader live web search. The default free endpoint may be slow or unavailable.</p></div>}
      <div className="chat-messages">{chat.map((m, i) => <div className={`message ${m.role}`} key={i}><div className="message-avatar">{m.role === "assistant" ? <Sparkles size={15} /> : "Y"}</div><div className="message-col"><div className="message-text">{rich(m.text)}</div>{m.via && <div className="message-via">{m.via.includes("web") || m.via.includes("Web") ? <Globe size={11} /> : null}{m.via}</div>}{m.sources && m.sources.length > 0 && <div className="sources">{m.sources.map((s, k) => <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer"><b>[{k + 1}]</b> {s.title}</a>)}</div>}</div></div>)}
        {busy && <div className="message assistant"><div className="message-avatar"><Sparkles size={15} /></div><div className="message-text typing"><i /><i /><i /></div></div>}<div ref={end} /></div>
      <div className="chip-row suggest">{SUGGEST.map(s => <Chip key={s} onClick={() => send(s)}>{s}</Chip>)}</div>
      <form className="chat-form" onSubmit={(e: FormEvent) => { e.preventDefault(); send(input); }}><input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask about cars, loans, insurance, repairs, latest news…" /><button className="send-btn" type="submit" disabled={busy} aria-label="Send"><ArrowUpRight size={18} /></button></form>
      <div className="chat-foot">AI answers can be wrong. Prices change, and safety-critical repairs belong with a professional.</div></div></>;
}
