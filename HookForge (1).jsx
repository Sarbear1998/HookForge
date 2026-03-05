import { useState, useCallback, useEffect } from "react";

const W = {
  bg: "#FAFAFA",
  navy: "#12112A",
  orange: "#F05A28",
  pink: "#E91E8C",
  purple: "#7B4FBB",
  blue: "#4A6CF7",
  orangeSoft: "#FFF0EB",
  pinkSoft: "#FFF0F7",
  purpleSoft: "#F3EEFF",
  border: "#E8E4F0",
  muted: "#8886A0",
  cardBg: "#FFFFFF",
};

const ANGLES = [
  { value: "missed_calls",    label: "☎ Missed Calls = Lost Revenue" },
  { value: "slow_response",   label: "⏱ Slow Response Time" },
  { value: "competitor",      label: "⚔ Competitor Replied Faster" },
  { value: "realization",     label: "💡 Founder Realization" },
  { value: "crm_horror",      label: "😬 CRM / Inbox Horror" },
  { value: "voicemail",       label: "📭 Voicemail Costing Money" },
  { value: "wasted_ads",      label: "💸 Wasted Ad Spend" },
  { value: "speed_advantage", label: "⚡ Speed Advantage" },
  { value: "internal_convo",  label: "💬 Internal Team Conversation" },
  { value: "247_answering",   label: "🌙 24/7 Answering Advantage" },
];

const FORMATS = [
  { value: "any",          label: "✦ Any Format (Mixed)" },
  { value: "pov",          label: "👁 POV Hook" },
  { value: "confession",   label: "😅 Founder Confession" },
  { value: "cost_reveal",  label: "💀 Cost Reveal" },
  { value: "before_after", label: "📈 Before / After" },
  { value: "psa",          label: "📢 PSA / Warning" },
  { value: "slack_text",   label: "💬 Slack / Text Message" },
  { value: "character",    label: "👵 Character Hook" },
  { value: "question",     label: "❓ Provocative Question" },
  { value: "when_you",     label: "😬 When You Can't..." },
];

const ANGLE_MAP = Object.fromEntries(ANGLES.map((a) => [a.value, a.label]));
const FORMAT_MAP = Object.fromEntries(FORMATS.map((f) => [f.value, f.label]));

