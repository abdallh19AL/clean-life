"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import {
  Scale, Droplets, Flame, Clipboard, CalendarDays,
  Utensils, Dumbbell, LogOut, User, ChevronLeft, CheckCircle,
} from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

// ─── Animation helpers ────────────────────────────────────────────────────────

const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.09 } },
};

const hoverLift = {
  whileHover: { y: -4, boxShadow: "0 12px 28px rgba(0,0,0,0.11)" },
  transition:  { type: "spring", stiffness: 320, damping: 22 },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getArabicDate() {
  return new Date().toLocaleDateString("ar-SA", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MetricCard({ label, icon: Icon, value, sub, color }: {
  label: string; icon: React.ElementType; value: string; sub: string; color: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      {...hoverLift}
      style={{
        background: "rgba(255,255,255,0.92)", border: "1.5px solid rgba(190,175,155,0.20)",
        borderRadius: 22, padding: "24px 22px", boxShadow: "0 2px 14px rgba(0,0,0,0.055)",
        cursor: "default", display: "flex", flexDirection: "column", gap: 6,
      }}
    >
      <div style={{
        width: 46, height: 46, borderRadius: 15, background: `${color}1A`,
        display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8,
      }}>
        <Icon size={23} color={color} />
      </div>
      <p style={{ color: "#999", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em" }}>{label}</p>
      <p style={{ color: "#1a1a1a", fontSize: "clamp(20px, 5vw, 28px)", fontWeight: 900, lineHeight: 1 }}>{value}</p>
      <p style={{ color: "#bbb", fontSize: 12 }}>{sub}</p>
    </motion.div>
  );
}

function QuickActionButton({ label, icon: Icon, bg, color, onClick }: {
  label: string; icon: React.ElementType; bg: string; color: string; onClick?: () => void;
}) {
  return (
    <motion.button
      variants={fadeUp}
      whileHover={{ y: -5, boxShadow: `0 10px 24px ${color}35` }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
      style={{
        background: bg, border: "none", borderRadius: 18, padding: "22px 14px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
        cursor: "pointer", fontFamily: "inherit", boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <Icon size={28} color={color} />
      <span style={{ color: "#2a2a2a", fontSize: 13, fontWeight: 700, textAlign: "center", lineHeight: 1.4 }}>
        {label}
      </span>
    </motion.button>
  );
}

// ─── Performance card (driven by today's real data) ───────────────────────────

function AnimatedBar({ pct, color, bg }: { pct: number; color: string; bg: string }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 120);
    return () => clearTimeout(t);
  }, [pct]);
  return (
    <div style={{ height: 8, borderRadius: 999, backgroundColor: bg, overflow: "hidden", flex: 1 }}>
      <div style={{
        height: "100%", borderRadius: 999, backgroundColor: color,
        width: `${width}%`, transition: "width 1s cubic-bezier(0.4,0,0.2,1)",
      }} />
    </div>
  );
}

function PerformanceCard({ cups, calories, calorieGoal }: {
  cups: number | null; calories: number | null; calorieGoal: number | null;
}) {
  const caloriePct: number | null =
    calorieGoal != null && calorieGoal > 0 && calories !== null
      ? Math.max(0, Math.round((1 - Math.abs(calories - calorieGoal) / calorieGoal) * 100))
      : null;

  const METRICS = [
    {
      label: "شرب الماء",
      pct:   cups !== null ? Math.min(Math.round((cups / 8) * 100), 100) : 0,
      color: "#06B6D4", bg: "rgba(6,182,212,0.12)",
      scored: true, calcHint: false,
    },
    {
      label: "السعرات الغذائية",
      pct:   caloriePct ?? 0,
      color: "#E07A5F", bg: "rgba(224,122,95,0.12)",
      scored: caloriePct !== null, calcHint: caloriePct === null,
    },
    { label: "الالتزام بالتمارين", pct: 0, color: "#3D7A5E", bg: "rgba(61,122,94,0.12)",  scored: true, calcHint: false },
    { label: "جودة النوم",         pct: 0, color: "#7E57C2", bg: "rgba(126,87,194,0.12)", scored: true, calcHint: false },
    { label: "مستوى النشاط",       pct: 0, color: "#5B8CBF", bg: "rgba(91,140,191,0.12)", scored: true, calcHint: false },
  ];

  const scoredMetrics = METRICS.filter(m => m.scored);
  const avg = Math.round(scoredMetrics.reduce((s, m) => s + m.pct, 0) / scoredMetrics.length);
  const rating =
    avg >= 80 ? { label: "ممتاز",      icon: "🌟", color: "#3D7A5E", bg: "rgba(61,122,94,0.10)"   } :
    avg >= 40 ? { label: "جيد",        icon: "💪", color: "#5B8CBF", bg: "rgba(91,140,191,0.10)"  } :
    avg >= 10 ? { label: "في البداية", icon: "🌱", color: "#E07A5F", bg: "rgba(224,122,95,0.10)"  } :
                { label: "ابدأ اليوم", icon: "📊", color: "#aaa",    bg: "rgba(190,175,155,0.10)" };

  const msg =
    avg >= 80 ? "أداؤك رائع اليوم! استمر على هذا المسار المتميز 💪" :
    avg >= 40 ? "أداء جيد! ركّز أكثر على شرب الماء وبقية أهدافك 🎯" :
    avg >= 10 ? "بداية طيبة! سجّل بقية بياناتك لرؤية تقييمك الكامل" :
                "سجّل وزنك وسعراتك وشرب الماء لترى تقييم أدائك هنا 📊";

  return (
    <motion.div
      variants={fadeUp} initial="hidden" animate="visible"
      transition={{ delay: 0.6, duration: 0.45, ease: "easeOut" }}
      style={{
        background: "rgba(255,255,255,0.92)", border: "1.5px solid rgba(190,175,155,0.20)",
        borderRadius: 22, padding: "30px 32px", boxShadow: "0 2px 14px rgba(0,0,0,0.055)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <h2 style={{ color: "#1a1a1a", fontSize: 19, fontWeight: 900 }}>تقييم أدائك اليوم 📊</h2>
        <div style={{
          padding: "6px 16px", borderRadius: 999, backgroundColor: rating.bg,
          color: rating.color, fontSize: 13, fontWeight: 900,
          display: "flex", alignItems: "center", gap: 6,
          border: `1.5px solid ${rating.color}30`,
        }}>
          {rating.icon} {rating.label}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 22 }}>
        {METRICS.map(({ label, pct, color, bg, calcHint }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span className="lg:w-[168px] lg:flex-shrink-0" style={{ fontSize: 13, fontWeight: 700, color: "#555", textAlign: "right" }}>
              {label}
            </span>
            {calcHint ? (
              <a
                href="/calculator"
                style={{
                  flex: 1, fontSize: 12, fontWeight: 700, color: "#0D9488",
                  textDecoration: "none", borderBottom: "1.5px solid rgba(13,148,136,0.30)",
                  lineHeight: 2,
                }}
              >
                احسب هدفك ←
              </a>
            ) : (
              <>
                <AnimatedBar pct={pct} color={color} bg={bg} />
                <span style={{ fontSize: 13, fontWeight: 900, color, width: 36, textAlign: "left", flexShrink: 0 }}>
                  {pct}٪
                </span>
              </>
            )}
          </div>
        ))}
      </div>

      <div style={{
        display: "flex", alignItems: "center", gap: 16, padding: "14px 18px",
        borderRadius: 14, backgroundColor: rating.bg, border: `1.5px solid ${rating.color}25`,
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14, flexShrink: 0,
          backgroundColor: `${rating.color}20`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, fontWeight: 900, color: rating.color,
        }}>
          {avg}٪
        </div>
        <p style={{ fontSize: 13, color: "#555", fontWeight: 700, lineHeight: 1.7 }}>{msg}</p>
      </div>
    </motion.div>
  );
}

// ─── Quick log input style ────────────────────────────────────────────────────

const quickInputStyle: React.CSSProperties = {
  width: "100%", boxSizing: "border-box",
  padding: "10px 12px", borderRadius: 12,
  border: "1.5px solid rgba(190,175,155,0.35)",
  backgroundColor: "#FCFAF6", fontSize: 16,
  fontFamily: "inherit", color: "#1a2e22",
  outline: "none", direction: "rtl", textAlign: "center",
  transition: "border-color 0.2s",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);

  // Today's persisted data (from Supabase)
  const [todayWeight,   setTodayWeight]   = useState<number | null>(null);
  const [todayCalories, setTodayCalories] = useState<number | null>(null);
  const [todayCups,     setTodayCups]     = useState<number | null>(null);
  const [dataLoading,   setDataLoading]   = useState(true);
  const [calorieGoal,   setCalorieGoal]   = useState<number | null>(null);

  // Quick log form
  const [logWeight,   setLogWeight]   = useState("");
  const [logCalories, setLogCalories] = useState("");
  const [logCups,     setLogCups]     = useState("");
  const [logSaving,   setLogSaving]   = useState(false);
  const [logSaved,    setLogSaved]    = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const today = todayISO();

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
        Promise.all([
          supabase
            .from("weight_logs")
            .select("weight_kg")
            .eq("user_id", user.id)
            .eq("date", today)
            .maybeSingle(),
          supabase
            .from("daily_logs")
            .select("calories, water_cups")
            .eq("user_id", user.id)
            .eq("date", today)
            .maybeSingle(),
          supabase
            .from("profiles")
            .select("calorie_goal")
            .eq("id", user.id)
            .maybeSingle(),
        ]).then(([wRes, dRes, pRes]) => {
          if (wRes.data)                     setTodayWeight(wRes.data.weight_kg);
          if (dRes.data?.calories   != null) setTodayCalories(dRes.data.calories);
          if (dRes.data?.water_cups != null) setTodayCups(dRes.data.water_cups);
          setCalorieGoal(pRes.data?.calorie_goal ?? null);
          setDataLoading(false);
        });
      } else {
        setDataLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) { setUser(session.user); }
      else if (event === "SIGNED_OUT") { window.location.href = "/login"; }
    });

    return () => subscription.unsubscribe();
  }, []);

  const userName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "مستخدم";

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  async function handleQuickLog(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    const hasInput = logWeight !== "" || logCalories !== "" || logCups !== "";
    if (!hasInput) return;

    setLogSaving(true);
    const supabase = createClient();
    const today = todayISO();
    const ops: Promise<unknown>[] = [];

    if (logWeight !== "") {
      ops.push(
        supabase
          .from("weight_logs")
          .upsert(
            { user_id: user.id, date: today, weight_kg: parseFloat(logWeight) },
            { onConflict: "user_id,date" }
          )
      );
    }

    if (logCalories !== "" || logCups !== "") {
      const record: Record<string, unknown> = { user_id: user.id, date: today };
      if (logCalories !== "") record.calories   = parseInt(logCalories);
      if (logCups     !== "") record.water_cups = parseInt(logCups);
      ops.push(
        supabase
          .from("daily_logs")
          .upsert(record, { onConflict: "user_id,date" })
      );
    }

    await Promise.all(ops);

    // Optimistic update of displayed values
    if (logWeight   !== "") setTodayWeight(parseFloat(logWeight));
    if (logCalories !== "") setTodayCalories(parseInt(logCalories));
    if (logCups     !== "") setTodayCups(parseInt(logCups));

    setLogWeight(""); setLogCalories(""); setLogCups("");
    setLogSaving(false);
    setLogSaved(true);
    setTimeout(() => setLogSaved(false), 3000);
  }

  const hasLogInput = logWeight !== "" || logCalories !== "" || logCups !== "";

  return (
    <div style={{
      minHeight: "100vh", backgroundColor: "#F8F5F0",
      fontFamily: "'Cairo', 'Segoe UI', sans-serif",
      direction: "rtl", padding: "32px 28px 56px",
    }}>

      {/* ── Top bar ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            background: "linear-gradient(135deg, #2D6A4F, #52B788)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 800, fontSize: 15, flexShrink: 0,
            boxShadow: "0 3px 12px rgba(45,106,79,0.30)",
          }}>
            {user ? getInitials(userName) : <User size={18} />}
          </div>
          <div>
            <p style={{ color: "#888", fontSize: 12, fontWeight: 600 }}>مرحباً،</p>
            <p style={{ color: "#1a1a1a", fontSize: 15, fontWeight: 800, lineHeight: 1.2 }}>{userName}</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.04, backgroundColor: "rgba(45,106,79,0.08)" }}
          whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "9px 18px", borderRadius: 12,
            border: "1.5px solid rgba(45,106,79,0.28)",
            background: "transparent", color: "#2D6A4F",
            fontSize: 13, fontWeight: 700, fontFamily: "inherit", cursor: "pointer",
          }}
        >
          <LogOut size={15} />
          تسجيل الخروج
        </motion.button>
      </div>

      {/* ── A: Welcome hero card ── */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible"
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ marginBottom: 24 }}
      >
        <div
          className="flex items-center justify-between px-5 py-7 sm:px-10 sm:py-9"
          style={{
            background: "linear-gradient(135deg, #1B4332 0%, #2D6A4F 40%, #40916C 75%, #52B788 100%)",
            borderRadius: 26,
            position: "relative", overflow: "hidden",
            boxShadow: "0 12px 40px rgba(27,67,50,0.30)",
          }}
        >
          <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -40, left: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: "20%", left: "42%", width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <p style={{ color: "rgba(255,255,255,0.68)", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>✦ أهلاً بك في عيادتك الرقمية</p>
            <h1 style={{ color: "#fff", fontSize: 34, fontWeight: 900, margin: "0 0 10px", lineHeight: 1.15 }}>مرحباً، {userName} 👋</h1>
            <p style={{ color: "rgba(255,255,255,0.62)", fontSize: 14, lineHeight: 1.7, maxWidth: 380 }}>هذا ملخص صحتك اليوم — ابدأ رحلتك نحو الأفضل</p>
          </div>
          <div className="hidden sm:block" style={{ position: "relative", zIndex: 1, textAlign: "center", flexShrink: 0 }}>
            <p style={{ color: "rgba(255,255,255,0.78)", fontSize: 13, fontWeight: 600, marginBottom: 12 }}>{getArabicDate()}</p>
            <span style={{
              display: "inline-block", background: "rgba(255,255,255,0.15)",
              border: "1.5px solid rgba(255,255,255,0.32)", backdropFilter: "blur(10px)",
              color: "#fff", fontSize: 12, fontWeight: 700, padding: "7px 20px", borderRadius: 30,
            }}>
              ✦ خطة نشطة
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── Logging reminder banner ── */}
      {!dataLoading && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, ease: "easeOut" }}
          style={{ marginBottom: 20 }}
        >
          {!(todayWeight !== null || todayCalories !== null || todayCups !== null) ? (
            <div style={{
              background: "linear-gradient(135deg, rgba(251,191,36,0.13), rgba(245,158,11,0.07))",
              border: "1.5px solid rgba(245,158,11,0.35)",
              borderRadius: 18, padding: "15px 22px",
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 22 }}>📋</span>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 800, color: "#92400E", marginBottom: 2 }}>
                    لم تسجّل بياناتك اليوم بعد!
                  </p>
                  <p style={{ fontSize: 12, color: "#B45309", fontWeight: 600 }}>
                    سجّل تقدمك للحفاظ على رحلتك الصحية — استخدم البطاقة أدناه
                  </p>
                </div>
              </div>
              <motion.span
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                style={{
                  background: "rgba(245,158,11,0.14)", border: "1.5px solid rgba(245,158,11,0.32)",
                  color: "#B45309", fontSize: 12, fontWeight: 800,
                  padding: "6px 16px", borderRadius: 999, flexShrink: 0,
                }}
              >
                سجّل الآن ↓
              </motion.span>
            </div>
          ) : (
            <div style={{
              background: "rgba(39,174,96,0.07)", border: "1.5px solid rgba(39,174,96,0.20)",
              borderRadius: 18, padding: "11px 22px",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <CheckCircle size={16} color="#27AE60" />
              <p style={{ fontSize: 13, fontWeight: 700, color: "#27AE60" }}>
                سجّلت بياناتك اليوم — أحسنت! 🎉
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* ── B: Metric cards — live from Supabase ── */}
      <motion.div
        variants={stagger} initial="hidden" animate="visible"
        transition={{ delayChildren: 0.15 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-[18px] mb-6"
      >
        <MetricCard
          label="الوزن الحالي" icon={Scale} color="#3D7A5E"
          value={!dataLoading && todayWeight   !== null ? `${todayWeight} كغ`        : "-- كغ"}
          sub={  !dataLoading && todayWeight   !== null ? "مسجل اليوم ✓"             : "لم يتم التسجيل بعد"}
        />
        <MetricCard
          label="استهلاك الماء" icon={Droplets} color="#5B8CBF"
          value={!dataLoading && todayCups     !== null ? `${(todayCups * 0.25).toFixed(1)} لتر` : "-- لتر"}
          sub={  !dataLoading && todayCups     !== null ? `${todayCups}/8 أكواب اليوم`          : "الهدف: 2.5 لتر يومياً"}
        />
        <MetricCard
          label="السعرات اليوم" icon={Flame} color="#E07A5F"
          value={!dataLoading && todayCalories !== null ? `${todayCalories} سعرة`    : "-- سعرة"}
          sub={  !dataLoading && todayCalories !== null ? "مسجلة اليوم ✓"            : "يحدد بعد الاستشارة"}
        />
      </motion.div>

      {/* ── C: Quick Daily Log ── */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible"
        transition={{ delay: 0.28, duration: 0.45, ease: "easeOut" }}
        style={{ marginBottom: 24 }}
      >
        <div style={{
          background: "rgba(255,255,255,0.92)", border: "1.5px solid rgba(190,175,155,0.20)",
          borderRadius: 22, padding: "28px 32px", boxShadow: "0 2px 14px rgba(0,0,0,0.055)",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <h2 style={{ color: "#1a1a1a", fontSize: 19, fontWeight: 900, marginBottom: 4 }}>سجّل يومك الآن ⚡</h2>
              <p style={{ color: "#bbb", fontSize: 13 }}>أدخل بياناتك في ثوانٍ — يحدّث تلقائياً إن سجّلت مسبقاً</p>
            </div>
            {logSaved && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 16px", borderRadius: 999,
                  backgroundColor: "rgba(39,174,96,0.10)",
                  border: "1.5px solid rgba(39,174,96,0.25)",
                  color: "#27AE60", fontSize: 13, fontWeight: 800,
                }}
              >
                <CheckCircle size={14} /> تم الحفظ!
              </motion.div>
            )}
          </div>

          <form onSubmit={handleQuickLog} style={{ display: "flex", gap: 14, alignItems: "flex-end", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 110 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, color: "#3D7A5E", marginBottom: 8 }}>
                <Scale size={12} /> الوزن (كغ)
              </label>
              <input
                type="number" step="0.1" min="30" max="300"
                placeholder={todayWeight !== null ? String(todayWeight) : "مثال: 82.5"}
                value={logWeight}
                onChange={e => setLogWeight(e.target.value)}
                style={quickInputStyle}
                onFocus={e => { e.target.style.borderColor = "#3D7A5E"; }}
                onBlur={e  => { e.target.style.borderColor = "rgba(190,175,155,0.35)"; }}
              />
            </div>

            <div style={{ flex: 1, minWidth: 110 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, color: "#E07A5F", marginBottom: 8 }}>
                <Flame size={12} /> السعرات
              </label>
              <input
                type="number" min="0" max="9999"
                placeholder={todayCalories !== null ? String(todayCalories) : "مثال: 1800"}
                value={logCalories}
                onChange={e => setLogCalories(e.target.value)}
                style={quickInputStyle}
                onFocus={e => { e.target.style.borderColor = "#E07A5F"; }}
                onBlur={e  => { e.target.style.borderColor = "rgba(190,175,155,0.35)"; }}
              />
            </div>

            <div style={{ flex: 1, minWidth: 110 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, color: "#5B8CBF", marginBottom: 8 }}>
                <Droplets size={12} /> الماء (أكواب)
              </label>
              <input
                type="number" min="0" max="20" step="1"
                placeholder={todayCups !== null ? String(todayCups) : "0–8"}
                value={logCups}
                onChange={e => setLogCups(e.target.value)}
                style={quickInputStyle}
                onFocus={e => { e.target.style.borderColor = "#5B8CBF"; }}
                onBlur={e  => { e.target.style.borderColor = "rgba(190,175,155,0.35)"; }}
              />
            </div>

            <motion.button
              type="submit"
              disabled={logSaving || !hasLogInput}
              whileHover={!logSaving && hasLogInput ? { y: -2, boxShadow: "0 10px 24px rgba(45,106,79,0.28)" } : undefined}
              whileTap={!logSaving && hasLogInput ? { scale: 0.97 } : undefined}
              style={{
                padding: "10px 28px", borderRadius: 14, border: "none",
                background: !hasLogInput || logSaving
                  ? "rgba(190,175,155,0.25)"
                  : "linear-gradient(135deg, #2D6A4F, #40916C)",
                color: !hasLogInput || logSaving ? "#aaa" : "white",
                fontWeight: 800, fontSize: 15, fontFamily: "inherit",
                cursor: !hasLogInput || logSaving ? "not-allowed" : "pointer",
                flexShrink: 0, height: 44,
                boxShadow: hasLogInput && !logSaving ? "0 4px 16px rgba(45,106,79,0.25)" : "none",
                transition: "background 0.2s",
              }}
            >
              {logSaving ? "..." : "حفظ"}
            </motion.button>
          </form>

          {/* AI calculator nudge */}
          <div style={{
            marginTop: 14, display: "flex", alignItems: "center", gap: 10,
            padding: "10px 16px", borderRadius: 12,
            background: "rgba(91,140,191,0.07)", border: "1px solid rgba(91,140,191,0.18)",
          }}>
            <span style={{ fontSize: 15 }}>💡</span>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#555", flex: 1, lineHeight: 1.4 }}>
              للدقة في حساب السعرات، جرّب الحاسبة الذكية لتحليل وجباتك
            </p>
            <motion.button
              whileHover={{ backgroundColor: "#5B8CBF", color: "#fff" }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.15 }}
              onClick={() => router.push("/dashboard/calculator")}
              style={{
                background: "transparent", border: "1.5px solid #5B8CBF",
                color: "#5B8CBF", borderRadius: 999, padding: "5px 14px",
                fontSize: 11, fontWeight: 800, fontFamily: "inherit",
                cursor: "pointer", flexShrink: 0,
              }}
            >
              جرّب الآن
            </motion.button>
          </div>

          {/* Today's summary pills */}
          {(todayWeight !== null || todayCalories !== null || todayCups !== null) && (
            <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
              {todayWeight !== null && (
                <span style={{
                  fontSize: 12, color: "#3D7A5E", fontWeight: 700,
                  background: "rgba(61,122,94,0.08)", padding: "4px 14px",
                  borderRadius: 999, border: "1px solid rgba(61,122,94,0.18)",
                }}>
                  ⚖️ {todayWeight} كغ
                </span>
              )}
              {todayCalories !== null && (
                <span style={{
                  fontSize: 12, color: "#E07A5F", fontWeight: 700,
                  background: "rgba(224,122,95,0.08)", padding: "4px 14px",
                  borderRadius: 999, border: "1px solid rgba(224,122,95,0.18)",
                }}>
                  🔥 {todayCalories} سعرة
                </span>
              )}
              {todayCups !== null && (
                <span style={{
                  fontSize: 12, color: "#5B8CBF", fontWeight: 700,
                  background: "rgba(91,140,191,0.08)", padding: "4px 14px",
                  borderRadius: 999, border: "1px solid rgba(91,140,191,0.18)",
                }}>
                  💧 {todayCups} أكواب
                </span>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* ── D: Plan + Appointments (two columns) ── */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible"
        transition={{ delay: 0.38, duration: 0.45, ease: "easeOut" }}
        className="grid grid-cols-1 lg:grid-cols-[60%_1fr] gap-[18px] mb-6"
      >
        <div style={{
          background: "rgba(255,255,255,0.92)", border: "1.5px solid rgba(190,175,155,0.20)",
          borderRadius: 22, padding: "30px 32px", boxShadow: "0 2px 14px rgba(0,0,0,0.055)",
        }}>
          <h2 style={{ color: "#1a1a1a", fontSize: 19, fontWeight: 900, marginBottom: 4 }}>خطتك المخصصة</h2>
          <p style={{ color: "#bbb", fontSize: 13, marginBottom: 36 }}>سيتم تحديد خطتك بعد الاستشارة الأولى</p>
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              style={{
                width: 76, height: 76, borderRadius: "50%", background: "rgba(64,145,108,0.11)",
                display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px",
              }}
            >
              <Clipboard size={34} color="#40916C" />
            </motion.div>
            <p style={{ color: "#333", fontSize: 16, fontWeight: 800, marginBottom: 10 }}>لم يتم تحديد خطتك بعد</p>
            <p style={{ color: "#bbb", fontSize: 13, lineHeight: 1.75, maxWidth: 300, margin: "0 auto 28px" }}>
              احجز استشارتك الأولى مع أحد خبرائنا لوضع خطة مخصصة لك
            </p>
            <motion.button
              whileHover={{ y: -3, boxShadow: "0 10px 28px rgba(45,106,79,0.35)" }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: "linear-gradient(135deg, #2D6A4F, #52B788)",
                color: "#fff", border: "none", borderRadius: 14,
                padding: "13px 30px", fontSize: 14, fontWeight: 700,
                fontFamily: "inherit", cursor: "pointer",
                display: "inline-flex", alignItems: "center", gap: 8,
                boxShadow: "0 4px 18px rgba(45,106,79,0.28)",
              }}
            >
              احجز استشارة <ChevronLeft size={16} />
            </motion.button>
          </div>
        </div>

        <div style={{
          background: "rgba(255,255,255,0.92)", border: "1.5px solid rgba(190,175,155,0.20)",
          borderRadius: 22, padding: "30px 26px", boxShadow: "0 2px 14px rgba(0,0,0,0.055)",
          display: "flex", flexDirection: "column",
        }}>
          <h2 style={{ color: "#1a1a1a", fontSize: 19, fontWeight: 900, marginBottom: 30 }}>مواعيدك القادمة</h2>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
            <div style={{
              width: 62, height: 62, borderRadius: "50%", background: "rgba(91,140,191,0.11)",
              display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16,
            }}>
              <CalendarDays size={28} color="#5B8CBF" />
            </div>
            <p style={{ color: "#888", fontSize: 14, fontWeight: 600, marginBottom: 22 }}>لا توجد مواعيد قادمة</p>
            <motion.button
              whileHover={{ backgroundColor: "#2D6A4F", color: "#fff" }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.18 }}
              onClick={() => router.push("/dashboard/appointments/book")}
              style={{
                background: "transparent", color: "#2D6A4F",
                border: "1.5px solid #2D6A4F", borderRadius: 12,
                padding: "10px 22px", fontSize: 13, fontWeight: 700,
                fontFamily: "inherit", cursor: "pointer",
              }}
            >
              حجز موعد جديد
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* ── E: Quick actions ── */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible"
        transition={{ delay: 0.48, duration: 0.45, ease: "easeOut" }}
        style={{ marginBottom: 24 }}
      >
        <div style={{
          background: "rgba(255,255,255,0.92)", border: "1.5px solid rgba(190,175,155,0.20)",
          borderRadius: 22, padding: "30px 32px", boxShadow: "0 2px 14px rgba(0,0,0,0.055)",
        }}>
          <h2 style={{ color: "#1a1a1a", fontSize: 19, fontWeight: 900, marginBottom: 22 }}>الإجراءات السريعة</h2>
          <motion.div
            variants={stagger} initial="hidden" animate="visible"
            transition={{ delayChildren: 0.52 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <QuickActionButton label="تسجيل الوزن اليومي" icon={Scale}    bg="rgba(61,122,94,0.10)"   color="#3D7A5E" onClick={() => router.push("/dashboard/weight")} />
            <QuickActionButton label="تسجيل الماء"         icon={Droplets} bg="rgba(91,140,191,0.10)"  color="#5B8CBF" onClick={() => router.push("/dashboard/water")} />
            <QuickActionButton label="عرض خطة التغذية"    icon={Utensils} bg="rgba(224,122,95,0.10)"  color="#E07A5F" onClick={() => router.push("/dashboard/nutrition")} />
            <QuickActionButton label="جدول التمارين"       icon={Dumbbell} bg="rgba(126,87,194,0.10)"  color="#7E57C2" onClick={() => router.push("/dashboard/workout")} />
          </motion.div>
        </div>
      </motion.div>

      {/* ── F: Daily performance tracker — live ── */}
      <PerformanceCard cups={todayCups} calories={todayCalories} calorieGoal={calorieGoal} />
    </div>
  );
}
