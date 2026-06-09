"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pill, Droplets, FlaskConical,
  Zap, Dumbbell, Scale, Watch, BookOpen,
  Home as HomeIcon, ShoppingBag, Calculator,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ─── Shared navbar ────────────────────────────────────────────────────── */

const NAV_LINKS = [
  { href: "/",           label: "الرئيسية",      Icon: HomeIcon    },
  { href: "/store",      label: "المتجر",         Icon: ShoppingBag },
  { href: "/calculator", label: "حاسبة السعرات", Icon: Calculator  },
];

function PageNavbar() {
  return (
    <div
      dir="rtl"
      style={{
        position: "sticky", top: 0, zIndex: 100,
        height: 60, flexShrink: 0,
        backgroundColor: "rgba(252,250,246,0.85)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderBottom: "1px solid rgba(190,175,155,0.20)",
        padding: "0 16px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        fontFamily: "'Cairo','Segoe UI',sans-serif",
      }}
    >
      {/* Logo */}
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: "linear-gradient(135deg, #2D6A4F, #52B788)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 10px rgba(45,106,79,0.28)",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
          </svg>
        </div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 900, color: "#1a2e22", lineHeight: 1.2, margin: 0 }}>Clean Life</p>
          <p style={{ fontSize: 10, fontWeight: 600, color: "#6B9E80", margin: 0 }}>عيادة الصحة</p>
        </div>
      </Link>

      {/* Nav links */}
      <div className="hidden md:flex" style={{ alignItems: "center", gap: 4 }}>
        {NAV_LINKS.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 12px", borderRadius: 10,
              color: "#4A6B5C", fontSize: 13.5, fontWeight: 600,
              textDecoration: "none", transition: "background 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(61,122,94,0.08)";
              (e.currentTarget as HTMLAnchorElement).style.color = "#2D6A4F";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLAnchorElement).style.color = "#4A6B5C";
            }}
          >
            <Icon size={14} />
            {label}
          </Link>
        ))}
      </div>

      {/* Auth buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <Link href="/login" style={{
          padding: "8px 20px", borderRadius: 12,
          color: "#2D6A4F", fontSize: 13.5, fontWeight: 700,
          textDecoration: "none",
          border: "1.5px solid rgba(45,106,79,0.35)",
        }}>
          تسجيل الدخول
        </Link>
        <Link href="/dashboard" style={{
          padding: "8px 20px", borderRadius: 12,
          background: "linear-gradient(135deg, #2D6A4F, #40916C)",
          color: "white", fontSize: 13.5, fontWeight: 700,
          textDecoration: "none",
          boxShadow: "0 2px 10px rgba(45,106,79,0.25)",
        }}>
          ابدأ الآن
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Data                                                                 */
/* ------------------------------------------------------------------ */

type Accent = { bg: string; iconColor: string; border: string; Icon: LucideIcon };

type Recommendation = {
  id:           number;
  title:        string;
  category:     string;
  description:  string;
  imageUrl:     string;
  externalLink: string;
  accent:       Accent;
};

const recommendationsData: Recommendation[] = [
  {
    id: 1,
    title:       "بروتين مصل اللبن الطبيعي",
    category:    "مكملات غذائية",
    description: "مصدر بروتين عالي الجودة مستخلص من مصل اللبن، يدعم بناء العضلات والتعافي بعد التمرين بكفاءة عالية.",
    imageUrl:    "https://placehold.co/400x300/e8f5e9/2d6a4f?text=Clean+Life",
    externalLink: "#",
    accent: { bg: "#F0FDF4", iconColor: "#16A34A", border: "#BBF7D0", Icon: Pill },
  },
  {
    id: 2,
    title:       "أوميغا 3 عالي التركيز",
    category:    "مكملات غذائية",
    description: "كبسولات زيت السمك المنقّى تدعم صحة القلب والدماغ وتقلل الالتهابات وتحسن الأداء الرياضي العام.",
    imageUrl:    "https://placehold.co/400x300/e8f5e9/2d6a4f?text=Clean+Life",
    externalLink: "#",
    accent: { bg: "#F0FDFA", iconColor: "#0D9488", border: "#99F6E4", Icon: Droplets },
  },
  {
    id: 3,
    title:       "كرياتين مونوهيدرات",
    category:    "مكملات غذائية",
    description: "الأكثر دراسةً علمياً بين المكملات الرياضية، يرفع القوة والقدرة التحملية في تمارين الشدة العالية.",
    imageUrl:    "https://placehold.co/400x300/e8f5e9/2d6a4f?text=Clean+Life",
    externalLink: "#",
    accent: { bg: "#ECFDF5", iconColor: "#059669", border: "#A7F3D0", Icon: FlaskConical },
  },
  {
    id: 4,
    title:       "حزام تدريب احترافي",
    category:    "معدات تدريب",
    description: "حزام قطني متين يوفر دعماً استثنائياً لأسفل الظهر أثناء تمارين القوة الثقيلة والرفع المتقدم.",
    imageUrl:    "https://placehold.co/400x300/e8f5e9/2d6a4f?text=Clean+Life",
    externalLink: "#",
    accent: { bg: "#FFFBEB", iconColor: "#D97706", border: "#FDE68A", Icon: Zap },
  },
  {
    id: 5,
    title:       "دمبل قابلة للضبط",
    category:    "معدات تدريب",
    description: "نظام دمبل ذكي يغني عن مجموعة أوزان كاملة، مثالي للتدريب المنزلي بمرونة تامة في تحديد الأوزان.",
    imageUrl:    "https://placehold.co/400x300/e8f5e9/2d6a4f?text=Clean+Life",
    externalLink: "#",
    accent: { bg: "#FFF7ED", iconColor: "#EA580C", border: "#FED7AA", Icon: Dumbbell },
  },
  {
    id: 6,
    title:       "ميزان ذكي لقياس نسبة الدهون",
    category:    "أجهزة قياس",
    description: "يقيس نسبة الدهون والعضلات والماء بتقنية BIA ويتزامن مع تطبيق الجوال لمتابعة تقدمك بدقة.",
    imageUrl:    "https://placehold.co/400x300/e8f5e9/2d6a4f?text=Clean+Life",
    externalLink: "#",
    accent: { bg: "#F5F3FF", iconColor: "#7C3AED", border: "#DDD6FE", Icon: Scale },
  },
  {
    id: 7,
    title:       "ساعة لياقة متكاملة",
    category:    "أجهزة قياس",
    description: "تتبع خطواتك ومعدل ضربات قلبك وجودة نومك وحرق السعرات بدقة لتحقيق أهداف لياقتك اليومية.",
    imageUrl:    "https://placehold.co/400x300/e8f5e9/2d6a4f?text=Clean+Life",
    externalLink: "#",
    accent: { bg: "#EFF6FF", iconColor: "#2563EB", border: "#BFDBFE", Icon: Watch },
  },
  {
    id: 8,
    title:       "دليل التغذية الرياضية العلمية",
    category:    "كتب وتعليم",
    description: "مرجع شامل مبني على الأبحاث يشرح مبادئ التغذية الرياضية وكيفية تصميم نظام غذائي مثالي للأداء.",
    imageUrl:    "https://placehold.co/400x300/e8f5e9/2d6a4f?text=Clean+Life",
    externalLink: "#",
    accent: { bg: "#EEF2FF", iconColor: "#4F46E5", border: "#C7D2FE", Icon: BookOpen },
  },
];

const ALL_CATEGORIES = ["الكل", "مكملات غذائية", "معدات تدريب", "أجهزة قياس", "كتب وتعليم"];

/* ------------------------------------------------------------------ */
/*  Page                                                                 */
/* ------------------------------------------------------------------ */

export default function StorePage() {
  const [activeFilter, setActiveFilter] = useState("الكل");

  const filtered =
    activeFilter === "الكل"
      ? recommendationsData
      : recommendationsData.filter((item) => item.category === activeFilter);

  return (
    <div
      dir="rtl"
      className="pb-24"
      style={{ fontFamily: "'Cairo', sans-serif", backgroundColor: "#F8F5F0", minHeight: "100vh" }}
    >
      <PageNavbar />

      {/* ── Header ──────────────────────────────────────────────────── */}
      <section className="pt-12 pb-10 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-5"
          style={{ backgroundColor: "#CCFBF1", color: "#0D9488", border: "1px solid #99F6E4" }}
        >
          ✦ موصى به من خبرائنا
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="text-4xl md:text-5xl font-black mb-4"
          style={{ color: "#1A2E22" }}
        >
          توصيات الخبراء
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="text-lg max-w-xl mx-auto"
          style={{ color: "#6B7280" }}
        >
          منتجات اخترها فريقنا بعناية لمساعدتك في الوصول إلى أهدافك الصحية والرياضية
        </motion.p>
      </section>

      {/* ── Filter tabs ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-wrap justify-center gap-2.5 px-4 mb-10"
      >
        {ALL_CATEGORIES.map((cat) => {
          const active = cat === activeFilter;
          return (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className="px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 active:scale-95"
              style={{
                backgroundColor: active ? "#2D6A4F" : "white",
                color:           active ? "white"   : "#4A6B5C",
                border:          active ? "1px solid #2D6A4F" : "1px solid rgba(190,175,155,0.4)",
                boxShadow:       active ? "0 2px 12px rgba(45,106,79,0.22)" : "none",
              }}
            >
              {cat}
            </button>
          );
        })}
      </motion.div>

      {/* ── Cards grid ──────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4">
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((item, i) => {
              const { Icon, bg, iconColor, border } = item.accent;
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.93 }}
                  transition={{ duration: 0.38, delay: i * 0.055, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col overflow-hidden"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.85)",
                    border:          "1px solid rgba(190,175,155,0.22)",
                    borderRadius:    "20px",
                    boxShadow:       "0 2px 20px rgba(0,0,0,0.06)",
                  }}
                >
                  {/* Icon area */}
                  <div
                    className="flex items-center justify-center flex-shrink-0"
                    style={{ height: 180, backgroundColor: bg, borderBottom: `1px solid ${border}` }}
                  >
                    <Icon size={58} style={{ color: iconColor, opacity: 0.88 }} strokeWidth={1.5} />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-5 gap-3">
                    {/* Category pill */}
                    <span
                      className="self-start text-xs font-bold px-3 py-1 rounded-full"
                      style={{ backgroundColor: bg, color: iconColor, border: `1px solid ${border}` }}
                    >
                      {item.category}
                    </span>

                    {/* Title */}
                    <h3 className="text-lg font-black leading-snug" style={{ color: "#1A2E22" }}>
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p
                      className="text-sm leading-relaxed line-clamp-2 flex-1"
                      style={{ color: "#6B7280" }}
                    >
                      {item.description}
                    </p>

                    {/* CTA */}
                    <a
                      href={item.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 flex items-center justify-center gap-1.5 w-full py-3 rounded-xl text-sm font-bold text-white transition-transform hover:scale-[1.02] active:scale-95"
                      style={{
                        background: "linear-gradient(135deg, #2D6A4F 0%, #40916C 100%)",
                        boxShadow:  "0 4px 14px rgba(45,106,79,0.28)",
                      }}
                    >
                      شراء من المصدر ←
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
}
