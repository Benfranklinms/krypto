import { useState, useEffect, useRef } from "react";
import "./index.css";
import { backendDecrypt, backendEncrypt } from "./api/cipher";

// ─── Cipher config ────────────────────────────────────────────────────────
const CIPHERS = [
  {
    id: "caesar",
    label: "Caesar",
    tag: "shift cipher",
    keys: [
      {
        id: "shift",
        label: "shift value",
        placeholder: "> shift (1–25)",
        type: "number",
        min: 1,
        max: 25,
      },
    ],
  },
  {
    id: "vigenere",
    label: "Vigenere",
    tag: "polyalphabetic",
    keys: [
      {
        id: "keyword",
        label: "keyword",
        placeholder: "> keyword (letters only)",
        type: "text",
      },
    ],
  },
  {
    id: "affine",
    label: "Affine",
    tag: "linear cipher",
    keys: [
      {
        id: "a",
        label: "multiplier a",
        placeholder: "> a (1,3,5,7...)",
        type: "number",
        min: 1,
        max: 25,
      },
      {
        id: "b",
        label: "additive b",
        placeholder: "> b (0–25)",
        type: "number",
        min: 0,
        max: 25,
      },
    ],
  },
];

// ─── Radar chart ──────────────────────────────────────────────────────────
function RadarChart({ data }) {
  if (!data) return null;
  const width = 240;
  const height = 232;
  const radius = 68;
  const cx = 120;
  const cy = 116;
  const entries = Object.entries(data);
  const metrics = entries.map(([key, val], i) => ({
    label: key.replace(/([A-Z])/g, " $1").trim(),
    value: Math.max(0, Math.min(100, val)),
    angle: (i / entries.length) * Math.PI * 2,
  }));

  const points = metrics.map((m) => ({
    x: cx + ((radius * m.value) / 100) * Math.cos(m.angle - Math.PI / 2),
    y: cy + ((radius * m.value) / 100) * Math.sin(m.angle - Math.PI / 2),
  }));

  const pathData =
    points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") +
    " Z";

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ marginTop: 16, display: "block", marginInline: "auto" }}
    >
      <defs>
        <style>{`.radar-label { font-size: 9px; fill: #666; font-family: monospace; }`}</style>
      </defs>
      {[20, 40, 60, 80, 100].map((r) => (
        <circle
          key={r}
          cx={cx}
          cy={cy}
          r={(radius * r) / 100}
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="1"
        />
      ))}
      {metrics.map((m, i) => {
        const x = cx + radius * 1.34 * Math.cos(m.angle - Math.PI / 2);
        const y = cy + radius * 1.34 * Math.sin(m.angle - Math.PI / 2);
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="radar-label"
          >
            {m.label}
          </text>
        );
      })}
      <path d={pathData} fill="#00ff0022" stroke="#00ff00" strokeWidth="2" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#00ff00" />
      ))}
    </svg>
  );
}

