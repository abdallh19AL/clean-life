"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

/* ─── Types ──────────────────────────────────────────────────────────────────── */

type Exercise = {
  nameAr: string;
  sets:   number;
  reps:   number;
};

type TrainingDay = {
  type:      "training";
  label:     string;
  color:     string;
  bg:        string;
  emoji:     string;
  exercises: Exercise[];
};

type DayPlan = TrainingDay | { type: "rest" };

type IntensityLevel = "intense" | "normal" | "light";

type IntensityInfo = {
  level:  IntensityLevel;
  label:  string;
  reason: string;
  emoji:  string;
  color:  string;
  bg:     string;
};

/* ─── Weekly split ────────────────────────────────────────────────────────────
   JS Date.getDay(): 0=Sun 1=Mon 2=Tue 3=Wed 4=Thu 5=Fri 6=Sat             */

const SPLIT: Record<number, DayPlan> = {
  6: {                                          /* Saturday → Chest (صدر)   */
    type: "training", label: "صدر",
    color: "#E07A5F", bg: "rgba(224,122,95,0.10)", emoji: "💪",
    exercises: [
      { nameAr: "بنش برس بار",    sets: 4, reps: 8  },
      { nameAr: "بنش مائل دمبل", sets: 3, reps: 10 },
      { nameAr: "تفتيح دمبل",    sets: 3, reps: 12 },
      { nameAr: "ديبس صدر",      sets: 3, reps: 12 },
      { nameAr: "تمرير كابل",    sets: 3, reps: 15 },
    ],
  },
  0: {                                          /* Sunday → Back (ظهر)      */
    type: "training", label: "ظهر",
    color: "#3D7A5E", bg: "rgba(61,122,94,0.10)", emoji: "🏋️",
    exercises: [
      { nameAr: "عقلة",           sets: 4, reps: 8  },
      { nameAr: "سحب أرضي كابل", sets: 4, reps: 10 },
      { nameAr: "سحب بار منحني", sets: 3, reps: 10 },
      { nameAr: "سحب تيبار",     sets: 3, reps: 12 },
      { nameAr: "رفرفة خلفي",    sets: 3, reps: 15 },
    ],
  },
  1: {                                          /* Monday → Shoulders (أكتاف) */
    type: "training", label: "أكتاف",
    color: "#5B8CBF", bg: "rgba(91,140,191,0.10)", emoji: "🔼",
    exercises: [
      { nameAr: "ضغط كتف بار",       sets: 4, reps: 8  },
      { nameAr: "رفرفة جانبي دمبل", sets: 4, reps: 12 },
      { nameAr: "رفرفة أمامي",       sets: 3, reps: 12 },
      { nameAr: "رفرفة خلفي منحني", sets: 3, reps: 15 },
      { nameAr: "شراغ بار",          sets: 4, reps: 12 },
    ],
  },
  2: {                                          /* Tuesday → Biceps+Triceps  */
    type: "training", label: "بايسيبس وترايسيبس",
    color: "#9B7EC8", bg: "rgba(155,126,200,0.10)", emoji: "💪",
    exercises: [
      { nameAr: "بايسيبس بار",     sets: 4, reps: 10 },
      { nameAr: "مطرقة دمبل",      sets: 3, reps: 12 },
      { nameAr: "تبادل دمبل",      sets: 3, reps: 12 },
      { nameAr: "ترايسيبس كابل",   sets: 4, reps: 12 },
      { nameAr: "ترايسيبس فرنسي", sets: 3, reps: 12 },
      { nameAr: "ديبس مقعد",       sets: 3, reps: 15 },
    ],
  },
  3: {                                          /* Wednesday → Legs (أرجل)  */
    type: "training", label: "أرجل",
    color: "#D97706", bg: "rgba(217,119,6,0.10)", emoji: "🦵",
    exercises: [
      { nameAr: "سكوات بار",   sets: 4, reps: 8  },
      { nameAr: "ضغط أرجل",   sets: 4, reps: 12 },
      { nameAr: "دفع أمامي",  sets: 3, reps: 12 },
      { nameAr: "خلفي مستلق", sets: 3, reps: 12 },
      { nameAr: "سمانة واقف", sets: 4, reps: 20 },
    ],
  },
  4: { type: "rest" },                          /* Thursday                 */
  5: { type: "rest" },                          /* Friday                   */
};

const DAY_NAMES: Record<number, string> = {
  0: "الأحد", 1: "الاثنين", 2: "الثلاثاء",
  3: "الأربعاء", 4: "الخميس", 5: "الجمعة", 6: "السبت",
};

/* ─── Intensity logic ────────────────────────────────────────────────────────
   calorieGoal is fetched from profiles.calorie_goal (set by the calculator).
   No hardcoded target — null goal → NORMAL + calculator prompt.             */

const THRESHOLD = 0.10;   // ±10 % band around goal = NORMAL

