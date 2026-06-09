"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  Search, Plus, Trash2, Sparkles, Flame,
  Sun, Zap, Shield, Activity,
} from "lucide-react";

/* ─── Food database ──────────────────────────────────────────────────────── */

const foodDatabase = [
  { id: 1,  name: "صدر دجاج مشوي",      emoji: "🍗", calories: 165, protein: 31,   carbs: 0,    fat: 3.6,  vitC: 0,   vitD: 0.1,  iron: 1,   calcium: 15,  tip: "مصدر ممتاز للبروتين الخالي من الدهون، مثالي لبناء العضلات وتسريع عملية التعافي بعد التمرين." },
  { id: 2,  name: "أرز أبيض مطبوخ",     emoji: "🍚", calories: 130, protein: 2.7,  carbs: 28,   fat: 0.3,  vitC: 0,   vitD: 0,    iron: 0.2, calcium: 10,  tip: "مصدر سريع للطاقة، يُنصح بتناوله قبل التمارين الرياضية المكثفة بساعتين." },
  { id: 3,  name: "بيض كامل",            emoji: "🥚", calories: 155, protein: 13,   carbs: 1.1,  fat: 11,   vitC: 0,   vitD: 2,    iron: 1.8, calcium: 56,  tip: "أفضل مصدر للبروتين الكامل، غني بفيتامين D والكولين المفيد لصحة الدماغ." },
  { id: 4,  name: "شوفان مطبوخ",         emoji: "🥣", calories: 71,  protein: 2.5,  carbs: 12,   fat: 1.4,  vitC: 0,   vitD: 0,    iron: 0.7, calcium: 11,  tip: "غني بالألياف القابلة للذوبان التي تخفض الكوليسترول وتحسن صحة الجهاز الهضمي." },
  { id: 5,  name: "سالمون مشوي",         emoji: "🐟", calories: 208, protein: 20,   carbs: 0,    fat: 13,   vitC: 3,   vitD: 11,   iron: 0.4, calcium: 12,  tip: "مصدر استثنائي لأوميغا 3 وفيتامين D، يقلل الالتهابات ويحسن صحة القلب." },
  { id: 6,  name: "بروكلي مطبوخ",        emoji: "🥦", calories: 35,  protein: 2.4,  carbs: 7,    fat: 0.4,  vitC: 65,  vitD: 0,    iron: 0.7, calcium: 47,  tip: "من أكثر الخضروات كثافةً بالمغذيات، يحتوي على مركبات تقي من السرطان." },
  { id: 7,  name: "موز",                  emoji: "🍌", calories: 89,  protein: 1.1,  carbs: 23,   fat: 0.3,  vitC: 9,   vitD: 0,    iron: 0.3, calcium: 5,   tip: "مصدر ممتاز للبوتاسيوم والطاقة السريعة، مثالي كوجبة خفيفة قبل التمرين." },
  { id: 8,  name: "زيت زيتون",           emoji: "🫙", calories: 884, protein: 0,    carbs: 0,    fat: 100,  vitC: 0,   vitD: 0,    iron: 0.1, calcium: 1,   tip: "غني بالدهون الأحادية غير المشبعة ومضادات الأكسدة، ركيزة أساسية للنظام البحر متوسطي." },
  { id: 9,  name: "لحم بقري مفروم",      emoji: "🥩", calories: 250, protein: 26,   carbs: 0,    fat: 17,   vitC: 0,   vitD: 0.1,  iron: 2.7, calcium: 18,  tip: "مصدر ممتاز للحديد الهيمي والزنك وفيتامين B12 الضرورية لصحة الدم." },
  { id: 10, name: "حليب كامل الدسم",     emoji: "🥛", calories: 61,  protein: 3.2,  carbs: 4.8,  fat: 3.3,  vitC: 0,   vitD: 1.2,  iron: 0.1, calcium: 113, tip: "مصدر رائع للكالسيوم وفيتامين D، ضروري لصحة العظام والأسنان." },
  { id: 11, name: "عدس مطبوخ",           emoji: "🫘", calories: 116, protein: 9,    carbs: 20,   fat: 0.4,  vitC: 1.5, vitD: 0,    iron: 3.3, calcium: 19,  tip: "من أغنى المصادر النباتية للحديد والبروتين، ممتاز للنباتيين." },
  { id: 12, name: "تفاحة",               emoji: "🍎", calories: 52,  protein: 0.3,  carbs: 14,   fat: 0.2,  vitC: 5,   vitD: 0,    iron: 0.1, calcium: 6,   tip: "غنية بمضادات الأكسدة والألياف، تساعد على تنظيم سكر الدم." },
];

