"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Droplets, RotateCcw } from "lucide-react";

const GOAL = 8; // cups

function getMotivation(filled: number): { text: string; color: string; emoji: string } {
  if (filled === 0) return { text: "ابدأ يومك بكوب ماء! 💧", color: "#aaa", emoji: "😴" };
  if (filled <= 2)  return { text: "بداية جيدة، واصل الشرب!", color: "#5B8CBF", emoji: "🙂" };
  if (filled <= 4)  return { text: "في منتصف الطريق، ممتاز!", color: "#40916C", emoji: "💪" };
  if (filled <= 6)  return { text: "رائع! قريب من هدفك اليومي", color: "#3D7A5E", emoji: "🌟" };
  if (filled < 8)   return { text: "كوب أو كوبان وتصل للهدف!", color: "#2D6A4F", emoji: "🔥" };
  return             { text: "أحسنت! وصلت لهدفك اليومي! 🎉", color: "#27AE60", emoji: "🏆" };
}

export default function WaterPage() {
  const router = useRouter();
  const [cups, setCups] = useState<boolean[]>(Array(GOAL).fill(false));

  const filled = cups.filter(Boolean).length;
  const liters = (filled * 0.25).toFixed(2);
  const motivation = getMotivation(filled);
  const pct = Math.round((filled / GOAL) * 100);

  function toggleCup(i: number) {
    setCups(prev => {
      const next = [...prev];
      // Fill/unfill in sequence: clicking cup i fills all up to i, or unfills from i
      if (prev[i]) {
        // Unfill this and all after
        return next.map((v, idx) => idx < i ? v : false);
      } else {
        // Fill all up to and including i
        return next.map((v, idx) => idx <= i ? true : v);
      }
    });
  }

  function reset() {
    setCups(Array(GOAL).fill(false));
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45 }}
      dir="rtl"
      style={{
        minHeight: "100vh", backgroundColor: "#F8F5F0",
        fontFamily: "'Cairo','Segoe UI',sans-serif",
        padding: "32px 28px 80px",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
        <motion.button
          whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/dashboard")}
          style={{
            width: 40, height: 40, borderRadius: 12, border: "none",
            backgroundColor: "rgba(255,255,255,0.85)",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <ArrowRight size={18} color="#5B8CBF" />
        </motion.button>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: "#1a1a1a", marginBottom: 2 }}>
            تتبع شرب الماء
          </h1>
          <p style={{ fontSize: 13, color: "#aaa" }}>الهدف اليومي: 2.5 لتر (8 أكواب)</p>
        </div>
      </div>

      {/* Progress card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        style={{
          backgroundColor: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(190,175,155,0.22)",
          borderRadius: 24, padding: 28,
          boxShadow: "0 2px 16px rgba(80,60,30,0.07)",
          marginBottom: 20, textAlign: "center",
        }}
      >
        {/* Big number */}
        <div style={{ marginBottom: 16 }}>
          <motion.p
            key={filled}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1,   opacity: 1 }}
            style={{ fontSize: 64, fontWeight: 900, color: "#5B8CBF", lineHeight: 1 }}
          >
            {filled}
            <span style={{ fontSize: 24, color: "#aaa", fontWeight: 600 }}>/{GOAL}</span>
          </motion.p>
          <p style={{ fontSize: 16, color: "#555", fontWeight: 700, marginTop: 4 }}>
            أكواب · <span style={{ color: "#5B8CBF" }}>{liters} لتر</span>
          </p>
        </div>

        {/* Progress bar */}
        <div style={{ height: 12, borderRadius: 999, backgroundColor: "rgba(91,140,191,0.12)", overflow: "hidden", marginBottom: 14 }}>
          <motion.div
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              height: "100%", borderRadius: 999,
              background: filled === GOAL
                ? "linear-gradient(90deg, #27AE60, #2ECC71)"
                : "linear-gradient(90deg, #5B8CBF, #7EB8F7)",
            }}
          />
        </div>

        {/* Motivation */}
        <AnimatePresence mode="wait">
          <motion.p
            key={filled}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ fontSize: 15, fontWeight: 700, color: motivation.color }}
          >
            {motivation.emoji} {motivation.text}
          </motion.p>
        </AnimatePresence>
      </motion.div>

      {/* Cups grid */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          backgroundColor: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(190,175,155,0.22)",
          borderRadius: 24, padding: 28,
          boxShadow: "0 2px 16px rgba(80,60,30,0.07)",
          marginBottom: 20,
        }}
      >
        <h2 style={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a", marginBottom: 20, textAlign: "center" }}>
          اضغط على الكوب لتسجيله
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {cups.map((isFilled, i) => (
            <motion.button
              key={i}
              onClick={() => toggleCup(i)}
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.92 }}
              animate={isFilled ? { scale: [1, 1.12, 1] } : {}}
              style={{
                padding: "18px 0",
                borderRadius: 18, border: "none",
                backgroundColor: isFilled ? "rgba(91,140,191,0.12)" : "rgba(248,245,240,0.9)",
                border: isFilled ? "2px solid rgba(91,140,191,0.35)" : "2px solid rgba(190,175,155,0.20)",
                cursor: "pointer",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: 6,
                transition: "background 0.2s, border-color 0.2s",
              } as React.CSSProperties}
            >
              {/* SVG cup */}
              <svg width="40" height="44" viewBox="0 0 40 44" fill="none">
                {/* Cup body */}
                <path d="M6 8 L10 40 Q10 42 12 42 L28 42 Q30 42 30 40 L34 8 Z"
                  fill={isFilled ? "rgba(91,140,191,0.20)" : "rgba(190,175,155,0.15)"}
                  stroke={isFilled ? "#5B8CBF" : "rgba(190,175,155,0.50)"}
                  strokeWidth="2" strokeLinejoin="round"
                />
                {/* Water fill */}
                {isFilled && (
                  <motion.path
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    style={{ transformOrigin: "bottom" }}
                    d="M11 30 L14 40 Q14 41 15 41 L25 41 Q26 41 26 40 L29 30 Q20 33 11 30 Z"
                    fill="#5B8CBF"
                    opacity="0.6"
                  />
                )}
                {/* Handle */}
                <path d="M30 16 Q37 16 37 22 Q37 28 30 28"
                  stroke={isFilled ? "#5B8CBF" : "rgba(190,175,155,0.50)"}
                  strokeWidth="2" strokeLinecap="round" fill="none"
                />
              </svg>
              <span style={{ fontSize: 11, fontWeight: 700, color: isFilled ? "#5B8CBF" : "#bbb" }}>
                {i + 1}
              </span>
            </motion.button>
          ))}
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: "#ccc", marginTop: 16 }}>
          كل كوب = 250 مل (ربع لتر)
        </p>
      </motion.div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 20 }}>
        {[
          { label: "مشروب", value: `${liters}`, unit: "لتر", color: "#5B8CBF", bg: "rgba(91,140,191,0.08)" },
          { label: "متبقي", value: `${((GOAL - filled) * 0.25).toFixed(2)}`, unit: "لتر", color: "#E07A5F", bg: "rgba(224,122,95,0.08)" },
          { label: "الهدف", value: "2.5", unit: "لتر", color: "#3D7A5E", bg: "rgba(61,122,94,0.08)" },
        ].map(({ label, value, unit, color, bg }) => (
          <div key={label} style={{
            backgroundColor: bg,
            border: `1.5px solid ${color}20`,
            borderRadius: 16, padding: "16px 12px", textAlign: "center",
          }}>
            <p style={{ fontSize: 20, fontWeight: 900, color, lineHeight: 1 }}>{value}</p>
            <p style={{ fontSize: 11, color: "#aaa", fontWeight: 600 }}>{unit}</p>
            <p style={{ fontSize: 12, color: "#666", fontWeight: 700, marginTop: 4 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Reset */}
      <motion.button
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
        onClick={reset}
        style={{
          width: "100%", padding: "13px",
          borderRadius: 14, border: "1.5px solid rgba(224,122,95,0.30)",
          backgroundColor: "rgba(224,122,95,0.07)",
          color: "#E07A5F", fontWeight: 700, fontSize: 14,
          fontFamily: "inherit", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}
      >
        <RotateCcw size={16} /> إعادة تعيين اليوم
      </motion.button>
    </motion.div>
  );
}
