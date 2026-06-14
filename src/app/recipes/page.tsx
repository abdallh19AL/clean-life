"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Utensils, Moon, Apple, Clock, Flame, X, ChefHat } from "lucide-react";
import SiteNavbar from "@/components/SiteNavbar";

/* ─── Types ──────────────────────────────────────────────────────────────── */

type Category = "فطور" | "غداء" | "عشاء" | "سناك";

type Recipe = {
  id:          number;
  name:        string;
  category:    Category;
  calories:    number;
  prepTime:    string;
  ingredients: string[];
  steps:       string[];
};

/* ─── Category config ────────────────────────────────────────────────────── */

const CATS: Record<Category, {
  color: string; bg: string; border: string;
  grad: string; Icon: React.ElementType;
}> = {
  "فطور": {
    color:  "#D97706",
    bg:     "rgba(217,119,6,0.10)",
    border: "rgba(217,119,6,0.25)",
    grad:   "linear-gradient(135deg, #FDE68A 0%, #FCD34D 100%)",
    Icon:   Sun,
  },
  "غداء": {
    color:  "#0D9488",
    bg:     "rgba(13,148,136,0.10)",
    border: "rgba(13,148,136,0.25)",
    grad:   "linear-gradient(135deg, #99F6E4 0%, #5EEAD4 100%)",
    Icon:   Utensils,
  },
  "عشاء": {
    color:  "#4F46E5",
    bg:     "rgba(79,70,229,0.10)",
    border: "rgba(79,70,229,0.25)",
    grad:   "linear-gradient(135deg, #C7D2FE 0%, #A5B4FC 100%)",
    Icon:   Moon,
  },
  "سناك": {
    color:  "#2D6A4F",
    bg:     "rgba(45,106,79,0.10)",
    border: "rgba(45,106,79,0.25)",
    grad:   "linear-gradient(135deg, #A7F3D0 0%, #6EE7B7 100%)",
    Icon:   Apple,
  },
};

const FILTERS = ["الكل", "فطور", "غداء", "عشاء", "سناك"] as const;

/* ─── Recipe data (hardcoded) ────────────────────────────────────────────── */