// ─── Typing effect ────────────────────────────────────────────────────────
function TypedText({ text, speed = 14 }) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    setShown("");
    let i = 0;
    const id = setInterval(() => {
      if (i < text.length) setShown(text.slice(0, ++i));
      else clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return (
    <>
      {shown}
      <span
        style={{ animation: "blink 1s step-end infinite", color: "#00ff00" }}
      >
        █
      </span>
    </>
  );
}

// ─── Decrypting overlay ───────────────────────────────────────────────────
const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

function DecryptingOverlay({ inputText }) {
  const [lines, setLines] = useState(() =>
    Array.from({ length: 5 }, () => ({
      current: "",
      target: "",
    }))
  );
  useEffect(() => {
    void inputText;
    const newLines = Array.from({ length: 5 }, () => ({
      current: "",
      target: "",
    }));

    const intervals = newLines.map((line) => {
      const len = Math.floor(Math.random() * 20) + 10;
      line.target = Array.from(
        { length: len },
        () => CHARSET[Math.floor(Math.random() * CHARSET.length)]
      ).join("");
      return setInterval(() => {
        line.current = Array.from(
          { length: len },
          () => CHARSET[Math.floor(Math.random() * CHARSET.length)]
        ).join("");
        setLines([...newLines]);
      }, 100);
    });
    return () => intervals.forEach(clearInterval);
  }, [inputText]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        padding: "32px 0",
      }}
    >
      <svg
        width="72"
        height="72"
        viewBox="0 0 72 72"
        style={{ marginBottom: 8 }}
      >
        <circle
          cx="36"
          cy="36"
          r="28"
          fill="none"
          stroke="#00ff0018"
          strokeWidth="2"
        />
        <circle
          cx="36"
          cy="36"
          r="28"
          fill="none"
          stroke="#00ff00"
          strokeWidth="2"
          strokeDasharray="44 132"
          style={{
            animation: "spin 1.1s linear infinite",
            transformOrigin: "36px 36px",
          }}
        />
        <circle
          cx="36"
          cy="36"
          r="18"
          fill="none"
          stroke="#00ff0033"
          strokeWidth="1"
        />
        <circle
          cx="36"
          cy="36"
          r="18"
          fill="none"
          stroke="#00ff00"
          strokeWidth="1"
          strokeDasharray="20 94"
          style={{
            animation: "spinR 0.7s linear infinite",
            transformOrigin: "36px 36px",
          }}
        />
        <text
          x="36"
          y="40"
          textAnchor="middle"
          fill="#00ff00"
          fontSize="9"
          fontFamily="monospace"
          letterSpacing="1"
        >
          KRYPTO
        </text>
      </svg>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          alignItems: "center",
        }}
      >
        {lines.map(({ current }, i) => (
          <div
            key={i}
            style={{
              fontFamily: "monospace",
              fontSize: 13,
              color: "#00ff00",
              letterSpacing: 3,
              opacity: 0.7 + (i % 3) * 0.1,
            }}
          >
            {current}
          </div>
        ))}
      </div>
      <div
        style={{
          fontFamily: "monospace",
          fontSize: 11,
          color: "#00ff0066",
          letterSpacing: 3,
          marginTop: 8,
          animation: "blink 1s step-end infinite",
        }}
      >
        ANALYSING CIPHER...
      </div>
    </div>
  );
}

// ─── Shared style tokens ──────────────────────────────────────────────────
const MONTECH = "'MontechV01', 'Courier New', monospace";
const MONO = "'Share Tech Mono', 'Courier New', monospace";

const S = {
  input: {
    width: "100%",
    background: "#0d0d0d",
    border: "1px solid #1f1f1f",
    borderRadius: 12,
    color: "#bbb",
    fontFamily: MONO,
    fontSize: 13,
    padding: "13px 16px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  btn: {
    width: "100%",
    background: "#00ff00",
    color: "#000",
    border: "none",
    borderRadius: 50,
    fontFamily: MONTECH,
    fontWeight: 700,
    fontSize: 14,
    padding: "15px 0",
    cursor: "pointer",
    letterSpacing: 2,
    transition: "opacity 0.15s",
  },
  section: { display: "flex", flexDirection: "column", gap: 10 },
  sectionGap: { display: "flex", flexDirection: "column", gap: 28 },
};

const focusOn = (e) => (e.target.style.borderColor = "#00ff0055");
const focusOff = (e) => (e.target.style.borderColor = "#1f1f1f");

// ─── Section heading ──────────────────────────────────────────────────────
function Heading({ label, mono }) {
  return (
    <h2
      style={{
        color: "#fff",
        fontFamily: MONO,
        fontWeight: mono ? 400 : 700,
        fontSize: mono ? 17 : 21,
        marginBottom: 2,
      }}
    >
      <span style={{ color: "#00ff00", marginRight: 6 }}>&gt;</span>
      {label}
    </h2>
  );
}