function buildPrompt(angle, format, painLevel, specificityLevel) {
  const formatGuide = {
    any: `Mix freely across all formats — POV, confessions, cost reveals, questions, character hooks, Slack messages, before/after. Vary the structure so each of the 6 hooks feels different.`,
    pov: `All 6 hooks must use a "POV:" opener. The POV describes a moment, realization, or transformation the founder experiences. Make it visceral and specific.
WINNING POV EXAMPLES TO RIFF ON (do not repeat, use as style guide):
- "POV: your business 2x revenue in 4 months by simply refusing to waste leads"
- "POV: every [profession] in your town HATES you"
- "POV: you realised speed is costing you business"
- "POV: you realized ghosting clients for hours was costing you 6 figures a year"
- "POV: your business answers calls even at 3:30 am"
- "POV: you stopped answering your phone and made more $$$$"
- "POV: yesterday you booked 3 calls in your sleep"`,
    confession: `All 6 hooks must be raw founder confessions — "I thought...", "I had no idea...", "The stupidest decision I made was...", "I was wrong about...". Self-aware, a little embarrassing, relatable.
WINNING CONFESSION EXAMPLES TO RIFF ON:
- "I thought I needed more ads. Boyyy I was wrong!"
- "This thing was costing me $10k a month and I had no idea"
- "The stupidest decision I made was not getting a 24/7 receptionist sooner"`,
    cost_reveal: `All 6 hooks must reveal a shocking cost or money leak — missed revenue, wasted spend, or hidden loss. Make the number feel real and painful.
WINNING COST REVEAL EXAMPLES TO RIFF ON:
- "Every missed call costs us $1,000. Here's how we fixed it"
- "If one call = $1,200, using voicemail is insane"
- "This thing was costing me $10k a month and I had no idea"`,
    before_after: `All 6 hooks must show a dramatic before/after contrast — revenue, response time, bookings, missed calls. Keep it punchy and specific.
WINNING BEFORE/AFTER EXAMPLES TO RIFF ON:
- "Revenue before and after installing AI receptionist"`,
    psa: `All 6 hooks must feel like a PSA or warning to business owners — urgent, slightly confrontational, like a friend grabbing you by the collar.
WINNING PSA EXAMPLES TO RIFF ON:
- "PSA: you shouldn't be paying $1,765/month for business software when you can get it for $0"
- "Worst thing you can do is 'take your time' when answering a client"`,
    slack_text: `All 6 hooks must look like a real Slack message, team text, or internal notification — raw, unpolished, like it was screenshotted from a real convo.
WINNING SLACK/TEXT EXAMPLES TO RIFF ON:
- "Hey Kristin, there's 14 missed calls today — you know each costs us at least $1k?"`,
    character: `All 6 hooks must open with a character — a grandma, a neighbour business owner, a competitor, a customer. Pull the viewer in with a person, not a product.
WINNING CHARACTER EXAMPLES TO RIFF ON:
- "This is my grandma. She owns XYZ business…"
- "I am legally stealing business from [profession] next door simply bc i'm faster to reply"`,
    question: `All 6 hooks must be a provocative, uncomfortable question that makes founders stop and audit themselves.
WINNING QUESTION EXAMPLES TO RIFF ON:
- "Why are you paying for all of this?"`,
    when_you: `All 6 hooks must start with "when you can't..." or "when you're..." — capturing a real founder moment of being stuck, busy, or unavailable and losing money because of it.
WINNING WHEN YOU EXAMPLES TO RIFF ON:
- "when you can't pick up because you're doing a job"`,
  };

  return `You are a UGC hook writer for Wonderly, an AI receptionist product for small business owners. Your hooks must make founders stop scrolling and whisper "holy sh*t… that's my business."

=== HOOK FORMAT REQUIREMENT ===
${formatGuide[format] || formatGuide.any}

=== TOPIC ANGLE ===
${ANGLE_MAP[angle] || angle}

=== CORE WRITING RULES ===
1. Sound like a real founder speaking — NOT marketing copy, NOT ad copy
2. Include micro-details: CRM logs, call history, inbox timestamps, Slack moments
3. Every hook must carry pain, consequence, or a jaw-drop moment
4. Generic enough for ANY service business owner — no trade-specific scenarios
5. Include at least TWO credibility anchors: timestamp (2:31pm) / delay (47 min) / count (9 missed calls) / money ($7,345) / competitor comparison / speed (2.3 sec)
6. BANNED words: scale, optimize, funnel, leverage, streamline, game-changer
7. Length: 6–28 words (POV/character hooks can go slightly longer if they earn it)
8. Variety: each of the 6 hooks must use a different structure, opener, and emotional angle — NO two hooks should feel similar

=== PAIN LEVEL: ${painLevel}/10 ===
${painLevel >= 8 ? "Maximum urgency. Brutal consequences. Make them wince." : painLevel >= 5 ? "Clear, uncomfortable pain. Real loss. Don't soften it." : "Subtle sting. Relatable annoyance. Still has a consequence."}

=== SPECIFICITY: ${specificityLevel}/10 ===
${specificityLevel >= 8 ? "Ultra-precise: exact timestamps, dollar amounts to the dollar, specific call counts." : specificityLevel >= 5 ? "Specific numbers — rounded but believable." : "Ballpark figures, general but credible."}

=== RANDOMIZE THESE DETAILS ===
Timestamps: 8:04am–5:58pm | Delays: 11, 17, 23, 38, 47, 52 min, 1h 12min
Call counts: 3–14 | Money: $840, $1,120, $1,480, $1,800, $2,400, $7,345, $9k, $10,480
Competitor speed: 90 sec, 2.3 sec, 3 min | Annual leaks: $40k, $60k, $6 figures

=== QUALITY FILTER — AUTO-REJECT IF ===
- Sounds like an ad or a LinkedIn post
- Lacks a specific number
- Lacks a consequence
- Two hooks in the batch have the same structure or opener
- Hook is trade-specific (roofing, plumbing, etc.)

Generate exactly 6 BRAND NEW hooks now.
Return ONLY a valid JSON array of 6 strings. No markdown, no backticks, no extra text.
["Hook one","Hook two","Hook three","Hook four","Hook five","Hook six"]`;
}

