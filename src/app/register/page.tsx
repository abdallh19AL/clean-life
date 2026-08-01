"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

/* ─── Controlled input with teal focus ring ────────────────────────── */
function FormInput({
  type, placeholder, value, onChange,
}: {
  type:        "text" | "email" | "password";
  placeholder: string;
  value:       string;
  onChange:    (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={()  => setFocused(false)}
      style={{
        width:           "100%",
        padding:         "12px 16px",
        borderRadius:    12,
        border:          `1.5px solid ${focused ? "#3D7A5E" : "rgba(190,175,155,0.4)"}`,
        backgroundColor: focused ? "#FAFAF8" : "#FCFAF6",
        fontSize:        "1rem",
        fontFamily:      "inherit",
        color:           "#1A2E22",
        outline:         "none",
        transition:      "border-color 0.2s, background-color 0.2s",
        boxSizing:       "border-box",
        boxShadow:       focused ? "0 0 0 3px rgba(61,122,94,0.10)" : "none",
      }}
    />
  );
}

/* ─── Page ──────────────────────────────────────────────────────────── */
export default function RegisterPage() {
  const [fullName,   setFullName]   = useState("");
  const [email,      setEmail]      = useState("");
  const [password,   setPassword]   = useState("");
  const [isPending,  setIsPending]  = useState(false);
  const [error,      setError]      = useState("");
  const [success,    setSuccess]    = useState(false);

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setError("");
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });
    if (authError) {
      setError("تعذر إنشاء الحساب، تأكد من صحة البيانات");
      setIsPending(false);
    } else {
      setSuccess(true);
      setIsPending(false);
    }
  };

  return (
    <div
      dir="rtl"
      style={{
        minHeight:       "100vh",
        backgroundColor: "#F8F5F0",
        backgroundImage: "radial-gradient(ellipse 90% 55% at 50% -5%, rgba(13,148,136,0.10) 0%, transparent 68%)",
        display:         "flex",
        alignItems:      "center",
        justifyContent:  "center",
        padding:         16,
        fontFamily:      "'Cairo', sans-serif",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width:           "100%",
          maxWidth:        440,
          backgroundColor: "white",
          borderRadius:    24,
          padding:         40,
          boxShadow:       "0 20px 60px rgba(30,40,30,0.12)",
        }}
      >

        {/* ── Logo ──────────────────────────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            {/* Teal "CL" badge */}
            <div
              style={{
                width:        44,
                height:       44,
                borderRadius: 12,
                background:   "linear-gradient(135deg, #2D6A4F 0%, #52B788 100%)",
                display:      "flex",
                alignItems:   "center",
                justifyContent: "center",
                boxShadow:    "0 3px 14px rgba(45,106,79,0.30)",
                flexShrink:   0,
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
              </svg>
            </div>

            {/* Text */}
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "1.15rem", fontWeight: 900, color: "#1A2E22", lineHeight: 1.15 }}>
                Clean Life
              </div>
              <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "#6B7280", marginTop: 1 }}>
                عيادة الصحة والرياضة
              </div>
            </div>
          </div>
        </div>

        {/* ── Divider ───────────────────────────────────────────── */}
        <hr style={{ border: "none", borderTop: "1px solid rgba(190,175,155,0.28)", marginBottom: 28 }} />

        {/* ── Title + subtitle ──────────────────────────────────── */}
        <div style={{ marginBottom: 26 }}>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 900, color: "#1A2E22", marginBottom: 7, lineHeight: 1.2 }}>
            إنشاء حساب جديد
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#6B7280", lineHeight: 1.65 }}>
            انضم إلى عيادة Clean Life وابدأ خطتك الصحية اليوم.
          </p>
        </div>

        {success ? (
          <div style={{
            padding:         "16px 18px",
            borderRadius:    12,
            backgroundColor: "#F0FDF4",
            border:          "1px solid #BBF7D0",
            fontSize:        "0.88rem",
            fontWeight:      600,
            color:           "#166534",
            textAlign:       "center",
            lineHeight:      1.7,
          }}>
            ✓ تم إنشاء الحساب بنجاح، تحقق من بريدك الإلكتروني لتفعيل الحساب.
          </div>
        ) : (
          <>
            {/* ── Form ──────────────────────────────────────────── */}
            <form onSubmit={handleEmailRegister} style={{ display: "flex", flexDirection: "column", gap: 18 }}>

              {/* Full name */}
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#3D5A4A" }}>
                  الاسم الكامل
                </label>
                <FormInput
                  type="text"
                  placeholder="الاسم الكامل"
                  value={fullName}
                  onChange={setFullName}
                />
              </div>

              {/* Email */}
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#3D5A4A" }}>
                  البريد الإلكتروني
                </label>
                <FormInput
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={setEmail}
                />
              </div>

              {/* Password */}
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#3D5A4A" }}>
                  كلمة المرور
                </label>
                <FormInput
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={setPassword}
                />
              </div>

              {/* Error message */}
              {error && (
                <div style={{
                  padding:         "10px 14px",
                  borderRadius:    10,
                  backgroundColor: "#FEF2F2",
                  border:          "1px solid #FECACA",
                  fontSize:        "0.84rem",
                  fontWeight:      600,
                  color:           "#DC2626",
                  textAlign:       "center",
                }}>
                  ⚠ {error}
                </div>
              )}

              {/* Primary button */}
              <button
                type="submit"
                disabled={isPending}
                style={{
                  width:           "100%",
                  height:          48,
                  borderRadius:    13,
                  border:          "none",
                  background:      "linear-gradient(135deg, #2D6A4F 0%, #3D9970 100%)",
                  color:           "white",
                  fontSize:        "0.95rem",
                  fontWeight:      800,
                  fontFamily:      "inherit",
                  cursor:          isPending ? "not-allowed" : "pointer",
                  opacity:         isPending ? 0.72 : 1,
                  boxShadow:       "0 5px 20px rgba(45,106,79,0.28)",
                  transition:      "transform 0.15s, box-shadow 0.15s, opacity 0.15s",
                  marginTop:       4,
                }}
                onMouseEnter={(e) => { if (!isPending) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(45,106,79,0.34)"; }}}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 5px 20px rgba(45,106,79,0.28)"; }}
                onMouseDown={(e)  => { if (!isPending) e.currentTarget.style.transform = "translateY(1px)"; }}
              >
                {isPending ? "جاري الإنشاء..." : "إنشاء حساب"}
              </button>
            </form>
          </>
        )}

        {/* ── Footer ────────────────────────────────────────────── */}
        <p style={{ textAlign: "center", fontSize: "0.845rem", color: "#6B7280", marginTop: 26, fontWeight: 500 }}>
          لديك حساب بالفعل؟{" "}
          <Link
            href="/login"
            style={{ color: "#0D9488", fontWeight: 700, textDecoration: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
          >
            تسجيل الدخول
          </Link>
        </p>

      </motion.div>
    </div>
  );
}
