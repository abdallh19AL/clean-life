"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

/* ─── Inline Google G icon ─────────────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908C16.658 14.252 17.64 11.944 17.64 9.2Z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
        fill="#EA4335"
      />
    </svg>
  );
}

/* ─── Controlled input with teal focus ring ────────────────────────── */
function FormInput({
  type, placeholder, value, onChange,
}: {
  type:        "email" | "password";
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
        fontSize:        "0.95rem",
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
export default function LoginPage() {
  const router = useRouter();
  const [email,      setEmail]      = useState("");
  const [password,   setPassword]   = useState("");
  const [isPending,  setIsPending]  = useState(false);
  const [error,      setError]      = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setError("");
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      setIsPending(false);
    } else {
      localStorage.removeItem('supabase.auth.token');
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sb-')) localStorage.removeItem(key);
      });
      router.refresh();
      router.push("/dashboard");
    }
  };

  const handleGoogleLogin = async () => {
    setIsPending(true);
    setError("");
    const supabase = createClient();
    // ?next=/dashboard tells the callback route where to land after code exchange.
    // Also add http://localhost:3000/auth/callback to Supabase → Auth → Redirect URLs.
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });
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
            تسجيل الدخول
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#6B7280", lineHeight: 1.65 }}>
            أهلاً بك في عيادة Clean Life، أدخل بياناتك لمتابعة خطتك الصحية.
          </p>
        </div>

        {/* ── Form ──────────────────────────────────────────────── */}
        <form onSubmit={handleEmailLogin} style={{ display: "flex", flexDirection: "column", gap: 18 }}>

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
            {/* Label row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#3D5A4A" }}>
                كلمة المرور
              </label>
              <a
                href="#"
                style={{
                  fontSize:        "0.78rem",
                  fontWeight:      600,
                  color:           "#0D9488",
                  textDecoration:  "none",
                  transition:      "color 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#0F766E")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#0D9488")}
              >
                نسيت كلمة المرور؟
              </a>
            </div>
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
            {isPending ? "جاري التحقق..." : "تسجيل الدخول"}
          </button>
        </form>

        {/* ── OR separator ──────────────────────────────────────── */}
        <div
          style={{
            display:    "flex",
            alignItems: "center",
            gap:        12,
            margin:     "22px 0",
          }}
        >
          <hr style={{ flex: 1, border: "none", borderTop: "1px solid rgba(190,175,155,0.32)" }} />
          <span style={{ fontSize: "0.78rem", color: "#9CA3AF", fontWeight: 600 }}>أو</span>
          <hr style={{ flex: 1, border: "none", borderTop: "1px solid rgba(190,175,155,0.32)" }} />
        </div>

        {/* ── Google button ─────────────────────────────────────── */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isPending}
          style={{
            width:           "100%",
            height:          48,
            borderRadius:    13,
            border:          "1px solid rgba(190,175,155,0.4)",
            backgroundColor: "white",
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "center",
            gap:             10,
            fontSize:        "0.9rem",
            fontWeight:      700,
            fontFamily:      "inherit",
            color:           "#374151",
            cursor:          "pointer",
            transition:      "background-color 0.15s, border-color 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#FAFAF8";
            e.currentTarget.style.borderColor     = "rgba(190,175,155,0.65)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "white";
            e.currentTarget.style.borderColor     = "rgba(190,175,155,0.4)";
          }}
        >
          <GoogleIcon />
          تسجيل الدخول بواسطة Google
        </button>

        {/* ── Footer ────────────────────────────────────────────── */}
        <p style={{ textAlign: "center", fontSize: "0.845rem", color: "#6B7280", marginTop: 26, fontWeight: 500 }}>
          ليس لديك حساب؟{" "}
          <Link
            href="/register"
            style={{ color: "#0D9488", fontWeight: 700, textDecoration: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
          >
            إنشاء حساب جديد
          </Link>
        </p>

      </motion.div>
    </div>
  );
}
