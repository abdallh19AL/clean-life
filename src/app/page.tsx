"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  animate,
  useInView,
} from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Star, Users, TrendingUp, Clock, Headphones,
  Activity, Dumbbell, Apple, BookOpen, Heart,
  X, Volume2, VolumeX, Sparkles,
  Home as HomeIcon, ShoppingBag, Calculator, HeartPulse,
} from "lucide-react";
import SiteNavbar from "@/components/SiteNavbar";

/* ─── Data ───────────────────────────────────────────────────────────────── */

const marqueeItems = [
  { icon: "⭐", text: "خسرت 12 كيلو في 90 يوم" },
  { icon: "💪", text: "تحسنت قوتي البدنية بشكل ملحوظ" },
  { icon: "🥗", text: "نظامي الغذائي تغيّر للأبد" },
  { icon: "🏃", text: "أصبحت أتمرن يومياً بلا انقطاع" },
  { icon: "⭐", text: "أفضل استثمار في صحتي" },
  { icon: "🎯", text: "أهدافي أصبحت واقعاً ملموساً" },
  { icon: "🔥", text: "طاقتي تضاعفت خلال أسابيع" },
  { icon: "🌟", text: "نتائج تفوق كل توقعاتي" },
];

/* ─── AnimatedCounter ────────────────────────────────────────────────────── */

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const ctrl = animate(0, value, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => ctrl.stop();
  }, [isInView, value]);

  return <span ref={ref}>{display}{suffix}</span>;
}

/* ─── MagneticButton ─────────────────────────────────────────────────────── */

function MagneticButton({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 15 });
  const sy = useSpring(y, { stiffness: 150, damping: 15 });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width  / 2) * 0.25);
    y.set((e.clientY - r.top  - r.height / 2) * 0.25);
  }
  function onLeave() { x.set(0); y.set(0); }

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy, display: "inline-block" }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </motion.div>
  );
}

/* ─── FloatingOrbs ───────────────────────────────────────────────────────── */

const ORBS = [
  { size: 320, color: "#0D948818", top: "8%",  left: "3%",  dur: 11, dy: [-28, 18],  dx: [12, -16] },
  { size: 220, color: "#52B78814", top: "55%", left: "78%", dur: 13, dy: [20, -32],  dx: [-12, 18] },
  { size: 160, color: "#D9770614", top: "25%", left: "68%", dur: 9,  dy: [-22, 26],  dx: [16, -10] },
  { size: 260, color: "#2D6A4F12", top: "70%", left: "14%", dur: 12, dy: [16, -22],  dx: [-14, 12] },
  { size: 190, color: "#0D948810", top: "3%",  left: "50%", dur: 10, dy: [-18, 24],  dx: [10, -15] },
];

