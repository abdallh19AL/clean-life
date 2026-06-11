"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import SiteNavbar from "@/components/SiteNavbar";

/* ─── Types ─────────────────────────────────────────────────────────── */

type Product = {
  id:                string;
  name:              string;
  description:       string;
  price:             number;
  category:          string;
  image_url:         string;
  whatsapp_message:  string | null;
  created_at:        string;
};

/* ─── Category colour map ────────────────────────────────────────────── */

const CATEGORY_STYLE: Record<string, { bg: string; color: string; border: string }> = {
  "برامج تدريب":  { bg: "rgba(13,148,136,0.08)",  color: "#0D9488", border: "rgba(13,148,136,0.28)" },
  "أنظمة غذائية": { bg: "rgba(217,119,6,0.08)",   color: "#D97706", border: "rgba(217,119,6,0.28)"  },
  "كتب ومقالات":  { bg: "rgba(79,70,229,0.08)",   color: "#4F46E5", border: "rgba(79,70,229,0.28)"  },
  "أخرى":         { bg: "rgba(155,89,182,0.08)",  color: "#9B59B6", border: "rgba(155,89,182,0.28)" },
};
const DEFAULT_STYLE = { bg: "rgba(61,122,94,0.08)", color: "#3D7A5E", border: "rgba(61,122,94,0.28)" };

function styleFor(cat: string) {
  return CATEGORY_STYLE[cat] ?? DEFAULT_STYLE;
}

const WA_NUMBER = "96285229462";

/* ─── Skeleton card ─────────────────────────────────────────────────── */

function SkeletonCard() {
  return (
    <div style={{
      backgroundColor: "rgba(255,255,255,0.88)",
      border: "1.5px solid rgba(190,175,155,0.25)",
      borderRadius: 20, overflow: "hidden",
      boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
    }}>
      <div className="animate-pulse" style={{ height: 180, backgroundColor: "#EDE9E3" }} />
      <div style={{ padding: 20 }}>
        <div className="animate-pulse" style={{ height: 13, width: "38%", backgroundColor: "#EDE9E3", borderRadius: 8, marginBottom: 12 }} />
        <div className="animate-pulse" style={{ height: 20, width: "78%", backgroundColor: "#EDE9E3", borderRadius: 8, marginBottom: 10 }} />
        <div className="animate-pulse" style={{ height: 13, backgroundColor: "#EDE9E3", borderRadius: 8, marginBottom: 6 }} />
        <div className="animate-pulse" style={{ height: 13, width: "55%", backgroundColor: "#EDE9E3", borderRadius: 8, marginBottom: 22 }} />
        <div className="animate-pulse" style={{ height: 44, backgroundColor: "#EDE9E3", borderRadius: 12 }} />
      </div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────── */

export default function StorePage() {
  const [products,     setProducts]     = useState<Product[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [activeFilter, setActiveFilter] = useState("الكل");

  useEffect(() => {
    createClient()
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setProducts(data);
        setLoading(false);
      });
  }, []);

  const categories = ["الكل", ...Array.from(new Set(products.map(p => p.category)))];
  const filtered   = activeFilter === "الكل"
    ? products
    : products.filter(p => p.category === activeFilter);

  return (
    <div
      dir="rtl"
      className="pb-24"
      style={{ fontFamily: "'Cairo', sans-serif", backgroundColor: "#F8F5F0", minHeight: "100vh" }}
    >
      <SiteNavbar />

      {/* ── Header ── */}
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
          className="text-lg max-w-xl mx-auto mb-4"
          style={{ color: "#6B7280" }}
        >
          منتجات وخدمات اخترها فريقنا بعناية لمساعدتك في الوصول إلى أهدافك الصحية والرياضية
        </motion.p>

        {/* Count badge — hidden during load to avoid flash */}
        {!loading && (
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
            <span style={{ fontSize: 18, fontWeight: 900 }}>{filtered.length}</span>
            {activeFilter !== "الكل" ? `منتج في ${activeFilter}` : `منتج من أصل ${products.length}`}
          </motion.div>
        )}
      </section>

      {/* ── Filter tabs ── */}
      {!loading && products.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex flex-wrap justify-center gap-2.5 px-4 mb-10"
        >
          {categories.map(cat => {
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
      )}

      {/* ── Grid ── */}
      <div className="max-w-6xl mx-auto px-4">

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty state */}
        {!loading && products.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <p style={{ fontSize: 52, marginBottom: 16 }}>🛍️</p>
            <p style={{ fontSize: 20, fontWeight: 800, color: "#1A2E22", marginBottom: 8 }}>
              لا توجد منتجات حالياً
            </p>
            <p style={{ fontSize: 15, color: "#9CA3AF" }}>
              سيتم إضافة منتجات وخدمات قريباً — تابعونا!
            </p>
          </motion.div>
        )}

        {/* Product cards */}
        {!loading && products.length > 0 && (
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((item, i) => {
                const s = styleFor(item.category);
                const waHref = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
                  item.whatsapp_message ?? `أريد الاستفسار عن ${item.name}`
                )}`;

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.93 }}
                    transition={{ duration: 0.38, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col overflow-hidden"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.88)",
                      border:          `1.5px solid ${s.border}`,
                      borderRadius:    20,
                      boxShadow:       "0 2px 20px rgba(0,0,0,0.06)",
                    }}
                  >
                    {/* Image area */}
                    <div
                      className="relative flex-shrink-0 overflow-hidden"
                      style={{ height: 180, backgroundColor: s.bg }}
                    >
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ fontSize: 52, opacity: 0.25 }}
                        >
                          🏷️
                        </div>
                      )}

                      {/* Price badge */}
                      <div style={{
                        position: "absolute", top: 12, right: 12,
                        backgroundColor: "white",
                        border: `1.5px solid ${s.border}`,
                        borderRadius: 10, padding: "4px 12px",
                        fontSize: 13, fontWeight: 900, color: s.color,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      }}>
                        {item.price} دينار
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-5 gap-3">
                      {/* Category pill */}
                      <span
                        className="self-start text-xs font-bold px-3 py-1 rounded-full"
                        style={{ backgroundColor: s.bg, color: s.color, border: `1px solid ${s.border}` }}
                      >
                        {item.category}
                      </span>

                      {/* Title */}
                      <h3 className="text-lg font-black leading-snug" style={{ color: "#1A2E22" }}>
                        {item.name}
                      </h3>

                      {/* Description */}
                      <p
                        className="text-sm leading-relaxed line-clamp-3"
                        style={{ color: "#6B7280", flex: 1 }}
                      >
                        {item.description}
                      </p>

                      {/* CTA */}
                      <a
                        href={waHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-white transition-transform hover:scale-[1.02] active:scale-95"
                        style={{
                          background: `linear-gradient(135deg, ${s.color}, ${s.color}CC)`,
                          boxShadow:  `0 4px 14px ${s.color}38`,
                        }}
                      >
                        <MessageCircle size={15} />
                        احجز عبر واتساب
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
