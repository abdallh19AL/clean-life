"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Clock, User, CheckCircle, AlertCircle } from "lucide-react";

// ─── Appointments data ────────────────────────────────────────────────────────
const appointments = [
  {
    id: 1, day: 12, month: "يونيو", time: "10:00 ص",
    doctor: "د. سارة العمري", type: "استشارة غذائية",
    status: "confirmed", color: "#3D7A5E", bg: "rgba(61,122,94,0.08)",
  },
  {
    id: 2, day: 18, month: "يونيو", time: "02:00 م",
    doctor: "د. أحمد الكندي", type: "مراجعة التقدم",
    status: "confirmed", color: "#5B8CBF", bg: "rgba(91,140,191,0.08)",
  },
  {
    id: 3, day: 25, month: "يونيو", time: "11:00 ص",
    doctor: "م. خالد الحربي", type: "تدريب شخصي",
    status: "pending", color: "#E07A5F", bg: "rgba(224,122,95,0.08)",
  },
];

const APPOINTMENT_DAYS = new Set([12, 18, 25]);

// ─── Calendar ─────────────────────────────────────────────────────────────────
function Calendar() {
  const today = new Date();
  const year  = today.getFullYear();
  const month = today.getMonth();
  const todayDate = today.getDate();

  const firstDay    = new Date(year, month, 1).getDay();   // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthName = today.toLocaleDateString("ar-SA", { month: "long", year: "numeric" });

  // Grid cells: blank prefix + days
  const cells: (number | null)[] = [
    ...Array<null>(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // Pad to complete weeks
  while (cells.length % 7 !== 0) cells.push(null);

  const weekLabels = ["أح", "إث", "ثل", "أر", "خم", "جم", "سب"];

  return (
    <div>
      {/* Month label */}
      <p style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a", marginBottom: 16, textAlign: "center" }}>
        {monthName}
      </p>

      {/* Week headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, marginBottom: 8 }}>
        {weekLabels.map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: 12, color: "#bbb", fontWeight: 700, padding: "4px 0" }}>
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
        {cells.map((day, i) => {
          const isToday = day === todayDate;
          const hasAppt = day !== null && APPOINTMENT_DAYS.has(day);
          return (
            <motion.div
              key={i}
              whileHover={day ? { scale: 1.1 } : {}}
              style={{
                height: 44, borderRadius: 10,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                position: "relative",
                fontSize: 13, fontWeight: isToday ? 800 : 500,
                backgroundColor: isToday ? "#3D7A5E" : hasAppt ? "rgba(61,122,94,0.08)" : "transparent",
                color: isToday ? "#fff" : day ? "#333" : "transparent",
                cursor: day ? "pointer" : "default",
                border: hasAppt && !isToday ? "1.5px solid rgba(61,122,94,0.25)" : "1.5px solid transparent",
              }}
            >
              {day ?? ""}
              {hasAppt && (
                <div style={{
                  position: "absolute", bottom: 4,
                  width: 4, height: 4, borderRadius: "50%",
                  backgroundColor: isToday ? "rgba(255,255,255,0.75)" : "#3D7A5E",
                }} />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 16, justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: 4, backgroundColor: "#3D7A5E" }} />
          <span style={{ fontSize: 12, color: "#888" }}>اليوم</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#3D7A5E" }} />
          <span style={{ fontSize: 12, color: "#888" }}>يوجد موعد</span>
        </div>
      </div>
    </div>
  );
}

// ─── Appointment card ─────────────────────────────────────────────────────────
function AppointmentCard({ appt, delay }: { appt: typeof appointments[0]; delay: number }) {
  const isConfirmed = appt.status === "confirmed";
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -3, boxShadow: "0 10px 24px rgba(0,0,0,0.09)" }}
      style={{
        background: "rgba(255,255,255,0.85)", border: "1.5px solid rgba(190,175,155,0.22)",
        borderRadius: 16, padding: 18, boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        marginBottom: 14, display: "flex", gap: 14, alignItems: "flex-start",
      }}
    >
      {/* Date badge */}
      <div style={{
        flexShrink: 0, width: 48, height: 56, borderRadius: 14,
        background: appt.bg, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 2,
        border: `1.5px solid ${appt.color}30`,
      }}>
        <span style={{ fontSize: 22, fontWeight: 900, color: appt.color, lineHeight: 1 }}>{appt.day}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: appt.color }}>{appt.month}</span>
      </div>

      {/* Details */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
          <p style={{ fontSize: 14, fontWeight: 800, color: "#1a1a1a" }}>{appt.type}</p>
          <span style={{
            fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
            background: isConfirmed ? "rgba(61,122,94,0.12)" : "rgba(224,122,95,0.12)",
            color: isConfirmed ? "#3D7A5E" : "#E07A5F",
            display: "flex", alignItems: "center", gap: 4, flexShrink: 0,
          }}>
            {isConfirmed
              ? <><CheckCircle size={11} /> مؤكد</>
              : <><AlertCircle size={11} /> قيد الانتظار</>
            }
          </span>
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <Clock size={13} color="#bbb" />
            <span style={{ fontSize: 12, color: "#888" }}>{appt.time}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <User size={13} color="#bbb" />
            <span style={{ fontSize: 12, color: "#888" }}>{appt.doctor}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AppointmentsPage() {
  const router = useRouter();

  function handleBook() {
    router.push("/dashboard/appointments/book");
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        minHeight: "100vh", backgroundColor: "#F8F5F0",
        fontFamily: "'Cairo','Segoe UI',sans-serif",
        direction: "rtl", padding: "32px 28px 100px",
        position: "relative",
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: 28 }}
      >
        <h1 style={{ fontSize: 28, fontWeight: 900, color: "#1a1a1a", marginBottom: 4 }}>المواعيد</h1>
        <p style={{ fontSize: 14, color: "#aaa" }}>إدارة مواعيدك مع الفريق المتخصص</p>
      </motion.div>

      {/* ── Two-column layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[60%_1fr] gap-5">

        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            background: "rgba(255,255,255,0.85)", border: "1.5px solid rgba(190,175,155,0.22)",
            borderRadius: 20, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.055)",
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 900, color: "#1a1a1a", marginBottom: 20 }}>
            التقويم الشهري
          </h2>
          <Calendar />
        </motion.div>

        {/* Appointments list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 900, color: "#1a1a1a", marginBottom: 16 }}>
            المواعيد القادمة
          </h2>
          {appointments.map((appt, i) => (
            <AppointmentCard key={appt.id} appt={appt} delay={0.25 + i * 0.1} />
          ))}
        </motion.div>
      </div>

      {/* ── Floating "book" button ── */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ y: -4, boxShadow: "0 16px 36px rgba(45,106,79,0.40)" }}
        whileTap={{ scale: 0.95 }}
        onClick={handleBook}
        style={{
          position: "fixed", bottom: 32, left: 32,
          display: "flex", alignItems: "center", gap: 10,
          padding: "14px 24px", borderRadius: 18, border: "none",
          background: "linear-gradient(135deg, #2D6A4F, #40916C)",
          color: "white", fontSize: 15, fontWeight: 800,
          fontFamily: "inherit", cursor: "pointer",
          boxShadow: "0 8px 28px rgba(45,106,79,0.35)",
          zIndex: 50,
        }}
      >
        <Plus size={20} />
        حجز موعد جديد
      </motion.button>

    </motion.div>
  );
}