function FloatingOrbs() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {ORBS.map((o, i) => (
        <div
          key={i}
          style={{
            position: "absolute", width: o.size, height: o.size,
            borderRadius: "50%", background: o.color,
            top: o.top, left: o.left,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Scroll indicator ───────────────────────────────────────────────────── */

function ScrollIndicator() {
  return (
    <div
      className="scroll-indicator-wrap"
      style={{
        position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 6, zIndex: 10,
      }}
    >
      <svg width="24" height="38" viewBox="0 0 24 38" fill="none">
        <rect x="1" y="1" width="22" height="36" rx="11" stroke="#0D9488" strokeWidth="2" />
        <rect
          x="11" y="7" width="2" height="7" rx="1" fill="#0D9488"
          className="scroll-dot-animate"
        />
      </svg>
      <p style={{ color: "#78716C", fontSize: 11, fontWeight: 600 }}>مرر للأسفل</p>
    </div>
  );
}

/* ─── Card variants ──────────────────────────────────────────────────────── */

const cardVars = {
  hidden:  { opacity: 0, scale: 0.95, y: 24 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
  hover: {
    y: -8,
    transition: { type: "spring" as const, stiffness: 300, damping: 20 },
  },
};

const iconVars = {
  hidden:  { rotate: 0 },
  visible: { rotate: 0 },
  hover:   { rotate: [0, -10, 10, 0], transition: { duration: 0.45 } },
};

/* ─── GlowBlob ───────────────────────────────────────────────────────────── */

function GlowBlob({ color, delay = 0 }: { color: string; delay?: number }) {
  return (
    <motion.div
      style={{
        position: "absolute", top: -20, left: -20,
        width: 90, height: 90, borderRadius: "50%",
        filter: "blur(22px)", backgroundColor: color,
        pointerEvents: "none",
      }}
      animate={{ scale: [1, 1.5, 1], opacity: [0.25, 0.6, 0.25] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

/* ─── Animation helpers ──────────────────────────────────────────────────── */

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 40 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const inView = (delay = 0) => ({
  initial:     { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0  },
  viewport:    { once: true        },
  transition:  { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
});

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function Home() {
  const router = useRouter();

  /* Modal state */
  const [aboutOpen, setAboutOpen]   = useState(false);
  const [videoOpen, setVideoOpen]   = useState(false);
  const [muted,     setMuted]       = useState(true);
  const [videoError, setVideoError] = useState(false);

  /* Lock body scroll while any modal is open */
  useEffect(() => {
    document.body.style.overflow = aboutOpen || videoOpen ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [aboutOpen, videoOpen]);

  /* Reset video error each time the modal opens */
  useEffect(() => {
    if (videoOpen) setVideoError(false);
  }, [videoOpen]);

  /* (dashboard 3-D scroll effect removed — expensive rotateX+boxShadow on scroll) */

  /* Hero parallax */
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroP } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroBgY     = useTransform(heroP, [0, 1], [0, 150]);
  const heroTextY   = useTransform(heroP, [0, 1], [0, -80]);
  const heroOpacity = useTransform(heroP, [0, 1], [1, 0]);

  return (
    <div dir="rtl" style={{ fontFamily: "'Cairo', sans-serif", backgroundColor: "#F7F3EC", color: "#1C1917" }}>

      {/* ── FIX 1: Sticky landing navbar ── */}
      <SiteNavbar ctaLabel="وصفاتنا الصحية" ctaHref="/recipes" />

      {/* ══════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          justifyContent: "center", alignItems: "center", textAlign: "center",
          padding: "112px 16px 80px", position: "relative", overflow: "hidden",
          backgroundColor: "#F7F3EC",
        }}
      >
        <motion.div style={{ y: heroBgY, position: "absolute", inset: 0, zIndex: 0 }}>
          <FloatingOrbs />
        </motion.div>

        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: 800, height: 800, borderRadius: "50%", pointerEvents: "none", zIndex: 0,
          background: "radial-gradient(circle, #0D948812 0%, transparent 65%)",
        }} />

        <motion.div style={{ y: heroTextY, opacity: heroOpacity, position: "relative", zIndex: 10, width: "100%", maxWidth: 900 }}>

          <motion.div
            {...fadeUp(0)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "8px 20px", borderRadius: 999, fontSize: 14, fontWeight: 700,
              backgroundColor: "#CCFBF1", color: "#0D9488", border: "1px solid #99F6E4",
              marginBottom: 28,
            }}
          >
            <Star style={{ width: 16, height: 16 }} />
            <span>منصة رعاية صحية بمعايير عالمية</span>
          </motion.div>

          <motion.h1
            {...fadeUp(0.15)}
            style={{
              fontSize: "clamp(2.2rem, 6vw, 4.5rem)", fontWeight: 900,
              lineHeight: 1.3, color: "#1C1917", marginBottom: 24,
            }}
          >
            نحت جسمك ورعايتك الصحية
            <br />
            <span className="gradient-shift">
              بمعايير عالمية
            </span>
          </motion.h1>

          <motion.p
            {...fadeUp(0.3)}
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.2rem)", color: "#57534E",
              lineHeight: 1.8, maxWidth: 600, margin: "0 auto 36px",
            }}
          >
            برامج متكاملة للتدريب والتغذية والرعاية الصحية، مصممة خصيصاً لأهدافك الشخصية
            وتمنحك نتائج حقيقية مستدامة.
          </motion.p>

          <motion.div
            {...fadeUp(0.45)}
            style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16 }}
          >
            <MagneticButton>
              <button
                onClick={() => setVideoOpen(true)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "14px clamp(20px,5vw,32px)", borderRadius: 18,
                  backgroundColor: "#0D9488", color: "white", fontWeight: 700,
                  fontSize: "clamp(14px,4vw,17px)",
                  boxShadow: "0 8px 32px rgba(13,148,136,0.35)",
                  border: "none", cursor: "pointer", fontFamily: "inherit",
                }}
              >
                ابدأ رحلتك
                <ArrowLeft style={{ width: 20, height: 20 }} />
              </button>
            </MagneticButton>
            <MagneticButton>
              <button
                onClick={() => setAboutOpen(true)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "14px clamp(20px,5vw,32px)", borderRadius: 18,
                  backgroundColor: "white", color: "#0D9488", fontWeight: 700,
                  fontSize: "clamp(14px,4vw,17px)",
                  border: "2px solid #0D9488",
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >
                تعرف علينا
              </button>
            </MagneticButton>
          </motion.div>
        </motion.div>

        <ScrollIndicator />
      </section>

      {/* ══════════════════════════════════════════════════════════════
          MINI DASHBOARD PREVIEW
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "80px 16px", overflow: "hidden", backgroundColor: "#F7F3EC" }}>
        <motion.div {...inView(0)} style={{ textAlign: "center", maxWidth: 576, margin: "0 auto 56px" }}>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 900, marginBottom: 12, color: "#1C1917" }}>
            لوحة تحكم ذكية بين يديك
          </h2>
          <p style={{ fontSize: 18, color: "#57534E" }}>
            تابع تقدمك، سجّل وجباتك، وراجع خطة تدريبك كل يوم
          </p>
        </motion.div>

        <div style={{ maxWidth: 768, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
            style={{
              borderRadius: 24, overflow: "hidden",
              boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
            }}
          >
            <div style={{ backgroundColor: "#fff", border: "1px solid #E7E5E4" }}>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "16px 24px", borderBottom: "1px solid #F5F5F4", backgroundColor: "#FAFAF9",
              }}>
                <div style={{ display: "flex", gap: 6 }}>
                  {["#EF4444","#F59E0B","#10B981"].map(c => (
                    <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: c }} />
                  ))}
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#78716C" }}>لوحة التحكم — حياة نظيفة</span>
                <Heart style={{ width: 20, height: 20, color: "#0D9488" }} />
              </div>
              <div style={{ padding: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ borderRadius: 16, padding: 20, backgroundColor: "#F0FDFA", border: "1px solid #99F6E4" }}>
                  <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, color: "#0D9488" }}>أيام الالتزام</p>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                    <span style={{ fontSize: 48, fontWeight: 900, color: "#0F766E", lineHeight: 1 }}>42</span>
                    <span style={{ fontSize: 18, color: "#0D9488", marginBottom: 4 }}>يوم 🔥</span>
                  </div>
                  <div style={{ display: "flex", gap: 4, marginTop: 12 }}>
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div key={i} style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: i < 6 ? "#0D9488" : "#CCFBF1" }} />
                    ))}
                  </div>
                </div>
                <div style={{ borderRadius: 16, padding: 20, backgroundColor: "#FFFBEB", border: "1px solid #FDE68A" }}>
                  <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, color: "#D97706" }}>الوزن الحالي</p>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                    <span style={{ fontSize: 48, fontWeight: 900, color: "#B45309", lineHeight: 1 }}>78</span>
                    <span style={{ fontSize: 18, color: "#D97706", marginBottom: 4 }}>كغ ↓</span>
                  </div>
                  <p style={{ fontSize: 14, marginTop: 4, color: "#92400E" }}>−5 كغ منذ البداية</p>
                </div>
                <div style={{ borderRadius: 16, padding: 20, gridColumn: "1 / -1", backgroundColor: "#F9FAFB", border: "1px solid #E5E7EB" }}>
                  <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "#374151" }}>مهام اليوم</p>
                  {["تمرين الصباح 30 دقيقة", "تناول وجبة البروتين", "8 أكواب ماء"].map((task, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        backgroundColor: i < 2 ? "#0D9488" : "#E5E7EB",
                      }}>
                        {i < 2 && <span style={{ color: "white", fontSize: 11 }}>✓</span>}
                      </div>
                      <span style={{ fontSize: 14, color: i < 2 ? "#9CA3AF" : "#111827", textDecoration: i < 2 ? "line-through" : "none" }}>
                        {task}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          INFINITE MARQUEE
      ══════════════════════════════════════════════════════════════ */}
      <section style={{
        padding: "40px 0", overflow: "hidden",
        backgroundColor: "#F0FDFA", borderTop: "1px solid #CCFBF1", borderBottom: "1px solid #CCFBF1",
      }}>
        <div dir="ltr">
          <motion.div
            style={{ display: "flex", gap: 20, width: "max-content" }}
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          >
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <div
                key={i} dir="rtl"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "12px 20px", borderRadius: 999, flexShrink: 0,
                  fontWeight: 600, fontSize: 14, whiteSpace: "nowrap",
                  backgroundColor: "white", border: "1px solid #99F6E4", color: "#0F766E",
                }}
              >
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          STATS
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "80px 16px", backgroundColor: "#F7F3EC" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            { num: 500, suffix: "+", label: "عميل ناجح",   Icon: Users,      special: null  },
            { num: 98,  suffix: "%", label: "نسبة الرضا",  Icon: TrendingUp, special: null  },
            { num: 90,  suffix: "",  label: "يوم للنتائج", Icon: Clock,      special: null  },
            { num: 0,   suffix: "",  label: "دعم متواصل",  Icon: Headphones, special: "24/7"},
          ].map(({ num, suffix, label, Icon, special }, i) => (
            <motion.div
              key={i}
              {...inView(i * 0.1)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                textAlign: "center", padding: 24, borderRadius: 20,
                backgroundColor: "white", border: "1px solid #E7E5E4",
                boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
              }}
            >
              <Icon style={{ width: 32, height: 32, color: "#0D9488", marginBottom: 12 }} />
              <div style={{ fontSize: "clamp(1.8rem, 4vw, 2.4rem)", fontWeight: 900, marginBottom: 4, color: "#0D9488" }}>
                {special ?? <AnimatedCounter value={num} suffix={suffix} />}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#78716C" }}>{label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          BENTO GRID — Services
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "80px 16px", backgroundColor: "#F7F3EC" }}>
        <div className="max-w-5xl mx-auto">
          <motion.div {...inView(0)} style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 900, marginBottom: 12, color: "#1C1917" }}>
              خدماتنا المتكاملة
            </h2>
            <p style={{ fontSize: 18, color: "#57534E" }}>كل ما تحتاجه لرحلة صحية ناجحة في مكان واحد</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-[auto_auto] gap-5">
            <motion.div
              variants={cardVars} initial="hidden" whileInView="visible" whileHover="hover"
              viewport={{ once: true }} transition={{ delay: 0.1 }}
              style={{ padding: 28, borderRadius: 24, display: "flex", flexDirection: "column", gap: 16, backgroundColor: "#F0FDFA", border: "1px solid #99F6E4", position: "relative", overflow: "hidden", cursor: "default" }}
            >
              <GlowBlob color="#0D948840" delay={0} />
              <motion.div variants={iconVars}><Dumbbell style={{ width: 40, height: 40, color: "#0D9488" }} /></motion.div>
              <h3 style={{ fontSize: 20, fontWeight: 900, color: "#134E4A" }}>برامج التدريب المخصصة</h3>
              <p style={{ lineHeight: 1.7, color: "#115E59" }}>خطط تمرين فردية من مدربين معتمدين دولياً تناسب مستواك وأهدافك الشخصية</p>
            </motion.div>

            <motion.div
              variants={cardVars} initial="hidden" whileInView="visible" whileHover="hover"
              viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="md:row-span-2"
              style={{ padding: 28, borderRadius: 24, display: "flex", flexDirection: "column", gap: 16, backgroundColor: "#FFFBEB", border: "1px solid #FDE68A", position: "relative", overflow: "hidden", cursor: "default" }}
            >
              <GlowBlob color="#D9770640" delay={1} />
              <motion.div variants={iconVars}><Apple style={{ width: 40, height: 40, color: "#D97706" }} /></motion.div>
              <h3 style={{ fontSize: 20, fontWeight: 900, color: "#78350F" }}>التغذية العلاجية</h3>
              <p style={{ lineHeight: 1.7, color: "#92400E" }}>أنظمة غذائية مخصصة وعلمية بإشراف أخصائيي التغذية المعتمدين الذين يفهمون احتياجات جسمك</p>
              <div style={{ marginTop: "auto", borderRadius: 16, padding: 16, backgroundColor: "white", border: "1px solid #FDE68A" }}>
                <p style={{ fontSize: 12, fontWeight: 700, marginBottom: 12, color: "#92400E" }}>خطة وجبات اليوم</p>
                {["إفطار صحي — 400 سعرة", "وجبة متوسطة — 600 سعرة", "عشاء خفيف — 350 سعرة"].map((meal, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, backgroundColor: "#D97706" }} />
                    <span style={{ fontSize: 12, color: "#78350F" }}>{meal}</span>
                  </div>
                ))}
                <div style={{ borderTop: "1px solid #FDE68A", paddingTop: 12, marginTop: 4 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
                    <span style={{ color: "#92400E" }}>إجمالي السعرات</span>
                    <span style={{ color: "#D97706" }}>1350 / 1800</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, overflow: "hidden", backgroundColor: "#FEF3C7" }}>
                    <div style={{ height: "100%", width: "75%", borderRadius: 3, backgroundColor: "#D97706" }} />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={cardVars} initial="hidden" whileInView="visible" whileHover="hover"
              viewport={{ once: true }} transition={{ delay: 0.3 }}
              style={{ padding: 28, borderRadius: 24, display: "flex", flexDirection: "column", gap: 16, backgroundColor: "#ECFDF5", border: "1px solid #A7F3D0", position: "relative", overflow: "hidden", cursor: "default" }}
            >
              <GlowBlob color="#05966940" delay={0.5} />
              <motion.div variants={iconVars}><Activity style={{ width: 40, height: 40, color: "#059669" }} /></motion.div>
              <h3 style={{ fontSize: 20, fontWeight: 900, color: "#064E3B" }}>متابعة التقدم الأسبوعي</h3>
              <p style={{ lineHeight: 1.7, color: "#065F46" }}>تقارير تفصيلية ولوحة ذكية تعكس تطورك الحقيقي أسبوعاً بأسبوع</p>
            </motion.div>

            <motion.div
              variants={cardVars} initial="hidden" whileInView="visible" whileHover="hover"
              viewport={{ once: true }} transition={{ delay: 0.4 }}
              className="md:col-span-2"
              style={{ padding: 28, borderRadius: 24, display: "flex", flexDirection: "column", gap: 16, backgroundColor: "#F0FDFA", border: "1px solid #99F6E4", position: "relative", overflow: "hidden", cursor: "default" }}
            >
              <GlowBlob color="#0D948830" delay={1.5} />
              <motion.div variants={iconVars}><BookOpen style={{ width: 40, height: 40, color: "#0D9488" }} /></motion.div>
              <h3 style={{ fontSize: 20, fontWeight: 900, color: "#134E4A" }}>مكتبة المحتوى الصحي</h3>
              <p style={{ lineHeight: 1.7, color: "#115E59" }}>مئات المقالات والفيديوهات التعليمية المتخصصة لبناء عادات صحية واعية ومستدامة تدوم طوال العمر</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "96px 16px", backgroundColor: "#F7F3EC" }}>
        <motion.div
          {...inView(0)}
          style={{
            maxWidth: 896, margin: "0 auto", borderRadius: 28,
            padding: "64px 48px", textAlign: "center",
            position: "relative", overflow: "hidden",
            background: "linear-gradient(135deg, #064E3B 0%, #065F46 55%, #0D9488 100%)",
            boxShadow: "0 24px 64px rgba(6,78,59,0.35)",
          }}
        >
          <motion.div animate={{ y: [-10, 10, -10], x: [-5, 8, -5] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            style={{ position: "absolute", top: 0, right: 0, width: 256, height: 256, borderRadius: "50%", backgroundColor: "#34D399", opacity: 0.10, transform: "translate(25%, -50%)", pointerEvents: "none" }} />
          <motion.div animate={{ y: [10, -10, 10], x: [5, -8, 5] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            style={{ position: "absolute", bottom: 0, left: 0, width: 192, height: 192, borderRadius: "50%", backgroundColor: "#6EE7B7", opacity: 0.10, transform: "translate(-25%, 50%)", pointerEvents: "none" }} />
          <motion.div animate={{ scale: [1, 1.25, 1], opacity: [0.04, 0.12, 0.04] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            style={{ position: "absolute", top: "50%", left: "50%", width: 320, height: 320, borderRadius: "50%", backgroundColor: "#A7F3D0", transform: "translate(-50%, -50%)", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 10 }}>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900, color: "white", marginBottom: 16 }}>ابدأ تحولك الصحي اليوم</h2>
            <p style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", color: "#A7F3D0", lineHeight: 1.8, maxWidth: 560, margin: "0 auto 36px" }}>
              انضم إلى أكثر من 500 عميل حققوا أهدافهم الصحية مع فريقنا المتخصص. رحلتك تبدأ بخطوة واحدة.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16 }}>
              <MagneticButton>
                <button onClick={() => setVideoOpen(true)}
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 32px", borderRadius: 18, backgroundColor: "white", color: "#064E3B", fontWeight: 700, fontSize: 17, boxShadow: "0 4px 20px rgba(0,0,0,0.18)", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                  ابدأ رحلتك <ArrowLeft style={{ width: 20, height: 20 }} />
                </button>
              </MagneticButton>
              <MagneticButton>
                <button onClick={() => setAboutOpen(true)}
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 32px", borderRadius: 18, color: "white", fontWeight: 700, fontSize: 17, border: "2px solid rgba(255,255,255,0.45)", backgroundColor: "transparent", cursor: "pointer", fontFamily: "inherit" }}>
                  تعرف علينا
                </button>
              </MagneticButton>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════════ */}
      <footer style={{ padding: "48px 16px", backgroundColor: "#1C1917", color: "#A8A29E" }}>
        <div className="max-w-5xl mx-auto">
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 900, marginBottom: 4, color: "white" }}>حياة نظيفة</h3>
              <p style={{ fontSize: 14 }}>رعايتك الصحية بمعايير عالمية</p>
            </div>
            <div style={{ display: "flex", gap: 24, fontSize: 14, fontWeight: 500 }}>
              <Link href="/dashboard" style={{ color: "#A8A29E", textDecoration: "none" }}>لوحة التحكم</Link>
              <Link href="/services" style={{ color: "#A8A29E", textDecoration: "none" }}>الخدمات</Link>
              <Link href="/contact" style={{ color: "#A8A29E", textDecoration: "none" }}>تواصل معنا</Link>
            </div>
          </div>
          <div style={{ marginTop: 32, paddingTop: 24, textAlign: "center", fontSize: 14, borderTop: "1px solid #292524" }}>
            <p>© 2026 حياة نظيفة — جميع الحقوق محفوظة</p>
          </div>
        </div>
      </footer>

      {/* ══════════════════════════════════════════════════════════════
          MODAL 1 — About Us (FIX 2: enhanced content)
      ══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {aboutOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setAboutOpen(false)}
            style={{
              position: "fixed", inset: 0,
              backgroundColor: "rgba(20,30,25,0.55)",
              backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
              zIndex: 200,
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "20px 16px",
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: 680, width: "100%",
                backgroundColor: "#F8F5F0",
                borderRadius: 24, padding: "clamp(20px,5vw,48px)",
                boxShadow: "0 30px 80px rgba(0,0,0,0.25)",
                position: "relative",
                direction: "rtl",
                fontFamily: "'Cairo','Segoe UI',sans-serif",
                maxHeight: "90vh", overflowY: "auto",
              }}
            >
              {/* Close */}
              <button
                onClick={() => setAboutOpen(false)}
                style={{
                  position: "absolute", top: 16, left: 16,
                  width: 32, height: 32, borderRadius: "50%",
                  backgroundColor: "rgba(190,175,155,0.20)",
                  border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(190,175,155,0.40)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(190,175,155,0.20)")}
              >
                <X size={16} color="#888" />
              </button>

              {/* Icon */}
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "linear-gradient(135deg, #2D6A4F, #52B788)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto", boxShadow: "0 6px 20px rgba(45,106,79,0.30)",
              }}>
                <Sparkles size={24} color="white" />
              </div>

              {/* Title */}
              <h2 style={{ fontSize: 26, fontWeight: 900, color: "#1A2E22", textAlign: "center", marginTop: 16, marginBottom: 6 }}>
                عيادة Clean Life
              </h2>

              {/* Subtitle */}
              <p style={{ color: "#7AA090", fontSize: 13, letterSpacing: "0.15em", textTransform: "uppercase", textAlign: "center", marginBottom: 20 }}>
                رحلة التحول الكاملة
              </p>

              {/* Opening paragraph */}
              <p style={{ fontSize: 15, color: "#4A6B5C", lineHeight: 1.9, textAlign: "center", marginBottom: 8 }}>
                في عيادة Clean Life، نؤمن أن الصحة ليست مجرد رقم على الميزان، بل أسلوب حياة متكامل يجمع بين الجسد والعقل والروح. منذ تأسيسنا، ساعدنا أكثر من 500 شخص على إعادة اكتشاف أفضل نسخة من أنفسهم.
              </p>

              {/* Section header */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 24, marginBottom: 12 }}>
                <div style={{ width: 3, height: 22, borderRadius: 2, backgroundColor: "#3D7A5E", flexShrink: 0 }} />
                <p style={{ fontSize: 16, fontWeight: 800, color: "#1A2E22" }}>ماذا يميزنا؟</p>
              </div>

              {/* Feature rows */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  {
                    Icon: HeartPulse,
                    title: "نهج علمي مدروس",
                    desc: "خطط مبنية على أحدث الأبحاث في التغذية وعلوم الرياضة، مخصصة لتناسب جسمك وأهدافك بدقة.",
                  },
                  {
                    Icon: Users,
                    title: "فريق من الخبراء",
                    desc: "أخصائيو تغذية معتمدون، مدربون شخصيون محترفون، وأطباء متخصصون متاحون لمتابعة رحلتك.",
                  },
                  {
                    Icon: TrendingUp,
                    title: "نتائج مستدامة",
                    desc: "نركز على بناء عادات تدوم مدى الحياة، لا على حلول سريعة وقتية. تحولك يبدأ من الداخل.",
                  },
                ].map(({ Icon, title, desc }) => (
                  <div key={title} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                      background: "linear-gradient(135deg, #2D6A4F22, #52B78822)",
                      border: "1.5px solid rgba(61,122,94,0.20)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Icon size={18} color="#3D7A5E" />
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 800, color: "#1A2E22", marginBottom: 4 }}>{title}</p>
                      <p style={{ fontSize: 13, color: "#6B8C7E", lineHeight: 1.7 }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quote box */}
              <div style={{
                marginTop: 24,
                backgroundColor: "rgba(61,122,94,0.06)",
                borderRight: "3px solid #3D7A5E",
                padding: "16px 20px", borderRadius: 12,
              }}>
                <p style={{ fontSize: 14, fontStyle: "italic", color: "#2D6A4F", fontWeight: 600, lineHeight: 1.7 }}>
                  "هدفنا ليس فقط تغيير شكلك، بل تغيير علاقتك بنفسك وبصحتك للأبد."
                </p>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 mb-6">
                {[
                  { num: "+500", label: "عميل سعيد" },
                  { num: "98%",  label: "معدل الرضا" },
                  { num: "12+",  label: "سنة خبرة"  },
                ].map(({ num, label }) => (
                  <div key={label} style={{ textAlign: "center", padding: "16px 8px", backgroundColor: "white", borderRadius: 14, border: "1px solid rgba(190,175,155,0.22)" }}>
                    <p style={{ fontSize: 22, fontWeight: 900, color: "#3D7A5E", lineHeight: 1.1 }}>{num}</p>
                    <p style={{ fontSize: 12, color: "#aaa", fontWeight: 600, marginTop: 4 }}>{label}</p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button
                onClick={() => { setAboutOpen(false); setVideoOpen(true); }}
                style={{
                  width: "100%", padding: "14px 24px", borderRadius: 14,
                  backgroundColor: "transparent", border: "2px solid #2D6A4F",
                  color: "#2D6A4F", fontWeight: 700, fontSize: 15,
                  fontFamily: "inherit", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  gap: 8, transition: "background 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(61,122,94,0.08)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent")}
              >
                ابدأ رحلتك معنا ←
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════
          MODAL 2 — Cinematic Video (FIX 3: gradient fallback)
      ══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {videoOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "fixed", inset: 0,
              backgroundColor: "rgba(0,0,0,0.92)",
              zIndex: 300,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              direction: "rtl", fontFamily: "'Cairo','Segoe UI',sans-serif",
            }}
          >
            {/* Close */}
            <button
              onClick={() => setVideoOpen(false)}
              style={{
                position: "absolute", top: 24, left: 24,
                width: 40, height: 40, borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.10)",
                border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.15s", zIndex: 10,
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(255,255,255,0.20)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(255,255,255,0.10)")}
            >
              <X size={20} color="white" />
            </button>


            {/* Video / fallback container */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: "90%", maxWidth: 900,
                aspectRatio: "16 / 9",
                borderRadius: 16, overflow: "hidden",
                position: "relative",
                boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
              }}
            >
              {/* YouTube embed */}
              <iframe
                src="https://www.youtube.com/embed/V7JFuRFJFV8?autoplay=1&mute=1&loop=1&playlist=V7JFuRFJFV8&controls=0&showinfo=0&rel=0"
                style={{ width: "100%", height: "100%", border: "none", borderRadius: 16 }}
                allow="autoplay; fullscreen"
                allowFullScreen
              />
              {/* Gradient overlay */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: 200,
                background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)",
                pointerEvents: "none",
              }} />
              {/* Text overlay */}
              <div style={{
                position: "absolute", bottom: 40, left: "50%",
                transform: "translateX(-50%)",
                textAlign: "center", zIndex: 2, width: "100%",
              }}>
                <p style={{ color: "rgba(255,255,255,0.7)", letterSpacing: "0.2em", fontSize: 12, fontWeight: 600 }}>
                  ابدأ رحلة التحول
                </p>
                <p style={{ fontSize: 32, fontWeight: 900, color: "white", marginTop: 8 }}>
                  حياتك تبدأ الآن
                </p>
              </div>
            </motion.div>

            {/* Skip button */}
            <div style={{ marginTop: 24 }}>
              <MagneticButton>
                <button
                  onClick={() => router.push("/dashboard")}
                  style={{
                    padding: "14px 28px", borderRadius: 16,
                    backgroundColor: "white", color: "#1B4332",
                    fontWeight: 700, fontSize: 16,
                    border: "none", cursor: "pointer",
                    fontFamily: "inherit",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.30)",
                  }}
                >
                  تخطي إلى لوحة التحكم ←
                </button>
              </MagneticButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