function computeIntensity(calories: number | null, calorieGoal: number | null): IntensityInfo {
  if (calorieGoal === null) {
    return {
      level: "normal", label: "شدة عادية", emoji: "⚖️",
      reason: "احسب هدفك من الحاسبة للحصول على شدة مخصصة",
      color: "#3D7A5E", bg: "rgba(61,122,94,0.08)",
    };
  }

  if (calories === null) {
    return {
      level: "normal", label: "شدة عادية", emoji: "⚖️",
      reason: "سجّل سعراتك للحصول على شدة مخصصة",
      color: "#3D7A5E", bg: "rgba(61,122,94,0.08)",
    };
  }

  const ratio = calories / calorieGoal;

  if (ratio > 1 + THRESHOLD) {
    return {
      level: "intense", label: "شدة عالية", emoji: "🔥",
      reason: `تجاوزت هدفك اليومي بنسبة ${Math.round((ratio - 1) * 100)}% — زدنا شدة التمرين`,
      color: "#E07A5F", bg: "rgba(224,122,95,0.09)",
    };
  }

  if (ratio < 1 - THRESHOLD) {
    return {
      level: "light", label: "شدة خفيفة", emoji: "💙",
      reason: `سعراتك أقل من الهدف بـ ${Math.round((1 - ratio) * 100)}% — خففنا الجلسة اليوم`,
      color: "#5B8CBF", bg: "rgba(91,140,191,0.09)",
    };
  }

  return {
    level: "normal", label: "شدة عادية", emoji: "✅",
    reason: "سعراتك في المدى المثالي — تمرين متوازن اليوم",
    color: "#3D7A5E", bg: "rgba(61,122,94,0.08)",
  };
}

function adjustExercise(ex: Exercise, level: IntensityLevel): Exercise {
  if (level === "normal") return ex;
  if (level === "intense") {
    return { nameAr: ex.nameAr, sets: ex.sets + 1, reps: Math.round(ex.reps * 1.2) };
  }
  /* light */
  return { nameAr: ex.nameAr, sets: Math.max(2, ex.sets - 1), reps: Math.round(ex.reps * 0.8) };
}

/* ─── Shared back button ─────────────────────────────────────────────────────── */

function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
      onClick={onBack}
      style={{
        width: 40, height: 40, borderRadius: 12, border: "none",
        backgroundColor: "rgba(255,255,255,0.85)",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", flexShrink: 0,
      }}
    >
      <ArrowRight size={18} color="#3D7A5E" />
    </motion.button>
  );
}

/* ─── Intensity banner ───────────────────────────────────────────────────────── */

function IntensityBanner({ info, loading }: { info: IntensityInfo; loading: boolean }) {
  if (loading) {
    return (
      <div style={{
        height: 68, borderRadius: 16, marginBottom: 20,
        backgroundColor: "rgba(190,175,155,0.12)",
        animation: "pulse 1.5s ease-in-out infinite",
      }} />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        display: "flex", alignItems: "center", gap: 14,
        backgroundColor: info.bg,
        border: `1.5px solid ${info.color}40`,
        borderRadius: 16, padding: "14px 18px",
        marginBottom: 20,
      }}
    >
      <span style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>{info.emoji}</span>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: 15, fontWeight: 900, color: info.color, marginBottom: 2 }}>{info.label}</p>
        <p style={{ fontSize: 13, color: "#666", lineHeight: 1.4 }}>{info.reason}</p>
      </div>
    </motion.div>
  );
}

/* ─── Rest-day screen ────────────────────────────────────────────────────────── */

function RestDayScreen({ dayName, onBack }: { dayName: string; onBack: () => void }) {
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
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 48 }}>
        <BackButton onBack={onBack} />
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: "#1a1a1a", marginBottom: 2 }}>جلسة التمرين</h1>
          <p style={{ fontSize: 13, color: "#aaa" }}>{dayName}</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          backgroundColor: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(190,175,155,0.22)",
          borderRadius: 24, padding: 36,
          boxShadow: "0 2px 16px rgba(80,60,30,0.07)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 72, marginBottom: 16 }}>😴</div>
        <h2 style={{ fontSize: 26, fontWeight: 900, color: "#1a1a1a", marginBottom: 12 }}>يوم راحة</h2>
        <p style={{ fontSize: 15, color: "#666", lineHeight: 1.8, maxWidth: 300, margin: "0 auto 28px" }}>
          الراحة جزء أساسي من بناء العضلات. جسمك يتعافى ويكبر الآن — دعه يعمل.
        </p>

        <div style={{
          display: "flex", flexDirection: "column", gap: 14,
          backgroundColor: "rgba(61,122,94,0.06)",
          border: "1px solid rgba(61,122,94,0.12)",
          borderRadius: 16, padding: "20px 24px", marginBottom: 32, textAlign: "right",
        }}>
          {[
            { icon: "💧", text: "اشرب 8 أكواب ماء على الأقل" },
            { icon: "🛌", text: "نم 7–9 ساعات لتعافٍ أفضل" },
            { icon: "🥗", text: "لا تهمل وجبة البروتين اليوم" },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 20 }}>{icon}</span>
              <span style={{ fontSize: 14, color: "#4A6B5C", fontWeight: 600 }}>{text}</span>
            </div>
          ))}
        </div>

        <motion.button
          whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
          onClick={onBack}
          style={{
            padding: "14px 40px", borderRadius: 14, border: "none",
            background: "linear-gradient(135deg, #2D6A4F, #40916C)",
            color: "white", fontWeight: 800, fontSize: 15,
            fontFamily: "inherit", cursor: "pointer",
            boxShadow: "0 4px 16px rgba(45,106,79,0.28)",
          }}
        >
          العودة
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

