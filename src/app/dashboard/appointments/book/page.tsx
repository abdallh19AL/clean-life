"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle, CalendarDays, Clock, FileText, Send } from "lucide-react";

const SESSION_TYPES = ["استشارة غذائية", "مراجعة تقدم", "تدريب شخصي", "تحليل جسم"];
const TIME_SLOTS = [
  { label: "9:00 ص",  value: "09:00" },
  { label: "10:00 ص", value: "10:00" },
  { label: "11:00 ص", value: "11:00" },
  { label: "12:00 م", value: "12:00" },
  { label: "1:00 م",  value: "13:00" },
  { label: "2:00 م",  value: "14:00" },
  { label: "3:00 م",  value: "15:00" },
  { label: "4:00 م",  value: "16:00" },
  { label: "5:00 م",  value: "17:00" },
];

const CARD: React.CSSProperties = {
  backgroundColor: "rgba(255,255,255,0.88)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(190,175,155,0.22)",
  borderRadius: 20,
  padding: 32,
  boxShadow: "0 2px 16px rgba(80,60,30,0.07)",
};

function Field({
  label, icon: Icon, children,
}: {
  label: string; icon: React.ElementType; children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{
        display: "flex", alignItems: "center", gap: 8,
        fontSize: 13, fontWeight: 700, color: "#3D5A4A", marginBottom: 8,
      }}>
        <Icon size={14} color="#3D7A5E" />
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", boxSizing: "border-box",
  padding: "12px 14px", borderRadius: 12,
  border: "1.5px solid rgba(190,175,155,0.35)",
  backgroundColor: "#FCFAF6",
  fontSize: 14, fontFamily: "inherit", color: "#1a2e22",
  outline: "none", direction: "rtl",
  transition: "border-color 0.2s",
};