async function callClaude(prompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) throw new Error("API " + res.status);
  const data = await res.json();
  const text = data.content?.map((b) => b.text || "").join("") || "";
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

async function intensify(hook) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 200,
      messages: [{
        role: "user",
        content: `Rewrite this UGC hook to be MORE painful, gut-punch specific, and raw. Keep it 8-24 words. Sharper consequence, more specific number, rawer emotion. Return ONLY the new hook text, nothing else.\n\nOriginal: "${hook}"`,
      }],
    }),
  });
  if (!res.ok) throw new Error("API " + res.status);
  const data = await res.json();
  return data.content?.map((b) => b.text || "").join("").trim() || hook;
}

function WonderlyMark({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <polygon points="4,34 20,6 28,20 20,28" fill="#F05A28" />
      <polygon points="20,28 28,20 36,34" fill="#E91E8C" />
      <polygon points="20,6 36,34 28,20" fill="#7B4FBB" />
    </svg>
  );
}

function Blobs() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -140, left: -160, width: 540, height: 540, borderRadius: "50%", background: "radial-gradient(circle, rgba(240,90,40,0.11) 0%, transparent 70%)" }} />
      <div style={{ position: "absolute", top: -100, right: -180, width: 620, height: 620, borderRadius: "50%", background: "radial-gradient(circle, rgba(123,79,187,0.10) 0%, transparent 70%)" }} />
      <div style={{ position: "absolute", bottom: -80, left: "25%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(233,30,140,0.07) 0%, transparent 70%)" }} />
    </div>
  );
}

function SliderControl({ label, value, onChange, leftLabel, rightLabel, color }) {
  const pct = ((value - 1) / 9) * 100;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: W.navy }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#fff", background: color, borderRadius: 20, padding: "2px 10px" }}>{value}/10</span>
      </div>
      <input
        type="range" min={1} max={10} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: "100%", height: 4, appearance: "none", WebkitAppearance: "none",
          background: `linear-gradient(to right, ${color} ${pct}%, #E8E4F0 ${pct}%)`,
          borderRadius: 4, outline: "none", cursor: "pointer",
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: W.muted, marginTop: 4 }}>
        <span>{leftLabel}</span><span>{rightLabel}</span>
      </div>
    </div>
  );
}

