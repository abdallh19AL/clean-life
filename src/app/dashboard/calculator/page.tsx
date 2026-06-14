"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Sparkles, Flame, Sun, Beef, Wheat, Droplets, History, Star } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

/* ─── Types ──────────────────────────────────────────────────────────────── */

type Result = {
  calories: number;
  protein:  number;
  carbs:    number;
  fats:     number;
  vitamins: string;
  tip:      string;
};

type HistoryEntry = { id: number; meal: string; result: Result };

/* ─── Helpers ────────────────────────────────────────────────────────────── */

const CARD: React.CSSProperties = {
  backgroundColor: "rgba(255,255,255,0.95)",
  border:       "1px solid rgba(190,175,155,0.22)",
  borderRadius: 20,
  padding:      24,
  boxShadow:    "0 2px 16px rgba(80,60,30,0.07)",
};

function fadeCard(delay = 0) {
  return {
    initial:    { opacity: 0, y: 20 },
    animate:    { opacity: 1, y: 0  },
    transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
  };
}

function AnimatedBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ height: 10, borderRadius: 999, background: "rgba(190,175,155,0.18)", overflow: "hidden" }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{ height: "100%", borderRadius: 999, backgroundColor: color }}
      />
    </div>
  );
}

function MacroCard({
  label, value, unit, color, Icon,
}: {
  label: string; value: number; unit: string; color: string; Icon: React.ElementType;
}) {
  return (
    <div style={{
      flex: 1, textAlign: "center",
      padding: "14px 8px", borderRadius: 16,
      backgroundColor: `${color}10`,
      border: `1.5px solid ${color}25`,
    }}>
      <Icon size={20} color={color} style={{ marginBottom: 6 }} />
      <p style={{ fontSize: 20, fontWeight: 900, color, lineHeight: 1 }}>{value.toFixed(1)}</p>
      <p style={{ fontSize: 12, color: "#aaa", fontWeight: 600, marginTop: 3 }}>{unit}</p>
      <p style={{ fontSize: 12, color: "#666", fontWeight: 700, marginTop: 2 }}>{label}</p>
    </div>
  );
}

function mealRating(r: Result) {
  if (r.calories < 300) return { label: "خفيفة جداً 🌿", color: "#27ae60", comment: "وجبتك منخفضة السعرات، قد تحتاج إلى إضافة مصادر للطاقة." };
  if (r.calories < 600) return { label: "متوازنة ✅",    color: "#3D7A5E", comment: "وجبة متوازنة ومناسبة لمعظم الأهداف الصحية." };
  if (r.calories < 900) return { label: "دسمة 🔥",        color: "#E07A5F", comment: "وجبة غنية بالسعرات، تأكد أن تكون نشيطاً بعدها." };
  return                       { label: "ثقيلة جداً ⚠️",  color: "#c0392b", comment: "سعرات مرتفعة جداً، فكر في تقسيمها على وجبتين." };
}

/* ─── Rate-limit helpers ─────────────────────────────────────────────────── */

const LIMIT_MS_CLIENT = 24 * 60 * 60 * 1000;

function formatRemaining(lastUsedAt: string): string {
  const remaining = new Date(lastUsedAt).getTime() + LIMIT_MS_CLIENT - Date.now();
  if (remaining <= 0) return "";
  const hours   = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0 && minutes > 0) return `يمكنك استخدام الحاسبة مرة أخرى بعد ${hours} ساعة و${minutes} دقيقة`;
  if (hours > 0)                return `يمكنك استخدام الحاسبة مرة أخرى بعد ${hours} ساعة`;
  return `يمكنك استخدام الحاسبة مرة أخرى بعد ${minutes} دقيقة`;
}

/* ─── Loading dots ───────────────────────────────────────────────────────── */