export default function BookAppointmentPage() {
  const router = useRouter();
  const [sessionType, setSessionType] = useState("");
  const [date,        setDate]        = useState("");
  const [time,        setTime]        = useState("");
  const [notes,       setNotes]       = useState("");
  const [loading,     setLoading]     = useState(false);
  const [submitted,   setSubmitted]   = useState(false);

  const canSubmit = sessionType && date && time;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);

    const subject = encodeURIComponent(`طلب حجز موعد - ${sessionType}`);
    const body = encodeURIComponent(
      `نوع الجلسة: ${sessionType}\n` +
      `التاريخ المفضل: ${date}\n` +
      `الوقت المفضل: ${TIME_SLOTS.find(t => t.value === time)?.label ?? time}\n` +
      `ملاحظات: ${notes || "لا يوجد"}`
    );
    window.location.href = `mailto:cleanlifetopjo@gmail.com?subject=${subject}&body=${body}`;

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
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
          onClick={() => router.push("/dashboard/appointments")}
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
            حجز موعد جديد
          </h1>
          <p style={{ fontSize: 13, color: "#aaa" }}>اختر نوع الجلسة والوقت المناسب لك</p>
        </div>
      </div>

      {/* Form card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{ ...CARD, maxWidth: 640, margin: "0 auto" }}
      >
        <AnimatePresence mode="wait">
          {submitted ? (
            /* ── Success state ── */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 16 }}
              style={{ textAlign: "center", padding: "32px 16px" }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.1 }}
                style={{ marginBottom: 20 }}
              >
                <CheckCircle size={72} color="#3D7A5E" style={{ margin: "0 auto" }} />
              </motion.div>

              <h2 style={{ fontSize: 22, fontWeight: 900, color: "#1a1a1a", marginBottom: 12 }}>
                تم استلام طلب حجزك! 🎉
              </h2>
              <p style={{
                fontSize: 15, color: "#555", lineHeight: 1.8,
                maxWidth: 380, margin: "0 auto 28px",
              }}>
                سنتواصل معك على رقمك المسجل خلال <strong>24 ساعة</strong> لتأكيد الموعد.
              </p>

              {/* Booking summary */}
              <div style={{
                backgroundColor: "rgba(61,122,94,0.06)",
                border: "1px solid rgba(61,122,94,0.15)",
                borderRadius: 14, padding: "16px 20px",
                textAlign: "right", marginBottom: 28,
              }}>
                <p style={{ fontSize: 13, color: "#555", marginBottom: 6 }}>
                  <span style={{ fontWeight: 800, color: "#3D7A5E" }}>الجلسة:</span> {sessionType}
                </p>
                <p style={{ fontSize: 13, color: "#555", marginBottom: 6 }}>
                  <span style={{ fontWeight: 800, color: "#3D7A5E" }}>التاريخ:</span> {date}
                </p>
                <p style={{ fontSize: 13, color: "#555" }}>
                  <span style={{ fontWeight: 800, color: "#3D7A5E" }}>الوقت:</span> {TIME_SLOTS.find(t => t.value === time)?.label}
                </p>
              </div>

              <motion.button
                whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                onClick={() => router.push("/dashboard/appointments")}
                style={{
                  padding: "12px 32px", borderRadius: 14, border: "none",
                  background: "linear-gradient(135deg, #2D6A4F, #40916C)",
                  color: "white", fontWeight: 800, fontSize: 14,
                  fontFamily: "inherit", cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(45,106,79,0.28)",
                }}
              >
                العودة للمواعيد
              </motion.button>
            </motion.div>
          ) : (
            /* ── Form ── */
            <motion.form key="form" onSubmit={handleSubmit} exit={{ opacity: 0 }}>

              <Field label="نوع الجلسة" icon={CalendarDays}>
                <select
                  value={sessionType}
                  onChange={e => setSessionType(e.target.value)}
                  style={{ ...inputStyle, cursor: "pointer" }}
                  onFocus={e => { e.target.style.borderColor = "#3D7A5E"; e.target.style.boxShadow = "0 0 0 3px rgba(61,122,94,0.08)"; }}
                  onBlur={e  => { e.target.style.borderColor = "rgba(190,175,155,0.35)"; e.target.style.boxShadow = "none"; }}
                >
                  <option value="">اختر نوع الجلسة</option>
                  {SESSION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>

              <Field label="التاريخ المفضل" icon={CalendarDays}>
                <input
                  type="date"
                  value={date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={e => setDate(e.target.value)}
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = "#3D7A5E"; e.target.style.boxShadow = "0 0 0 3px rgba(61,122,94,0.08)"; }}
                  onBlur={e  => { e.target.style.borderColor = "rgba(190,175,155,0.35)"; e.target.style.boxShadow = "none"; }}
                />
              </Field>

              <Field label="الوقت المفضل" icon={Clock}>
                <select
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  style={{ ...inputStyle, cursor: "pointer" }}
                  onFocus={e => { e.target.style.borderColor = "#3D7A5E"; e.target.style.boxShadow = "0 0 0 3px rgba(61,122,94,0.08)"; }}
                  onBlur={e  => { e.target.style.borderColor = "rgba(190,175,155,0.35)"; e.target.style.boxShadow = "none"; }}
                >
                  <option value="">اختر الوقت</option>
                  {TIME_SLOTS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </Field>

              <Field label="ملاحظات إضافية (اختياري)" icon={FileText}>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="أي تفاصيل إضافية تريد إبلاغنا بها..."
                  rows={4}
                  style={{ ...inputStyle, resize: "vertical" }}
                  onFocus={e => { e.target.style.borderColor = "#3D7A5E"; e.target.style.boxShadow = "0 0 0 3px rgba(61,122,94,0.08)"; }}
                  onBlur={e  => { e.target.style.borderColor = "rgba(190,175,155,0.35)"; e.target.style.boxShadow = "none"; }}
                />
              </Field>

              <motion.button
                type="submit"
                disabled={!canSubmit || loading}
                whileHover={canSubmit && !loading ? { y: -2, boxShadow: "0 12px 28px rgba(45,106,79,0.30)" } : {}}
                whileTap={canSubmit && !loading ? { scale: 0.97 } : {}}
                style={{
                  width: "100%", padding: "15px",
                  borderRadius: 14, border: "none",
                  background: !canSubmit || loading
                    ? "rgba(190,175,155,0.25)"
                    : "linear-gradient(135deg, #2D6A4F, #40916C)",
                  color: !canSubmit || loading ? "#aaa" : "white",
                  fontWeight: 800, fontSize: 15,
                  fontFamily: "inherit",
                  cursor: !canSubmit || loading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  boxShadow: !canSubmit || loading ? "none" : "0 4px 18px rgba(45,106,79,0.28)",
                  transition: "background 0.2s",
                }}
              >
                {loading ? "جاري الإرسال..." : <><Send size={16} /> تأكيد الحجز</>}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
