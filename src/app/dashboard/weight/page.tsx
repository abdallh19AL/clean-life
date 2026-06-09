"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Scale, TrendingDown, TrendingUp, Minus, CalendarDays, FileText } from "lucide-react";

/* ─── Mock history ────────────────────────────────────────────────────── */

const mockEntries = [
  { date: "2026-06-08", weight: 82.5, notes: "" },
  { date: "2026-06-07", weight: 82.8, notes: "بعد التمرين" },
  { date: "2026-06-06", weight: 83.1, notes: "" },
  { date: "2026-06-05", weight: 83.0, notes: "" },
  { date: "2026-06-04", weight: 83.4, notes: "يوم راحة" },
  { date: "2026-06-03", weight: 83.6, notes: "" },
  { date: "2026-06-02", weight: 83.9, notes: "" },
];

const CARD: React.CSSProperties = {
  backgroundColor: "rgba(255,255,255,0.88)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(190,175,155,0.22)",
  borderRadius: 20,
  padding: 28,
  boxShadow: "0 2px 16px rgba(80,60,30,0.07)",
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("ar-SA", { weekday: "short", month: "short", day: "numeric" });
}

export default function WeightPage() {
  const router = useRouter();
  const today  = new Date().toISOString().split("T")[0];

  const [weight,  setWeight]  = useState("");
  const [date,    setDate]    = useState(today);
  const [notes,   setNotes]   = useState("");
  const [saved,   setSaved]   = useState(false);
  const [history, setHistory] = useState(mockEntries);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!weight || !date) return;
    setHistory(prev => [{ date, weight: parseFloat(weight), notes }, ...prev].slice(0, 7));
    setSaved(true);
    setTimeout(() => { setSaved(false); setWeight(""); setNotes(""); }, 2000);
  }

  const latest = history[0];
  const prev   = history[1];
  const diff   = prev ? parseFloat((latest.weight - prev.weight).toFixed(1)) : 0;

  const inputStyle: React.CSSProperties = {
    width: "100%", boxSizing: "border-box",
    padding: "12px 14px", borderRadius: 12,
    border: "1.5px solid rgba(190,175,155,0.35)",
    backgroundColor: "#FCFAF6",
    fontSize: 14, fontFamily: "inherit", color: "#1a2e22",
    outline: "none", direction: "rtl",
  };

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
          <ArrowRight size={18} color="#3D7A5E" />
        </motion.button>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: "#1a1a1a", marginBottom: 2 }}>
            تسجيل الوزن اليومي
          </h1>
          <p style={{ fontSize: 13, color: "#aaa" }}>تتبع تغيرات وزنك يومياً لرؤية تقدمك</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Left: Input form ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Current weight summary */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            style={CARD}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: "rgba(61,122,94,0.10)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Scale size={28} color="#3D7A5E" />
              </div>
              <div>
                <p style={{ fontSize: 12, color: "#aaa", fontWeight: 700, marginBottom: 2 }}>آخر قراءة مسجلة</p>
                <p style={{ fontSize: 32, fontWeight: 900, color: "#1a1a1a", lineHeight: 1 }}>
                  {latest.weight} <span style={{ fontSize: 16, color: "#aaa", fontWeight: 600 }}>كغ</span>
                </p>
              </div>
              <div style={{ marginRight: "auto" }}>
                {diff === 0 ? (
                  <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#888", fontSize: 13, fontWeight: 700 }}>
                    <Minus size={16} /> لا تغيير
                  </span>
                ) : diff < 0 ? (
                  <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#3D7A5E", fontSize: 13, fontWeight: 700 }}>
                    <TrendingDown size={16} /> {Math.abs(diff)} كغ ↓
                  </span>
                ) : (
                  <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#E07A5F", fontSize: 13, fontWeight: 700 }}>
                    <TrendingUp size={16} /> {diff} كغ ↑
                  </span>
                )}
              </div>
            </div>

            {/* Mini trend bar */}
            <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 48 }}>
              {history.slice().reverse().map((e, i) => {
                const min = Math.min(...history.map(h => h.weight));
                const max = Math.max(...history.map(h => h.weight));
                const pct = max === min ? 50 : ((e.weight - min) / (max - min)) * 100;
                return (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(20, pct)}%` }}
                    transition={{ delay: i * 0.05, duration: 0.5, ease: "easeOut" }}
                    style={{
                      flex: 1, borderRadius: 6,
                      backgroundColor: i === history.length - 1 ? "#3D7A5E" : "rgba(61,122,94,0.20)",
                    }}
                  />
                );
              })}
            </div>
            <p style={{ fontSize: 10, color: "#ccc", marginTop: 6, textAlign: "center" }}>آخر 7 أيام</p>
          </motion.div>

          {/* Log form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={CARD}
          >
            <h2 style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a", marginBottom: 20 }}>
              تسجيل قراءة جديدة
            </h2>
            <form onSubmit={handleSave}>
              {/* Weight input */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: "#3D5A4A", display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <Scale size={13} color="#3D7A5E" /> الوزن (كغ)
                </label>
                <input
                  type="number" step="0.1" min="30" max="300"
                  placeholder="مثال: 82.5"
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                  style={{ ...inputStyle, fontSize: 22, fontWeight: 900, textAlign: "center", letterSpacing: "0.05em" }}
                  onFocus={e => { e.target.style.borderColor = "#3D7A5E"; }}
                  onBlur={e  => { e.target.style.borderColor = "rgba(190,175,155,0.35)"; }}
                />
              </div>

              {/* Date */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: "#3D5A4A", display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <CalendarDays size={13} color="#3D7A5E" /> التاريخ
                </label>
                <input
                  type="date" value={date}
                  onChange={e => setDate(e.target.value)}
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = "#3D7A5E"; }}
                  onBlur={e  => { e.target.style.borderColor = "rgba(190,175,155,0.35)"; }}
                />
              </div>

              {/* Notes */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: "#3D5A4A", display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <FileText size={13} color="#3D7A5E" /> ملاحظات (اختياري)
                </label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="مثال: قبل الإفطار، بعد التمرين..."
                  rows={2}
                  style={{ ...inputStyle, resize: "none" }}
                  onFocus={e => { e.target.style.borderColor = "#3D7A5E"; }}
                  onBlur={e  => { e.target.style.borderColor = "rgba(190,175,155,0.35)"; }}
                />
              </div>

              <motion.button
                type="submit"
                disabled={!weight || !date}
                whileHover={weight && date ? { y: -2, boxShadow: "0 10px 24px rgba(45,106,79,0.28)" } : {}}
                whileTap={weight && date ? { scale: 0.97 } : {}}
                animate={saved ? { scale: [1, 1.04, 1] } : {}}
                style={{
                  width: "100%", padding: "14px",
                  borderRadius: 14, border: "none",
                  background: saved
                    ? "linear-gradient(135deg, #27AE60, #2ECC71)"
                    : !weight || !date
                      ? "rgba(190,175,155,0.25)"
                      : "linear-gradient(135deg, #2D6A4F, #40916C)",
                  color: !weight || !date ? "#aaa" : "white",
                  fontWeight: 800, fontSize: 15,
                  fontFamily: "inherit",
                  cursor: !weight || !date ? "not-allowed" : "pointer",
                  transition: "background 0.2s",
                  boxShadow: !weight || !date ? "none" : "0 4px 16px rgba(45,106,79,0.25)",
                }}
              >
                {saved ? "✓ تم الحفظ!" : "حفظ القراءة"}
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* ── Right: History table ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={CARD}
        >
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a", marginBottom: 20 }}>
            آخر 7 قراءات
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {history.map((entry, i) => {
              const prevEntry = history[i + 1];
              const d = prevEntry ? parseFloat((entry.weight - prevEntry.weight).toFixed(1)) : 0;
              return (
                <motion.div
                  key={entry.date + i}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.06 }}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 16px", borderRadius: 14,
                    backgroundColor: i === 0 ? "rgba(61,122,94,0.07)" : "rgba(248,245,240,0.8)",
                    border: i === 0 ? "1.5px solid rgba(61,122,94,0.15)" : "1.5px solid rgba(190,175,155,0.15)",
                  }}
                >
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 800, color: i === 0 ? "#3D7A5E" : "#333" }}>
                      {formatDate(entry.date)}
                      {i === 0 && <span style={{ fontSize: 10, fontWeight: 700, color: "#3D7A5E", marginRight: 6, backgroundColor: "rgba(61,122,94,0.12)", padding: "2px 8px", borderRadius: 999 }}>آخر قراءة</span>}
                    </p>
                    {entry.notes && (
                      <p style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{entry.notes}</p>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {d !== 0 && (
                      <span style={{ fontSize: 12, fontWeight: 700, color: d < 0 ? "#3D7A5E" : "#E07A5F" }}>
                        {d < 0 ? `↓ ${Math.abs(d)}` : `↑ ${d}`}
                      </span>
                    )}
                    <span style={{ fontSize: 18, fontWeight: 900, color: "#1a1a1a" }}>
                      {entry.weight} <span style={{ fontSize: 11, color: "#bbb", fontWeight: 600 }}>كغ</span>
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
