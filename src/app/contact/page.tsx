"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home as HomeIcon, ShoppingBag, Calculator,
  MessageCircle, Mail, Clock, MapPin, CheckCircle, Send,
} from "lucide-react";
import SiteNavbar from "@/components/SiteNavbar";

/* ─── Contact info cards data ─────────────────────────────────────────── */

const contactCards = [
  {
    Icon: MessageCircle,
    label: "واتساب",
    value: "+962 85 229 462",
    color: "#25D366",
    bg: "rgba(37,211,102,0.08)",
    href: "https://wa.me/96285229462",
  },
  {
    Icon: Mail,
    label: "البريد الإلكتروني",
    value: "cleanlifetopjo@gmail.com",
    color: "#3D7A5E",
    bg: "rgba(61,122,94,0.08)",
    href: "mailto:cleanlifetopjo@gmail.com",
  },
  {
    Icon: Clock,
    label: "ساعات العمل",
    value: "السبت–الخميس، 9ص–6م",
    color: "#5B8CBF",
    bg: "rgba(91,140,191,0.08)",
    href: null,
  },
  {
    Icon: MapPin,
    label: "الموقع",
    value: "عمّان، الأردن",
    color: "#9B59B6",
    bg: "rgba(155,89,182,0.08)",
    href: null,
  },
];

const INQUIRY_TYPES = ["استشارة", "شكوى", "اقتراح", "أخرى"];

/* ─── Controlled input ────────────────────────────────────────────────── */