// ─── Custom cipher dropdown ───────────────────────────────────────────────
function CipherDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const selected = CIPHERS.find((c) => c.id === value);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", userSelect: "none" }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          ...S.input,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          borderColor: open ? "#00ff0055" : "#1f1f1f",
          color: selected ? "#fff" : "#444",
        }}
      >
        <span>
          {selected ? (
            <>
              <span style={{ color: "#00ff00", marginRight: 8 }}>&gt;</span>
              {selected.label}
              <span style={{ color: "#555", fontSize: 11, marginLeft: 10 }}>
                {selected.tag}
              </span>
            </>
          ) : (
            "select cipher algorithm"
          )}
        </span>
        <span
          style={{
            color: "#00ff00",
            fontSize: 10,
            letterSpacing: 1,
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
            display: "inline-block",
          }}
        >
          ▼
        </span>
      </div>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            zIndex: 200,
            background: "#0d0d0d",
            border: "1px solid #00ff0033",
            borderRadius: 12,
            overflow: "hidden",
            animation: "fadeIn 0.15s ease",
            boxShadow: "0 8px 32px #00ff0015",
          }}
        >
          {CIPHERS.map((c, i) => (
            <div
              key={c.id}
              onClick={() => {
                onChange(c.id);
                setOpen(false);
              }}
              style={{
                padding: "11px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                borderBottom:
                  i < CIPHERS.length - 1 ? "1px solid #1a1a1a" : "none",
                background: c.id === value ? "#00ff0010" : "transparent",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#00ff0018")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  c.id === value ? "#00ff0010" : "transparent")
              }
            >
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 13,
                  color: c.id === value ? "#00ff00" : "#ccc",
                }}
              >
                {c.label}
              </span>
              <span
                style={{
                  fontSize: 10,
                  color: "#555",
                  fontFamily: MONO,
                  letterSpacing: 1,
                }}
              >
                {c.tag}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Dynamic key fields ───────────────────────────────────────────────────
function KeyFields({ cipher, keys, onChange }) {
  if (!cipher || cipher.keys.length === 0) {
    return null;
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        animation: "fadeIn 0.2s ease",
      }}
    >
      {cipher.keys.map((field) =>
        field.type === "textarea" ? (
          <textarea
            key={field.id}
            rows={4}
            placeholder={field.placeholder}
            value={keys[field.id] ?? ""}
            onChange={(e) => onChange(field.id, e.target.value)}
            style={{ ...S.input, resize: "vertical", lineHeight: 1.6 }}
            onFocus={focusOn}
            onBlur={focusOff}
          />
        ) : (
          <input
            key={field.id}
            type={field.type}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            value={keys[field.id] ?? ""}
            onChange={(e) => onChange(field.id, e.target.value)}
            style={S.input}
            onFocus={focusOn}
            onBlur={focusOff}
          />
        )
      )}
    </div>
  );
}

// ─── Encryption panel ─────────────────────────────────────────────────────
function EncryptionPanel({ onEncrypt }) {
  const [text, setText] = useState("");
  const [algorithm, setAlgorithm] = useState("caesar");
  const [keys, setKeys] = useState({ shift: "3" });
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectedCipher = CIPHERS.find((c) => c.id === algorithm);
  const firstKey = selectedCipher?.keys[0]?.id;

  const handleAlgChange = (alg) => {
    setAlgorithm(alg);
    const cipher = CIPHERS.find((c) => c.id === alg);
    const newKeys = {};
    cipher?.keys.forEach((field) => {
      newKeys[field.id] = "";
    });
    setKeys(newKeys);
    setOutput("");
    setError("");
  };

  const handleKeyChange = (id, value) => {
    setKeys((prev) => ({ ...prev, [id]: value }));
  };

  const run = async () => {
    if (!text.trim()) return;
    setBusy(true);
    setError("");
    setOutput("");
    try {
      const fn = onEncrypt || backendEncrypt;
      const res = await fn({
        text,
        algorithm,
        key: keys[firstKey] ?? "",
        keys,
      });
      res.error ? setError(res.error) : setOutput(res.result ?? "");
    } catch (e) {
      setError(e.message ?? "Encryption failed.");
    }
    setBusy(false);
  };

  const copy = () =>
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });

  return (
    <div style={S.sectionGap}>
      <section style={S.section}>
        <Heading label="Input" />
        <textarea
          rows={4}
          placeholder="Enter your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ ...S.input, resize: "vertical", lineHeight: 1.7 }}
          onFocus={focusOn}
          onBlur={focusOff}
        />
      </section>
      <section style={S.section}>
        <Heading label="select algorithm" mono />
        <CipherDropdown value={algorithm} onChange={handleAlgChange} />
        <KeyFields
          cipher={selectedCipher}
          keys={keys}
          onChange={handleKeyChange}
        />
      </section>
      <button
        style={{
          ...S.btn,
          opacity: busy || !algorithm ? 0.5 : 1,
          cursor: !algorithm ? "not-allowed" : "pointer",
        }}
        onClick={run}
        disabled={busy || !algorithm}
        onMouseEnter={(e) => {
          if (algorithm) e.target.style.opacity = "0.8";
        }}
        onMouseLeave={(e) => {
          e.target.style.opacity = busy || !algorithm ? "0.5" : "1";
        }}
      >
        {busy ? "> encrypting..." : "> run encryption"}
      </button>
      <section style={S.section}>
        <Heading label="Output" />
        <div
          style={{
            ...S.input,
            minHeight: 64,
            color: error ? "#ff4444" : output ? "#00ff00" : "#444",
            wordBreak: "break-all",
          }}
        >
          {error || output || "Encrypted output will appear here."}
        </div>
        <button
          style={S.btn}
          onClick={copy}
          onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
          onMouseLeave={(e) => (e.target.style.opacity = "1")}
        >
          {copied ? "[ copied! ]" : "[ copy ]"}
        </button>
      </section>
    </div>
  );
}

