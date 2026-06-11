"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Home as HomeIcon, ShoppingBag, Calculator } from "lucide-react";

const NAV_LINKS = [
  { href: "/",           label: "الرئيسية",      Icon: HomeIcon    },
  { href: "/store",      label: "المتجر",         Icon: ShoppingBag },
  { href: "/calculator", label: "حاسبة السعرات", Icon: Calculator  },
];

interface SiteNavbarProps {
  ctaLabel?: string;
  ctaHref?:  string;
}

export default function SiteNavbar({
  ctaLabel = "ابدأ الآن",
  ctaHref  = "/dashboard",
}: SiteNavbarProps) {
  const pathname = usePathname();
  const [user,    setUser]    = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, [pathname]);

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
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(61,122,94,0.08)";
              (e.currentTarget as HTMLAnchorElement).style.color = "#2D6A4F";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLAnchorElement).style.color = "#4A6B5C";
            }}
          >
            <Icon size={14} />
            {label}
          </Link>
        ))}
      </div>

      {/* Auth area */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        {loading ? (
          <div style={{
            width: "7.5rem", height: 36, borderRadius: 12,
            backgroundColor: "rgba(45,106,79,0.10)",
          }} />
        ) : user ? (
          <Link href="/dashboard" style={{
            padding: "8px 20px", borderRadius: 12,
            background: "linear-gradient(135deg, #2D6A4F, #40916C)",
            color: "white", fontSize: 13.5, fontWeight: 700,
            textDecoration: "none", boxShadow: "0 2px 10px rgba(45,106,79,0.25)",
          }}>لوحة التحكم</Link>
        ) : (
          <>
            <Link href="/login" style={{
              padding: "8px 20px", borderRadius: 12,
              color: "#2D6A4F", fontSize: 13.5, fontWeight: 700,
              textDecoration: "none", border: "1.5px solid rgba(45,106,79,0.35)",
            }}>تسجيل الدخول</Link>
            <Link href={ctaHref} style={{
              padding: "8px 20px", borderRadius: 12,
              background: "linear-gradient(135deg, #2D6A4F, #40916C)",
              color: "white", fontSize: 13.5, fontWeight: 700,
              textDecoration: "none", boxShadow: "0 2px 10px rgba(45,106,79,0.25)",
            }}>{ctaLabel}</Link>
          </>
        )}
      </div>
    </div>
  );
}