type FoodItem  = typeof foodDatabase[0];
type PlateItem = { food: FoodItem; weight: number; id: number };

/* ─── Helpers ────────────────────────────────────────────────────────────── */

const CARD: React.CSSProperties = {
  backgroundColor: "rgba(255,255,255,0.85)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(190,175,155,0.22)",
  borderRadius: 20,
  padding: 24,
  boxShadow: "0 2px 16px rgba(80,60,30,0.07)",
};

function fadeIn(delay = 0) {
  return {
    initial:    { opacity: 0, y: 20 },
    animate:    { opacity: 1, y: 0  },
    transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
  };
}

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ height: 8, borderRadius: 999, background: "rgba(190,175,155,0.18)", overflow: "hidden" }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ height: "100%", borderRadius: 999, backgroundColor: color }}
      />
    </div>
  );
}

function PieLabel({ cx, cy, total }: { cx: number; cy: number; total: number }) {
  return (
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" style={{ fontFamily: "'Cairo',sans-serif" }}>
      <tspan x={cx} dy="-8" fontSize={22} fontWeight={900} fill="#1a1a1a">{total}</tspan>
      <tspan x={cx} dy={22} fontSize={11} fill="#aaa">سعرة</tspan>
    </text>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function CalculatorPage() {
  const [searchQuery,  setSearchQuery]  = useState("");
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [weight,       setWeight]       = useState(100);
  const [plate,        setPlate]        = useState<PlateItem[]>([]);

  /* ── Computed ── */
  const filteredFoods = useMemo(() =>
    searchQuery
      ? foodDatabase.filter(f => f.name.includes(searchQuery))
      : foodDatabase,
  [searchQuery]);

  const selectedNutrition = useMemo(() => {
    if (!selectedFood) return null;
    const r = weight / 100;
    return {
      calories: Math.round(selectedFood.calories * r),
      protein:  +(selectedFood.protein  * r).toFixed(1),
      carbs:    +(selectedFood.carbs    * r).toFixed(1),
      fat:      +(selectedFood.fat      * r).toFixed(1),
    };
  }, [selectedFood, weight]);

  const total = useMemo(() =>
    plate.reduce((acc, item) => {
      const r = item.weight / 100;
      return {
        calories: acc.calories + Math.round(item.food.calories * r),
        protein:  acc.protein  + item.food.protein  * r,
        carbs:    acc.carbs    + item.food.carbs     * r,
        fat:      acc.fat      + item.food.fat       * r,
        vitC:     acc.vitC     + item.food.vitC      * r,
        vitD:     acc.vitD     + item.food.vitD      * r,
        iron:     acc.iron     + item.food.iron      * r,
        calcium:  acc.calcium  + item.food.calcium   * r,
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, vitC: 0, vitD: 0, iron: 0, calcium: 0 }),
  [plate]);

  const smartTips = useMemo(() => {
    const tips: string[] = [];
    if (total.protein > 30) tips.push("بروتين ممتاز! وجبتك تدعم نمو العضلات وتسريع التعافي.");
    if (total.fat     > 30) tips.push("نسبة الدهون مرتفعة نسبياً. تأكد أن معظمها من مصادر صحية كالأفوكادو وزيت الزيتون.");
    if (total.carbs   > 60) tips.push("وجبة غنية بالكربوهيدرات - مثالية قبل التمارين المكثفة.");
    if (total.vitC    < 10) tips.push("وجبتك منخفضة بفيتامين C. أضف بعض الفلفل الملون أو البرتقال.");
    if (total.iron    >  3) tips.push("محتوى ممتاز من الحديد! يساعد على منع فقر الدم وتحسين مستويات الطاقة.");
    tips.push("اشرب كوباً من الماء مع كل وجبة لتحسين الامتصاص.");
    return tips;
  }, [total]);

  /* ── Pie chart data ── */
  const pieData = [
    { name: "بروتين",       value: Math.round(total.protein * 4), color: "#3D7A5E" },
    { name: "كربوهيدرات",  value: Math.round(total.carbs   * 4), color: "#5B8CBF" },
    { name: "دهون",         value: Math.round(total.fat     * 9), color: "#E07A5F" },
    { name: "متبقي",        value: Math.max(0, 2000 - total.calories), color: "#E8E0D5" },
  ].filter(d => d.value > 0);

  /* ── Actions ── */
  function addToPlate() {
    if (!selectedFood) return;
    setPlate(prev => [...prev, { food: selectedFood, weight, id: Date.now() }]);
  }
  function removeFromPlate(id: number) {
    setPlate(prev => prev.filter(item => item.id !== id));
  }

  /* ── Nutrition pill ── */
  function NutritionPill({ label, value, unit, color }: { label: string; value: number | string; unit: string; color: string }) {
    return (
      <div style={{ flex: 1, minWidth: 60, backgroundColor: `${color}12`, borderRadius: 12, padding: "8px 4px", textAlign: "center", border: `1.5px solid ${color}25` }}>
        <p style={{ fontSize: 15, fontWeight: 900, color, lineHeight: 1 }}>{value}</p>
        <p style={{ fontSize: 10, color: "#aaa", fontWeight: 600, marginTop: 2 }}>{unit}</p>
        <p style={{ fontSize: 10, color: "#888", fontWeight: 600 }}>{label}</p>
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────────────────────── */
  return (
    <div dir="rtl" style={{ minHeight: "100vh", backgroundColor: "#F8F5F0", fontFamily: "'Cairo','Segoe UI',sans-serif", padding: "32px 24px 64px" }}>

      {/* ── Header ── */}
      <motion.div {...fadeIn(0)} style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: "#1a1a1a" }}>حاسبة التغذية الذكية</h1>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "4px 14px", borderRadius: 999,
            backgroundColor: "rgba(61,122,94,0.10)", color: "#2D6A4F",
            fontSize: 12, fontWeight: 700, border: "1px solid rgba(61,122,94,0.20)",
          }}>
            <Sparkles size={12} /> مدعوم بذكاء غذائي
          </span>
        </div>
        <p style={{ fontSize: 14, color: "#aaa" }}>ابنِ وجبتك المثالية وتتبع مغذياتها بدقة</p>
      </motion.div>

      {/* ── Two-column grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ marginBottom: 24 }}>

        {/* ══ LEFT COLUMN ══ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Card 1 — Food selector */}
          <motion.div {...fadeIn(0.05)} style={CARD}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a", marginBottom: 14 }}>اختر طعامك</h2>

            {/* Search */}
            <div style={{ position: "relative", marginBottom: 14 }}>
              <Search size={15} color="#aaa" style={{ position: "absolute", top: "50%", right: 12, transform: "translateY(-50%)", pointerEvents: "none" }} />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="ابحث عن طعام..."
                style={{
                  width: "100%", boxSizing: "border-box",
                  padding: "10px 36px 10px 12px",
                  borderRadius: 12, border: "1.5px solid rgba(190,175,155,0.30)",
                  backgroundColor: "#FAFAF7", fontSize: 14,
                  fontFamily: "inherit", outline: "none",
                  color: "#333",
                }}
              />
            </div>

            {/* Food grid */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr",
              gap: 10, maxHeight: 280, overflowY: "auto",
              paddingLeft: 2, paddingRight: 2,
            }}>
              {filteredFoods.map(food => {
                const isSelected = selectedFood?.id === food.id;
                return (
                  <motion.button
                    key={food.id}
                    onClick={() => { setSelectedFood(food); setWeight(100); }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      padding: "12px 8px", borderRadius: 14, cursor: "pointer",
                      border: isSelected ? "2px solid #3D7A5E" : "1.5px solid rgba(190,175,155,0.22)",
                      backgroundColor: isSelected ? "rgba(61,122,94,0.08)" : "rgba(248,245,240,0.8)",
                      textAlign: "center", fontFamily: "inherit",
                      transition: "border-color 0.15s, background 0.15s",
                    }}
                  >
                    <div style={{ fontSize: 28, lineHeight: 1, marginBottom: 6 }}>{food.emoji}</div>
                    <p style={{ fontSize: 12, fontWeight: 700, color: isSelected ? "#2D6A4F" : "#333", lineHeight: 1.3, marginBottom: 3 }}>{food.name}</p>
                    <p style={{ fontSize: 10, color: "#aaa", fontWeight: 600 }}>{food.calories} سعرة/100غ</p>
                  </motion.button>
                );
              })}
              {filteredFoods.length === 0 && (
                <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "24px 0", color: "#bbb", fontSize: 13 }}>
                  لا توجد نتائج للبحث
                </div>
              )}
            </div>
          </motion.div>

          {/* Card 2 — Details panel */}
          <AnimatePresence>
            {selectedFood && (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0,  scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.97 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                style={CARD}
              >
                {/* Food header */}
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
                  <span style={{ fontSize: 40, lineHeight: 1 }}>{selectedFood.emoji}</span>
                  <div>
                    <p style={{ fontSize: 16, fontWeight: 900, color: "#1a1a1a" }}>{selectedFood.name}</p>
                    <p style={{ fontSize: 12, color: "#aaa" }}>{selectedFood.calories} سعرة لكل 100 غرام</p>
                  </div>
                </div>

                {/* Weight slider */}
                <div style={{ marginBottom: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#555" }}>الكمية</span>
                    <span style={{ fontSize: 13, fontWeight: 900, color: "#3D7A5E" }}>{weight} غرام</span>
                  </div>
                  <input
                    type="range" min={10} max={500} step={10}
                    value={weight}
                    onChange={e => setWeight(+e.target.value)}
                    style={{ width: "100%", accentColor: "#3D7A5E", cursor: "pointer" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                    <span style={{ fontSize: 10, color: "#ccc" }}>500غ</span>
                    <span style={{ fontSize: 10, color: "#ccc" }}>10غ</span>
                  </div>
                </div>

                {/* Nutrition preview */}
                {selectedNutrition && (
                  <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                    <NutritionPill label="سعرات"       value={selectedNutrition.calories} unit="kcal" color="#E07A5F" />
                    <NutritionPill label="بروتين"       value={selectedNutrition.protein}  unit="غ"    color="#3D7A5E" />
                    <NutritionPill label="كربوهيدرات"  value={selectedNutrition.carbs}    unit="غ"    color="#5B8CBF" />
                    <NutritionPill label="دهون"         value={selectedNutrition.fat}      unit="غ"    color="#E0A45F" />
                  </div>
                )}

                {/* Expert tip */}
                <div style={{
                  backgroundColor: "rgba(61,122,94,0.06)", borderRight: "3px solid #3D7A5E",
                  padding: "12px 16px", borderRadius: 12, marginBottom: 18,
                }}>
                  <p style={{ fontSize: 13, color: "#2D6A4F", lineHeight: 1.7, fontWeight: 600 }}>
                    💡 {selectedFood.tip}
                  </p>
                </div>

                {/* Add button */}
                <motion.button
                  whileHover={{ y: -2, boxShadow: "0 10px 24px rgba(45,106,79,0.30)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={addToPlate}
                  style={{
                    width: "100%", padding: "13px", borderRadius: 14, border: "none",
                    background: "linear-gradient(135deg, #2D6A4F, #40916C)",
                    color: "white", fontWeight: 800, fontSize: 15,
                    fontFamily: "inherit", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    boxShadow: "0 4px 16px rgba(45,106,79,0.28)",
                  }}
                >
                  <Plus size={18} />
                  إضافة إلى الوجبة
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Card 3 — Plate items */}
          <motion.div {...fadeIn(0.1)} style={CARD}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a", marginBottom: 16 }}>
              مكونات الوجبة
              {plate.length > 0 && (
                <span style={{ marginRight: 8, fontSize: 12, fontWeight: 700, color: "#3D7A5E", backgroundColor: "rgba(61,122,94,0.10)", padding: "2px 10px", borderRadius: 999 }}>
                  {plate.length} عناصر
                </span>
              )}
            </h2>

            {plate.length === 0 ? (
              <div style={{ textAlign: "center", padding: "28px 0", color: "#ccc" }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>🍽️</div>
                <p style={{ fontSize: 13, fontWeight: 600 }}>لم تضف أي طعام بعد</p>
                <p style={{ fontSize: 11, marginTop: 4 }}>اختر من القائمة أعلاه</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <AnimatePresence>
                  {plate.map(item => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0  }}
                      exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "12px 14px", borderRadius: 14,
                        backgroundColor: "rgba(248,245,240,0.9)",
                        border: "1.5px solid rgba(190,175,155,0.18)",
                      }}
                    >
                      <span style={{ fontSize: 24, flexShrink: 0 }}>{item.food.emoji}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 800, color: "#1a1a1a", marginBottom: 2 }}>{item.food.name}</p>
                        <p style={{ fontSize: 11, color: "#aaa" }}>
                          {item.weight}غ · {Math.round(item.food.calories * item.weight / 100)} سعرة
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => removeFromPlate(item.id)}
                        style={{
                          width: 30, height: 30, borderRadius: "50%", border: "none",
                          backgroundColor: "rgba(224,122,95,0.12)", cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Trash2 size={14} color="#E07A5F" />
                      </motion.button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>

        {/* ══ RIGHT COLUMN ══ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Card 4 — Total calories + donut */}
          <motion.div {...fadeIn(0.08)} style={CARD}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <Flame size={20} color="#E07A5F" />
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a" }}>إجمالي السعرات</h2>
              <span style={{ marginRight: "auto", fontSize: 22, fontWeight: 900, color: "#E07A5F" }}>
                {total.calories}
                <span style={{ fontSize: 13, color: "#aaa", fontWeight: 600 }}> / 2000</span>
              </span>
            </div>

            <div style={{ height: 240, position: "relative" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData.length > 0 ? pieData : [{ name: "فارغ", value: 2000, color: "#E8E0D5" }]}
                    cx="50%" cy="50%"
                    innerRadius={68} outerRadius={98}
                    startAngle={90} endAngle={-270}
                    dataKey="value"
                    label={false}
                    labelLine={false}
                  >
                    {(pieData.length > 0 ? pieData : [{ name: "فارغ", value: 2000, color: "#E8E0D5" }]).map((entry, i) => (
                      <Cell key={i} fill={entry.color} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: number) => [`${v} سعرة`, ""]}
                    contentStyle={{ borderRadius: 12, border: "1px solid rgba(190,175,155,0.3)", fontFamily: "'Cairo',sans-serif", fontSize: 13 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center overlay */}
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center", pointerEvents: "none",
              }}>
                <p style={{ fontSize: 24, fontWeight: 900, color: "#1a1a1a", lineHeight: 1 }}>{total.calories}</p>
                <p style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>سعرة</p>
              </div>
            </div>

            {/* Legend */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px", justifyContent: "center", marginTop: 4 }}>
              {[
                { label: "بروتين",      color: "#3D7A5E" },
                { label: "كربوهيدرات", color: "#5B8CBF" },
                { label: "دهون",        color: "#E07A5F" },
                { label: "متبقي",       color: "#E8E0D5" },
              ].map(({ label, color }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: color }} />
                  <span style={{ fontSize: 11, color: "#888", fontWeight: 600 }}>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Card 5 — Macros */}
          <motion.div {...fadeIn(0.12)} style={CARD}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a", marginBottom: 18 }}>الماكروز (جرام)</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {[
                { label: "البروتين",        value: total.protein, goal: 150, color: "#3D7A5E", unit: "غ" },
                { label: "الكربوهيدرات",   value: total.carbs,   goal: 250, color: "#5B8CBF", unit: "غ" },
                { label: "الدهون",          value: total.fat,     goal: 65,  color: "#E07A5F", unit: "غ" },
              ].map(({ label, value, goal, color, unit }) => (
                <div key={label}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#555" }}>{label}</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color }}>
                      {value.toFixed(1)}{unit}
                      <span style={{ fontSize: 11, color: "#bbb", fontWeight: 600 }}> / {goal}{unit}</span>
                    </span>
                  </div>
                  <Bar value={value} max={goal} color={color} />
                  <p style={{ fontSize: 10, color: "#bbb", marginTop: 4 }}>{Math.min(Math.round((value / goal) * 100), 100)}% من الهدف اليومي</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Card 6 — Vitamins & minerals */}
          <motion.div {...fadeIn(0.16)} style={CARD}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a", marginBottom: 18 }}>الفيتامينات والمعادن</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { label: "فيتامين C", value: total.vitC,    goal: 90,   unit: "مغ", Icon: Sun,      color: "#E07A5F" },
                { label: "فيتامين D", value: total.vitD,    goal: 20,   unit: "μg", Icon: Zap,      color: "#D4A017" },
                { label: "الحديد",    value: total.iron,    goal: 18,   unit: "مغ", Icon: Shield,   color: "#C0392B" },
                { label: "الكالسيوم", value: total.calcium, goal: 1000, unit: "مغ", Icon: Activity, color: "#5B8CBF" },
              ].map(({ label, value, goal, unit, Icon, color }) => (
                <div key={label}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 9, backgroundColor: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={14} color={color} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#555", flex: 1 }}>{label}</span>
                    <span style={{ fontSize: 12, fontWeight: 800, color }}>
                      {value.toFixed(1)}{unit}
                      <span style={{ fontSize: 10, color: "#bbb", fontWeight: 600 }}> / {goal}</span>
                    </span>
                  </div>
                  <Bar value={value} max={goal} color={color} />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Card 7: Smart tips — full width ── */}
      <motion.div {...fadeIn(0.2)} style={CARD}>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <Sparkles size={18} color="#3D7A5E" />
          نصائح الوجبة الذكية 🧠
        </h2>

        {plate.length === 0 ? (
          <div style={{ textAlign: "center", padding: "20px 0", color: "#bbb", fontSize: 13 }}>
            أضف أطعمة لرؤية نصائح مخصصة لوجبتك
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
            <AnimatePresence>
              {smartTips.map((tip, i) => (
                <motion.div
                  key={tip}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  style={{
                    display: "flex", gap: 12, alignItems: "flex-start",
                    padding: "14px 16px", borderRadius: 14,
                    backgroundColor: "rgba(61,122,94,0.06)",
                    border: "1px solid rgba(61,122,94,0.14)",
                  }}
                >
                  <Sparkles size={16} color="#3D7A5E" style={{ flexShrink: 0, marginTop: 2 }} />
                  <p style={{ fontSize: 13, color: "#2D6A4F", lineHeight: 1.7, fontWeight: 600 }}>{tip}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

    </div>
  );
}
