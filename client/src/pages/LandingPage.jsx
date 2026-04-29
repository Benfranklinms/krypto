import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useInView,
} from "framer-motion";
import Lenis from "lenis";

// ─── Constants ────────────────────────────────────────────────────────────────
const MONO = "'Share Tech Mono', 'Courier New', monospace";
const GREEN = "#00ff00";
const GREEN_DIM = "rgba(0,255,0,0.55)";

// ─── Lenis Smooth Scroll Hook ────────────────────────────────────────────────
function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);
}

// ─── Matrix Rain Canvas ──────────────────────────────────────────────────────
function MatrixRain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const chars = "KRYPTOABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&{}[]";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array.from({ length: columns }, () => Math.random() * -100);

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        const brightness = Math.random();
        ctx.fillStyle =
          brightness > 0.95
            ? "#ffffff"
            : brightness > 0.7
              ? GREEN
              : "rgba(0,255,0,0.3)";
        ctx.fillText(char, x, y);
        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 0.5 + Math.random() * 0.5;
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        opacity: 0.35,
        pointerEvents: "none",
      }}
    />
  );
}

// ─── Network Grid Canvas (full-page background) ─────────────────────────────
function NetworkGrid() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let w, h;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = document.documentElement.scrollHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Create nodes
    const NODE_COUNT = 60;
    const CONNECTION_DIST = 160;
    const nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 2 + 1,
      pulse: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Update positions
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        node.pulse += 0.015;

        // Bounce off edges
        if (node.x < 0 || node.x > w) node.vx *= -1;
        if (node.y < 0 || node.y > h) node.vy *= -1;

        // Keep in bounds
        node.x = Math.max(0, Math.min(w, node.x));
        node.y = Math.max(0, Math.min(h, node.y));
      }

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.12;
            ctx.strokeStyle = `rgba(0, 255, 0, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const node of nodes) {
        const glow = 0.3 + Math.sin(node.pulse) * 0.2;
        ctx.fillStyle = `rgba(0, 255, 0, ${glow})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fill();

        // Subtle glow ring on some nodes
        if (node.r > 2) {
          ctx.strokeStyle = `rgba(0, 255, 0, ${glow * 0.3})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.r + 4 + Math.sin(node.pulse) * 2, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    // Re-measure page height periodically (as content loads)
    const resizeInterval = setInterval(() => {
      const newH = document.documentElement.scrollHeight;
      if (Math.abs(newH - h) > 100) {
        h = canvas.height = newH;
      }
    }, 2000);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
      clearInterval(resizeInterval);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="lp-network-grid"
    />
  );
}

// ─── Floating Particles ──────────────────────────────────────────────────────
function FloatingParticles() {
  const particles = useRef(
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      dur: Math.random() * 20 + 15,
      delay: Math.random() * 10,
    }))
  ).current;

  return (
    <div className="lp-particles">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="lp-particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            boxShadow: `0 0 ${p.size * 4}px ${GREEN_DIM}`,
          }}
          animate={{
            y: [0, -30, 10, -20, 0],
            x: [0, 15, -10, 5, 0],
            opacity: [0.2, 0.7, 0.3, 0.6, 0.2],
          }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ─── Cursor Glow ─────────────────────────────────────────────────────────────
function CursorGlow() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 15 });
  const sy = useSpring(y, { stiffness: 150, damping: 15 });

  useEffect(() => {
    const fn = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, [x, y]);

  return (
    <motion.div
      className="lp-cursor-glow"
      style={{ left: sx, top: sy }}
    />
  );
}

// ─── Glitch Text ─────────────────────────────────────────────────────────────
function GlitchText({ text, style }) {
  return (
    <span className="lp-glitch" style={style} data-text={text}>
      {text}
    </span>
  );
}

// ─── Animated Counter ────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = "", duration = 2 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration * 60);
    const id = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(id);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(id);
  }, [inView, target, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

// ─── Scramble Text on Hover ──────────────────────────────────────────────────
function ScrambleText({ text, style, as: Tag = "span" }) {
  const [display, setDisplay] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%";
  const intervalRef = useRef(null);

  const scramble = useCallback(() => {
    let iter = 0;
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((c, i) =>
            i < iter ? text[i] : chars[Math.floor(Math.random() * chars.length)]
          )
          .join("")
      );
      iter += 1 / 3;
      if (iter >= text.length) {
        clearInterval(intervalRef.current);
        setDisplay(text);
      }
    }, 30);
  }, [text]);

  const reset = useCallback(() => {
    clearInterval(intervalRef.current);
    setDisplay(text);
  }, [text]);

  return (
    <Tag
      style={{ ...style, cursor: "default" }}
      onMouseEnter={scramble}
      onMouseLeave={reset}
    >
      {display}
    </Tag>
  );
}

// ─── Section reveal ──────────────────────────────────────────────────────────
const sectionVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

function RevealSection({ children, style, className = "" }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={sectionVariants}
    >
      {children}
    </motion.div>
  );
}

// ─── Word-by-word scroll reveal ──────────────────────────────────────────────
function WordReveal({ text, className = "" }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          style={{ display: "inline-block", marginRight: "0.35em" }}
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{
            duration: 0.5,
            delay: i * 0.06,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

// ─── Character-by-character reveal ───────────────────────────────────────────
function CharReveal({ text, className = "", delay = 0 }) {
  return (
    <span className={className}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          style={{ display: "inline-block" }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.4,
            delay: delay + i * 0.03,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

// ─── Feature Card ────────────────────────────────────────────────────────────
function FeatureCard({ icon, title, description, delay = 0 }) {
  return (
    <motion.div
      className="lp-glass-card"
      initial={{ opacity: 0, y: 40, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        scale: 1.04,
        borderColor: "rgba(0,255,0,0.4)",
        boxShadow:
          "0 0 50px rgba(0,255,0,0.12), inset 0 0 50px rgba(0,255,0,0.03)",
      }}
    >
      <div className="lp-card-icon">{icon}</div>
      <h3 className="lp-card-title">
        <span style={{ color: GREEN, marginRight: 8 }}>&gt;</span>
        {title}
      </h3>
      <p className="lp-card-desc">{description}</p>
    </motion.div>
  );
}

// ─── Step Item ───────────────────────────────────────────────────────────────
function StepItem({ number, title, description, delay }) {
  return (
    <motion.div
      className="lp-step"
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="lp-step-num">{number}</div>
      <div>
        <h4 className="lp-step-title">{title}</h4>
        <p className="lp-step-desc">{description}</p>
      </div>
    </motion.div>
  );
}

// ─── Live Cipher Demo ────────────────────────────────────────────────────────
function LiveCipherDemo() {
  const [input] = useState("HELLO WORLD");
  const [output, setOutput] = useState("");
  const [encrypting, setEncrypting] = useState(false);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const runDemo = useCallback(() => {
    setEncrypting(true);
    let iter = 0;
    const caesarShift = 3;
    const target = input
      .split("")
      .map((c) => {
        if (c === " ") return " ";
        const idx = chars.indexOf(c.toUpperCase());
        return idx === -1 ? c : chars[(idx + caesarShift) % 26];
      })
      .join("");

    const interval = setInterval(() => {
      setOutput(
        target
          .split("")
          .map((ch, i) => {
            if (ch === " ") return " ";
            return i < iter
              ? target[i]
              : chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );
      iter += 0.5;
      if (iter >= target.length) {
        clearInterval(interval);
        setOutput(target);
        setTimeout(() => setEncrypting(false), 2000);
      }
    }, 50);
  }, [input]);

  useEffect(() => {
    if (inView && !encrypting) {
      const t = setTimeout(runDemo, 500);
      return () => clearTimeout(t);
    }
  }, [inView]);

  return (
    <div ref={ref} className="lp-demo-container">
      <div className="lp-demo-window">
        <div className="lp-demo-titlebar">
          <div className="lp-demo-dots">
            <span style={{ background: "#ff5f57" }} />
            <span style={{ background: "#febc2e" }} />
            <span style={{ background: "#28c840" }} />
          </div>
          <span className="lp-demo-title">KRYPTO_TERMINAL</span>
        </div>
        <div className="lp-demo-body">
          <div className="lp-demo-line">
            <span style={{ color: GREEN }}>&gt; </span>
            <span style={{ color: "#666" }}>input: </span>
            <span style={{ color: "#fff" }}>{input}</span>
          </div>
          <div className="lp-demo-line">
            <span style={{ color: GREEN }}>&gt; </span>
            <span style={{ color: "#666" }}>cipher: </span>
            <span style={{ color: GREEN }}>CAESAR (shift=3)</span>
          </div>
          <div className="lp-demo-line" style={{ marginTop: 8 }}>
            <span style={{ color: GREEN }}>&gt; </span>
            <span style={{ color: "#666" }}>output: </span>
            <span
              style={{
                color: GREEN,
                textShadow: encrypting ? `0 0 10px ${GREEN}` : "none",
                transition: "text-shadow 0.3s",
              }}
            >
              {output || "..."}
            </span>
            <span className="lp-blink">█</span>
          </div>
          {!encrypting && output && (
            <motion.div
              className="lp-demo-line"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{ marginTop: 12 }}
            >
              <span style={{ color: "rgba(0,255,0,0.4)", fontSize: 11 }}>
                ✓ encryption complete — caesar cipher applied
              </span>
            </motion.div>
          )}
        </div>
      </div>
      <motion.button
        className="lp-demo-retry"
        onClick={runDemo}
        whileHover={{ scale: 1.05, boxShadow: `0 0 20px rgba(0,255,0,0.3)` }}
        whileTap={{ scale: 0.95 }}
      >
        ↻ Run Again
      </motion.button>
    </div>
  );
}

// ─── Stat Ring ───────────────────────────────────────────────────────────────
function StatRing({ value, label, sublabel }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const circ = 2 * Math.PI * 45;
  const offset = circ - (value / 100) * circ;

  return (
    <motion.div
      ref={ref}
      className="lp-stat-ring"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <svg width="110" height="110" viewBox="0 0 110 110">
        <circle cx="55" cy="55" r="45" fill="none" stroke="rgba(0,255,0,0.08)" strokeWidth="3" />
        <motion.circle
          cx="55" cy="55" r="45" fill="none" stroke={GREEN} strokeWidth="3"
          strokeLinecap="round" strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={inView ? { strokeDashoffset: offset } : {}}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          style={{
            transformOrigin: "55px 55px",
            transform: "rotate(-90deg)",
            filter: `drop-shadow(0 0 6px ${GREEN_DIM})`,
          }}
        />
        <text x="55" y="52" textAnchor="middle" fill="#fff" fontSize="22" fontFamily={MONO} fontWeight="700">
          {inView ? <AnimatedCounter target={value} /> : "0"}
        </text>
        <text x="55" y="68" textAnchor="middle" fill="rgba(0,255,0,0.5)" fontSize="9" fontFamily={MONO} letterSpacing="1">
          {sublabel}
        </text>
      </svg>
      <span className="lp-stat-ring-label">{label}</span>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── MAIN LANDING PAGE ───────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
export default function LandingPage() {
  const navigate = useNavigate();
  useLenis();

  // ── Siena Parallax: hero scroll refs ────────────────────────────────────
  const heroContainerRef = useRef(null);
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroContainerRef,
    offset: ["start start", "end start"],
  });

  // Hero transforms — scale down + border-radius up as you scroll
  const heroScale = useTransform(heroScrollProgress, [0, 1], [1, 0.82]);
  const heroBorderRadius = useTransform(heroScrollProgress, [0, 1], [0, 32]);
  const heroInnerY = useTransform(heroScrollProgress, [0, 1], [0, -80]);
  const heroOverlayOpacity = useTransform(heroScrollProgress, [0, 0.8, 1], [0, 0, 0.5]);

  // Smoothed with springs for buttery feel
  const smoothScale = useSpring(heroScale, { stiffness: 100, damping: 30 });
  const smoothBR = useSpring(heroBorderRadius, { stiffness: 100, damping: 30 });
  const smoothInnerY = useSpring(heroInnerY, { stiffness: 100, damping: 30 });

  // ── Mouse tracking for 3D tilt on hero ──────────────────────────────────
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springMX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const springMY = useSpring(mouseY, { stiffness: 80, damping: 20 });
  const rotateX = useTransform(springMY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(springMX, [-0.5, 0.5], [-5, 5]);

  const handleMouseMove = useCallback(
    (e) => {
      const el = heroContainerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
      mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [mouseX, mouseY]
  );

  // ── Global scroll progress for the progress bar ────────────────────────
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // ── Reveal text below hero (slides up as hero scales down) ─────────────
  const revealTextRef = useRef(null);
  const { scrollYProgress: revealProgress } = useScroll({
    target: heroContainerRef,
    offset: ["start start", "end start"],
  });
  const revealY = useTransform(revealProgress, [0.3, 1], [100, 0]);
  const revealOpacity = useTransform(revealProgress, [0.3, 0.8], [0, 1]);
  const smoothRevealY = useSpring(revealY, { stiffness: 80, damping: 25 });
  const smoothRevealOpacity = useSpring(revealOpacity, { stiffness: 80, damping: 25 });

  // ── Typed subtitle ─────────────────────────────────────────────────────
  const [subtitle, setSubtitle] = useState("");
  const fullSub = "ADVANCED CRYPTOGRAPHIC ANALYSIS SYSTEM";
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      if (i <= fullSub.length) {
        setSubtitle(fullSub.slice(0, i++));
      } else clearInterval(id);
    }, 50);
    return () => clearInterval(id);
  }, []);

  // ── Nav scroll state ───────────────────────────────────────────────────
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div className="lp-root">
      <NetworkGrid />
      <CursorGlow />

      {/* Scroll progress bar */}
      <motion.div className="lp-progress" style={{ scaleX, transformOrigin: "0%" }} />

      {/* ── Navigation ──────────────────────────────────────────────── */}
      <motion.nav
        className={`lp-nav ${scrolled ? "lp-nav--scrolled" : ""}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.span className="lp-nav-logo" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <span style={{ color: GREEN }}>&gt;</span> KRYPTO
        </motion.span>
        <div className="lp-nav-links">
          {["Features", "How It Works", "Demo", "Stats"].map((l) => (
            <motion.a
              key={l}
              href={`#${l.toLowerCase().replace(/\s+/g, "-")}`}
              className="lp-nav-link"
              whileHover={{ color: GREEN, y: -2 }}
              transition={{ duration: 0.2 }}
            >
              {l}
            </motion.a>
          ))}
          <motion.button
            className="lp-nav-cta"
            onClick={() => navigate("/app")}
            whileHover={{ scale: 1.05, boxShadow: `0 0 25px rgba(0,255,0,0.4)` }}
            whileTap={{ scale: 0.95 }}
          >
            LAUNCH APP
          </motion.button>
        </div>
      </motion.nav>

      {/* ══════════════════════════════════════════════════════════════
           SECTION 1 — SIENA PARALLAX HERO
         ════════════════════════════════════════════════════════════ */}
      <div ref={heroContainerRef} className="lp-hero-wrapper" onMouseMove={handleMouseMove}>
        {/* Sticky hero that scales down */}
        <div className="lp-hero-sticky">
          <motion.div
            className="lp-hero-frame"
            style={{
              scale: smoothScale,
              borderRadius: smoothBR,
            }}
          >
            {/* Matrix rain inside the hero frame */}
            <MatrixRain />
            <FloatingParticles />

            {/* Dark gradient overlay that increases as you scroll */}
            <motion.div
              className="lp-hero-overlay"
              style={{ opacity: heroOverlayOpacity }}
            />

            {/* Scanline */}
            <div className="lp-scanline" />

            {/* Hero content with 3D tilt + parallax inner movement */}
            <motion.div
              className="lp-hero-content"
              style={{ y: smoothInnerY, rotateX, rotateY, perspective: 1200 }}
            >
              {/* Badge */}
              <motion.div
                className="lp-badge"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <span className="lp-badge-dot" />
                SYSTEM ONLINE
              </motion.div>

              {/* Title */}
              <motion.h1
                className="lp-hero-title"
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                <GlitchText text="KRYPTO" />
              </motion.h1>

              {/* Subtitle typing */}
              <motion.p
                className="lp-hero-sub"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {subtitle}
                <span className="lp-blink">█</span>
              </motion.p>

              {/* Description */}
              <motion.p
                className="lp-hero-desc"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.6 }}
              >
                Classical cipher encryption &amp; Automatic decryption.
                <br />
                Break any cipher. Protect any message.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                className="lp-hero-btns"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8, duration: 0.6 }}
              >
                <motion.button
                  className="lp-btn-primary"
                  onClick={() => navigate("/app")}
                  whileHover={{
                    scale: 1.06,
                    boxShadow: `0 0 50px rgba(0,255,0,0.4), 0 0 100px rgba(0,255,0,0.12)`,
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="lp-btn-shine" />
                  &gt; ENTER THE SYSTEM
                </motion.button>
                <motion.a
                  href="#features"
                  className="lp-btn-secondary"
                  whileHover={{ scale: 1.05, borderColor: "rgba(0,255,0,0.6)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  EXPLORE ↓
                </motion.a>
              </motion.div>
            </motion.div>

            {/* Corner decorations */}
            <div className="lp-corner lp-corner--tl" />
            <div className="lp-corner lp-corner--tr" />
            <div className="lp-corner lp-corner--bl" />
            <div className="lp-corner lp-corner--br" />
          </motion.div>

          {/* Text that reveals below the shrinking hero */}
          <motion.div
            ref={revealTextRef}
            className="lp-hero-reveal"
            style={{ y: smoothRevealY, opacity: smoothRevealOpacity }}
          >
            <span className="lp-hero-reveal-line">SCROLL TO EXPLORE</span>
            <motion.div
              className="lp-scroll-indicator"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="lp-scroll-mouse">
                <div className="lp-scroll-dot" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
           SECTION 2 — FEATURES
         ════════════════════════════════════════════════════════════ */}
      <section id="features" className="lp-section">
        <RevealSection>
          <div className="lp-section-header">
            <span className="lp-tag">CAPABILITIES</span>
            <h2 className="lp-section-title">
              <ScrambleText text="WHAT KRYPTO CAN DO" as="span" />
            </h2>
            <p className="lp-section-sub">
              <WordReveal text="A complete cryptographic toolkit powered by machine learning" />
            </p>
          </div>
        </RevealSection>

        <div className="lp-features-grid">
          <FeatureCard
            icon={
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <rect x="4" y="16" width="28" height="16" rx="3" stroke={GREEN} strokeWidth="1.5" />
                <path d="M12 16V10a6 6 0 1 1 12 0v6" stroke={GREEN} strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="18" cy="24" r="2" fill={GREEN} />
              </svg>
            }
            title="ENCRYPT"
            description="Apply Caesar, Vigenère, and Affine ciphers with military-grade precision. Choose your algorithm, set your key, and lock your messages."
            delay={0}
          />
          <FeatureCard
            icon={
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <rect x="4" y="16" width="28" height="16" rx="3" stroke={GREEN} strokeWidth="1.5" />
                <path d="M24 16V10a6 6 0 0 0-12 0v6" stroke={GREEN} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" />
                <circle cx="18" cy="24" r="2" fill={GREEN} />
                <path d="M18 26v3" stroke={GREEN} strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            }
            title="DECRYPT"
            description="Automatic cipher detection using neural networks. Feed in any ciphertext — our AI identifies the algorithm and cracks the key."
            delay={0.15}
          />
          <FeatureCard
            icon={
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="18" r="13" stroke={GREEN} strokeWidth="1.5" />
                <path d="M18 8v10l7 4" stroke={GREEN} strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="18" cy="18" r="2" fill={GREEN} />
              </svg>
            }
            title="ANALYZE"
            description="Real-time statistical analysis with confidence scoring, radar charts, and probability breakdowns for every cipher."
            delay={0.3}
          />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
           SECTION 3 — HOW IT WORKS
         ════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="lp-section">
        <RevealSection>
          <div className="lp-section-header">
            <span className="lp-tag">PROCESS</span>
            <h2 className="lp-section-title">
              <ScrambleText text="HOW IT WORKS" as="span" />
            </h2>
            <p className="lp-section-sub">
              <WordReveal text="From ciphertext to plaintext in milliseconds" />
            </p>
          </div>
        </RevealSection>

        <div className="lp-steps">
          <div className="lp-steps-line" />
          <StepItem number="01" title="PASTE YOUR TEXT" description="Drop any encrypted message into the terminal. No format restrictions — just raw ciphertext." delay={0} />
          <StepItem number="02" title="AI IDENTIFIES CIPHER" description="Our ML model analyzes character frequency, patterns, and statistical features to predict the encryption algorithm." delay={0.15} />
          <StepItem number="03" title="KEY EXTRACTION" description="Using brute-force optimization and heuristic search, the system discovers the encryption key automatically." delay={0.3} />
          <StepItem number="04" title="DECRYPTED OUTPUT" description="Your plaintext is revealed with confidence scores, statistical breakdown, and full cipher analysis." delay={0.45} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
           SECTION 4 — LIVE DEMO
         ════════════════════════════════════════════════════════════ */}
      <section id="demo" className="lp-section">
        <RevealSection>
          <div className="lp-section-header">
            <span className="lp-tag">INTERACTIVE</span>
            <h2 className="lp-section-title">
              <ScrambleText text="LIVE DEMO" as="span" />
            </h2>
            <p className="lp-section-sub">
              <WordReveal text="Watch encryption happen in real-time" />
            </p>
          </div>
        </RevealSection>
        <RevealSection>
          <LiveCipherDemo />
        </RevealSection>
      </section>

      {/* ══════════════════════════════════════════════════════════════
           SECTION 5 — STATS
         ════════════════════════════════════════════════════════════ */}
      <section id="stats" className="lp-section">
        <RevealSection>
          <div className="lp-section-header">
            <span className="lp-tag">METRICS</span>
            <h2 className="lp-section-title">
              <ScrambleText text="BY THE NUMBERS" as="span" />
            </h2>
          </div>
        </RevealSection>

        <div className="lp-stats-grid">
          <StatRing value={99} label="DETECTION ACCURACY" sublabel="%" />
          <StatRing value={3} label="CIPHER ALGORITHMS" sublabel="TYPES" />
          <StatRing value={50} label="AVG CRACK TIME" sublabel="MS" />
          <StatRing value={26} label="KEY SPACE COVERAGE" sublabel="KEYS" />
        </div>

        <RevealSection>
          <div className="lp-stats-row">
            <div className="lp-stat-big">
              <span className="lp-stat-big-num"><AnimatedCounter target={10000} suffix="+" /></span>
              <span className="lp-stat-big-label">MESSAGES PROCESSED</span>
            </div>
            <div className="lp-stat-big">
              <span className="lp-stat-big-num"><AnimatedCounter target={100} suffix="%" /></span>
              <span className="lp-stat-big-label">OPEN SOURCE</span>
            </div>
            <div className="lp-stat-big">
              <span className="lp-stat-big-num"><AnimatedCounter target={0} suffix="" /></span>
              <span className="lp-stat-big-label">DATA STORED</span>
            </div>
          </div>
        </RevealSection>
      </section>

      {/* ══════════════════════════════════════════════════════════════
           SECTION 6 — CTA FOOTER
         ════════════════════════════════════════════════════════════ */}
      <section className="lp-cta-section">
        <div className="lp-cta-grid-bg" />
        <RevealSection className="lp-cta-content">
          <motion.h2
            className="lp-cta-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            READY TO <span style={{ color: GREEN }}>CRACK</span> THE CODE?
          </motion.h2>
          <motion.p
            className="lp-cta-desc"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <CharReveal text="Enter the system. Encrypt your secrets. Break any cipher." delay={0.3} />
          </motion.p>
          <motion.button
            className="lp-cta-btn"
            onClick={() => navigate("/app")}
            whileHover={{
              scale: 1.08,
              boxShadow: `0 0 60px rgba(0,255,0,0.5), 0 0 120px rgba(0,255,0,0.15)`,
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <span className="lp-btn-shine" />
            &gt; LAUNCH KRYPTO
          </motion.button>
          <motion.div
            className="lp-cta-note"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
          >
            <span style={{ color: GREEN }}>●</span> No signup required — 100% client-side encryption
          </motion.div>
        </RevealSection>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <span style={{ color: GREEN }}>&gt;</span> KRYPTO v1.0
          <span style={{ color: "#333" }}>|</span>
          <span style={{ color: "#444" }}>BUILT WITH NEURAL NETWORKS &amp; COFFEE</span>
        </div>
      </footer>
    </div>
  );
}
