"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft, Star, Users, TrendingUp, Clock, Headphones,
  Activity, Dumbbell, Apple, BookOpen, Heart,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                                 */
/* ------------------------------------------------------------------ */

const marqueeItems = [
  { icon: "⭐", text: "خسرت 12 كيلو في 90 يوم" },
  { icon: "💪", text: "تحسنت قوتي البدنية بشكل ملحوظ" },
  { icon: "🥗", text: "نظامي الغذائي تغيّر للأبد" },
  { icon: "🏃", text: "أصبحت أتمرن يومياً بلا انقطاع" },
  { icon: "⭐", text: "أفضل استثمار في صحتي" },
  { icon: "🎯", text: "أهدافي أصبحت واقعاً ملموساً" },
  { icon: "🔥", text: "طاقتي تضاعفت خلال أسابيع" },
  { icon: "🌟", text: "نتائج تفوق كل توقعاتي" },
];

const stats = [
  { value: "+500", label: "عميل ناجح",     Icon: Users       },
  { value: "98%",  label: "نسبة الرضا",    Icon: TrendingUp  },
  { value: "90",   label: "يوم للنتائج",   Icon: Clock       },
  { value: "24/7", label: "دعم متواصل",    Icon: Headphones  },
];

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                    */
/* ------------------------------------------------------------------ */

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 40 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const inView = (delay = 0) => ({
  initial:    { opacity: 0, y: 30 },
  whileInView:{ opacity: 1, y: 0  },
  viewport:   { once: true        },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
});

/* ------------------------------------------------------------------ */
/*  Page                                                                 */
/* ------------------------------------------------------------------ */

