"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Timer, Flame, Dumbbell, Clock } from "lucide-react";

// ─── Exercises data ───────────────────────────────────────────────────────────
const exercises = [
  { id: 1, nameAr: "ضغط الصدر بالبار",   nameEn: "Bench Press",       sets: 4, reps: 8,  rest: "90 ث" },
  { id: 2, nameAr: "ضغط مائل بالدمبل",   nameEn: "Incline Dumbbell",  sets: 3, reps: 10, rest: "60 ث" },
  { id: 3, nameAr: "تمرين الفلاي كيبل",  nameEn: "Cable Fly",         sets: 3, reps: 12, rest: "60 ث" },
  { id: 4, nameAr: "الضغط العسكري",       nameEn: "Military Press",    sets: 4, reps: 10, rest: "90 ث" },
  { id: 5, nameAr: "رفع جانبي بالدمبل",  nameEn: "Lateral Raises",    sets: 3, reps: 15, rest: "45 ث" },
];

const stats = [
  { label: "المدة",               value: "60 دقيقة",  icon: Timer,    color: "#3D7A5E" },
  { label: "السعرات المحروقة",    value: "380 سعرة",  icon: Flame,    color: "#E07A5F" },
  { label: "التمارين",            value: "5 تمارين",  icon: Dumbbell, color: "#5B8CBF" },
  { label: "الراحة بين الجولات", value: "60 ثانية",  icon: Clock,    color: "#9B7EC8" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function WorkoutPage() {
  const [done, setDone] = useState<Set<number>>(new Set());

  function toggle(id: number) {
    setDone(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const completedCount = done.size;
  const pct = Math.round((completedCount / exercises.length) * 100);

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
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: 28 }}
      >
        <h1 style={{ fontSize: 28, fontWeight: 900, color: "#1a1a1a", marginBottom: 4 }}>
          جدول التدريب
        </h1>
        <p style={{ fontSize: 14, color: "#aaa" }}>يوم 4 — يوم الضغط 💪</p>
      </motion.div>

      {/* ── Stat mini-cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map(({ label, value, icon: Icon, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.07 }}
            whileHover={{ y: -3 }}
            style={{
              background: "rgba(255,255,255,0.85)", border: "1.5px solid rgba(190,175,155,0.22)",
              borderRadius: 18, padding: "18px 16px", boxShadow: "0 2px 12px rgba(0,0,0,0.055)",
              textAlign: "center",
            }}
          >
            <div style={{
              width: 40, height: 40, borderRadius: 12, background: `${color}18`,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 10px",
            }}>
              <Icon size={20} color={color} />
            </div>
            <p style={{ fontSize: 15, fontWeight: 900, color: "#1a1a1a", marginBottom: 2 }}>{value}</p>
            <p style={{ fontSize: 12, color: "#aaa", fontWeight: 600 }}>{label}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Exercise list card ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        style={{
          background: "rgba(255,255,255,0.85)", border: "1.5px solid rgba(190,175,155,0.22)",
          borderRadius: 20, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.055)",
        }}
      >
        {/* Progress header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: "#1a1a1a" }}>تمارين اليوم</h2>
          <span style={{
            background: "rgba(61,122,94,0.10)", color: "#3D7A5E",
            fontSize: 13, fontWeight: 700, padding: "5px 14px", borderRadius: 20,
          }}>
            {completedCount} / {exercises.length} مكتمل
          </span>
        </div>

        {/* Progress bar */}
        <div style={{ height: 8, borderRadius: 999, background: "rgba(190,175,155,0.18)", overflow: "hidden", marginBottom: 24 }}>
          <motion.div
            animate={{ width: `${pct}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
            style={{ height: "100%", background: "linear-gradient(90deg, #2D6A4F, #52B788)", borderRadius: 999 }}
          />
        </div>

        {/* Exercise rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {exercises.map((ex, i) => {
            const isDone = done.has(ex.id);
            return (
              <motion.button
                key={ex.id}
                onClick={() => toggle(ex.id)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                whileHover={{ x: -4 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: "flex", alignItems: "flex-start", gap: 14,
                  padding: "16px 18px", borderRadius: 16,
                  background: isDone ? "rgba(61,122,94,0.08)" : "rgba(248,245,240,0.8)",
                  border: `1.5px solid ${isDone ? "rgba(61,122,94,0.25)" : "rgba(190,175,155,0.22)"}`,
                  cursor: "pointer", textAlign: "right", fontFamily: "inherit",
                  transition: "background 0.2s, border-color 0.2s",
                }}
              >
                <motion.div
                  animate={{ scale: isDone ? [1, 1.25, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {isDone
                    ? <CheckCircle2 size={24} color="#3D7A5E" />
                    : <Circle       size={24} color="#ccc" />
                  }
                </motion.div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: 15, fontWeight: 800, color: isDone ? "#888" : "#1a1a1a",
                    textDecoration: isDone ? "line-through" : "none", marginBottom: 2,
                  }}>
                    {ex.nameAr}
                  </p>
                  <p style={{ fontSize: 12, color: "#bbb", marginBottom: 6 }}>{ex.nameEn}</p>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <span style={{
                      background: "rgba(61,122,94,0.10)", color: "#3D7A5E",
                      fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20,
                    }}>
                      {ex.sets}×{ex.reps}
                    </span>
                    <span style={{
                      background: "rgba(190,175,155,0.15)", color: "#888",
                      fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 20,
                    }}>
                      {ex.rest}
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Completion banner */}
        <AnimatePresence>
          {pct === 100 && (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              style={{
                marginTop: 20, padding: "16px 24px", borderRadius: 16, textAlign: "center",
                background: "linear-gradient(135deg, #2D6A4F, #52B788)",
                color: "white", fontSize: 15, fontWeight: 800,
                boxShadow: "0 6px 20px rgba(45,106,79,0.30)",
              }}
            >
              🎉 أنجزت تمرين اليوم بالكامل — رائع!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Start workout button */}
        <motion.button
          whileHover={{ y: -3, boxShadow: "0 12px 28px rgba(45,106,79,0.35)" }}
          whileTap={{ scale: 0.97 }}
          style={{
            width: "100%", marginTop: 20, padding: "16px",
            borderRadius: 16, border: "none",
            background: "linear-gradient(135deg, #2D6A4F, #40916C)",
            color: "white", fontSize: 16, fontWeight: 800,
            fontFamily: "inherit", cursor: "pointer",
            boxShadow: "0 4px 16px rgba(45,106,79,0.28)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          }}
        >
          <Dumbbell size={20} />
          ابدأ التمرين
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