// ─── Decryption panel ─────────────────────────────────────────────────────
function DecryptionPanel({ onDecrypt }) {
  const [text, setText] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const run = async () => {
    if (!text.trim()) return;
    setBusy(true);
    setError("");
    setOutput("");
    setStats(null);
    try {
      const fn = onDecrypt || backendDecrypt;
      const res = await fn({ text });
      if (res.error) setError(res.error);
      else {
        setOutput(res.result ?? "");
        if (res.stats) setStats(res.stats);
      }
    } catch (e) {
      setError(e.message ?? "Decryption failed.");
    }
    setBusy(false);
  };

  const copy = () =>
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });

  return (
    <div style={S.sectionGap}>
      <section style={S.section}>
        <Heading label="Input" />
        <textarea
          rows={4}
          placeholder="Enter your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ ...S.input, resize: "vertical", lineHeight: 1.7 }}
          onFocus={focusOn}
          onBlur={focusOff}
        />
      </section>
      <button
        style={{
          ...S.btn,
          opacity: busy ? 0.65 : 1,
        }}
        onClick={run}
        disabled={busy}
        onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
        onMouseLeave={(e) => (e.target.style.opacity = busy ? "0.65" : "1")}
      >
        {busy ? "> cracking..." : "> run decryption"}
      </button>
      {busy && <DecryptingOverlay inputText={text} />}
      {!busy && (
        <section style={S.section}>
          <Heading label="Output" />
          <div
            style={{
              ...S.input,
              minHeight: 64,
              color: error ? "#ff4444" : output ? "#00ff00" : "#444",
              wordBreak: "break-all",
            }}
          >
            {error ? (
              error
            ) : output ? (
              <TypedText text={output} />
            ) : (
              "Decryption result will appear here."
            )}
          </div>
          <button
            style={S.btn}
            onClick={copy}
            onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
            onMouseLeave={(e) => (e.target.style.opacity = "1")}
          >
            {copied ? "[ copied! ]" : "[ copy ]"}
          </button>
        </section>
      )}
      {stats && (
        <section
          style={{ ...S.section, gap: 16, animation: "fadeIn 0.4s ease" }}
        >
          <Heading label="Statistics" />
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 14,
                marginBottom: 4,
              }}
            >
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 11,
                  letterSpacing: 2,
                  color: "#666",
                }}
              >
                PREDICTED CIPHER
              </span>
              <span
                style={{ color: "#00ff00", fontFamily: MONO, fontSize: 13 }}
              >
                {stats.probability}% probability
              </span>

              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 11,
                  letterSpacing: 2,
                  color: "#666",
                }}
              >
                KEY
              </span>
              <span
                style={{ color: "#00ff00", fontFamily: MONO, fontSize: 13 }}
              >
                {stats.keyLabel}
              </span>
            </div>
            <div style={{ fontSize: 27, fontWeight: 700, letterSpacing: -0.5 }}>
              {stats.predictedCipher}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginTop: 4,
            }}
          >
            {stats.ciphers.map((c) => (
              <div
                key={c.name}
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                <span
                  style={{
                    width: 72,
                    fontSize: 11,
                    color: "#888",
                    fontFamily: MONO,
                    flexShrink: 0,
                  }}
                >
                  {c.name}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 3,
                    background: "#1a1a1a",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.max(0, Math.min(100, c.score * 100))}%`,
                      background: "#00ff00",
                      borderRadius: 2,
                      transition: "width 0.9s cubic-bezier(0.22,1,0.36,1)",
                    }}
                  />
                </div>
                <span
                  style={{
                    width: 42,
                    textAlign: "right",
                    fontSize: 11,
                    color: "#00ff00",
                    fontFamily: MONO,
                    flexShrink: 0,
                  }}
                >
                  {Math.round(c.score * 100)}%
                </span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 8 }}>
            <RadarChart data={stats.radar} />
          </div>
        </section>
      )}
    </div>
  );
}

// ─── Root component ───────────────────────────────────────────────────────
export default function KryptoApp({ onEncrypt, onDecrypt }) {
  const [tab, setTab] = useState("encrypt");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #000; color: #fff; font-family: 'Share Tech Mono', 'Courier New', monospace; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scan { from{top:0} to{top:100vh} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes spinR { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
        .ks-scanline { pointer-events:none; position:fixed; left:0; right:0; height:2px; background:linear-gradient(transparent,#00ff0012,transparent); animation:scan 6s linear infinite; z-index:999; }
        .ks-tab { background:none; cursor:pointer; font-family:'Courier New',monospace; font-size:12px; letter-spacing:2px; padding:7px 18px; border-radius:50px; transition:all .2s; border: 1px solid transparent; }
        .ks-tab.on  { background:#00ff00; color:#000; font-weight:700; border:1px solid #00ff00; }
        .ks-tab.off { color:#444; border:1px solid #1e1e1e; }
        .ks-tab.off:hover { color:#00ff00; border-color:#00ff0044; }
        ::-webkit-scrollbar       { width:4px }
        ::-webkit-scrollbar-track { background:#000 }
        ::-webkit-scrollbar-thumb { background:#00ff0033; border-radius:2px }
      `}</style>
      <div className="ks-scanline" />
      <div style={{ minHeight: "100vh", background: "#000" }}>
        {/* Top bar */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            padding: "14px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "linear-gradient(#000 70%,transparent)",
          }}
        >
          <span
            style={{
              color: "#00ff00",
              fontSize: 15,
              letterSpacing: 2,
              fontFamily: MONTECH,
              fontWeight: 700,
            }}
          >
            &gt; KRYPTO v1.0
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            {["encrypt", "decrypt"].map((t) => (
              <button
                key={t}
                className={`ks-tab ${tab === t ? "on" : "off"}`}
                onClick={() => setTab(t)}
              >
                {t.toUpperCase() + "ION"}
              </button>
            ))}
          </div>
        </div>
        {/* Main content */}
        <main
          key={tab}
          style={{
            maxWidth: 620,
            margin: "0 auto",
            padding: "96px 24px 80px",
            animation: "fadeIn 0.35s ease",
          }}
        >
          <h1
            style={{
              textAlign: "center",
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: 7,
              marginBottom: 48,
              fontFamily: MONTECH,
            }}
          >
            {tab === "encrypt" ? "ENCRYPTION" : "DECRYPTION"}
          </h1>
          {tab === "encrypt" ? (
            <EncryptionPanel onEncrypt={onEncrypt} />
          ) : (
            <DecryptionPanel onDecrypt={onDecrypt} />
          )}
        </main>
      </div>
    </>
  );
}