export default function Home() {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target:  dashboardRef,
    offset:  ["start end", "center center"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [22, 0]);
  const scale   = useTransform(scrollYProgress, [0, 1], [0.88, 1]);
  const yOffset = useTransform(scrollYProgress, [0, 1], [60, 0]);

  return (
    <div dir="rtl" style={{ fontFamily: "'Cairo', sans-serif", backgroundColor: "#F7F3EC", color: "#1C1917" }}>

      {/* ============================================================
          HERO
      ============================================================ */}
      <section
        className="min-h-screen flex flex-col justify-center items-center text-center px-4 pt-28 pb-20 relative overflow-hidden"
        style={{ backgroundColor: "#F7F3EC" }}
      >
        {/* Ambient blobs */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, #0D948822 0%, transparent 65%)" }}
        />
        <div
          className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, #D9770622 0%, transparent 65%)" }}
        />

        <div className="max-w-4xl mx-auto relative z-10 space-y-7">
          {/* Badge */}
          <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold" style={{ backgroundColor: "#CCFBF1", color: "#0D9488", border: "1px solid #99F6E4" }}>
            <Star className="w-4 h-4 fill-current" />
            <span>منصة رعاية صحية بمعايير عالمية</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            {...fadeUp(0.15)}
            className="text-4xl md:text-6xl lg:text-7xl font-black"
            style={{ lineHeight: 1.3, color: "#1C1917" }}
          >
            نحت جسمك ورعايتك الصحية
            <br />
            <span style={{ color: "#0D9488" }}>بمعايير عالمية</span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            {...fadeUp(0.3)}
            className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            style={{ color: "#57534E" }}
          >
            برامج متكاملة للتدريب والتغذية والرعاية الصحية، مصممة خصيصاً لأهدافك الشخصية
            وتمنحك نتائج حقيقية مستدامة.
          </motion.p>

          {/* CTA buttons */}
          <motion.div {...fadeUp(0.45)} className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-bold text-lg transition-transform hover:scale-105 active:scale-95"
              style={{ backgroundColor: "#0D9488", boxShadow: "0 8px 32px #0D948838" }}
            >
              ابدأ رحلتك الآن
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg transition-transform hover:scale-105 active:scale-95"
              style={{ backgroundColor: "white", color: "#0D9488", border: "2px solid #0D9488" }}
            >
              تعرف علينا أكثر
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ============================================================
          MINI DASHBOARD PREVIEW — 3-D scroll effect
      ============================================================ */}
      <section ref={dashboardRef} className="py-20 px-4 overflow-hidden" style={{ backgroundColor: "#F7F3EC" }}>
        <motion.div {...inView(0)} className="text-center max-w-xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-black mb-3" style={{ color: "#1C1917" }}>
            لوحة تحكم ذكية بين يديك
          </h2>
          <p className="text-lg" style={{ color: "#57534E" }}>
            تابع تقدمك، سجّل وجباتك، وراجع خطة تدريبك كل يوم
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto" style={{ perspective: "1200px" }}>
          <motion.div style={{ rotateX, scale, y: yOffset }} className="rounded-3xl overflow-hidden shadow-2xl">
            {/* Dashboard mock */}
            <div style={{ backgroundColor: "#ffffff", border: "1px solid #E7E5E4" }}>
              {/* Title bar */}
              <div
                className="flex items-center justify-between px-6 py-4"
                style={{ borderBottom: "1px solid #F5F5F4", backgroundColor: "#FAFAF9" }}
              >
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#EF4444" }} />
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#F59E0B" }} />
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#10B981" }} />
                </div>
                <span className="text-sm font-semibold" style={{ color: "#78716C" }}>لوحة التحكم — حياة نظيفة</span>
                <Heart className="w-5 h-5" style={{ color: "#0D9488" }} />
              </div>

              {/* Cards */}
              <div className="p-6 grid grid-cols-2 gap-4">
                {/* Streak */}
                <div className="rounded-2xl p-5" style={{ backgroundColor: "#F0FDFA", border: "1px solid #99F6E4" }}>
                  <p className="text-sm font-semibold mb-1" style={{ color: "#0D9488" }}>أيام الالتزام</p>
                  <div className="flex items-end gap-2">
                    <span className="text-5xl font-black" style={{ color: "#0F766E" }}>42</span>
                    <span className="text-lg mb-1.5" style={{ color: "#0D9488" }}>يوم 🔥</span>
                  </div>
                  <div className="flex gap-1 mt-3">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div key={i} className="flex-1 rounded" style={{ height: 6, backgroundColor: i < 6 ? "#0D9488" : "#CCFBF1" }} />
                    ))}
                  </div>
                </div>

                {/* Weight */}
                <div className="rounded-2xl p-5" style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A" }}>
                  <p className="text-sm font-semibold mb-1" style={{ color: "#D97706" }}>الوزن الحالي</p>
                  <div className="flex items-end gap-2">
                    <span className="text-5xl font-black" style={{ color: "#B45309" }}>78</span>
                    <span className="text-lg mb-1.5" style={{ color: "#D97706" }}>كغ ↓</span>
                  </div>
                  <p className="text-sm mt-1" style={{ color: "#92400E" }}>−5 كغ منذ البداية</p>
                </div>

                {/* Today tasks */}
                <div className="rounded-2xl p-5 col-span-2" style={{ backgroundColor: "#F9FAFB", border: "1px solid #E5E7EB" }}>
                  <p className="text-sm font-semibold mb-3" style={{ color: "#374151" }}>مهام اليوم</p>
                  <div className="space-y-2">
                    {["تمرين الصباح 30 دقيقة", "تناول وجبة البروتين", "8 أكواب ماء"].map((task, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: i < 2 ? "#0D9488" : "#E5E7EB" }}
                        >
                          {i < 2 && <span className="text-white text-xs">✓</span>}
                        </div>
                        <span
                          className="text-sm"
                          style={{ color: i < 2 ? "#9CA3AF" : "#111827", textDecoration: i < 2 ? "line-through" : "none" }}
                        >
                          {task}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================
          INFINITE MARQUEE — social proof
      ============================================================ */}
      <section
        className="py-10 overflow-hidden"
        style={{ backgroundColor: "#F0FDFA", borderTop: "1px solid #CCFBF1", borderBottom: "1px solid #CCFBF1" }}
      >
        {/* ltr wrapper so RTL parent doesn't flip scroll direction */}
        <div dir="ltr">
          <motion.div
            className="flex gap-5"
            style={{ width: "max-content" }}
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          >
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <div
                key={i}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full flex-shrink-0 font-semibold text-sm whitespace-nowrap"
                style={{ backgroundColor: "white", border: "1px solid #99F6E4", color: "#0F766E" }}
                dir="rtl"
              >
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================================
          STATS ROW
      ============================================================ */}
      <section className="py-20 px-4" style={{ backgroundColor: "#F7F3EC" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5">
          {stats.map(({ value, label, Icon }, i) => (
            <motion.div
              key={i}
              {...inView(i * 0.1)}
              className="flex flex-col items-center text-center p-6 rounded-2xl"
              style={{ backgroundColor: "white", border: "1px solid #E7E5E4", boxShadow: "0 2px 16px #00000009" }}
            >
              <Icon className="w-8 h-8 mb-3" style={{ color: "#0D9488" }} />
              <div className="text-3xl md:text-4xl font-black mb-1" style={{ color: "#0D9488" }}>{value}</div>
              <div className="text-sm font-semibold" style={{ color: "#78716C" }}>{label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============================================================
          BENTO GRID — Services
      ============================================================ */}
      <section className="py-20 px-4" style={{ backgroundColor: "#F7F3EC" }}>
        <div className="max-w-5xl mx-auto">
          <motion.div {...inView(0)} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-3" style={{ color: "#1C1917" }}>
              خدماتنا المتكاملة
            </h2>
            <p className="text-lg" style={{ color: "#57534E" }}>
              كل ما تحتاجه لرحلة صحية ناجحة في مكان واحد
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-[auto_auto] gap-5">
            {/* Card 1 — normal */}
            <motion.div
              {...inView(0.1)}
              className="p-7 rounded-3xl flex flex-col gap-4"
              style={{ backgroundColor: "#F0FDFA", border: "1px solid #99F6E4" }}
            >
              <Dumbbell className="w-10 h-10" style={{ color: "#0D9488" }} />
              <h3 className="text-xl font-black" style={{ color: "#134E4A" }}>برامج التدريب المخصصة</h3>
              <p className="leading-relaxed" style={{ color: "#115E59" }}>
                خطط تمرين فردية من مدربين معتمدين دولياً تناسب مستواك وأهدافك الشخصية
              </p>
            </motion.div>

            {/* Card 2 — tall (row-span-2) */}
            <motion.div
              {...inView(0.2)}
              className="p-7 rounded-3xl flex flex-col gap-4 md:row-span-2"
              style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A" }}
            >
              <Apple className="w-10 h-10" style={{ color: "#D97706" }} />
              <h3 className="text-xl font-black" style={{ color: "#78350F" }}>التغذية العلاجية</h3>
              <p className="leading-relaxed" style={{ color: "#92400E" }}>
                أنظمة غذائية مخصصة وعلمية بإشراف أخصائيي التغذية المعتمدين الذين يفهمون احتياجات جسمك
              </p>

              {/* Mock nutrition plan */}
              <div className="mt-auto rounded-2xl p-4 space-y-3" style={{ backgroundColor: "white", border: "1px solid #FDE68A" }}>
                <p className="text-xs font-bold" style={{ color: "#92400E" }}>خطة وجبات اليوم</p>
                {["إفطار صحي — 400 سعرة", "وجبة متوسطة — 600 سعرة", "عشاء خفيف — 350 سعرة"].map((meal, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: "#D97706" }} />
                    <span className="text-xs" style={{ color: "#78350F" }}>{meal}</span>
                  </div>
                ))}
                <div className="pt-2" style={{ borderTop: "1px solid #FDE68A" }}>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span style={{ color: "#92400E" }}>إجمالي السعرات</span>
                    <span style={{ color: "#D97706" }}>1350 / 1800</span>
                  </div>
                  <div className="rounded-full overflow-hidden" style={{ height: 6, backgroundColor: "#FEF3C7" }}>
                    <div className="h-full rounded-full" style={{ width: "75%", backgroundColor: "#D97706" }} />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 3 — normal */}
            <motion.div
              {...inView(0.3)}
              className="p-7 rounded-3xl flex flex-col gap-4"
              style={{ backgroundColor: "#ECFDF5", border: "1px solid #A7F3D0" }}
            >
              <Activity className="w-10 h-10" style={{ color: "#059669" }} />
              <h3 className="text-xl font-black" style={{ color: "#064E3B" }}>متابعة التقدم الأسبوعي</h3>
              <p className="leading-relaxed" style={{ color: "#065F46" }}>
                تقارير تفصيلية ولوحة ذكية تعكس تطورك الحقيقي أسبوعاً بأسبوع
              </p>
            </motion.div>

            {/* Card 4 — wide (col-span-2) */}
            <motion.div
              {...inView(0.4)}
              className="p-7 rounded-3xl flex flex-col gap-4 md:col-span-2"
              style={{ backgroundColor: "#F0FDFA", border: "1px solid #99F6E4" }}
            >
              <BookOpen className="w-10 h-10" style={{ color: "#0D9488" }} />
              <h3 className="text-xl font-black" style={{ color: "#134E4A" }}>مكتبة المحتوى الصحي</h3>
              <p className="leading-relaxed" style={{ color: "#115E59" }}>
                مئات المقالات والفيديوهات التعليمية المتخصصة لبناء عادات صحية واعية ومستدامة تدوم طوال العمر
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================
          CTA BANNER
      ============================================================ */}
      <section className="py-24 px-4" style={{ backgroundColor: "#F7F3EC" }}>
        <motion.div
          {...inView(0)}
          className="max-w-4xl mx-auto rounded-3xl p-12 text-center relative overflow-hidden"
          style={{
            background:    "linear-gradient(135deg, #064E3B 0%, #065F46 55%, #0D9488 100%)",
            boxShadow:     "0 24px 64px #064E3B44",
          }}
        >
          {/* Decorative blobs */}
          <div
            className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none -translate-y-1/2 translate-x-1/4 opacity-10"
            style={{ backgroundColor: "#34D399" }}
          />
          <div
            className="absolute bottom-0 left-0 w-48 h-48 rounded-full pointer-events-none translate-y-1/2 -translate-x-1/4 opacity-10"
            style={{ backgroundColor: "#6EE7B7" }}
          />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black mb-4 text-white">
              ابدأ تحولك الصحي اليوم
            </h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto" style={{ color: "#A7F3D0" }}>
              انضم إلى أكثر من 500 عميل حققوا أهدافهم الصحية مع فريقنا المتخصص.
              رحلتك تبدأ بخطوة واحدة.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg transition-transform hover:scale-105 active:scale-95"
                style={{ backgroundColor: "white", color: "#064E3B" }}
              >
                احجز استشارتك المجانية
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg transition-transform hover:scale-105 active:scale-95"
                style={{ color: "white", border: "2px solid rgba(255,255,255,0.45)" }}
              >
                اعرف المزيد
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ============================================================
          FOOTER
      ============================================================ */}
      <footer className="py-12 px-4" style={{ backgroundColor: "#1C1917", color: "#A8A29E" }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-right">
              <h3 className="text-xl font-black mb-1" style={{ color: "white" }}>حياة نظيفة</h3>
              <p className="text-sm">رعايتك الصحية بمعايير عالمية</p>
            </div>
            <div className="flex gap-6 text-sm font-medium">
              <Link href="/dashboard" className="hover:text-white transition-colors">لوحة التحكم</Link>
              <Link href="/dashboard" className="hover:text-white transition-colors">الخدمات</Link>
              <Link href="/dashboard" className="hover:text-white transition-colors">تواصل معنا</Link>
            </div>
          </div>
          <div className="mt-8 pt-6 text-center text-sm" style={{ borderTop: "1px solid #292524" }}>
            <p>© 2026 حياة نظيفة — جميع الحقوق محفوظة</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