function LoadingDots() {
  return (
    <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }}
          style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#aaa", display: "inline-block" }}
        />
      ))}
    </span>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function CalculatorPage() {
  const [mealText,  setMealText]  = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result,    setResult]    = useState<Result | null>(null);
  const [error,     setError]     = useState("");
  const [history,   setHistory]   = useState<HistoryEntry[]>([]);

  const [lastUsedAt,   setLastUsedAt]   = useState<string | null>(null);
  const [limitLoading, setLimitLoading] = useState(true);
  const [isGuest,      setIsGuest]      = useState(false);
  const [tick,         setTick]         = useState(0);

  /* Fetch last usage timestamp on mount */
  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setIsGuest(true); setLimitLoading(false); return; }
        const { data } = await supabase
          .from("profiles")
          .select("last_ai_calc_at")
          .eq("id", user.id)
          .maybeSingle();
        setLastUsedAt(data?.last_ai_calc_at ?? null);
      } catch {
        // network error → assume unlocked, server will enforce
      } finally {
        setLimitLoading(false);
      }
    })();
  }, []);

  /* Tick every 60s to refresh countdown while locked */
  useEffect(() => {
    if (!lastUsedAt) return;
    const remaining = new Date(lastUsedAt).getTime() + LIMIT_MS_CLIENT - Date.now();
    if (remaining <= 0) return;
    const id = setInterval(() => setTick(t => t + 1), 60_000);
    return () => clearInterval(id);
  }, [lastUsedAt]);

  /* isLocked re-evaluates on every render (tick forces re-render each minute) */
  void tick;
  const isLocked = !limitLoading && lastUsedAt !== null &&
    (Date.now() - new Date(lastUsedAt).getTime()) < LIMIT_MS_CLIENT;

  async function analyze() {
    if (!mealText.trim() || isLoading || isLocked || isGuest) return;
    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/analyze-food", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ meal: mealText }),
      });
      const data = await res.json();

      if (res.status === 429) {
        setLastUsedAt(data.lastUsedAt ?? new Date().toISOString());
        setError("لقد استخدمت الحاسبة بالفعل اليوم، يرجى الانتظار حتى الغد");
        return;
      }

      if (!res.ok || "error" in data) throw new Error();

      setResult(data as Result);
      setLastUsedAt(new Date().toISOString()); // lock UI immediately
      setHistory(prev => [{ id: Date.now(), meal: mealText, result: data as Result }, ...prev].slice(0, 5));
    } catch {
      setError("تعذّر التحليل، تأكد من اتصالك وحاول مجدداً");
    } finally {
      setIsLoading(false);
    }
  }

  /* ── Derived ── */
  const totalMacroCals = result ? result.protein * 4 + result.carbs * 4 + result.fats * 9 : 1;

  const pieData = result ? [
    { name: "بروتين",      value: Math.round(result.protein * 4), color: "#3D7A5E" },
    { name: "كربوهيدرات", value: Math.round(result.carbs   * 4), color: "#5B8CBF" },
    { name: "دهون",        value: Math.round(result.fats    * 9), color: "#E07A5F" },
  ].filter(d => d.value > 0) : [];

  const rating = result ? mealRating(result) : null;

  /* ── JSX ── */
  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100vh",
        backgroundColor: "#F8F5F0",
        fontFamily: "'Cairo','Segoe UI',sans-serif",
        padding: "32px 24px 64px",
      }}
    >
      {/* ── Header ── */}
      <motion.div {...fadeCard(0)} style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: "#1a1a1a" }}>
            حاسبة التغذية الذكية 🧠
          </h1>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "4px 14px", borderRadius: 999,
            backgroundColor: "rgba(61,122,94,0.10)",
            color: "#2D6A4F", fontSize: 12, fontWeight: 700,
            border: "1px solid rgba(61,122,94,0.20)",
          }}>
            <Sparkles size={12} /> مدعوم بـ Gemini AI
          </span>
        </div>
        <p style={{ fontSize: 14, color: "#aaa" }}>
          صِف وجبتك بالعربية وسيحللها الذكاء الاصطناعي فوراً
        </p>
      </motion.div>

      {/* ── Usage guidance ── */}
      <motion.div {...fadeCard(0.03)} style={{
        ...CARD,
        marginBottom: 16,
        backgroundColor: "rgba(61,122,94,0.06)",
        border: "1px solid rgba(61,122,94,0.18)",
        padding: "14px 18px",
      }}>
        <p style={{ fontSize: 13, fontWeight: 800, color: "#2D6A4F", marginBottom: 6 }}>
          ℹ️ كيف تستخدم الحاسبة بشكل صحيح
        </p>
        <ul style={{ fontSize: 12, color: "#3D7A5E", lineHeight: 2, margin: 0, paddingRight: 18, paddingLeft: 0 }}>
          <li>تعمل الحاسبة مرة واحدة كل 24 ساعة لكل مستخدم</li>
          <li>للحصول على أدق النتائج، استخدمها في نهاية يومك بعد تسجيل جميع وجباتك</li>
        </ul>
      </motion.div>

      {/* ── Input card ── */}
      <motion.div {...fadeCard(0.05)} style={{ ...CARD, marginBottom: 24 }}>
        <textarea
          value={mealText}
          onChange={e => setMealText(e.target.value)}
          placeholder="مثال: أكلت سيخين كباب مع حمص وخبز عربي وسلطة خضراء"
          style={{
            width: "100%", boxSizing: "border-box",
            minHeight: 120, resize: "vertical",
            padding: "14px 16px", borderRadius: 14,
            border: "1.5px solid rgba(190,175,155,0.30)",
            backgroundColor: "#FAFAF7",
            fontSize: 16, fontFamily: "inherit",
            lineHeight: 1.7, outline: "none",
            color: "#333", direction: "rtl",
            transition: "border-color 0.2s",
          }}
          onFocus={e => { e.target.style.borderColor = "#3D7A5E"; }}
          onBlur={e  => { e.target.style.borderColor = "rgba(190,175,155,0.30)"; }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 12, color: "#bbb" }}>{mealText.length} حرف</span>
        </div>

        <motion.button
          onClick={analyze}
          disabled={isLoading || !mealText.trim() || isLocked || limitLoading || isGuest}
          whileHover={!isLoading && mealText.trim() && !isLocked && !isGuest ? { y: -2, boxShadow: "0 10px 24px rgba(45,106,79,0.30)" } : {}}
          whileTap={!isLoading && mealText.trim() && !isLocked && !isGuest ? { scale: 0.97 } : {}}
          style={{
            width: "100%", padding: "14px",
            borderRadius: 14, border: "none",
            background: isLoading || !mealText.trim() || isLocked || limitLoading || isGuest
              ? "rgba(190,175,155,0.25)"
              : "linear-gradient(135deg, #2D6A4F, #40916C)",
            color: isLoading || !mealText.trim() || isLocked || limitLoading || isGuest ? "#aaa" : "white",
            fontWeight: 800, fontSize: 16,
            fontFamily: "inherit",
            cursor: isLoading || !mealText.trim() || isLocked || limitLoading || isGuest ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            transition: "background 0.2s",
            boxShadow: isLoading || !mealText.trim() || isLocked || limitLoading || isGuest ? "none" : "0 4px 16px rgba(45,106,79,0.25)",
            minHeight: 44,
          }}
        >
          {isLocked
            ? "تم الاستخدام اليوم ✓"
            : isLoading
              ? <><LoadingDots /> جاري التحليل...</>
              : "احسب وجبتي 🔍"
          }
        </motion.button>

        {/* Countdown when locked */}
        {isLocked && lastUsedAt && (
          <div style={{
            marginTop: 12, padding: "12px 16px", borderRadius: 12, textAlign: "center",
            backgroundColor: "rgba(217,119,6,0.08)", border: "1px solid rgba(217,119,6,0.20)",
          }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#92400E", marginBottom: 2 }}>
              🕐 لقد استخدمت الحاسبة اليوم
            </p>
            <p style={{ fontSize: 12, color: "#92400E" }}>
              {formatRemaining(lastUsedAt)}
            </p>
          </div>
        )}

        {/* Guest prompt */}
        {!limitLoading && isGuest && (
          <div style={{
            marginTop: 12, padding: "12px 16px", borderRadius: 12, textAlign: "center",
            backgroundColor: "rgba(91,140,191,0.08)", border: "1px solid rgba(91,140,191,0.20)",
          }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#3a6ea0" }}>
              💡 سجّل دخولك لاستخدام الحاسبة الذكية
            </p>
          </div>
        )}
      </motion.div>

      {/* ── Error ── */}
      <AnimatePresence>
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              ...CARD, marginBottom: 24,
              backgroundColor: "rgba(192,57,43,0.07)",
              border: "1.5px solid rgba(192,57,43,0.20)",
              padding: "16px 20px",
              color: "#c0392b", fontWeight: 700, fontSize: 14,
            }}
          >
            ⚠️ {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Results ── */}
      <AnimatePresence>
        {result && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* ══ LEFT COLUMN ══ */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                {/* Card: Calories + Pie */}
                <motion.div {...fadeCard(0.05)} style={CARD}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <Flame size={22} color="#E07A5F" />
                    <h2 style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a" }}>إجمالي السعرات والماكروز</h2>
                  </div>
                  <p style={{ fontSize: 42, fontWeight: 900, color: "#E07A5F", lineHeight: 1.1, marginBottom: 4 }}>
                    {result.calories}
                    <span style={{ fontSize: 16, color: "#aaa", fontWeight: 600, marginRight: 8 }}>سعرة حرارية</span>
                  </p>

                  {/* Donut chart */}
                  <div style={{ height: 280, position: "relative" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%" cy="50%"
                          innerRadius={72} outerRadius={104}
                          startAngle={90} endAngle={-270}
                          dataKey="value"
                          label={false}
                          labelLine={false}
                        >
                          {pieData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} strokeWidth={0} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(v: number) => [`${v} سعرة`, ""]}
                          contentStyle={{
                            borderRadius: 12,
                            border: "1px solid rgba(190,175,155,0.3)",
                            fontFamily: "'Cairo',sans-serif",
                            fontSize: 13,
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Center label */}
                    <div style={{
                      position: "absolute", top: "50%", left: "50%",
                      transform: "translate(-50%, -50%)",
                      textAlign: "center", pointerEvents: "none",
                    }}>
                      <p style={{ fontSize: 26, fontWeight: 900, color: "#1a1a1a", lineHeight: 1 }}>{result.calories}</p>
                      <p style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>سعرة</p>
                    </div>
                  </div>

                  {/* Legend */}
                  <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
                    {[
                      { label: "بروتين",      color: "#3D7A5E" },
                      { label: "كربوهيدرات", color: "#5B8CBF" },
                      { label: "دهون",        color: "#E07A5F" },
                    ].map(({ label, color }) => (
                      <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <div style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: color }} />
                        <span style={{ fontSize: 12, color: "#888", fontWeight: 600 }}>{label}</span>
                      </div>
                    ))}
                  </div>

                  {/* 3 macro cards */}
                  <div style={{ display: "flex", gap: 10 }}>
                    <MacroCard label="بروتين"      value={result.protein} unit="غ" color="#3D7A5E" Icon={Beef}     />
                    <MacroCard label="كربوهيدرات" value={result.carbs}   unit="غ" color="#5B8CBF" Icon={Wheat}    />
                    <MacroCard label="دهون"        value={result.fats}    unit="غ" color="#E07A5F" Icon={Droplets} />
                  </div>
                </motion.div>

                {/* Card: Extra info */}
                <motion.div {...fadeCard(0.1)} style={CARD}>
                  <h2 style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a", marginBottom: 16 }}>معلومات إضافية</h2>

                  {/* Vitamins */}
                  <div style={{
                    display: "flex", alignItems: "flex-start", gap: 12,
                    backgroundColor: "rgba(61,122,94,0.07)",
                    border: "1px solid rgba(61,122,94,0.15)",
                    borderRadius: 14, padding: "14px 16px", marginBottom: 16,
                  }}>
                    <Sun size={18} color="#3D7A5E" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 700, color: "#3D7A5E", marginBottom: 4 }}>الفيتامينات الرئيسية</p>
                      <p style={{ fontSize: 13, color: "#2D6A4F", lineHeight: 1.6 }}>{result.vitamins}</p>
                    </div>
                  </div>

                  {/* Macro % breakdown */}
                  <div style={{ marginBottom: 16 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#555", marginBottom: 10 }}>توزيع السعرات</p>
                    <div style={{ display: "flex", gap: 8 }}>
                      {[
                        { label: "بروتين",      pct: Math.round((result.protein * 4 / totalMacroCals) * 100), color: "#3D7A5E" },
                        { label: "كربوهيدرات", pct: Math.round((result.carbs   * 4 / totalMacroCals) * 100), color: "#5B8CBF" },
                        { label: "دهون",        pct: Math.round((result.fats    * 9 / totalMacroCals) * 100), color: "#E07A5F" },
                      ].map(({ label, pct, color }) => (
                        <div key={label} style={{
                          flex: 1, textAlign: "center",
                          padding: "10px 4px", borderRadius: 12,
                          backgroundColor: `${color}10`,
                          border: `1px solid ${color}20`,
                        }}>
                          <p style={{ fontSize: 18, fontWeight: 900, color, lineHeight: 1 }}>{pct}%</p>
                          <p style={{ fontSize: 10, color: "#888", marginTop: 3, fontWeight: 600 }}>{label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tip */}
                  <div style={{
                    backgroundColor: "rgba(248,245,240,0.9)",
                    borderRight: "3px solid #3D7A5E",
                    borderRadius: 12, padding: "14px 16px",
                  }}>
                    <p style={{ fontSize: 12, fontWeight: 800, color: "#3D7A5E", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                      <Sparkles size={13} /> النصيحة الغذائية
                    </p>
                    <p style={{ fontSize: 13, color: "#444", lineHeight: 1.7 }}>{result.tip}</p>
                  </div>
                </motion.div>
              </div>

              {/* ══ RIGHT COLUMN ══ */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                {/* Card: Macro bars */}
                <motion.div {...fadeCard(0.08)} style={CARD}>
                  <h2 style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a", marginBottom: 20 }}>نسب الماكروز</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {[
                      { label: "البروتين",      value: result.protein, goal: 150, color: "#3D7A5E" },
                      { label: "الكربوهيدرات", value: result.carbs,   goal: 250, color: "#5B8CBF" },
                      { label: "الدهون",         value: result.fats,    goal: 65,  color: "#E07A5F" },
                    ].map(({ label, value, goal, color }) => (
                      <div key={label}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#555" }}>{label}</span>
                          <span style={{ fontSize: 13, fontWeight: 800, color }}>
                            {value.toFixed(1)}غ
                            <span style={{ fontSize: 10, color: "#bbb", fontWeight: 600 }}> / {goal}غ</span>
                          </span>
                        </div>
                        <AnimatedBar value={value} max={goal} color={color} />
                        <p style={{ fontSize: 10, color: "#bbb", marginTop: 5 }}>
                          {Math.min(Math.round((value / goal) * 100), 100)}% من الهدف اليومي
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Card: History */}
                <motion.div {...fadeCard(0.12)} style={CARD}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <History size={18} color="#3D7A5E" />
                    <h2 style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a" }}>سجل الوجبات اليوم</h2>
                  </div>

                  {history.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "24px 0", color: "#ccc" }}>
                      <p style={{ fontSize: 32, marginBottom: 8 }}>📋</p>
                      <p style={{ fontSize: 13 }}>لم تحلل أي وجبة بعد</p>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <AnimatePresence>
                        {history.map((entry, i) => (
                          <motion.button
                            key={entry.id}
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => { setResult(entry.result); setMealText(entry.meal); }}
                            style={{
                              display: "flex", alignItems: "center", gap: 12,
                              padding: "12px 14px", borderRadius: 14,
                              border: "1.5px solid rgba(190,175,155,0.20)",
                              backgroundColor: "rgba(248,245,240,0.8)",
                              cursor: "pointer", fontFamily: "inherit",
                              textAlign: "right", width: "100%",
                            }}
                          >
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ fontSize: 13, fontWeight: 700, color: "#333", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {entry.meal.length > 40 ? entry.meal.slice(0, 40) + "..." : entry.meal}
                              </p>
                            </div>
                            <span style={{
                              flexShrink: 0, padding: "4px 12px", borderRadius: 999,
                              backgroundColor: "rgba(224,122,95,0.12)",
                              color: "#E07A5F", fontSize: 12, fontWeight: 800,
                            }}>
                              {entry.result.calories} سعرة
                            </span>
                          </motion.button>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.div>

                {/* Card: Meal rating */}
                {rating && (
                  <motion.div {...fadeCard(0.16)} style={CARD}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                      <Star size={18} color="#D4A017" />
                      <h2 style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a" }}>تقييم الوجبة</h2>
                    </div>

                    <div style={{
                      padding: "20px", borderRadius: 16, textAlign: "center",
                      backgroundColor: `${rating.color}10`,
                      border: `2px solid ${rating.color}30`,
                      marginBottom: 14,
                    }}>
                      <p style={{ fontSize: 28, fontWeight: 900, color: rating.color, lineHeight: 1 }}>
                        {rating.label}
                      </p>
                      <p style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
                        {result.calories} سعرة حرارية
                      </p>
                    </div>

                    <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7, fontWeight: 600 }}>
                      {rating.comment}
                    </p>

                    {result.protein > 30 && (
                      <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 12, backgroundColor: "rgba(61,122,94,0.07)", border: "1px solid rgba(61,122,94,0.15)" }}>
                        <p style={{ fontSize: 12, color: "#2D6A4F", fontWeight: 700 }}>💪 بروتين ممتاز — يدعم بناء العضلات والتعافي</p>
                      </div>
                    )}
                    {result.carbs > 60 && (
                      <div style={{ marginTop: 8, padding: "10px 14px", borderRadius: 12, backgroundColor: "rgba(91,140,191,0.07)", border: "1px solid rgba(91,140,191,0.15)" }}>
                        <p style={{ fontSize: 12, color: "#3a6ea0", fontWeight: 700 }}>⚡ غنية بالكربوهيدرات — مثالية قبل التمارين</p>
                      </div>
                    )}
                    {result.fats > 30 && (
                      <div style={{ marginTop: 8, padding: "10px 14px", borderRadius: 12, backgroundColor: "rgba(224,122,95,0.07)", border: "1px solid rgba(224,122,95,0.15)" }}>
                        <p style={{ fontSize: 12, color: "#b05a3a", fontWeight: 700 }}>🫙 دهون مرتفعة — تأكد أنها من مصادر صحية</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
