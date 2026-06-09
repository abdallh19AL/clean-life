"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pill, Droplets, FlaskConical,
  Zap, Dumbbell, Scale, Watch, BookOpen,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

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
      {/* ── Header ──────────────────────────────────────────────────── */}
      <section className="pt-20 pb-10 px-4 text-center">
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