function HookCard({ hook, idx, onCopy, onIntensify, onSave, copied, intensifying, isSaved }) {
  return (
    <div
      style={{
        background: W.cardBg, border: "1px solid " + W.border, borderRadius: 14,
        padding: "18px 20px 14px", position: "relative",
        animation: "hookIn 0.3s ease both", animationDelay: (idx * 0.07) + "s",
        boxShadow: "0 2px 12px rgba(18,17,42,0.05)", transition: "box-shadow 0.2s",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 24px rgba(18,17,42,0.10)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 2px 12px rgba(18,17,42,0.05)"; }}
    >
      <span style={{
        position: "absolute", top: 16, left: -1,
        background: "linear-gradient(135deg, " + W.orange + ", " + W.pink + ")",
        color: "#fff", fontSize: 10, fontWeight: 800,
        padding: "3px 8px", borderRadius: "0 6px 6px 0",
      }}>
        {String(idx + 1).padStart(2, "0")}
      </span>

      <p style={{
        margin: "0 0 14px 26px", fontSize: 15, lineHeight: 1.65,
        color: W.navy, fontWeight: 500, fontFamily: "Georgia, serif",
      }}>{hook}</p>

      <div style={{ display: "flex", gap: 8, paddingLeft: 26, flexWrap: "wrap", alignItems: "center" }}>
        <button
          onClick={() => onCopy(hook, idx)}
          style={{
            background: copied ? W.purpleSoft : W.bg,
            color: copied ? W.purple : W.muted,
            border: "1px solid " + (copied ? W.purple : W.border),
            borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer",
          }}
        >{copied ? "✓ Copied!" : "⎘ Copy"}</button>

        <button
          onClick={() => onIntensify(idx)} disabled={intensifying}
          style={{
            background: intensifying ? W.orangeSoft : W.bg,
            color: W.orange, border: "1px solid " + (intensifying ? W.orange : "#F5C4B0"),
            borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 600,
            cursor: intensifying ? "not-allowed" : "pointer", opacity: intensifying ? 0.7 : 1,
          }}
        >{intensifying ? "⚙ Working…" : "🔥 More Painful"}</button>

        <button
          onClick={() => onSave(hook, idx)}
          style={{
            background: isSaved ? W.purpleSoft : W.bg,
            color: isSaved ? W.purple : W.muted,
            border: "1px solid " + (isSaved ? W.purple : W.border),
            borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 600,
            cursor: "pointer", marginLeft: "auto",
          }}
        >{isSaved ? "★ Saved!" : "☆ Save"}</button>
      </div>
    </div>
  );
}

function SavedLedger({ saved, onRemove, onCopy, copiedIdx }) {
  const [open, setOpen] = useState(true);
  if (saved.length === 0) return null;

  return (
    <div style={{
      background: W.cardBg, border: "1px solid " + W.border,
      borderRadius: 20, overflow: "hidden",
      boxShadow: "0 2px 16px rgba(18,17,42,0.06)", marginTop: 32,
    }}>
      <div
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 22px", cursor: "pointer",
          background: "linear-gradient(135deg, " + W.purpleSoft + ", " + W.pinkSoft + ")",
          borderBottom: open ? "1px solid " + W.border : "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>📋</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: W.navy }}>Saved Hooks</span>
          <span style={{
            background: "linear-gradient(135deg, " + W.purple + ", " + W.pink + ")",
            color: "#fff", fontSize: 11, fontWeight: 800,
            borderRadius: 20, padding: "2px 9px",
          }}>{saved.length}</span>
        </div>
        <span style={{ color: W.muted, fontSize: 12, fontWeight: 600 }}>
          {open ? "▲ collapse" : "▼ expand"}
        </span>
      </div>

      {open && (
        <div style={{ padding: "8px 22px 20px" }}>
          {saved.map((item, i) => (
            <div key={item.id} style={{
              display: "flex", alignItems: "flex-start", gap: 12,
              padding: "13px 0",
              borderBottom: i < saved.length - 1 ? "1px solid " + W.border : "none",
            }}>
              <span style={{
                flexShrink: 0, marginTop: 3,
                background: W.purpleSoft, color: W.purple,
                fontSize: 9, fontWeight: 700, letterSpacing: "0.06em",
                padding: "3px 7px", borderRadius: 6, textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}>
                {item.angle.replace(/_/g, " ")}
              </span>
              {item.format && item.format !== "any" && (
                <span style={{
                  flexShrink: 0, marginTop: 3,
                  background: W.pinkSoft, color: W.pink,
                  fontSize: 9, fontWeight: 700, letterSpacing: "0.06em",
                  padding: "3px 7px", borderRadius: 6, textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}>
                  {item.format.replace(/_/g, " ")}
                </span>
              )}

              <p style={{
                flex: 1, margin: 0, fontSize: 13.5, lineHeight: 1.6,
                color: W.navy, fontFamily: "Georgia, serif",
              }}>{item.text}</p>

              <div style={{ display: "flex", gap: 6, flexShrink: 0, marginTop: 2 }}>
                <button
                  onClick={() => onCopy(item.text, "saved-" + i)}
                  style={{
                    background: copiedIdx === "saved-" + i ? W.purpleSoft : "transparent",
                    border: "1px solid " + W.border, borderRadius: 6, padding: "4px 9px",
                    fontSize: 11, fontWeight: 600, cursor: "pointer",
                    color: copiedIdx === "saved-" + i ? W.purple : W.muted,
                  }}
                >{copiedIdx === "saved-" + i ? "✓" : "⎘"}</button>

                <button
                  onClick={() => onRemove(item.id)}
                  style={{
                    background: "transparent", border: "1px solid " + W.border,
                    borderRadius: 6, padding: "4px 9px", fontSize: 11, cursor: "pointer", color: W.muted,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#FF4B4B"; e.currentTarget.style.color = "#FF4B4B"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = W.border; e.currentTarget.style.color = W.muted; }}
                >✕</button>
              </div>
            </div>
          ))}

          <button
            onClick={() => {
              const all = saved.map((s, i) => (i + 1) + ". " + s.text).join("\n");
              navigator.clipboard.writeText(all);
            }}
            style={{
              marginTop: 14, width: "100%",
              background: "linear-gradient(135deg, " + W.purple + ", " + W.pink + ")",
              color: "#fff", border: "none", borderRadius: 10,
              padding: "11px 18px", fontSize: 13, fontWeight: 700,
              cursor: "pointer", letterSpacing: "0.03em",
            }}
          >
            ⎘ Copy All {saved.length} Saved Hooks
          </button>
        </div>
      )}
    </div>
  );
}

export default function HookForge() {
  const [angle, setAngle] = useState("missed_calls");
  const [format, setFormat] = useState("any");
  const [painLevel, setPainLevel] = useState(7);
  const [specificityLevel, setSpecificityLevel] = useState(7);
  const [hooks, setHooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [painLoadingIdx, setPainLoadingIdx] = useState(null);
  const [savedHooks, setSavedHooks] = useState([]);
  const [justSaved, setJustSaved] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get("hookforge-saved");
        if (res?.value) setSavedHooks(JSON.parse(res.value));
      } catch {}
    })();
  }, []);

  const persistSaved = async (list) => {
    try { await window.storage.set("hookforge-saved", JSON.stringify(list)); } catch {}
  };

  const generate = useCallback(async () => {
    setLoading(true); setError(null); setHooks([]);
    try {
      const result = await callClaude(buildPrompt(angle, format, painLevel, specificityLevel));
      setHooks(result.slice(0, 6));
    } catch {
      setError("Generation failed — please try again.");
    } finally { setLoading(false); }
  }, [angle, format, painLevel, specificityLevel]);

  const copyHook = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1800);
  };

  const morePainful = async (idx) => {
    setPainLoadingIdx(idx);
    try {
      const newHook = await intensify(hooks[idx]);
      setHooks((prev) => prev.map((h, i) => (i === idx ? newHook : h)));
    } catch { setError("Intensify failed."); }
    finally { setPainLoadingIdx(null); }
  };

  const saveHook = (text, idx) => {
    if (savedHooks.some((s) => s.text === text)) return;
    const entry = { id: Date.now(), text, angle, format };
    const updated = [entry, ...savedHooks];
    setSavedHooks(updated);
    persistSaved(updated);
    setJustSaved((prev) => ({ ...prev, [idx]: true }));
    setTimeout(() => setJustSaved((prev) => ({ ...prev, [idx]: false })), 2200);
  };

  const removeHook = (id) => {
    const updated = savedHooks.filter((s) => s.id !== id);
    setSavedHooks(updated);
    persistSaved(updated);
  };

  return (
    <div style={{ minHeight: "100vh", background: W.bg, fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <Blobs />
      <style>{`
        * { box-sizing: border-box; }
        @keyframes hookIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; width: 18px; height: 18px;
          background: #fff; border-radius: 50%; cursor: pointer;
          border: 3px solid currentColor;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
      `}</style>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "44px 20px 80px", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <WonderlyMark size={30} />
            <span style={{ fontSize: 13, fontWeight: 700, color: W.muted, letterSpacing: "0.14em", textTransform: "uppercase" }}>Wonderly</span>
          </div>
          <h1 style={{
            margin: "0 0 10px", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.05,
            fontSize: "clamp(38px, 7vw, 60px)", color: W.navy,
          }}>
            Hook<span style={{
              background: "linear-gradient(135deg, " + W.orange + " 0%, " + W.pink + " 55%, " + W.purple + " 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>Forge</span>
          </h1>
          <p style={{ margin: 0, fontSize: 15, color: W.muted }}>
            Generate scroll-stopping UGC hooks that make founders say "that's my business."
          </p>
        </div>

        {/* Controls */}
        <div style={{
          background: W.cardBg, border: "1px solid " + W.border,
          borderRadius: 20, padding: "28px 28px 24px", marginBottom: 28,
          boxShadow: "0 4px 24px rgba(18,17,42,0.06)",
        }}>
          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: "block", fontSize: 11, fontWeight: 700,
              color: W.navy, marginBottom: 8, letterSpacing: "0.08em", textTransform: "uppercase",
            }}>Hook Angle</label>
            <div style={{ position: "relative" }}>
              <select
                value={angle} onChange={(e) => setAngle(e.target.value)}
                style={{
                  appearance: "none", WebkitAppearance: "none",
                  width: "100%", padding: "11px 40px 11px 14px",
                  background: "#fff", border: "1.5px solid " + W.border,
                  borderRadius: 10, fontSize: 13.5, fontWeight: 500,
                  color: W.navy, outline: "none", cursor: "pointer",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = W.purple; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = W.border; }}
              >
                {ANGLES.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
              </select>
              <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: W.muted, pointerEvents: "none", fontSize: 10 }}>▼</span>
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: "block", fontSize: 11, fontWeight: 700,
              color: W.navy, marginBottom: 8, letterSpacing: "0.08em", textTransform: "uppercase",
            }}>Hook Format</label>
            <div style={{ position: "relative" }}>
              <select
                value={format} onChange={(e) => setFormat(e.target.value)}
                style={{
                  appearance: "none", WebkitAppearance: "none",
                  width: "100%", padding: "11px 40px 11px 14px",
                  background: "#fff", border: "1.5px solid " + W.border,
                  borderRadius: 10, fontSize: 13.5, fontWeight: 500,
                  color: W.navy, outline: "none", cursor: "pointer",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = W.pink; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = W.border; }}
              >
                {FORMATS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
              <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: W.muted, pointerEvents: "none", fontSize: 10 }}>▼</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 26 }}>
            <SliderControl label="Pain Level" value={painLevel} onChange={setPainLevel} leftLabel="mild" rightLabel="brutal" color={W.orange} />
            <SliderControl label="Specificity" value={specificityLevel} onChange={setSpecificityLevel} leftLabel="vague" rightLabel="surgical" color={W.purple} />
          </div>

          <button
            onClick={generate} disabled={loading}
            style={{
              width: "100%", background: loading ? "#ccc" : W.navy,
              color: "#fff", border: "none", borderRadius: 12,
              padding: "14px 28px", fontSize: 14, fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 4px 16px rgba(18,17,42,0.2)",
              transition: "all 0.15s", fontFamily: "inherit",
            }}
          >
            {loading
              ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <span style={{
                    display: "inline-block", width: 14, height: 14,
                    border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff",
                    borderRadius: "50%", animation: "spin 0.7s linear infinite",
                  }} />
                  Forging Hooks…
                </span>
              : "⚡ Forge Hooks"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: "#FFF0F0", border: "1px solid #FFB0B0",
            borderRadius: 10, padding: "12px 16px", marginBottom: 20,
            fontSize: 13, color: "#C0392B", fontWeight: 500,
          }}>✖ {error}</div>
        )}

        {/* Hooks List */}
        {!loading && hooks.length > 0 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: W.muted, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                {hooks.length} hooks · {ANGLE_MAP[angle]} · {FORMAT_MAP[format]}
              </span>
              <button
                onClick={generate} disabled={loading}
                style={{
                  background: "transparent", border: "1px solid " + W.border,
                  borderRadius: 8, padding: "5px 14px", fontSize: 11, fontWeight: 600,
                  color: W.muted, cursor: "pointer", fontFamily: "inherit",
                }}
              >↺ Regenerate</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {hooks.map((hook, idx) => (
                <HookCard
                  key={hook + idx} hook={hook} idx={idx}
                  onCopy={copyHook} onIntensify={morePainful} onSave={saveHook}
                  copied={copiedIdx === idx} intensifying={painLoadingIdx === idx}
                  isSaved={justSaved[idx] || savedHooks.some((s) => s.text === hook)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && hooks.length === 0 && !error && (
          <div style={{
            textAlign: "center", padding: "60px 32px",
            background: W.cardBg, borderRadius: 20,
            border: "1.5px dashed " + W.border,
          }}>
            <div style={{ fontSize: 42, marginBottom: 12 }}>⚒️</div>
            <p style={{ margin: 0, fontSize: 14, color: W.muted }}>
              Choose your angle and forge your first batch of hooks above
            </p>
          </div>
        )}

        {/* Saved Ledger */}
        <SavedLedger
          saved={savedHooks} onRemove={removeHook}
          onCopy={copyHook} copiedIdx={copiedIdx}
        />

        {/* Footer */}
        <div style={{ marginTop: 52, textAlign: "center" }}>
          <WonderlyMark size={18} />
          <p style={{ margin: "6px 0 0", fontSize: 11, color: W.muted }}>HookForge · Wonderly × Claude</p>
        </div>
      </div>
    </div>
  );
}