/* ─── Training screen ────────────────────────────────────────────────────────── */

function TrainingScreen({ plan, dayName, intensity, intensityLoading, onBack }: {
  plan:             TrainingDay;
  dayName:          string;
  intensity:        IntensityInfo;
  intensityLoading: boolean;
  onBack:           () => void;
}) {
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
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
        <BackButton onBack={onBack} />
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: "#1a1a1a", marginBottom: 2 }}>جلسة التمرين</h1>
          <p style={{ fontSize: 13, color: "#aaa" }}>{dayName}</p>
        </div>
      </div>

      {/* Intensity banner */}
      <IntensityBanner info={intensity} loading={intensityLoading} />

      {/* Muscle group banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        style={{
          backgroundColor: plan.bg,
          border: `1.5px solid ${plan.color}40`,
          borderRadius: 20, padding: "22px 24px",
          marginBottom: 20,
          display: "flex", alignItems: "center", gap: 18,
        }}
      >
        <span style={{ fontSize: 52, lineHeight: 1 }}>{plan.emoji}</span>
        <div>
          <p style={{ fontSize: 13, color: plan.color, fontWeight: 700, marginBottom: 4 }}>تمرين اليوم</p>
          <p style={{ fontSize: 26, fontWeight: 900, color: "#1a1a1a", lineHeight: 1.1 }}>{plan.label}</p>
          <p style={{ fontSize: 13, color: "#888", marginTop: 6 }}>
            {plan.exercises.length} تمارين
          </p>
        </div>
      </motion.div>

      {/* Exercise list */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          backgroundColor: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(190,175,155,0.22)",
          borderRadius: 24, padding: 24,
          boxShadow: "0 2px 16px rgba(80,60,30,0.07)",
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 900, color: "#1a1a1a", marginBottom: 20 }}>
          التمارين
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {plan.exercises.map((ex, i) => (
            <motion.div
              key={ex.nameAr}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.15 + i * 0.07 }}
              style={{
                display: "flex", alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 16px", borderRadius: 16,
                backgroundColor: "rgba(248,245,240,0.8)",
                border: "1.5px solid rgba(190,175,155,0.20)",
                minHeight: 52,
              }}
            >
              {/* Number + name */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                  backgroundColor: plan.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 900, color: plan.color,
                }}>
                  {i + 1}
                </div>
                <p style={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a" }}>{ex.nameAr}</p>
              </div>

              {/* Sets × reps badge */}
              <span style={{
                fontSize: 13, fontWeight: 700,
                padding: "5px 14px", borderRadius: 20, flexShrink: 0,
                backgroundColor: plan.bg, color: plan.color,
              }}>
                {ex.sets}×{ex.reps}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────────── */

export default function WorkoutSessionPage() {
  const router  = useRouter();
  const dayIdx  = new Date().getDay();    // 0=Sun … 6=Sat
  const plan    = SPLIT[dayIdx];
  const dayName = DAY_NAMES[dayIdx];

  const [status,         setStatus]         = useState<"loading" | "loaded">("loading");
  const [latestCalories, setLatestCalories] = useState<number | null>(null);
  const [calorieGoal,    setCalorieGoal]    = useState<number | null>(null);

  useEffect(() => {
    if (plan.type !== "training") return;

    (async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setStatus("loaded"); return; }

        /* Fetch calories log + calorie goal in parallel */
        const [{ data: logData }, { data: profileData }] = await Promise.all([
          supabase
            .from("daily_logs")
            .select("calories")
            .eq("user_id", user.id)
            .not("calories", "is", null)
            .order("date", { ascending: false })
            .limit(1)
            .maybeSingle(),
          supabase
            .from("profiles")
            .select("calorie_goal")
            .eq("id", user.id)
            .maybeSingle(),
        ]);

        setLatestCalories(logData?.calories ?? null);
        setCalorieGoal(profileData?.calorie_goal ?? null);
      } catch {
        /* Network / auth error → default to NORMAL, never crash */
      } finally {
        setStatus("loaded");
      }
    })();
  }, []); // runs once on mount; dayIdx is stable for the session lifetime

  if (plan.type === "rest") {
    return <RestDayScreen dayName={dayName} onBack={() => router.back()} />;
  }

  const intensityLoading = status === "loading";
  const intensity        = computeIntensity(
    intensityLoading ? null : latestCalories,
    intensityLoading ? null : calorieGoal,
  );
  const adjustedPlan: TrainingDay = {
    ...plan,
    exercises: intensityLoading
      ? plan.exercises                                          // base while loading
      : plan.exercises.map(ex => adjustExercise(ex, intensity.level)),
  };

  return (
    <TrainingScreen
      plan={adjustedPlan}
      dayName={dayName}
      intensity={intensity}
      intensityLoading={intensityLoading}
      onBack={() => router.back()}
    />
  );
}
