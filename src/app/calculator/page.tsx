"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator, Dumbbell, Flame, Droplets, Zap,
  TrendingUp, TrendingDown, Minus, Sparkles, Award,
  Home as HomeIcon, ShoppingBag,
} from "lucide-react";
import SiteNavbar from "@/components/SiteNavbar";
import { createClient } from "@/utils/supabase/client";


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Types
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

type Gender   = "male" | "female";
type Activity = "sedentary" | "light" | "moderate" | "active";
type Goal     = "lose" | "maintain" | "gain";

interface Results {
  bmr:      number;
  tdee:     number;
  calories: number;
  protein:  number; // g
  fats:     number; // g
  carbs:    number; // g
  water:    number; // L
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Constants
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const ACTIVITY_FACTORS: Record<Activity, number> = {
  sedentary: 1.200,
  light:     1.375,
  moderate:  1.550,
  active:    1.725,
};

const ACTIVITY_OPTIONS: { id: Activity; label: string; sub: string }[] = [
  { id: "sedentary", label: "خامل",      sub: "لا تمرين أو نادراً"    },
  { id: "light",     label: "خفيف",      sub: "1-3 أيام / الأسبوع"    },
  { id: "moderate",  label: "متوسط",     sub: "3-5 أيام / الأسبوع"    },
  { id: "active",    label: "نشط جداً",  sub: "6-7 أيام / الأسبوع"    },
];

const GOAL_OPTIONS: {
  id: Goal; label: string; sub: string;
  activeColor: string; activeBg: string; activeBorder: string;
  Icon: React.ElementType;
}[] = [
  {
    id: "lose", label: "تنشيف", sub: "−500 سعرة",
    activeColor: "#DC2626", activeBg: "#FEF2F2", activeBorder: "#FECACA",
    Icon: TrendingDown,
  },
  {
    id: "maintain", label: "محافظة", sub: "TDEE محايد",
    activeColor: "#0D9488", activeBg: "#F0FDFA", activeBorder: "#99F6E4",
    Icon: Minus,
  },
  {
    id: "gain", label: "تضخيم", sub: "+400 سعرة",
    activeColor: "#D97706", activeBg: "#FFFBEB", activeBorder: "#FDE68A",
    Icon: TrendingUp,
  },
];

const EXPERT_TIPS: Record<Goal, string> = {
  gain:     "لتحقيق تضخيم نظيف وفعّال، ركّز على مبدأ الحمل التدريجي برفع الأوزان تدريجياً أسبوعاً بعد أسبوع. الفائض الكالوري المحسوب (+400 سعرة) يضمن لك بناءً عضلياً دون تراكم دهون مفرط. أعطِ الأولوية لتمارين المركّب الكبرى كالسكوات والديدليفت والبنش برس، واحرص على 7-9 ساعات نوم يومياً لأن هرمون النمو يُفرز أثناء النوم العميق.",
  lose:     "للتنشيف مع الحفاظ على الكتلة العضلية، الأهم هو تحقيق العجز المحسوب دون التضحية بالبروتين. معدل 2.2 غ/كغ يحمي ألياف عضلاتك أثناء الحرق. واظب على شرب الكمية المحسوبة من الماء يومياً لأن الترطيب الجيد يرفع معدل الأيض ويساعد في طرد السموم وتكسير الدهون. أضف كارديو خفيفاً بعد جلسات القوة لتعزيز الحرق.",
  maintain: "المحافظة على الوزن المثالي هي أصعب المراحل وتتطلب انضباطاً حقيقياً مع التوازن الدقيق بين السعرات الداخلة والخارجة. استمر في تمارين القوة للحفاظ على كثافة العضلات، وتنوّع في التمارين لتجنّب التكيّف العضلي. راقب وزنك أسبوعياً في نفس الوقت، وتذكر أن تذبذباً بمقدار 1-2 كغ أمر طبيعي تماماً.",
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Calculation engine — Mifflin-St Jeor
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function computeResults(
  weight: number, height: number, age: number,
  gender: Gender, activity: Activity, goal: Goal,
): Results {
  const bmr =
    gender === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  const tdee     = bmr * ACTIVITY_FACTORS[activity];
  const calories = goal === "lose" ? tdee - 500 : goal === "gain" ? tdee + 400 : tdee;

  const protein     = weight * 2.2;
  const proteinCals = protein * 4;
  const fatCals     = calories * 0.25;
  const fats        = fatCals / 9;
  const carbCals    = calories - proteinCals - fatCals;
  const carbs       = Math.max(0, carbCals / 4);
  const water       = weight * 0.033;

  return {
    bmr:      Math.round(bmr),
    tdee:     Math.round(tdee),
    calories: Math.round(calories),
    protein:  Math.round(protein),
    fats:     Math.round(fats),
    carbs:    Math.round(carbs),
    water:    parseFloat(water.toFixed(1)),
  };
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Small UI primitives
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#4A6B5C", marginBottom: 6 }}>
      {children}
    </span>
  );
}

function NumberInput({
  value, onChange, placeholder, min, max,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  min?: number;
  max?: number;
}) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      min={min}
      max={max}
      style={{
        width: "100%",
        height: 48,
        borderRadius: 12,
        border: "1.5px solid #E5E0D8",
        backgroundColor: "#FAFAF8",
        padding: "0 14px",
        fontSize: "1.05rem",
        fontWeight: 700,
        color: "#1A2E22",
        outline: "none",
        textAlign: "center",
        direction: "ltr",
        fontFamily: "inherit",
        transition: "border-color 0.2s",
      }}
      onFocus={(e) => (e.currentTarget.style.borderColor = "#0D9488")}
      onBlur={(e)  => (e.currentTarget.style.borderColor = "#E5E0D8")}
    />
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
      <div style={{ width: 3, height: 18, borderRadius: 99, backgroundColor: "#0D9488" }} />
      <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#1A2E22", letterSpacing: "0.01em" }}>
        {children}
      </span>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Page
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function CalculatorPage() {
  const [weight,   setWeight]   = useState("");
  const [height,   setHeight]   = useState("");
  const [age,      setAge]      = useState("");
  const [gender,   setGender]   = useState<Gender>("male");
  const [activity, setActivity] = useState<Activity>("moderate");
  const [goal,     setGoal]     = useState<Goal>("maintain");
  const [results,    setResults]    = useState<Results | null>(null);
  const [error,      setError]      = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "guest">("idle");

  const handleCalculate = async () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);

