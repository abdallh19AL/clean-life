"use client";

import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";

// ─── Mock weight data: 30 days, 85 → 74 kg with realistic variation ──────────
const weightData = Array.from({ length: 30 }, (_, i) => {
  const base = 85 - (11 / 29) * i;
  const v = Math.sin(i * 1.7) * 0.45 + Math.sin(i * 3.1) * 0.2;
  return { day: String(i + 1), weight: Number((base + v).toFixed(1)) };
});

// ─── Animation helpers ────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 20 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: "easeOut" as const },
});

// ─── Custom recharts tooltip ──────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: {
  active?: boolean; payload?: { value: number }[]; label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "white", border: "1px solid rgba(190,175,155,0.3)",
      borderRadius: 12, padding: "10px 16px", boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
      fontFamily: "'Cairo', sans-serif",
    }}>
      <p style={{ color: "#999", fontSize: 12, marginBottom: 2 }}>اليوم {label}</p>
      <p style={{ color: "#3D7A5E", fontSize: 16, fontWeight: 900 }}>{payload[0].value} كغ</p>
    </div>
  );
}

// ─── Horizontal progress bar ──────────────────────────────────────────────────
function HBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>{pct}%</span>
      </div>
      <div style={{ height: 8, borderRadius: 999, background: "rgba(190,175,155,0.2)", overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          style={{ height: "100%", borderRadius: 999, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProgressPage() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        minHeight: "100vh", backgroundColor: "#F8F5F0",
        fontFamily: "'Cairo','Segoe UI',sans-serif",
        direction: "rtl", padding: "32px 28px 56px",
      }}
    >
      {/* Header */}
      <motion.div {...fadeUp(0)} style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: "#1a1a1a", marginBottom: 4 }}>
          متابعة التقدم
        </h1>
        <p style={{ fontSize: 14, color: "#aaa" }}>تتبع رحلتك وتطور جسمك أسبوعاً بأسبوع</p>
      </motion.div>

      {/* ── Stat cards ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, marginBottom: 24 }}
      >
        {[
          { label: "الوزن الحالي",       value: "74",  unit: "كغ", sub: "−11 كغ من البداية",     color: "#3D7A5E" },
          { label: "مؤشر كتلة الجسم",   value: "24.2", unit: "",  sub: "وزن طبيعي ✓",           color: "#5B8CBF" },
          { label: "نسبة الدهون",        value: "18.5", unit: "%", sub: "نسبة صحية مثالية",       color: "#E07A5F" },
        ].map(({ label, value, unit, sub, color }) => (
          <motion.div
            key={label}
            whileHover={{ y: -4, boxShadow: "0 12px 28px rgba(0,0,0,0.10)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{
              background: "rgba(255,255,255,0.85)", border: "1.5px solid rgba(190,175,155,0.22)",
              borderRadius: 20, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.055)",
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 14, background: `${color}1A`,
              display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14,
            }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: color }} />
            </div>
            <p style={{ color: "#999", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", marginBottom: 4 }}>
              {label}
            </p>
            <p style={{ color: "#1a1a1a", fontSize: 26, fontWeight: 900, marginBottom: 4 }}>
              {value}<span style={{ fontSize: 16, color: "#aaa", marginRight: 4 }}>{unit}</span>
            </p>
            <p style={{ color: "#bbb", fontSize: 12 }}>{sub}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Weight chart ── */}
      <motion.div
        {...fadeUp(0.2)}
        style={{
          background: "rgba(255,255,255,0.85)", border: "1.5px solid rgba(190,175,155,0.22)",
          borderRadius: 20, padding: "28px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.055)",
          marginBottom: 24,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: "#1a1a1a", marginBottom: 4 }}>
              تطور الوزن آخر 30 يوم
            </h2>
            <p style={{ fontSize: 13, color: "#aaa" }}>الوزن بالكيلوغرام</p>
          </div>
          <span style={{
            background: "rgba(61,122,94,0.10)", color: "#3D7A5E", fontSize: 13,
            fontWeight: 700, padding: "6px 16px", borderRadius: 30,
          }}>
            −11 كغ 📉
          </span>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={weightData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#3D7A5E" stopOpacity={0.20} />
                <stop offset="95%" stopColor="#3D7A5E" stopOpacity={0}    />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(190,175,155,0.20)" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fill: "#bbb", fontSize: 11, fontFamily: "Cairo" }}
              tickLine={false} axisLine={false}
              ticks={["1","5","10","15","20","25","30"]}
            />
            <YAxis
              domain={[73, 86]}
              tick={{ fill: "#bbb", fontSize: 11, fontFamily: "Cairo" }}
              tickLine={false} axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#3D7A5E", strokeWidth: 1, strokeDasharray: "4 4" }} />
            <Area
              type="monotone" dataKey="weight"
              stroke="#3D7A5E" strokeWidth={2.5}
              fill="url(#weightGrad)"
              dot={false} activeDot={{ r: 5, fill: "#3D7A5E", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* ── BMI + Body composition ── */}
      <motion.div
        {...fadeUp(0.3)}
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}
      >
        {/* BMI */}
        <div style={{
          background: "rgba(255,255,255,0.85)", border: "1.5px solid rgba(190,175,155,0.22)",
          borderRadius: 20, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.055)",
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: "#1a1a1a", marginBottom: 20 }}>
            تحليل مؤشر كتلة الجسم
          </h2>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <p style={{ fontSize: 52, fontWeight: 900, color: "#3D7A5E", lineHeight: 1 }}>24.2</p>
            <span style={{
              display: "inline-block", marginTop: 8,
              background: "rgba(61,122,94,0.12)", color: "#3D7A5E",
              fontSize: 14, fontWeight: 700, padding: "6px 20px", borderRadius: 30,
            }}>
              ✓ وزن طبيعي
            </span>
          </div>
          {/* BMI scale bar */}
          <div style={{ marginTop: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#bbb", marginBottom: 6 }}>
              <span>نحيف<br/>{"<18.5"}</span>
              <span style={{ textAlign: "center" }}>طبيعي<br/>18.5–25</span>
              <span style={{ textAlign: "left" }}>زائد<br/>{">25"}</span>
            </div>
            <div style={{ position: "relative", height: 10, borderRadius: 999, overflow: "hidden", display: "flex" }}>
              <div style={{ flex: 1, background: "#93C5FD" }} />
              <div style={{ flex: 1.5, background: "#6EE7B7" }} />
              <div style={{ flex: 1, background: "#FCD34D" }} />
              <div style={{ flex: 0.8, background: "#FCA5A5" }} />
            </div>
            {/* Indicator */}
            <div style={{ position: "relative", height: 16, marginTop: 4 }}>
              <motion.div
                initial={{ left: "0%" }} animate={{ left: "38%" }}
                transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                style={{
                  position: "absolute", top: 0, transform: "translateX(-50%)",
                  width: 2, height: 16, background: "#3D7A5E",
                  borderRadius: 1,
                }}
              />
            </div>
            <p style={{ textAlign: "center", fontSize: 11, color: "#3D7A5E", fontWeight: 700 }}>
              أنت هنا ← 24.2
            </p>
          </div>
        </div>

        {/* Body composition */}
        <div style={{
          background: "rgba(255,255,255,0.85)", border: "1.5px solid rgba(190,175,155,0.22)",
          borderRadius: 20, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.055)",
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: "#1a1a1a", marginBottom: 24 }}>
            تركيب الجسم
          </h2>
          <HBar label="كتلة العضلات"  pct={35}   color="#3D7A5E" />
          <HBar label="نسبة الدهون"   pct={18.5} color="#E07A5F" />
          <HBar label="نسبة الماء"    pct={60}   color="#5B8CBF" />
          <HBar label="الكثافة العظمية" pct={4.5}  color="#9B7EC8" />
        </div>
      </motion.div>
    </motion.div>
  );
}
