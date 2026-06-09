"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import {
  Scale,
  Droplets,
  Flame,
  Clipboard,
  CalendarDays,
  Utensils,
  Dumbbell,
  LogOut,
  User,
  ChevronLeft,
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
    weekday: "long",
    year:    "numeric",
    month:   "long",
    day:     "numeric",
  });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MetricCard({
  label, icon: Icon, value, sub, color,
}: {
  label: string; icon: React.ElementType; value: string; sub: string; color: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      {...hoverLift}
      style={{
        background:    "rgba(255,255,255,0.92)",
        border:        "1.5px solid rgba(190,175,155,0.20)",
        borderRadius:  22,
        padding:       "24px 22px",
        boxShadow:     "0 2px 14px rgba(0,0,0,0.055)",
        cursor:        "default",
        display:       "flex",
        flexDirection: "column",
        gap:           6,
      }}
    >
      <div
        style={{
          width:           46,
          height:          46,
          borderRadius:    15,
          background:      `${color}1A`,
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "center",
          marginBottom:    8,
        }}
      >
        <Icon size={23} color={color} />
      </div>
      <p style={{ color: "#999", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em" }}>
        {label}
      </p>
      <p style={{ color: "#1a1a1a", fontSize: 28, fontWeight: 900, lineHeight: 1 }}>
        {value}
      </p>
      <p style={{ color: "#bbb", fontSize: 12 }}>{sub}</p>
    </motion.div>
  );
}

function QuickActionButton({
  label, icon: Icon, bg, color,
}: {
  label: string; icon: React.ElementType; bg: string; color: string;
}) {
  return (
    <motion.button
      variants={fadeUp}
      whileHover={{ y: -5, boxShadow: `0 10px 24px ${color}35` }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{
        background:     bg,
        border:         "none",
        borderRadius:   18,
        padding:        "22px 14px",
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        gap:            10,
        cursor:         "pointer",
        fontFamily:     "inherit",
        boxShadow:      "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <Icon size={28} color={color} />
      <span style={{ color: "#2a2a2a", fontSize: 13, fontWeight: 700, textAlign: "center", lineHeight: 1.4 }}>
        {label}
      </span>
    </motion.button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
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

  return (
    <div
      style={{
        minHeight:       "100vh",
        backgroundColor: "#F8F5F0",
        fontFamily:      "'Cairo', 'Segoe UI', sans-serif",
        direction:       "rtl",
        padding:         "32px 28px 56px",
      }}
    >
      {/* ── Top bar ── */}
      <div
        style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          marginBottom:   32,
        }}
      >
        {/* User chip */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width:           44,
              height:          44,
              borderRadius:    "50%",
              background:      "linear-gradient(135deg, #2D6A4F, #52B788)",
              display:         "flex",
              alignItems:      "center",
              justifyContent:  "center",
              color:           "#fff",
              fontWeight:      800,
              fontSize:        15,
              flexShrink:      0,
              boxShadow:       "0 3px 12px rgba(45,106,79,0.30)",
            }}
          >
            {user ? getInitials(userName) : <User size={18} />}
          </div>
          <div>
            <p style={{ color: "#888", fontSize: 12, fontWeight: 600 }}>مرحباً،</p>
            <p style={{ color: "#1a1a1a", fontSize: 15, fontWeight: 800, lineHeight: 1.2 }}>
              {userName}
            </p>
          </div>
        </div>

        {/* Logout */}
        <motion.button
          whileHover={{ scale: 1.04, backgroundColor: "rgba(45,106,79,0.08)" }}
          whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          style={{
            display:         "flex",
            alignItems:      "center",
            gap:             6,
            padding:         "9px 18px",
            borderRadius:    12,
            border:          "1.5px solid rgba(45,106,79,0.28)",
            background:      "transparent",
            color:           "#2D6A4F",
            fontSize:        13,
            fontWeight:      700,
            fontFamily:      "inherit",
            cursor:          "pointer",
          }}
        >
          <LogOut size={15} />
          تسجيل الخروج
        </motion.button>
      </div>

      {/* ── A: Welcome hero card ── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ marginBottom: 24 }}
      >
        <div
          style={{
            background:     "linear-gradient(135deg, #1B4332 0%, #2D6A4F 40%, #40916C 75%, #52B788 100%)",
            borderRadius:   26,
            padding:        "36px 40px",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
            position:       "relative",
            overflow:       "hidden",
            boxShadow:      "0 12px 40px rgba(27,67,50,0.30)",
          }}
        >
          {/* Blobs */}
          <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -40, left: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: "20%", left: "42%", width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />

          {/* Text */}
          <div style={{ position: "relative", zIndex: 1 }}>
            <p style={{ color: "rgba(255,255,255,0.68)", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
              ✦ أهلاً بك في عيادتك الرقمية
            </p>
            <h1 style={{ color: "#fff", fontSize: 34, fontWeight: 900, margin: "0 0 10px", lineHeight: 1.15 }}>
              مرحباً، {userName} 👋
            </h1>
            <p style={{ color: "rgba(255,255,255,0.62)", fontSize: 14, lineHeight: 1.7, maxWidth: 380 }}>
              هذا ملخص صحتك اليوم — ابدأ رحلتك نحو الأفضل
            </p>
          </div>

          {/* Date + badge */}
          <div style={{ position: "relative", zIndex: 1, textAlign: "center", flexShrink: 0 }}>
            <p style={{ color: "rgba(255,255,255,0.78)", fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
              {getArabicDate()}
            </p>
            <span
              style={{
                display:        "inline-block",
                background:     "rgba(255,255,255,0.15)",
                border:         "1.5px solid rgba(255,255,255,0.32)",
                backdropFilter: "blur(10px)",
                color:          "#fff",
                fontSize:       12,
                fontWeight:     700,
                padding:        "7px 20px",
                borderRadius:   30,
              }}
            >
              ✦ خطة نشطة
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── B: Metric cards (staggered) ── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        transition={{ delayChildren: 0.15 }}
        style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginBottom: 24 }}
      >
        <MetricCard label="الوزن الحالي"           icon={Scale}    value="-- كغ"   sub="لم يتم التسجيل بعد"    color="#3D7A5E" />
        <MetricCard label="استهلاك الماء اليومي"   icon={Droplets} value="-- لتر"  sub="الهدف: 2.5 لتر يومياً" color="#5B8CBF" />
        <MetricCard label="السعرات المستهدفة"       icon={Flame}    value="-- سعرة" sub="يحدد بعد الاستشارة"    color="#E07A5F" />
      </motion.div>

      {/* ── C: Plan + Appointments (two columns) ── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3, duration: 0.45, ease: "easeOut" }}
        style={{ display: "grid", gridTemplateColumns: "60% 1fr", gap: 18, marginBottom: 24 }}
      >
        {/* Custom plan card */}
        <div
          style={{
            background:    "rgba(255,255,255,0.92)",
            border:        "1.5px solid rgba(190,175,155,0.20)",
            borderRadius:  22,
            padding:       "30px 32px",
            boxShadow:     "0 2px 14px rgba(0,0,0,0.055)",
          }}
        >
          <h2 style={{ color: "#1a1a1a", fontSize: 19, fontWeight: 900, marginBottom: 4 }}>
            خطتك المخصصة
          </h2>
          <p style={{ color: "#bbb", fontSize: 13, marginBottom: 36 }}>
            سيتم تحديد خطتك بعد الاستشارة الأولى
          </p>

          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              style={{
                width:           76,
                height:          76,
                borderRadius:    "50%",
                background:      "rgba(64,145,108,0.11)",
                display:         "flex",
                alignItems:      "center",
                justifyContent:  "center",
                margin:          "0 auto 20px",
              }}
            >
              <Clipboard size={34} color="#40916C" />
            </motion.div>

            <p style={{ color: "#333", fontSize: 16, fontWeight: 800, marginBottom: 10 }}>
              لم يتم تحديد خطتك بعد
            </p>
            <p style={{ color: "#bbb", fontSize: 13, lineHeight: 1.75, maxWidth: 300, margin: "0 auto 28px" }}>
              احجز استشارتك الأولى مع أحد خبرائنا لوضع خطة مخصصة لك
            </p>

            <motion.button
              whileHover={{ y: -3, boxShadow: "0 10px 28px rgba(45,106,79,0.35)" }}
              whileTap={{ scale: 0.97 }}
              style={{
                background:  "linear-gradient(135deg, #2D6A4F, #52B788)",
                color:       "#fff",
                border:      "none",
                borderRadius: 14,
                padding:     "13px 30px",
                fontSize:    14,
                fontWeight:  700,
                fontFamily:  "inherit",
                cursor:      "pointer",
                display:     "inline-flex",
                alignItems:  "center",
                gap:         8,
                boxShadow:   "0 4px 18px rgba(45,106,79,0.28)",
              }}
            >
              احجز استشارة
              <ChevronLeft size={16} />
            </motion.button>
          </div>
        </div>

        {/* Appointments card */}
        <div
          style={{
            background:    "rgba(255,255,255,0.92)",
            border:        "1.5px solid rgba(190,175,155,0.20)",
            borderRadius:  22,
            padding:       "30px 26px",
            boxShadow:     "0 2px 14px rgba(0,0,0,0.055)",
            display:       "flex",
            flexDirection: "column",
          }}
        >
          <h2 style={{ color: "#1a1a1a", fontSize: 19, fontWeight: 900, marginBottom: 30 }}>
            مواعيدك القادمة
          </h2>

          <div
            style={{
              flex:           1,
              display:        "flex",
              flexDirection:  "column",
              alignItems:     "center",
              justifyContent: "center",
              textAlign:      "center",
            }}
          >
            <div
              style={{
                width:           62,
                height:          62,
                borderRadius:    "50%",
                background:      "rgba(91,140,191,0.11)",
                display:         "flex",
                alignItems:      "center",
                justifyContent:  "center",
                marginBottom:    16,
              }}
            >
              <CalendarDays size={28} color="#5B8CBF" />
            </div>
            <p style={{ color: "#888", fontSize: 14, fontWeight: 600, marginBottom: 22 }}>
              لا توجد مواعيد قادمة
            </p>
            <motion.button
              whileHover={{ backgroundColor: "#2D6A4F", color: "#fff" }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.18 }}
              style={{
                background:   "transparent",
                color:        "#2D6A4F",
                border:       "1.5px solid #2D6A4F",
                borderRadius: 12,
                padding:      "10px 22px",
                fontSize:     13,
                fontWeight:   700,
                fontFamily:   "inherit",
                cursor:       "pointer",
              }}
            >
              حجز موعد جديد
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* ── D: Quick actions ── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.42, duration: 0.45, ease: "easeOut" }}
      >
        <div
          style={{
            background:    "rgba(255,255,255,0.92)",
            border:        "1.5px solid rgba(190,175,155,0.20)",
            borderRadius:  22,
            padding:       "30px 32px",
            boxShadow:     "0 2px 14px rgba(0,0,0,0.055)",
          }}
        >
          <h2 style={{ color: "#1a1a1a", fontSize: 19, fontWeight: 900, marginBottom: 22 }}>
            الإجراءات السريعة
          </h2>

          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            transition={{ delayChildren: 0.48 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}
          >
            <QuickActionButton label="تسجيل الوزن اليومي" icon={Scale}    bg="rgba(61,122,94,0.10)"   color="#3D7A5E" />
            <QuickActionButton label="تسجيل الماء"         icon={Droplets} bg="rgba(91,140,191,0.10)"  color="#5B8CBF" />
            <QuickActionButton label="عرض خطة التغذية"    icon={Utensils} bg="rgba(224,122,95,0.10)"  color="#E07A5F" />
            <QuickActionButton label="جدول التمارين"       icon={Dumbbell} bg="rgba(126,87,194,0.10)"  color="#7E57C2" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
