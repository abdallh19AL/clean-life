"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────

type ChartEntry  = { day: string; weight: number };
type BmiCategory = { label: string; color: string; bg: string };

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 20 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: "easeOut" as const },
});

function formatDateShort(dateStr: string) {
  const d     = new Date(dateStr);
  const day   = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}`;
}

function getBmiCategory(bmi: number): BmiCategory {
  if (bmi < 18.5) return { label: "نحيف",  color: "#5B8CBF", bg: "rgba(91,140,191,0.12)"  };
  if (bmi < 25)   return { label: "طبيعي", color: "#3D7A5E", bg: "rgba(61,122,94,0.12)"   };
  if (bmi < 30)   return { label: "زائد",  color: "#E07A5F", bg: "rgba(224,122,95,0.12)"  };
  return                  { label: "سمنة",  color: "#C0392B", bg: "rgba(192,57,43,0.12)"   };
}

// Maps a BMI value to a % position on the 4-zone colour bar.
// Zones: flex 1 (<18.5) + 1.5 (18.5–25) + 1 (25–30) + 0.8 (≥30) = 4.3 total
function getBmiIndicatorPct(bmi: number): number {
  const UW = (1   / 4.3) * 100;  // 0 – 23.3 %
  const NM = (2.5 / 4.3) * 100;  // 23.3 – 58.1 %
  const OW = (3.5 / 4.3) * 100;  // 58.1 – 81.4 %
  if (bmi <= 0)   return 0;
  if (bmi < 18.5) return (bmi / 18.5) * UW;
  if (bmi < 25)   return UW + ((bmi - 18.5) / 6.5)  * (NM - UW);
  if (bmi < 30)   return NM + ((bmi - 25)   / 5)     * (OW - NM);
  return Math.min(OW + ((bmi - 30) / 15) * (100 - OW), 97);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: {
  active?: boolean; payload?: { value: number }[]; label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "white", border: "1px solid rgba(190,175,155,0.3)",
      borderRadius: 12, padding: "10px 16px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
      fontFamily: "'Cairo', sans-serif",
    }}>
      <p style={{ color: "#999", fontSize: 12, marginBottom: 2 }}>{label}</p>
      <p style={{ color: "#3D7A5E", fontSize: 16, fontWeight: 900 }}>{payload[0].value} كغ</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProgressPage() {
  const router = useRouter();

  const [chartData,    setChartData]    = useState<ChartEntry[]>([]);
  const [latestWeight, setLatestWeight] = useState<number | null>(null);
  const [firstWeight,  setFirstWeight]  = useState<number | null>(null);
  const [loading,      setLoading]      = useState(true);

  const [userId,       setUserId]       = useState<string | null>(null);
  const [heightCm,     setHeightCm]     = useState<number | null>(null);
  const [bodyFatPct,   setBodyFatPct]   = useState<number | null>(null);
  const [bodyFatInput, setBodyFatInput] = useState("");
  const [bfSaving,     setBfSaving]     = useState(false);
  const [bfSaved,      setBfSaved]      = useState(false);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      setUserId(user.id);

      const [weightRes, profileRes] = await Promise.all([
        supabase
          .from("weight_logs")
          .select("date, weight_kg")
          .eq("user_id", user.id)
          .order("date", { ascending: true })
          .limit(30),
        supabase
          .from("profiles")
          .select("height_cm, body_fat_pct")
          .eq("id", user.id)
          .maybeSingle(),
      ]);

      if (weightRes.data && weightRes.data.length > 0) {
        const d = weightRes.data;
        setChartData(d.map(e => ({ day: formatDateShort(e.date), weight: e.weight_kg })));
        setLatestWeight(d[d.length - 1].weight_kg);
        setFirstWeight(d[0].weight_kg);
      }
      if (profileRes.data?.height_cm    != null) setHeightCm(profileRes.data.height_cm);
      if (profileRes.data?.body_fat_pct != null) setBodyFatPct(profileRes.data.body_fat_pct);

      setLoading(false);
    })();
  }, []);

  async function saveBodyFat() {
    if (!bodyFatInput || !userId) return;
    setBfSaving(true);
    const supabase = createClient();
    await supabase
      .from("profiles")
      .upsert({ id: userId, body_fat_pct: parseFloat(bodyFatInput) }, { onConflict: "id" });
    setBodyFatPct(parseFloat(bodyFatInput));
    setBodyFatInput("");
    setBfSaving(false);
    setBfSaved(true);
    setTimeout(() => setBfSaved(false), 2500);
  }

  // Derived values
  const weightDiff = latestWeight !== null && firstWeight !== null
    ? parseFloat((latestWeight - firstWeight).toFixed(1))
    : null;

  const weights = chartData.map(e => e.weight);
  const yMin    = weights.length > 0 ? Math.floor(Math.min(...weights) - 1) : 60;
  const yMax    = weights.length > 0 ? Math.ceil(Math.max(...weights)  + 1) : 100;

  const bmi: number | null =
    latestWeight !== null && heightCm !== null
      ? parseFloat((latestWeight / Math.pow(heightCm / 100, 2)).toFixed(1))
      : null;

  const bmiCat    = bmi !== null ? getBmiCategory(bmi) : null;
  const bmiIndPct = bmi !== null ? getBmiIndicatorPct(bmi) : null;

  const CARD: React.CSSProperties = {
    background:  "rgba(255,255,255,0.85)",
    border:      "1.5px solid rgba(190,175,155,0.22)",
    borderRadius: 20,
    boxShadow:   "0 2px 12px rgba(0,0,0,0.055)",
  };

  const bfInputStyle: React.CSSProperties = {
    flex: 1, padding: "10px 14px", borderRadius: 12,
    border: "1.5px solid rgba(190,175,155,0.35)",
    backgroundColor: "#FCFAF6", fontSize: 15,
    fontFamily: "inherit", color: "#1a2e22",
    outline: "none", direction: "rtl", textAlign: "center",
    transition: "border-color 0.2s",
  };

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
        <h1 style={{ fontSize: 28, fontWeight: 900, color: "#1a1a1a", marginBottom: 4 }}>متابعة التقدم</h1>
        <p style={{ fontSize: 14, color: "#aaa" }}>تتبع رحلتك وتطور جسمك أسبوعاً بأسبوع</p>
      </motion.div>

      {/* ── Stat cards ── */}
      <motion.div
        {...fadeUp(0.1)}
        style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, marginBottom: 24 }}
      >
        {/* Weight */}
        <motion.div
          whileHover={{ y: -4, boxShadow: "0 12px 28px rgba(0,0,0,0.10)" }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{ ...CARD, padding: 24 }}
        >
          <div style={{
            width: 44, height: 44, borderRadius: 14, background: "rgba(61,122,94,0.10)",
            display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14,
          }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#3D7A5E" }} />
          </div>
          <p style={{ color: "#999", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", marginBottom: 4 }}>
            الوزن الحالي
          </p>
          <p style={{ color: "#1a1a1a", fontSize: 26, fontWeight: 900, marginBottom: 4 }}>
            {loading ? "..." : latestWeight !== null ? latestWeight : "--"}
            <span style={{ fontSize: 16, color: "#aaa", marginRight: 4 }}>كغ</span>
          </p>
          <p style={{ color: "#bbb", fontSize: 12 }}>
            {!loading && (weightDiff !== null
              ? weightDiff < 0 ? `${weightDiff} كغ من البداية 📉`
                : weightDiff > 0 ? `+${weightDiff} كغ من البداية`
                : "ثابت من البداية"
              : "سجّل وزنك لرؤية التقدم"
            )}
          </p>
        </motion.div>

        {/* BMI stat card */}
        <motion.div
          whileHover={{ y: -4, boxShadow: "0 12px 28px rgba(0,0,0,0.10)" }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{ ...CARD, padding: 24 }}
        >
          <div style={{
            width: 44, height: 44, borderRadius: 14,
            background: bmiCat ? bmiCat.bg : "rgba(91,140,191,0.10)",
            display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14,
          }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: bmiCat ? bmiCat.color : "#5B8CBF" }} />
          </div>
          <p style={{ color: "#999", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", marginBottom: 4 }}>
            مؤشر كتلة الجسم
          </p>
          <p style={{ color: "#1a1a1a", fontSize: 26, fontWeight: 900, marginBottom: 4 }}>
            {loading ? "..." : bmi !== null ? bmi : "--"}
          </p>
          <p style={{ color: bmiCat ? bmiCat.color : "#bbb", fontSize: 12, fontWeight: bmiCat ? 700 : 400 }}>
            {!loading && (bmiCat
              ? bmiCat.label
              : heightCm === null ? "أدخل طولك في الإعدادات" : "سجّل وزنك أولاً"
            )}
          </p>
        </motion.div>

        {/* Body fat stat card */}
        <motion.div
          whileHover={{ y: -4, boxShadow: "0 12px 28px rgba(0,0,0,0.10)" }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{ ...CARD, padding: 24 }}
        >
          <div style={{
            width: 44, height: 44, borderRadius: 14, background: "rgba(224,122,95,0.10)",
            display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14,
          }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#E07A5F" }} />
          </div>
          <p style={{ color: "#999", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", marginBottom: 4 }}>
            نسبة الدهون
          </p>
          <p style={{ color: "#1a1a1a", fontSize: 26, fontWeight: 900, marginBottom: 4 }}>
            {loading ? "..." : bodyFatPct !== null ? bodyFatPct : "--"}
            {!loading && bodyFatPct !== null && (
              <span style={{ fontSize: 16, color: "#aaa", marginRight: 4 }}>%</span>
            )}
          </p>
          <p style={{ color: "#bbb", fontSize: 12 }}>
            {!loading && (bodyFatPct !== null ? "مُدخَل يدوياً ✓" : "أدخله في البطاقة أدناه")}
          </p>
        </motion.div>
      </motion.div>

      {/* ── Weight chart ── */}
      <motion.div
        {...fadeUp(0.2)}
        style={{ ...CARD, padding: "28px 24px", marginBottom: 24 }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: "#1a1a1a", marginBottom: 4 }}>
              تطور الوزن{chartData.length > 0 ? ` — آخر ${chartData.length} قراءة` : ""}
            </h2>
            <p style={{ fontSize: 13, color: "#aaa" }}>الوزن بالكيلوغرام</p>
          </div>
          {weightDiff !== null && (
            <span style={{
              background: weightDiff <= 0 ? "rgba(61,122,94,0.10)" : "rgba(224,122,95,0.10)",
              color: weightDiff <= 0 ? "#3D7A5E" : "#E07A5F",
              fontSize: 13, fontWeight: 700, padding: "6px 16px", borderRadius: 30,
            }}>
              {weightDiff < 0 ? `${weightDiff} كغ 📉` : weightDiff > 0 ? `+${weightDiff} كغ 📈` : "ثابت ✓"}
            </span>
          )}
        </div>

        {loading && (
          <div className="animate-pulse" style={{ height: 280, borderRadius: 12, backgroundColor: "#EDE9E3" }} />
        )}
        {!loading && chartData.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <p style={{ fontSize: 44, marginBottom: 12 }}>⚖️</p>
            <p style={{ fontSize: 16, fontWeight: 800, color: "#555", marginBottom: 8 }}>لا توجد بيانات وزن بعد</p>
            <p style={{ fontSize: 13, color: "#aaa" }}>سجّل وزنك يومياً لرؤية مخطط تقدمك هنا</p>
          </div>
        )}
        {!loading && chartData.length > 0 && (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[yMin, yMax]}
                tick={{ fill: "#bbb", fontSize: 11, fontFamily: "Cairo" }}
                tickLine={false} axisLine={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "#3D7A5E", strokeWidth: 1, strokeDasharray: "4 4" }}
              />
              <Area
                type="monotone" dataKey="weight"
                stroke="#3D7A5E" strokeWidth={2.5}
                fill="url(#weightGrad)"
                dot={chartData.length <= 10 ? { r: 4, fill: "#3D7A5E", strokeWidth: 0 } : false}
                activeDot={{ r: 5, fill: "#3D7A5E", strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      {/* ── BMI analysis + Body fat ── */}
      <motion.div
        {...fadeUp(0.3)}
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}
      >

        {/* BMI card */}
        <div style={{ ...CARD, padding: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: "#1a1a1a", marginBottom: 20 }}>
            تحليل مؤشر كتلة الجسم
          </h2>

          {loading && (
            <div className="animate-pulse" style={{ height: 150, borderRadius: 12, backgroundColor: "#EDE9E3" }} />
          )}

          {/* No height set */}
          {!loading && heightCm === null && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <p style={{ fontSize: 38, marginBottom: 12 }}>📏</p>
              <p style={{ fontSize: 14, fontWeight: 800, color: "#555", marginBottom: 6 }}>
                أدخل طولك في الإعدادات
              </p>
              <p style={{ fontSize: 12, color: "#aaa", marginBottom: 20 }}>
                يحتاج المؤشر إلى طولك لحساب النتيجة
              </p>
              <motion.button
                whileHover={{ y: -2, boxShadow: "0 8px 20px rgba(61,122,94,0.22)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push("/dashboard/settings")}
                style={{
                  background: "linear-gradient(135deg, #2D6A4F, #40916C)",
                  color: "white", border: "none", borderRadius: 12,
                  padding: "10px 22px", fontSize: 13, fontWeight: 800,
                  fontFamily: "inherit", cursor: "pointer",
                  boxShadow: "0 3px 12px rgba(45,106,79,0.25)",
                }}
              >
                الذهاب إلى الإعدادات ←
              </motion.button>
            </div>
          )}

          {/* Height set but no weight */}
          {!loading && heightCm !== null && bmi === null && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <p style={{ fontSize: 38, marginBottom: 12 }}>⚖️</p>
              <p style={{ fontSize: 14, fontWeight: 800, color: "#555", marginBottom: 6 }}>
                سجّل وزنك أولاً
              </p>
              <p style={{ fontSize: 12, color: "#aaa" }}>
                طولك: {heightCm} سم — نحتاج وزنك لإكمال الحساب
              </p>
            </div>
          )}

          {/* Real BMI */}
          {!loading && bmi !== null && bmiCat !== null && bmiIndPct !== null && (
            <>
              <div style={{ textAlign: "center", marginBottom: 22 }}>
                <motion.p
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.45, delay: 0.35 }}
                  style={{ fontSize: 54, fontWeight: 900, color: bmiCat.color, lineHeight: 1 }}
                >
                  {bmi}
                </motion.p>
                <span style={{
                  display: "inline-block", marginTop: 10,
                  background: bmiCat.bg, color: bmiCat.color,
                  fontSize: 14, fontWeight: 700, padding: "6px 20px", borderRadius: 30,
                }}>
                  {bmiCat.label}
                </span>
                <p style={{ fontSize: 11, color: "#bbb", marginTop: 6 }}>
                  {heightCm} سم — {latestWeight} كغ
                </p>
              </div>

              {/* Scale bar */}
              <div>
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  fontSize: 9, color: "#bbb", marginBottom: 6,
                }}>
                  <span style={{ flex: 1 }}>نحيف<br/>{"<18.5"}</span>
                  <span style={{ flex: 1.5, textAlign: "center" }}>طبيعي<br/>18.5–25</span>
                  <span style={{ flex: 1, textAlign: "center" }}>زائد<br/>25–30</span>
                  <span style={{ flex: 0.8, textAlign: "right" }}>سمنة<br/>{">30"}</span>
                </div>
                <div style={{ position: "relative", paddingBottom: 8 }}>
                  <div style={{ height: 10, borderRadius: 999, overflow: "hidden", display: "flex" }}>
                    <div style={{ flex: 1,   background: "#93C5FD" }} />
                    <div style={{ flex: 1.5, background: "#6EE7B7" }} />
                    <div style={{ flex: 1,   background: "#FCD34D" }} />
                    <div style={{ flex: 0.8, background: "#FCA5A5" }} />
                  </div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.55 }}
                    style={{
                      position: "absolute", top: -4,
                      left: `${bmiIndPct}%`,
                      transform: "translateX(-50%)",
                      width: 18, height: 18, borderRadius: "50%",
                      background: "white",
                      border: `3px solid ${bmiCat.color}`,
                      boxShadow: `0 2px 8px ${bmiCat.color}66`,
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Body fat — editable */}
        <div style={{ ...CARD, padding: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: "#1a1a1a", marginBottom: 20 }}>
            نسبة الدهون في الجسم
          </h2>

          {/* Current value */}
          <div style={{ textAlign: "center", marginBottom: 22 }}>
            <motion.p
              key={String(bodyFatPct)}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1,    opacity: 1 }}
              style={{
                fontSize: 52, fontWeight: 900, lineHeight: 1,
                color: bodyFatPct !== null ? "#E07A5F" : "#aaa",
              }}
            >
              {loading ? "..." : bodyFatPct !== null ? bodyFatPct : "--"}
              {!loading && bodyFatPct !== null && (
                <span style={{ fontSize: 24, color: "#aaa", fontWeight: 600 }}>%</span>
              )}
            </motion.p>
            {!loading && bodyFatPct !== null && (
              <span style={{
                display: "inline-block", marginTop: 8,
                background: "rgba(224,122,95,0.10)", color: "#E07A5F",
                fontSize: 12, fontWeight: 700, padding: "4px 16px", borderRadius: 30,
              }}>
                مُسجَّل ✓
              </span>
            )}
          </div>

          {/* Input */}
          <div style={{ marginBottom: 14 }}>
            <label style={{
              fontSize: 12, fontWeight: 700, color: "#E07A5F",
              display: "block", marginBottom: 7,
            }}>
              {bodyFatPct !== null ? "تحديث النسبة %" : "أدخل نسبة الدهون %"}
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="number" step="0.1" min="1" max="70"
                placeholder={bodyFatPct !== null ? String(bodyFatPct) : "مثال: 18.5"}
                value={bodyFatInput}
                onChange={e => setBodyFatInput(e.target.value)}
                style={bfInputStyle}
                onFocus={e => { e.target.style.borderColor = "#E07A5F"; }}
                onBlur={e  => { e.target.style.borderColor = "rgba(190,175,155,0.35)"; }}
              />
              <motion.button
                whileHover={bodyFatInput && !bfSaving ? { y: -2 } : undefined}
                whileTap={bodyFatInput && !bfSaving ? { scale: 0.97 } : undefined}
                onClick={saveBodyFat}
                disabled={!bodyFatInput || bfSaving}
                style={{
                  padding: "10px 20px", borderRadius: 12, border: "none", flexShrink: 0,
                  background: bodyFatInput && !bfSaving
                    ? "linear-gradient(135deg, #E07A5F, #C0392B)"
                    : "rgba(190,175,155,0.25)",
                  color: bodyFatInput && !bfSaving ? "white" : "#aaa",
                  fontWeight: 800, fontSize: 13, fontFamily: "inherit",
                  cursor: bodyFatInput && !bfSaving ? "pointer" : "not-allowed",
                  transition: "background 0.2s",
                  boxShadow: bodyFatInput ? "0 3px 10px rgba(224,122,95,0.30)" : "none",
                }}
              >
                {bfSaving ? "..." : "حفظ"}
              </motion.button>
            </div>
            {bfSaved && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ fontSize: 12, color: "#27AE60", fontWeight: 700, marginTop: 8 }}
              >
                ✓ تم الحفظ!
              </motion.p>
            )}
          </div>

          <div style={{
            paddingTop: 14, borderTop: "1px solid rgba(190,175,155,0.18)",
            marginTop: 4,
          }}>
            <p style={{ fontSize: 11, color: "#bbb", lineHeight: 1.65 }}>
              ⚠️ يتطلب قياساً بأجهزة مختصة (مثل جهاز قياس الدهون أو InBody) للحصول على نتيجة دقيقة
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
