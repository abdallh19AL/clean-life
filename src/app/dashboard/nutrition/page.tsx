"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Sunset, Moon, Droplets } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useCalorieGoal } from "@/hooks/useCalorieGoal";

// ─── Data ─────────────────────────────────────────────────────────────────────
const meals = [
  {
    id: "breakfast",
    label: "الإفطار",
    time: "08:00 ص",
    icon: Sun,
    color: "#E07A5F",
    bg: "rgba(224,122,95,0.08)",
    calories: 550,
    protein: 28,
    carbs: 62,
    fat: 18,
    items: ["شوفان مع الحليب والموز", "بيضتان مسلوقتان", "قهوة بلا سكر"],
  },
  {
    id: "lunch",
    label: "الغداء",
    time: "01:00 م",
    icon: Sunset,
    color: "#3D7A5E",
    bg: "rgba(61,122,94,0.08)",
    calories: 750,
    protein: 52,
    carbs: 75,
    fat: 22,
    items: ["صدر دجاج مشوي 200 غ", "أرز بالكركم", "سلطة خضراء بالزيتون"],
  },
  {
    id: "dinner",
    label: "العشاء",
    time: "07:30 م",
    icon: Moon,
    color: "#5B8CBF",
    bg: "rgba(91,140,191,0.08)",
    calories: 550,
    protein: 30,
    carbs: 48,
    fat: 20,
    items: ["سلطة التونة بالخضار", "حمص بالطحينة", "خبز أسمر"],
  },
];

const totalConsumed = meals.reduce((s, m) => s + m.calories, 0);

