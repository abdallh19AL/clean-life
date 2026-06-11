"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────

type ChartEntry = { day: string; weight: number };

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
  const [chartData,    setChartData]    = useState<ChartEntry[]>([]);
  const [latestWeight, setLatestWeight] = useState<number | null>(null);
  const [firstWeight,  setFirstWeight]  = useState<number | null>(null);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data } = await supabase
        .from("weight_logs")
        .select("date, weight_kg")
        .eq("user_id", user.id)
        .order("date", { ascending: true })
        .limit(30);

      if (data && data.length > 0) {
        setChartData(data.map(e => ({ day: formatDateShort(e.date), weight: e.weight_kg })));
        setLatestWeight(data[data.length - 1].weight_kg);
        setFirstWeight(data[0].weight_kg);
      }
      setLoading(false);
    })();
  }, []);

  const weightDiff = latestWeight !== null && firstWeight !== null
    ? parseFloat((latestWeight - firstWeight).toFixed(1))
    : null;

  const weights = chartData.map(e => e.weight);
  const yMin    = weights.length > 0 ? Math.floor(Math.min(...weights) - 1) : 60;
  const yMax    = weights.length > 0 ? Math.ceil(Math.max(...weights)  + 1) : 100;

  const CARD: React.CSSProperties = {
    background: "rgba(255,255,255,0.85)",
    border: "1.5px solid rgba(190,175,155,0.22)",
    borderRadius: 20,
    boxShadow: "0 2px 12px rgba(0,0,0,0.055)",
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
        {/* Real weight */}
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
            {!loading && (
              weightDiff !== null
                ? weightDiff < 0 ? `${weightDiff} كغ من البداية 📉`
                  : weightDiff > 0 ? `+${weightDiff} كغ من البداية`
                  : "ثابت من البداية"
                : "سجّل وزنك لرؤية التقدم"
            )}
          </p>
        </motion.div>

        {/* BMI — needs height */}
        <motion.div
          whileHover={{ y: -4, boxShadow: "0 12px 28px rgba(0,0,0,0.10)" }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{ ...CARD, padding: 24 }}
        >
          <div style={{
            width: 44, height: 44, borderRadius: 14, background: "rgba(91,140,191,0.10)",
            display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14,
          }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#5B8CBF" }} />
          </div>
          <p style={{ color: "#999", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", marginBottom: 4 }}>
            مؤشر كتلة الجسم
          </p>
          <p style={{ color: "#1a1a1a", fontSize: 26, fontWeight: 900, marginBottom: 4 }}>--</p>
          <p style={{ color: "#bbb", fontSize: 12 }}>يتطلب إدخال الطول</p>
        </motion.div>

        {/* Body fat */}
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
          <p style={{ color: "#1a1a1a", fontSize: 26, fontWeight: 900, marginBottom: 4 }}>--</p>
          <p style={{ color: "#bbb", fontSize: 12 }}>يتطلب قياساً متخصصاً</p>
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

      {/* ── BMI + Body composition ── */}
      <motion.div
        {...fadeUp(0.3)}
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}
      >
        {/* BMI analysis */}
        <div style={{ ...CARD, padding: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: "#1a1a1a", marginBottom: 20 }}>
            تحليل مؤشر كتلة الجسم
          </h2>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <p style={{ fontSize: 52, fontWeight: 900, color: "#aaa", lineHeight: 1 }}>--</p>
            <span style={{
              display: "inline-block", marginTop: 8,
              background: "rgba(190,175,155,0.12)", color: "#aaa",
              fontSize: 14, fontWeight: 700, padding: "6px 20px", borderRadius: 30,
            }}>
              يتطلب إدخال الطول
            </span>
          </div>
          <div style={{ marginTop: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#bbb", marginBottom: 6 }}>
              <span>نحيف<br/>{"<18.5"}</span>
              <span style={{ textAlign: "center" }}>طبيعي<br/>18.5–25</span>
              <span>زائد<br/>{">25"}</span>
            </div>
            <div style={{ position: "relative", height: 10, borderRadius: 999, overflow: "hidden", display: "flex" }}>
              <div style={{ flex: 1, background: "#93C5FD" }} />
              <div style={{ flex: 1.5, background: "#6EE7B7" }} />
              <div style={{ flex: 1, background: "#FCD34D" }} />
              <div style={{ flex: 0.8, background: "#FCA5A5" }} />
            </div>
            <p style={{ textAlign: "center", fontSize: 11, color: "#aaa", fontWeight: 600, marginTop: 10 }}>
              سيحسب تلقائياً بعد إدخال بيانات طولك
            </p>
          </div>
        </div>

        {/* Body composition */}
        <div style={{ ...CARD, padding: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: "#1a1a1a", marginBottom: 24 }}>
            تركيب الجسم
          </h2>
          <HBar label="كتلة العضلات"    pct={35}   color="#3D7A5E" />
          <HBar label="نسبة الدهون"     pct={18.5} color="#E07A5F" />
          <HBar label="نسبة الماء"      pct={60}   color="#5B8CBF" />
          <HBar label="الكثافة العظمية" pct={4.5}  color="#9B7EC8" />
          <p style={{ fontSize: 11, color: "#ccc", marginTop: 12 }}>
            * تقديرات — تتطلب قياساً متخصصاً للدقة
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