    if (!weight || !height || !age || isNaN(w) || isNaN(h) || isNaN(a)) {
      setError("يرجى ملء جميع الحقول بأرقام صحيحة");
      return;
    }
    if (w < 30 || w > 300) { setError("الوزن يجب أن يكون بين 30 و 300 كغ");      return; }
    if (h < 100 || h > 250){ setError("الطول يجب أن يكون بين 100 و 250 سم");     return; }
    if (a < 10  || a > 100) { setError("العمر يجب أن يكون بين 10 و 100 سنة");    return; }

    setError("");
    const computed = computeResults(w, h, a, gender, activity, goal);
    setResults(computed);

    // Save calorie_goal to profiles if logged in
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setSaveStatus("guest");
        return;
      }
      setSaveStatus("saving");
      await supabase
        .from("profiles")
        .upsert({ id: user.id, calorie_goal: computed.calories }, { onConflict: "id" });
      setSaveStatus("saved");
    } catch {
      setSaveStatus("idle");
    }
  };

  /* ── colour helpers for active goal ──────────────────────────────── */
  const activeGoal = GOAL_OPTIONS.find((g) => g.id === goal)!;

  return (
    <div
      dir="rtl"
      style={{ fontFamily: "'Cairo', sans-serif", backgroundColor: "#F8F5F0", minHeight: "100vh" }}
      className="pb-24"
    >
      <SiteNavbar />

      {/* ══ Page header ══════════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="pt-12 pb-10 px-4 text-center"
      >
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-5"
          style={{ backgroundColor: "#CCFBF1", color: "#0D9488", border: "1px solid #99F6E4" }}
        >
          <Calculator size={14} />
          <span>معادلات Mifflin-St Jeor العلمية</span>
        </div>

        <h1
          className="text-4xl md:text-5xl font-black mb-4"
          style={{ color: "#1A2E22" }}
        >
          الحاسبة الصحية الذكية
        </h1>

        <p className="text-lg max-w-2xl mx-auto" style={{ color: "#6B7280" }}>
          أدخل بياناتك الجسدية واحصل على خطة تغذية كاملة محسوبة علمياً — سعرات، ماكرو، ماء، وتوصية مخصصة لهدفك
        </p>
      </motion.section>

      {/* ══ Main 2-column grid ═══════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">

          {/* ─── LEFT COLUMN: Input form ────────────────────────────
               (appears on RIGHT in RTL — visual right = form start) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="flex flex-col gap-6 p-7 rounded-2xl"
              style={{ backgroundColor: "white", border: "1px solid rgba(190,175,155,0.22)", boxShadow: "0 2px 24px rgba(0,0,0,0.05)" }}
            >
              {/* ── Section 1: Body data ── */}
              <div>
                <SectionLabel>بيانات جسمك</SectionLabel>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <FieldLabel>الوزن (كغ)</FieldLabel>
                    <NumberInput value={weight} onChange={setWeight} placeholder="75" min={30} max={300} />
                  </div>
                  <div>
                    <FieldLabel>الطول (سم)</FieldLabel>
                    <NumberInput value={height} onChange={setHeight} placeholder="175" min={100} max={250} />
                  </div>
                  <div>
                    <FieldLabel>العمر (سنة)</FieldLabel>
                    <NumberInput value={age} onChange={setAge} placeholder="25" min={10} max={100} />
                  </div>
                  <div>
                    <FieldLabel>الجنس</FieldLabel>
                    <div style={{ display: "flex", gap: 8, height: 48 }}>
                      {(["male", "female"] as Gender[]).map((g) => {
                        const active = gender === g;
                        return (
                          <button
                            key={g}
                            onClick={() => setGender(g)}
                            style={{
                              flex: 1,
                              borderRadius: 12,
                              border: `1.5px solid ${active ? "#0D9488" : "#E5E0D8"}`,
                              backgroundColor: active ? "#0D9488" : "#FAFAF8",
                              color: active ? "white" : "#4A6B5C",
                              fontWeight: 700,
                              fontSize: "0.9rem",
                              cursor: "pointer",
                              transition: "all 0.18s ease",
                              fontFamily: "inherit",
                            }}
                          >
                            {g === "male" ? "ذكر" : "أنثى"}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Section 2: Activity level ── */}
              <div>
                <SectionLabel>مستوى نشاطك اليومي</SectionLabel>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {ACTIVITY_OPTIONS.map((opt) => {
                    const active = activity === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setActivity(opt.id)}
                        style={{
                          padding: "12px 10px",
                          borderRadius: 12,
                          border:           `1.5px solid ${active ? "#0D9488" : "#E5E0D8"}`,
                          backgroundColor:  active ? "#F0FDFA" : "#FAFAF8",
                          cursor:           "pointer",
                          transition:       "all 0.18s ease",
                          textAlign:        "center",
                          fontFamily:       "inherit",
                        }}
                      >
                        <div style={{ fontSize: "0.9rem", fontWeight: 800, color: active ? "#0D9488" : "#1A2E22" }}>
                          {opt.label}
                        </div>
                        <div style={{ fontSize: "0.7rem", color: "#9CA3AF", marginTop: 2 }}>
                          {opt.sub}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Section 3: Goal ── */}
              <div>
                <SectionLabel>هدفك الرياضي</SectionLabel>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  {GOAL_OPTIONS.map((opt) => {
                    const active = goal === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setGoal(opt.id)}
                        style={{
                          padding:         "14px 8px",
                          borderRadius:    12,
                          border:          `1.5px solid ${active ? opt.activeBorder : "#E5E0D8"}`,
                          backgroundColor: active ? opt.activeBg : "#FAFAF8",
                          cursor:          "pointer",
                          transition:      "all 0.18s ease",
                          textAlign:       "center",
                          fontFamily:      "inherit",
                        }}
                      >
                        <opt.Icon
                          size={18}
                          style={{ color: active ? opt.activeColor : "#9CA3AF", margin: "0 auto 6px" }}
                        />
                        <div style={{ fontSize: "1rem", fontWeight: 800, color: active ? opt.activeColor : "#1A2E22" }}>
                          {opt.label}
                        </div>
                        <div style={{ fontSize: "0.68rem", color: "#9CA3AF", marginTop: 2 }}>
                          {opt.sub}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Error ── */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      backgroundColor: "#FEF2F2",
                      border:          "1px solid #FECACA",
                      borderRadius:    10,
                      padding:         "10px 14px",
                      fontSize:        "0.85rem",
                      fontWeight:      600,
                      color:           "#DC2626",
                    }}
                  >
                    ⚠ {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Calculate button ── */}
              <button
                onClick={handleCalculate}
                className="w-full flex items-center justify-center gap-2 font-black text-base text-white rounded-xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  height:     56,
                  background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)",
                  boxShadow:  "0 6px 24px rgba(13,148,136,0.30)",
                  border:     "none",
                  cursor:     "pointer",
                  fontFamily: "inherit",
                }}
              >
                <Calculator size={20} />
                احسب احتياجاتك
              </button>

              {/* ── Save status banner ── */}
              <AnimatePresence>
                {saveStatus === "saved" && (
                  <motion.div
                    key="saved"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      backgroundColor: "#F0FDF4",
                      border: "1px solid #86EFAC",
                      borderRadius: 10,
                      padding: "10px 14px",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: "#16A34A",
                      textAlign: "center",
                    }}
                  >
                    ✓ تم حفظ هدفك السعري في ملفك الشخصي
                  </motion.div>
                )}
                {saveStatus === "guest" && (
                  <motion.div
                    key="guest"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      backgroundColor: "#FFFBEB",
                      border: "1px solid #FDE68A",
                      borderRadius: 10,
                      padding: "10px 14px",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: "#92400E",
                      textAlign: "center",
                    }}
                  >
                    💡 سجّل دخولك لحفظ هدفك تلقائياً وربطه بخطة التمرين
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ─── RIGHT COLUMN: Results ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <AnimatePresence mode="wait">
              {!results ? (
                /* ── Placeholder ── */
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center text-center p-10 rounded-2xl"
                  style={{
                    minHeight:       420,
                    backgroundColor: "white",
                    border:          "1.5px dashed rgba(13,148,136,0.25)",
                    boxShadow:       "0 2px 24px rgba(0,0,0,0.04)",
                  }}
                >
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
                    style={{ background: "linear-gradient(135deg, #CCFBF1 0%, #F0FDFA 100%)" }}
                  >
                    <Sparkles size={40} style={{ color: "#0D9488" }} />
                  </div>
                  <h3 className="text-xl font-black mb-3" style={{ color: "#1A2E22" }}>
                    نتائجك ستظهر هنا
                  </h3>
                  <p className="text-sm leading-relaxed max-w-xs" style={{ color: "#9CA3AF" }}>
                    أدخل بياناتك في النموذج واضغط "احسب احتياجاتك" للحصول على خطتك الغذائية المخصصة
                  </p>
                </motion.div>
              ) : (
                /* ── Results dashboard ── */
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col gap-4"
                >
                  {/* ·· Calorie ring card ·· */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.05 }}
                    className="p-7 rounded-2xl text-center"
                    style={{
                      backgroundColor: "white",
                      border:          "1px solid rgba(190,175,155,0.22)",
                      boxShadow:       "0 2px 24px rgba(0,0,0,0.05)",
                    }}
                  >
                    <p className="text-sm font-bold mb-5" style={{ color: "#4A6B5C" }}>
                      السعرات اليومية الموصى بها
                    </p>

                    {/* Calorie ring */}
                    <div
                      className="mx-auto mb-5"
                      style={{
                        width:        168,
                        height:       168,
                        borderRadius: "50%",
                        border:       "7px solid #0D9488",
                        background:   "radial-gradient(circle at 35% 35%, #CCFBF1 0%, #F0FDFA 100%)",
                        display:      "flex",
                        flexDirection:"column",
                        alignItems:   "center",
                        justifyContent: "center",
                        boxShadow:    "0 8px 36px rgba(13,148,136,0.20)",
                      }}
                    >
                      <span style={{ fontSize: "2.5rem", fontWeight: 900, color: "#0D9488", lineHeight: 1 }}>
                        {results.calories.toLocaleString("ar-SA")}
                      </span>
                      <span style={{ fontSize: "0.72rem", color: "#0F766E", fontWeight: 700, marginTop: 5, letterSpacing: "0.05em" }}>
                        سعرة / يوم
                      </span>
                    </div>

                    {/* BMR + TDEE row */}
                    <div className="flex justify-center gap-8">
                      {[
                        { label: "معدل الأيض الأساسي BMR", value: results.bmr },
                        { label: "الاحتياج اليومي TDEE",   value: results.tdee },
                      ].map((item) => (
                        <div key={item.label} className="text-center">
                          <div style={{ fontSize: "1.2rem", fontWeight: 900, color: "#1A2E22" }}>
                            {item.value.toLocaleString("ar-SA")}
                          </div>
                          <div style={{ fontSize: "0.68rem", color: "#9CA3AF", fontWeight: 600, marginTop: 2 }}>
                            {item.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* ·· Macro cards ·· */}
                  <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.15 }}
                    style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}
                  >
                    {[
                      {
                        label: "البروتين", value: results.protein,
                        color: "#D97706", bg: "#FFFBEB", border: "#FDE68A",
                        Icon: Dumbbell,   tip: "2.2 غ / كغ",
                      },
                      {
                        label: "الكارب",   value: results.carbs,
                        color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE",
                        Icon: Flame,      tip: "السعرات المتبقية",
                      },
                      {
                        label: "الدهون",   value: results.fats,
                        color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE",
                        Icon: Zap,        tip: "25% من السعرات",
                      },
                    ].map((macro) => (
                      <div
                        key={macro.label}
                        className="flex flex-col items-center rounded-2xl p-4"
                        style={{
                          backgroundColor: macro.bg,
                          border:          `1.5px solid ${macro.border}`,
                        }}
                      >
                        <macro.Icon size={20} style={{ color: macro.color, marginBottom: 8 }} />
                        <div style={{ fontSize: "1.6rem", fontWeight: 900, color: macro.color, lineHeight: 1 }}>
                          {macro.value}
                        </div>
                        <div style={{ fontSize: "0.7rem", color: macro.color, marginTop: 1 }}>غرام</div>
                        <div style={{ fontSize: "0.8rem", fontWeight: 800, color: "#1A2E22", marginTop: 6 }}>
                          {macro.label}
                        </div>
                        <div style={{ fontSize: "0.65rem", color: "#9CA3AF", marginTop: 2, textAlign: "center" }}>
                          {macro.tip}
                        </div>
                      </div>
                    ))}
                  </motion.div>

                  {/* ·· Water + Creatine card ·· */}
                  <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.25 }}
                    className="rounded-2xl p-5"
                    style={{
                      backgroundColor: "white",
                      border:          "1px solid rgba(190,175,155,0.22)",
                      boxShadow:       "0 2px 16px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div style={{ display: "flex", gap: 14, alignItems: "stretch" }}>
                      {/* Water */}
                      <div
                        className="flex-1 flex flex-col items-center justify-center rounded-xl p-4"
                        style={{ backgroundColor: "#EFF6FF", border: "1.5px solid #BFDBFE" }}
                      >
                        <Droplets size={26} style={{ color: "#2563EB", marginBottom: 6 }} />
                        <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#2563EB", lineHeight: 1 }}>
                          {results.water}
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "#3B82F6", marginTop: 2 }}>لتر / يوم</div>
                        <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#1A2E22", marginTop: 5 }}>
                          الماء اليومي
                        </div>
                        <div style={{ fontSize: "0.66rem", color: "#9CA3AF", marginTop: 2 }}>الوزن × 0.033</div>
                      </div>

                      {/* Creatine */}
                      <div
                        className="flex-1 flex flex-col items-center justify-center rounded-xl p-4"
                        style={{ backgroundColor: "#ECFDF5", border: "1.5px solid #A7F3D0" }}
                      >
                        <Award size={26} style={{ color: "#059669", marginBottom: 6 }} />
                        <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#059669", lineHeight: 1 }}>
                          5
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "#10B981", marginTop: 2 }}>غرام / يوم</div>
                        <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#1A2E22", marginTop: 5 }}>
                          توصية الكرياتين
                        </div>
                        <div style={{ fontSize: "0.66rem", color: "#9CA3AF", marginTop: 2, textAlign: "center" }}>
                          معيار الأداء الرياضي
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* ·· Expert tip ·· */}
                  <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.35 }}
                    className="rounded-2xl p-6"
                    style={{
                      background: `linear-gradient(135deg, ${activeGoal.activeBg} 0%, white 100%)`,
                      border:     `1.5px solid ${activeGoal.activeBorder}`,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles size={17} style={{ color: activeGoal.activeColor }} />
                      <span
                        style={{ fontSize: "0.85rem", fontWeight: 800, color: activeGoal.activeColor }}
                      >
                        نصيحة الأخصائي المخصصة — {activeGoal.label}
                      </span>
                    </div>
                    <p style={{ fontSize: "0.88rem", lineHeight: 1.85, color: "#374151" }}>
                      {EXPERT_TIPS[goal]}
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>{/* end grid */}
      </div>
    </div>
  );
}