// ─── Macro bar ────────────────────────────────────────────────────────────────
function MacroBar({ label, grams, max, color }: { label: string; grams: number; max: number; color: string }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: "#888", fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 12, color, fontWeight: 700 }}>{grams} غ</span>
      </div>
      <div style={{ height: 5, borderRadius: 999, background: "rgba(190,175,155,0.20)", overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min((grams / max) * 100, 100)}%` }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.4 }}
          style={{ height: "100%", borderRadius: 999, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
function todayISO() { return new Date().toISOString().split("T")[0]; }

export default function NutritionPage() {
  const [cups,          setCups]         = useState<boolean[]>(Array(8).fill(false));
  const [userId,        setUserId]       = useState<string | null>(null);
  const [todayCalories, setTodayCalories] = useState<number | null>(null);
  const { goal, loading: goalLoading }    = useCalorieGoal();

  // Load today's water + calories from daily_logs on mount
  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data } = await supabase
        .from("daily_logs")
        .select("calories, water_cups")
        .eq("user_id", user.id)
        .eq("date", todayISO())
        .maybeSingle();

      if (data?.water_cups != null) {
        const count = Math.min(data.water_cups, 8);
        setCups(Array(8).fill(false).map((_, i) => i < count));
      }
      if (data?.calories != null) setTodayCalories(data.calories);
    })();
  }, []);

  function toggleCup(i: number) {
    const newCups = cups.map((v, idx) => idx === i ? !v : v);
    setCups(newCups);
    const count = newCups.filter(Boolean).length;
    if (userId) {
      const supabase = createClient();
      supabase
        .from("daily_logs")
        .upsert(
          { user_id: userId, date: todayISO(), water_cups: count },
          { onConflict: "user_id,date" }
        );
    }
  }

  const filledCups  = cups.filter(Boolean).length;
  const displayCal  = todayCalories ?? 0;
  const caloriesPct = goal != null && goal > 0
    ? Math.min(Math.round((displayCal / goal) * 100), 100)
    : 0;

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
          الخطة الغذائية
        </h1>
        <p style={{ fontSize: 14, color: "#aaa" }}>تتبع وجباتك ومدخولك الغذائي اليومي</p>
      </motion.div>

      {/* ── Calorie summary card ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          background: "rgba(255,255,255,0.85)", border: "1.5px solid rgba(190,175,155,0.22)",
          borderRadius: 20, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.055)",
          marginBottom: 24,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 13, color: "#999", fontWeight: 600, marginBottom: 4 }}>السعرات الحرارية اليوم</p>
            <p style={{ fontSize: 26, fontWeight: 900, color: "#1a1a1a" }}>
              {displayCal}
              {!goalLoading && goal !== null && (
                <span style={{ fontSize: 16, color: "#aaa", fontWeight: 600 }}> / {goal} سعرة</span>
              )}
              {(goalLoading || goal === null) && (
                <span style={{ fontSize: 16, color: "#ccc", fontWeight: 500 }}> سعرة</span>
              )}
            </p>
          </div>

          {/* Right side: remaining OR calculator prompt */}
          {!goalLoading && goal !== null && (
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 32, fontWeight: 900, color: "#3D7A5E" }}>
                {Math.max(0, goal - displayCal)}
              </p>
              <p style={{ fontSize: 12, color: "#bbb" }}>سعرة متبقية</p>
            </div>
          )}
          {!goalLoading && goal === null && (
            <Link
              href="/calculator"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, color: "#0D9488", textDecoration: "none",
                padding: "10px 14px", borderRadius: 10, lineHeight: 1.5, textAlign: "center",
                backgroundColor: "rgba(13,148,136,0.08)", border: "1px solid rgba(13,148,136,0.20)",
                minHeight: 44,
              }}
            >
              احسب هدفك
            </Link>
          )}
        </div>

        {/* Progress bar — only meaningful when a real goal is set */}
        {!goalLoading && goal !== null && (
          <>
            <div style={{ height: 12, borderRadius: 999, background: "rgba(190,175,155,0.18)", overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${caloriesPct}%` }}
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                style={{ height: "100%", borderRadius: 999, background: "linear-gradient(90deg, #2D6A4F, #52B788)" }}
              />
            </div>
            <p style={{ fontSize: 12, color: "#aaa", marginTop: 8 }}>{caloriesPct}% من الهدف اليومي</p>
          </>
        )}
        {goalLoading && (
          <div style={{ height: 12, borderRadius: 999, background: "rgba(190,175,155,0.12)" }} />
        )}

        {/* AI calculator nudge */}
        <div style={{
          marginTop: 14, display: "flex", alignItems: "center", gap: 10,
          padding: "9px 14px", borderRadius: 10,
          background: "rgba(91,140,191,0.07)", border: "1px solid rgba(91,140,191,0.16)",
        }}>
          <span style={{ fontSize: 14 }}>💡</span>
          <p style={{ fontSize: 12, color: "#555", fontWeight: 600, flex: 1, lineHeight: 1.4 }}>
            للدقة، استخدم الحاسبة الذكية لتحليل وجباتك وحساب سعراتها تلقائياً
          </p>
          <a
            href="/dashboard/calculator"
            style={{
              fontSize: 12, fontWeight: 800, color: "#5B8CBF",
              textDecoration: "none", flexShrink: 0, whiteSpace: "nowrap",
              borderBottom: "1.5px solid rgba(91,140,191,0.4)",
            }}
          >
            جرّب الآن ←
          </a>
        </div>
      </motion.div>

      {/* ── Meal cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[18px] mb-6">
        {meals.map((meal, i) => {
          const Icon = meal.icon;
          return (
            <motion.div
              key={meal.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
              whileHover={{ y: -4, boxShadow: "0 12px 28px rgba(0,0,0,0.10)" }}
              style={{
                background: "rgba(255,255,255,0.85)", border: "1.5px solid rgba(190,175,155,0.22)",
                borderRadius: 20, padding: 22, boxShadow: "0 2px 12px rgba(0,0,0,0.055)",
                position: "relative", overflow: "hidden",
              }}
            >
              {/* Corner glow */}
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 }}
                style={{
                  position: "absolute", top: -16, left: -16, width: 64, height: 64,
                  borderRadius: "50%", filter: "blur(18px)",
                  backgroundColor: meal.color, pointerEvents: "none",
                }}
              />

              {/* Header row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 12, background: meal.bg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon size={20} color={meal.color} />
                  </div>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a" }}>{meal.label}</p>
                    <p style={{ fontSize: 11, color: "#bbb" }}>{meal.time}</p>
                  </div>
                </div>
                <span style={{
                  background: meal.bg, color: meal.color,
                  fontSize: 13, fontWeight: 700, padding: "4px 12px", borderRadius: 20,
                }}>
                  {meal.calories} سعرة
                </span>
              </div>

              {/* Food items */}
              <div style={{ marginBottom: 16 }}>
                {meal.items.map((item, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", flexShrink: 0, backgroundColor: meal.color }} />
                    <span style={{ fontSize: 12, color: "#555" }}>{item}</span>
                  </div>
                ))}
              </div>

              {/* Macro bars */}
              <div style={{ borderTop: "1px solid rgba(190,175,155,0.20)", paddingTop: 12 }}>
                <MacroBar label="بروتين" grams={meal.protein} max={60}  color="#3D7A5E" />
                <MacroBar label="كارب"   grams={meal.carbs}   max={100} color="#5B8CBF" />
                <MacroBar label="دهون"   grams={meal.fat}     max={40}  color="#E07A5F" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Water tracker ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        style={{
          background: "rgba(255,255,255,0.85)", border: "1.5px solid rgba(190,175,155,0.22)",
          borderRadius: 20, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.055)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: "#1a1a1a", marginBottom: 4 }}>
              تتبع شرب الماء
            </h2>
            <p style={{ fontSize: 13, color: "#aaa" }}>الهدف: 8 أكواب (2 لتر يومياً)</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Droplets size={22} color="#5B8CBF" />
            <span style={{ fontSize: 20, fontWeight: 900, color: "#5B8CBF" }}>
              {filledCups}<span style={{ fontSize: 14, color: "#aaa", fontWeight: 600 }}>/8</span>
            </span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {cups.map((filled, i) => (
            <motion.button
              key={i}
              onClick={() => toggleCup(i)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              style={{
                width: 52, height: 64, borderRadius: 14,
                background: filled ? "rgba(91,140,191,0.15)" : "rgba(190,175,155,0.10)",
                border: `2px solid ${filled ? "#5B8CBF" : "rgba(190,175,155,0.30)"}`,
                cursor: "pointer", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: 4,
                transition: "all 0.2s",
              }}
            >
              <Droplets size={22} color={filled ? "#5B8CBF" : "#ccc"} />
              <span style={{ fontSize: 10, fontWeight: 700, color: filled ? "#5B8CBF" : "#ccc" }}>
                {i + 1}
              </span>
            </motion.button>
          ))}
        </div>

        <motion.div
          initial={false}
          animate={{ width: `${(filledCups / 8) * 100}%` }}
          style={{ height: 8, borderRadius: 999, background: "rgba(91,140,191,0.15)", overflow: "hidden", marginTop: 16 }}
        >
          <motion.div
            animate={{ width: `${(filledCups / 8) * 100}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            style={{ height: "100%", background: "linear-gradient(90deg, #5B8CBF, #93C5FD)", borderRadius: 999 }}
          />
        </motion.div>
        <p style={{ fontSize: 12, color: "#aaa", marginTop: 8 }}>
          {filledCups === 0 && "لم تشرب ماء بعد — ابدأ الآن!"}
          {filledCups > 0 && filledCups < 8 && `${filledCups} من 8 أكواب — أحسنت، واصل!`}
          {filledCups === 8 && "🎉 أنجزت هدف الماء اليومي!"}
        </p>
      </motion.div>
    </motion.div>
  );
}
