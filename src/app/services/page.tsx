"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Utensils, Dumbbell, TrendingUp, Apple, Activity, Heart,
  Home as HomeIcon, ShoppingBag, Calculator, ArrowLeft, CheckCircle,
} from "lucide-react";
import SiteNavbar from "@/components/SiteNavbar";

/* ─── Data ─────────────────────────────────────────────────────────────── */

const services = [
  {
    Icon: Utensils,
    title: "استشارة التغذية",
    description: "جلسة تحليل كاملة مع أخصائي تغذية معتمد لوضع خطة غذائية تناسب جسمك وأهدافك.",
    color: "#3D7A5E",
    bg: "rgba(61,122,94,0.07)",
    features: ["تحليل شامل للحالة الغذائية", "خطة غذائية مخصصة", "متابعة أسبوعية"],
  },
  {
    Icon: Dumbbell,
    title: "التدريب الشخصي",
    description: "برنامج تدريبي مخصص مع مدرب محترف يتوافق مع مستواك ويحقق أهدافك بكفاءة.",
    color: "#5B8CBF",
    bg: "rgba(91,140,191,0.07)",
    features: ["تقييم اللياقة البدنية", "برنامج تدريبي مخصص", "تتبع الأداء"],
  },
  {
    Icon: TrendingUp,
    title: "متابعة التقدم",
    description: "تقارير أسبوعية وتحليل مستمر لنتائجك لضمان السير في الاتجاه الصحيح دائماً.",
    color: "#D4A017",
    bg: "rgba(212,160,23,0.07)",
    features: ["تقارير أسبوعية مفصّلة", "رسوم بيانية للتقدم", "توصيات تكيفية"],
  },
  {
    Icon: Apple,
    title: "خطة غذائية",
    description: "نظام غذائي علمي مخصص لجسمك وأهدافك مع وصفات وقوائم طعام يومية.",
    color: "#E07A5F",
    bg: "rgba(224,122,95,0.07)",
    features: ["قوائم طعام يومية", "وصفات صحية متنوعة", "بدائل غذائية مرنة"],
  },
  {
    Icon: Activity,
    title: "تحليل الجسم",
    description: "قياس دقيق لمكونات جسمك ونسبة الدهون والعضلات باستخدام أحدث الأجهزة.",
    color: "#9B59B6",
    bg: "rgba(155,89,182,0.07)",
    features: ["قياس نسبة الدهون", "تحليل الكتلة العضلية", "مؤشر BMI & BMR"],
  },
  {
    Icon: Heart,
    title: "الدعم النفسي",
    description: "دعم متخصص لبناء عادات صحية مستدامة ومعالجة العلاقة مع الطعام والجسم.",
    color: "#E05F7A",
    bg: "rgba(224,95,122,0.07)",
    features: ["جلسات دعم أسبوعية", "تقنيات إدارة الشهية", "بناء عادات صحية"],
  },
];

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default function ServicesPage() {
  return (
    <div dir="rtl" style={{ minHeight: "100vh", backgroundColor: "#F8F5F0", fontFamily: "'Cairo','Segoe UI',sans-serif" }}>
      <SiteNavbar />

      {/* ── Header ── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ textAlign: "center", padding: "64px 24px 48px" }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 18px", borderRadius: 999, marginBottom: 20,
            backgroundColor: "rgba(61,122,94,0.10)",
            color: "#2D6A4F", fontSize: 13, fontWeight: 700,
            border: "1px solid rgba(61,122,94,0.20)",
          }}
        >
          ✦ خدماتنا المتكاملة
        </motion.div>

        <h1 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 900, color: "#1a2e22", marginBottom: 16, lineHeight: 1.2 }}>
          كل ما تحتاجه في مكان واحد
        </h1>
        <p style={{ fontSize: 17, color: "#6B7280", maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
          خدمات متكاملة صممها خبراؤنا لمساعدتك على تحقيق أهدافك الصحية بثقة وكفاءة
        </p>
      </motion.section>

      {/* ── Service cards bento grid ── */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 80px" }}
      >
        {services.map((svc, i) => (
          <motion.div
            key={svc.title}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -6, boxShadow: "0 20px 48px rgba(60,50,30,0.12)" }}
            style={{
              backgroundColor: "rgba(255,255,255,0.88)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(190,175,155,0.22)",
              borderRadius: 24,
              padding: 28,
              boxShadow: "0 2px 16px rgba(80,60,30,0.07)",
              display: "flex", flexDirection: "column",
              transition: "box-shadow 0.3s",
            }}
          >
            {/* Icon badge */}
            <div style={{
              width: 52, height: 52, borderRadius: 16,
              backgroundColor: svc.bg,
              border: `1.5px solid ${svc.color}20`,
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 18, flexShrink: 0,
            }}>
              <svc.Icon size={26} color={svc.color} />
            </div>

            <h2 style={{ fontSize: 19, fontWeight: 900, color: "#1a2e22", marginBottom: 10, lineHeight: 1.3 }}>
              {svc.title}
            </h2>
            <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7, marginBottom: 18, flex: 1 }}>
              {svc.description}
            </p>

            {/* Feature list */}
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px", display: "flex", flexDirection: "column", gap: 8 }}>
              {svc.features.map(f => (
                <li key={f} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <CheckCircle size={14} color={svc.color} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: "#555", fontWeight: 600 }}>{f}</span>
                </li>
              ))}
            </ul>

            {/* Price + button */}
            <div style={{
              borderTop: "1px solid rgba(190,175,155,0.18)",
              paddingTop: 18, marginTop: "auto",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div>
                <p style={{ fontSize: 12, color: "#aaa", fontWeight: 600, marginBottom: 2 }}>ابتداءً من</p>
                <p style={{ fontSize: 20, fontWeight: 900, color: svc.color }}>99 دينار</p>
              </div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/contact"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "10px 20px", borderRadius: 12,
                    background: `linear-gradient(135deg, ${svc.color}, ${svc.color}cc)`,
                    color: "white", fontSize: 13, fontWeight: 800,
                    textDecoration: "none",
                    boxShadow: `0 4px 14px ${svc.color}30`,
                  }}
                >
                  احجز الآن <ArrowLeft size={13} />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── CTA section ── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        style={{
          textAlign: "center",
          padding: "64px 24px",
          background: "linear-gradient(135deg, #1B4332 0%, #2D6A4F 50%, #40916C 100%)",
        }}
      >
        <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 900, color: "white", marginBottom: 14 }}>
          جاهز تبدأ رحلتك؟ 🌿
        </h2>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.75)", marginBottom: 32, lineHeight: 1.7 }}>
          تواصل معنا اليوم وسنضع لك خطة مخصصة تناسب أهدافك وميزانيتك
        </p>
        <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
          <Link
            href="/contact"
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "16px 40px", borderRadius: 16,
              backgroundColor: "white", color: "#1B4332",
              fontWeight: 800, fontSize: 16, textDecoration: "none",
              boxShadow: "0 8px 32px rgba(0,0,0,0.20)",
            }}
          >
            احجز استشارتك المجانية <ArrowLeft size={18} />
          </Link>
        </motion.div>
      </motion.section>
    </div>
  );
}