function Field({
  label, type = "text", as, placeholder, value, onChange, options,
}: {
  label: string;
  type?: string;
  as?: "textarea" | "select";
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  options?: string[];
}) {
  const [focused, setFocused] = useState(false);

  const sharedStyle: React.CSSProperties = {
    width: "100%", boxSizing: "border-box",
    padding: "12px 14px", borderRadius: 12,
    border: `1.5px solid ${focused ? "#3D7A5E" : "rgba(190,175,155,0.35)"}`,
    backgroundColor: focused ? "#FAFAF8" : "#FCFAF6",
    fontSize: 16, fontFamily: "inherit", color: "#1a2e22",
    outline: "none", direction: "rtl",
    transition: "border-color 0.2s, background 0.2s",
    boxShadow: focused ? "0 0 0 3px rgba(61,122,94,0.08)" : "none",
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#3D5A4A", marginBottom: 6 }}>
        {label}
      </label>
      {as === "textarea" ? (
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={5}
          style={{ ...sharedStyle, resize: "vertical" }}
        />
      ) : as === "select" ? (
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ ...sharedStyle, cursor: "pointer" }}
        >
          <option value="">اختر نوع الاستفسار</option>
          {options?.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={sharedStyle}
        />
      )}
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default function ContactPage() {
  const [name,      setName]      = useState("");
  const [email,     setEmail]     = useState("");
  const [phone,     setPhone]     = useState("");
  const [inquiry,   setInquiry]   = useState("");
  const [message,   setMessage]   = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !message) return;
    setLoading(true);

    const subject = encodeURIComponent(`استفسار من ${name} - ${inquiry || "عام"}`);
    const body = encodeURIComponent(
      `الاسم: ${name}\n` +
      `البريد الإلكتروني: ${email}\n` +
      `رقم الهاتف: ${phone || "غير محدد"}\n` +
      `نوع الاستفسار: ${inquiry || "غير محدد"}\n\n` +
      `الرسالة:\n${message}`
    );
    window.location.href = `mailto:cleanlifetopjo@gmail.com?subject=${subject}&body=${body}`;

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  }

  const CARD: React.CSSProperties = {
    backgroundColor: "rgba(255,255,255,0.88)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "1px solid rgba(190,175,155,0.22)",
    borderRadius: 20,
    padding: 28,
    boxShadow: "0 2px 16px rgba(80,60,30,0.07)",
  };

  return (
    <div dir="rtl" style={{ minHeight: "100vh", backgroundColor: "#F8F5F0", fontFamily: "'Cairo','Segoe UI',sans-serif" }}>
      <SiteNavbar />

      {/* ── Header ── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ textAlign: "center", padding: "56px 24px 40px" }}
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
          ✦ نحن هنا لمساعدتك
        </motion.div>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 46px)", fontWeight: 900, color: "#1a2e22", marginBottom: 14, lineHeight: 1.2 }}>
          تواصل معنا
        </h1>
        <p style={{ fontSize: 16, color: "#6B7280", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
          نحن هنا لمساعدتك في كل خطوة — أرسل رسالتك وسنرد خلال 24 ساعة
        </p>
      </motion.section>

      {/* ── Two-column layout ── */}
      <div
        className="grid grid-cols-1 lg:grid-cols-5 gap-8"
        style={{ maxWidth: 1060, margin: "0 auto", padding: "0 24px 80px" }}
      >

        {/* ══ LEFT: Form (60%) ══ */}
        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.15 }}
          style={CARD}
        >
          <h2 style={{ fontSize: 18, fontWeight: 900, color: "#1a2e22", marginBottom: 24 }}>
            أرسل رسالتك 📩
          </h2>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  textAlign: "center", padding: "48px 24px",
                  backgroundColor: "rgba(61,122,94,0.06)",
                  borderRadius: 16,
                  border: "1.5px solid rgba(61,122,94,0.15)",
                }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 14 }}
                  style={{ marginBottom: 16 }}
                >
                  <CheckCircle size={56} color="#3D7A5E" style={{ margin: "0 auto" }} />
                </motion.div>
                <p style={{ fontSize: 20, fontWeight: 900, color: "#1a2e22", marginBottom: 10 }}>
                  تم إرسال رسالتك بنجاح! 🎉
                </p>
                <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7 }}>
                  سنتواصل معك خلال 24 ساعة على بريدك الإلكتروني أو رقم الهاتف.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setName(""); setEmail(""); setPhone(""); setInquiry(""); setMessage(""); }}
                  style={{
                    marginTop: 24, padding: "10px 28px", borderRadius: 12,
                    background: "linear-gradient(135deg, #2D6A4F, #40916C)",
                    color: "white", fontWeight: 700, fontSize: 14,
                    border: "none", cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  إرسال رسالة جديدة
                </button>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleSubmit} initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Field label="الاسم الكامل"         placeholder="أدخل اسمك الكامل"           value={name}    onChange={setName}    />
                <Field label="البريد الإلكتروني"    type="email" placeholder="example@email.com" value={email}   onChange={setEmail}   />
                <Field label="رقم الهاتف"           type="tel"   placeholder="+962 79 000 0000"  value={phone}   onChange={setPhone}   />
                <Field label="نوع الاستفسار"        as="select"  options={INQUIRY_TYPES}          value={inquiry} onChange={setInquiry} />
                <Field label="الرسالة"              as="textarea" placeholder="اكتب رسالتك هنا..." value={message} onChange={setMessage} />

                <motion.button
                  type="submit"
                  disabled={loading || !name || !email || !message}
                  whileHover={!loading && name && email && message ? { y: -2, boxShadow: "0 10px 28px rgba(45,106,79,0.28)" } : {}}
                  whileTap={!loading && name && email && message ? { scale: 0.97 } : {}}
                  style={{
                    width: "100%", padding: "14px",
                    borderRadius: 14, border: "none",
                    background: loading || !name || !email || !message
                      ? "rgba(190,175,155,0.25)"
                      : "linear-gradient(135deg, #2D6A4F, #40916C)",
                    color: loading || !name || !email || !message ? "#aaa" : "white",
                    fontWeight: 800, fontSize: 15, fontFamily: "inherit",
                    cursor: loading || !name || !email || !message ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                    boxShadow: loading || !name || !email || !message ? "none" : "0 4px 16px rgba(45,106,79,0.25)",
                    transition: "background 0.2s",
                  }}
                >
                  {loading ? (
                    <span style={{ opacity: 0.7 }}>جاري الإرسال...</span>
                  ) : (
                    <><Send size={16} /> إرسال الرسالة</>
                  )}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ══ RIGHT: Info cards (40%) ══ */}
        <div className="lg:col-span-2" style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {contactCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.2 + i * 0.08 }}
            >
              {card.href ? (
                <a href={card.href} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                  <ContactCard card={card} />
                </a>
              ) : (
                <ContactCard card={card} />
              )}
            </motion.div>
          ))}

        </div>
      </div>
    </div>
  );
}

/* ─── Contact card subcomponent ───────────────────────────────────────── */

function ContactCard({ card }: { card: typeof contactCards[0] }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 14,
      padding: "16px 18px",
      backgroundColor: "rgba(255,255,255,0.88)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      border: "1px solid rgba(190,175,155,0.22)",
      borderRadius: 16,
      boxShadow: "0 2px 10px rgba(80,60,30,0.05)",
      transition: "box-shadow 0.2s",
    }}
      onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 20px rgba(80,60,30,0.10)")}
      onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 10px rgba(80,60,30,0.05)")}
    >
      <div style={{
        width: 42, height: 42, borderRadius: 12, flexShrink: 0,
        backgroundColor: card.bg,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <card.Icon size={20} color={card.color} />
      </div>
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#aaa", marginBottom: 3 }}>{card.label}</p>
        <p style={{ fontSize: 14, fontWeight: 800, color: "#1a2e22" }}>{card.value}</p>
      </div>
    </div>
  );
}