const RECIPES: Recipe[] = [
  {
    id: 1, name: "بان كيك الشوفان والموز", category: "فطور",
    calories: 280, prepTime: "15 دقيقة",
    ingredients: [
      "كوب شوفان مطحون",
      "موزة ناضجة مهروسة",
      "بيضتان",
      "نصف كوب حليب قليل الدسم",
      "رشة قرفة",
      "ملعقة صغيرة بيكنج باودر",
    ],
    steps: [
      "اخلط الشوفان المطحون مع البيكنج باودر والقرفة",
      "أضف الموز المهروس والبيض والحليب واخلط حتى يتجانس",
      "سخّن مقلاة غير لاصقة على نار متوسطة بدون زيت",
      "اسكب مقدار ملعقة كبيرة واتركه حتى تظهر فقاعات ثم اقلبه",
      "قدّمه مع شرائح موز أو عسل خفيف",
    ],
  },
  {
    id: 2, name: "أومليت الخضار بالجبن", category: "فطور",
    calories: 220, prepTime: "10 دقائق",
    ingredients: [
      "3 بيضات",
      "ربع كوب فلفل ملوّن مقطّع",
      "ربع كوب سبانخ",
      "ملعقتان جبن قليل الدسم",
      "ملح وفلفل أسود",
    ],
    steps: [
      "اخفق البيض مع الملح والفلفل",
      "سخّن مقلاة برشة زيت زيتون",
      "أضف الفلفل والسبانخ وقلّبهم دقيقتين",
      "اسكب البيض فوق الخضار واتركه على نار هادئة",
      "أضف الجبن، اطوِ الأومليت، وقدّمه ساخناً",
    ],
  },
  {
    id: 3, name: "توست الأفوكادو والبيض المسلوق", category: "فطور",
    calories: 310, prepTime: "12 دقيقة",
    ingredients: [
      "شريحة خبز أسمر",
      "نصف حبة أفوكادو",
      "بيضة مسلوقة",
      "عصرة ليمون",
      "ملح وفلفل وبذور سمسم",
    ],
    steps: [
      "حمّص شريحة الخبز الأسمر",
      "اهرس الأفوكادو مع عصرة ليمون وملح",
      "وزّع الأفوكادو على التوست",
      "قطّع البيضة المسلوقة وضعها فوق الأفوكادو",
      "رشّ بذور السمسم والفلفل وقدّمه",
    ],
  },
  {
    id: 4, name: "صدر دجاج مشوي مع خضار سوتيه", category: "غداء",
    calories: 350, prepTime: "25 دقيقة",
    ingredients: [
      "صدر دجاج 150غ",
      "كوب بروكلي وجزر مقطّع",
      "ملعقة زيت زيتون",
      "ثوم مفروم",
      "بهارات وملح وفلفل",
    ],
    steps: [
      "تبّل الدجاج بالبهارات والملح والفلفل",
      "اشوِه على شواية أو مقلاة حتى ينضج (7 دقائق لكل جهة)",
      "في مقلاة أخرى سخّن زيت الزيتون والثوم",
      "أضف الخضار وقلّبها 5 دقائق مع بقاء القرمشة",
      "قدّم الدجاج بجانب الخضار",
    ],
  },
  {
    id: 5, name: "سلطة التونة بالحمص", category: "غداء",
    calories: 290, prepTime: "10 دقائق",
    ingredients: [
      "علبة تونة بالماء مصفّاة",
      "نصف كوب حمص مسلوق",
      "خيار وطماطم مقطّعة",
      "بصل أخضر",
      "عصير ليمون وملعقة زيت زيتون",
    ],
    steps: [
      "صفّي التونة جيداً من الماء",
      "اخلط التونة مع الحمص والخضار المقطّعة",
      "أضف البصل الأخضر",
      "تبّل بعصير الليمون وزيت الزيتون والملح",
      "قلّب جيداً وقدّمها باردة",
    ],
  },
  {
    id: 6, name: "أرز بني بالدجاج والخضار", category: "غداء",
    calories: 420, prepTime: "30 دقيقة",
    ingredients: [
      "نصف كوب أرز بني",
      "120غ دجاج مكعّبات",
      "بازيلا وذرة وجزر",
      "بصل وثوم",
      "ملعقة زيت زيتون وبهارات",
    ],
    steps: [
      "اسلق الأرز البني حسب التعليمات",
      "سخّن الزيت وقلّب البصل والثوم",
      "أضف الدجاج حتى يتحمّر",
      "أضف الخضار والبهارات وقلّب 5 دقائق",
      "اخلط الأرز المسلوق مع الخليط وقدّمه ساخناً",
    ],
  },
  {
    id: 7, name: "سمك السلمون المشوي بالليمون", category: "عشاء",
    calories: 330, prepTime: "20 دقيقة",
    ingredients: [
      "شريحة سلمون 150غ",
      "عصير نصف ليمونة",
      "ثوم مفروم",
      "شبت أو بقدونس",
      "ملح وفلفل وزيت زيتون",
    ],
    steps: [
      "تبّل السلمون بالليمون والثوم والملح والفلفل",
      "اتركه يتبّل 10 دقائق",
      "سخّن الفرن على 200 درجة",
      "اشوِ السلمون 12-15 دقيقة حتى ينضج",
      "زيّنه بالشبت وقدّمه مع سلطة خضراء",
    ],
  },
  {
    id: 8, name: "شوربة العدس بالخضار", category: "عشاء",
    calories: 210, prepTime: "30 دقيقة",
    ingredients: [
      "كوب عدس أحمر",
      "جزرة وبصلة وكرفس",
      "ثوم مفروم",
      "كمون وكركم",
      "4 أكواب ماء أو مرق خضار",
    ],
    steps: [
      "اغسل العدس جيداً",
      "سخّن قدراً برشة زيت وقلّب البصل والثوم",
      "أضف الجزر والكرفس والبهارات",
      "أضف العدس والماء واتركه يغلي 20 دقيقة",
      "اهرسه ناعماً وقدّمه ساخناً مع عصرة ليمون",
    ],
  },
  {
    id: 9, name: "كرات اللحم بالفرن مع سلطة", category: "عشاء",
    calories: 340, prepTime: "25 دقيقة",
    ingredients: [
      "150غ لحم مفروم قليل الدهن",
      "بصل مبشور وثوم",
      "بقدونس مفروم",
      "بهارات وملح",
      "سلطة خضراء للتقديم",
    ],
    steps: [
      "اخلط اللحم مع البصل والثوم والبقدونس والبهارات",
      "شكّل كرات صغيرة",
      "رتّبها في صينية فرن",
      "اشوِها على 200 درجة لمدة 18-20 دقيقة",
      "قدّمها مع السلطة الخضراء",
    ],
  },
  {
    id: 10, name: "سموذي الفراولة والزبادي", category: "سناك",
    calories: 160, prepTime: "5 دقائق",
    ingredients: [
      "كوب فراولة",
      "نصف كوب زبادي يوناني",
      "نصف موزة",
      "رشة عسل اختياري",
      "مكعبات ثلج",
    ],
    steps: [
      "ضع الفراولة والموز في الخلاط",
      "أضف الزبادي اليوناني",
      "أضف الثلج والعسل",
      "اخلط حتى يصبح ناعماً",
      "قدّمه فوراً بارداً",
    ],
  },
  {
    id: 11, name: "كرات التمر واللوز", category: "سناك",
    calories: 90, prepTime: "15 دقيقة",
    ingredients: [
      "كوب تمر منزوع النوى",
      "نصف كوب لوز",
      "ملعقة كاكاو خام",
      "رشة قرفة",
      "جوز هند مبشور للتغليف",
    ],
    steps: [
      "اطحن اللوز في محضّر الطعام",
      "أضف التمر والكاكاو والقرفة واطحن حتى يتكتّل",
      "شكّل كرات صغيرة باليد",
      "لفّها بجوز الهند المبشور",
      "برّدها 30 دقيقة قبل التقديم",
    ],
  },
  {
    id: 12, name: "زبادي بالفواكه والمكسرات (بارفيه)", category: "سناك",
    calories: 190, prepTime: "5 دقائق",
    ingredients: [
      "كوب زبادي يوناني",
      "نصف كوب توت مشكّل",
      "ملعقة شوفان",
      "ملعقة مكسرات مقطّعة",
      "رشة عسل",
    ],
    steps: [
      "ضع طبقة زبادي في كوب",
      "أضف طبقة من التوت",
      "أضف طبقة شوفان ومكسرات",
      "كرّر الطبقات",
      "زيّن بالعسل وقدّمه بارداً",
    ],
  },
];

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function RecipesPage() {
  const [filter,   setFilter]   = useState<typeof FILTERS[number]>("الكل");
  const [selected, setSelected] = useState<Recipe | null>(null);

  const visible = filter === "الكل"
    ? RECIPES
    : RECIPES.filter(r => r.category === filter);

  return (
    <div
      dir="rtl"
      style={{
        fontFamily: "'Cairo','Segoe UI',sans-serif",
        backgroundColor: "#F8F5F0",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <SiteNavbar />

      {/* ── Hero header ── */}
      <section style={{ padding: "52px 16px 32px", textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "7px 20px", borderRadius: 999, fontSize: 13, fontWeight: 700,
            backgroundColor: "#CCFBF1", color: "#0D9488",
            border: "1px solid #99F6E4", marginBottom: 20,
          }}
        >
          <ChefHat size={15} />
          وصفات صحية من خبرائنا
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          style={{
            fontSize: "clamp(1.8rem, 5vw, 3rem)", fontWeight: 900,
            color: "#1A2E22", marginBottom: 14, lineHeight: 1.3,
          }}
        >
          مكتبة الوصفات الصحية
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            fontSize: "clamp(14px, 2.5vw, 17px)", color: "#6B7280",
            lineHeight: 1.8, maxWidth: 520, margin: "0 auto 28px",
          }}
        >
          {RECIPES.length} وصفة صحية ولذيذة لكل وجبات يومك — مصممة لدعم أهدافك الغذائية
        </motion.p>

        {/* Count badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "6px 18px", borderRadius: 999,
            backgroundColor: "rgba(45,106,79,0.08)",
            border: "1.5px solid rgba(45,106,79,0.18)",
            color: "#2D6A4F", fontSize: 13, fontWeight: 800,
          }}
        >
          <span style={{ fontSize: 17, fontWeight: 900 }}>{visible.length}</span>
          {filter === "الكل" ? "وصفة متاحة" : `وصفة في ${filter}`}
        </motion.div>
      </section>

      {/* ── Filter chips ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.35 }}
        style={{
          display: "flex", flexWrap: "wrap", justifyContent: "center",
          gap: 10, padding: "0 16px 32px",
        }}
      >
        {FILTERS.map(f => {
          const active = f === filter;
          const cat    = f !== "الكل" ? CATS[f as Category] : null;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "8px 20px", borderRadius: 999, minHeight: 40,
                fontSize: 14, fontWeight: 700,
                fontFamily: "inherit", cursor: "pointer",
                transition: "all 0.18s",
                backgroundColor: active
                  ? (cat ? cat.color : "#2D6A4F")
                  : (cat ? cat.bg : "rgba(45,106,79,0.08)"),
                color: active ? "white" : (cat ? cat.color : "#2D6A4F"),
                border: `1.5px solid ${cat ? cat.border : "rgba(45,106,79,0.25)"}`,
              }}
            >
              {f}
            </button>
          );
        })}
      </motion.div>

      {/* ── Cards grid ── */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        style={{ gap: 20, padding: "0 16px 80px", maxWidth: 1140, margin: "0 auto" }}
      >
        <AnimatePresence mode="popLayout">
          {visible.map((recipe, i) => {
            const cat = CATS[recipe.category];
            const CatIcon = cat.Icon;
            return (
              <motion.div
                key={recipe.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.38, delay: Math.min(i * 0.06, 0.36) }}
                onClick={() => setSelected(recipe)}
                whileHover={{ y: -5, boxShadow: "0 14px 40px rgba(0,0,0,0.12)" }}
                whileTap={{ scale: 0.98 }}
                style={{
                  backgroundColor: "rgba(255,255,255,0.88)",
                  border: "1.5px solid rgba(190,175,155,0.25)",
                  borderRadius: 20, overflow: "hidden",
                  cursor: "pointer",
                  boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                }}
              >
                {/* Colored icon header */}
                <div style={{
                  height: 120, background: cat.grad,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative",
                }}>
                  <CatIcon
                    size={52} color={cat.color}
                    strokeWidth={1.4}
                    style={{ opacity: 0.75 }}
                  />
                </div>

                {/* Card body */}
                <div style={{ padding: "18px 18px 20px" }}>
                  {/* Category chip */}
                  <span style={{
                    display: "inline-flex", alignItems: "center",
                    padding: "3px 10px", borderRadius: 999,
                    fontSize: 11, fontWeight: 700,
                    backgroundColor: cat.bg, color: cat.color,
                    border: `1px solid ${cat.border}`,
                    marginBottom: 9,
                  }}>
                    {recipe.category}
                  </span>

                  {/* Recipe name */}
                  <p style={{
                    fontSize: 15, fontWeight: 800, color: "#1a1a1a",
                    lineHeight: 1.4, marginBottom: 14,
                    minHeight: 42,
                  }}>
                    {recipe.name}
                  </p>

                  {/* Stats */}
                  <div style={{
                    display: "flex", gap: 18, alignItems: "center",
                    paddingTop: 12,
                    borderTop: "1px solid rgba(190,175,155,0.18)",
                  }}>
                    <span style={{
                      display: "flex", alignItems: "center", gap: 5,
                      fontSize: 12, color: "#888", fontWeight: 600,
                    }}>
                      <Flame size={13} color="#E07A5F" />
                      {recipe.calories} سعرة
                    </span>
                    <span style={{
                      display: "flex", alignItems: "center", gap: 5,
                      fontSize: 12, color: "#888", fontWeight: 600,
                    }}>
                      <Clock size={13} color="#6B7280" />
                      {recipe.prepTime}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ── Recipe modal ── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setSelected(null)}
            style={{
              position: "fixed", inset: 0, zIndex: 200,
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: 16,
              backgroundColor: "rgba(0,0,0,0.42)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
            }}
          >
            {(() => {
              const cat     = CATS[selected.category];
              const CatIcon = cat.Icon;
              return (
                <motion.div
                  key="modal"
                  initial={{ y: 36, scale: 0.95, opacity: 0 }}
                  animate={{ y: 0,  scale: 1,    opacity: 1 }}
                  exit={{   y: 28, scale: 0.96,  opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  onClick={e => e.stopPropagation()}
                  style={{
                    width: "100%", maxWidth: 540,
                    maxHeight: "90vh",
                    overflow: "hidden",        // clips rounded corners
                    display: "flex", flexDirection: "column",
                    backgroundColor: "white",
                    borderRadius: 24,
                    boxShadow: "0 28px 72px rgba(0,0,0,0.22)",
                  }}
                >
                  {/* Modal colored header */}
                  <div style={{
                    height: 130, background: cat.grad,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    position: "relative", flexShrink: 0,
                  }}>
                    <CatIcon size={56} color={cat.color} strokeWidth={1.3} style={{ opacity: 0.7 }} />
                    <button
                      onClick={() => setSelected(null)}
                      style={{
                        position: "absolute", top: 14, left: 14,
                        width: 36, height: 36, borderRadius: 10,
                        border: "none", backgroundColor: "rgba(255,255,255,0.70)",
                        cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      <X size={18} color="#555" />
                    </button>
                  </div>

                  {/* Modal body — scrollable */}
                  <div style={{
                    padding: "22px 22px 32px",
                    overflowY: "auto",
                    fontFamily: "'Cairo','Segoe UI',sans-serif",
                    direction: "rtl",
                  }}>
                    {/* Name + chip */}
                    <h2 style={{
                      fontSize: 20, fontWeight: 900, color: "#1a1a1a",
                      lineHeight: 1.3, marginBottom: 12,
                    }}>
                      {selected.name}
                    </h2>

                    {/* Stats row */}
                    <div style={{
                      display: "flex", gap: 10, flexWrap: "wrap",
                      alignItems: "center", marginBottom: 22,
                    }}>
                      <span style={{
                        display: "inline-flex", alignItems: "center",
                        padding: "4px 12px", borderRadius: 999,
                        fontSize: 12, fontWeight: 700,
                        backgroundColor: cat.bg, color: cat.color,
                        border: `1px solid ${cat.border}`,
                      }}>
                        {selected.category}
                      </span>
                      <span style={{
                        display: "flex", alignItems: "center", gap: 5,
                        fontSize: 13, color: "#888", fontWeight: 600,
                        padding: "4px 12px", borderRadius: 999,
                        backgroundColor: "rgba(224,122,95,0.08)",
                        border: "1px solid rgba(224,122,95,0.20)",
                      }}>
                        <Flame size={13} color="#E07A5F" />
                        {selected.calories} سعرة
                      </span>
                      <span style={{
                        display: "flex", alignItems: "center", gap: 5,
                        fontSize: 13, color: "#888", fontWeight: 600,
                        padding: "4px 12px", borderRadius: 999,
                        backgroundColor: "rgba(107,114,128,0.08)",
                        border: "1px solid rgba(107,114,128,0.18)",
                      }}>
                        <Clock size={13} color="#6B7280" />
                        {selected.prepTime}
                      </span>
                    </div>

                    <div style={{ height: 1, backgroundColor: "rgba(190,175,155,0.22)", marginBottom: 20 }} />

                    {/* Ingredients */}
                    <h3 style={{
                      fontSize: 14, fontWeight: 800, color: "#1a1a1a",
                      marginBottom: 12,
                      display: "flex", alignItems: "center", gap: 8,
                    }}>
                      <span style={{
                        width: 24, height: 24, borderRadius: 7,
                        backgroundColor: cat.bg,
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        fontSize: 13,
                      }}>🥗</span>
                      المكوّنات
                    </h3>
                    <ul style={{
                      margin: "0 0 24px", padding: 0,
                      listStyle: "none",
                      display: "flex", flexDirection: "column", gap: 8,
                    }}>
                      {selected.ingredients.map((ing, i) => (
                        <li key={i} style={{
                          display: "flex", alignItems: "flex-start", gap: 10,
                          fontSize: 14, color: "#444", lineHeight: 1.6,
                        }}>
                          <span style={{
                            width: 7, height: 7, borderRadius: "50%",
                            backgroundColor: cat.color, flexShrink: 0,
                            marginTop: 8,
                          }} />
                          {ing}
                        </li>
                      ))}
                    </ul>

                    <div style={{ height: 1, backgroundColor: "rgba(190,175,155,0.22)", marginBottom: 20 }} />

                    {/* Steps */}
                    <h3 style={{
                      fontSize: 14, fontWeight: 800, color: "#1a1a1a",
                      marginBottom: 14,
                      display: "flex", alignItems: "center", gap: 8,
                    }}>
                      <span style={{
                        width: 24, height: 24, borderRadius: 7,
                        backgroundColor: cat.bg,
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        fontSize: 13,
                      }}>👨‍🍳</span>
                      خطوات التحضير
                    </h3>
                    <ol style={{
                      margin: 0, padding: 0,
                      listStyle: "none",
                      display: "flex", flexDirection: "column", gap: 12,
                    }}>
                      {selected.steps.map((step, i) => (
                        <li key={i} style={{
                          display: "flex", alignItems: "flex-start", gap: 12,
                          fontSize: 14, color: "#444", lineHeight: 1.7,
                        }}>
                          <span style={{
                            width: 26, height: 26, borderRadius: 8,
                            backgroundColor: cat.color, color: "white",
                            fontSize: 12, fontWeight: 800,
                            display: "inline-flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0,
                          }}>
                            {i + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </motion.div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
