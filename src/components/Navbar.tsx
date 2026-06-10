"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { LayoutDashboard, LogIn, Menu, X, Leaf } from "lucide-react";

export default function Navbar() {
  const supabase = createClient();
  const pathname  = usePathname();
  const [user,    setUser]   = useState<any>(null);
  const [isOpen,  setIsOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const navLinks = [
    { href: "/",            label: "الرئيسية"        },
    { href: "/calculator",  label: "الحاسبة الذكية"  },
    { href: "/store",       label: "المتجر والحلول"   },
  ];

  return (
    <nav
      dir="rtl"
      className="sticky top-0 z-50"
      style={{
        backgroundColor:      "rgba(252,250,246,0.85)",
        backdropFilter:       "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderBottom:         "1px solid rgba(190,175,155,0.20)",
        boxShadow:            "0 1px 16px rgba(45,106,79,0.06)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between" style={{ height: 72 }}>

          {/* ── Logo (right in RTL) ──────────────────────────────── */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #2D6A4F 0%, #52B788 100%)",
                boxShadow:  "0 2px 10px rgba(45,106,79,0.28)",
              }}
            >
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span
              className="text-xl font-black tracking-tight"
              style={{ color: "#1A2E22" }}
            >
              Clean Life
            </span>
          </Link>

          {/* ── Nav links — centered (desktop) ───────────────────── */}
          <div className="hidden md:flex items-center gap-9">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);
              return (
                <Link key={link.href} href={link.href} className="relative py-2 group">
                  <span
                    className="text-sm font-semibold transition-colors duration-200"
                    style={{ color: isActive ? "#2D6A4F" : "#4A6B5C" }}
                  >
                    {link.label}
                  </span>
                  {isActive ? (
                    <motion.div
                      layoutId="activeNavTab"
                      className="absolute -bottom-px left-0 right-0 h-[2px] rounded-full"
                      style={{ backgroundColor: "#2D6A4F" }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  ) : (
                    <span
                      className="absolute -bottom-px left-0 right-0 h-[2px] rounded-full origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-200"
                      style={{ backgroundColor: "#52B788" }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ── Action button + mobile toggle (left in RTL) ──────── */}
          <div className="flex items-center gap-3">
            {/* Desktop button */}
            <div className="hidden md:block">
              <AuthButton user={user} />
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsOpen((v) => !v)}
              className="md:hidden p-2 rounded-xl transition-all active:scale-95"
              style={{ backgroundColor: "rgba(45,106,79,0.08)" }}
              aria-label="القائمة"
            >
              {isOpen
                ? <X    className="w-5 h-5" style={{ color: "#2D6A4F" }} />
                : <Menu className="w-5 h-5" style={{ color: "#2D6A4F" }} />}
            </button>
          </div>

        </div>
      </div>

      {/* ── Mobile drawer ─────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={  { opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden"
            style={{
              borderTop:       "1px solid rgba(190,175,155,0.22)",
              backgroundColor: "rgba(252,250,246,0.97)",
            }}
          >
            <div className="px-4 py-5 flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-3 rounded-xl text-sm font-semibold transition-colors duration-150"
                    style={{
                      backgroundColor: isActive ? "rgba(45,106,79,0.09)" : "transparent",
                      color:           isActive ? "#2D6A4F" : "#4A6B5C",
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <div className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(190,175,155,0.25)" }}>
                <AuthButton user={user} onClick={() => setIsOpen(false)} fullWidth />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  Auth button (shared desktop / mobile)                              */
/* ------------------------------------------------------------------ */

function AuthButton({
  user,
  onClick,
  fullWidth = false,
}: {
  user: any;
  onClick?: () => void;
  fullWidth?: boolean;
}) {
  const base: React.CSSProperties = {
    backgroundColor: "#2D6A4F",
    color:           "white",
    borderRadius:    "0.75rem",
    fontWeight:      700,
    fontSize:        "0.875rem",
    transition:      "background-color 0.18s ease",
    display:         "flex",
    alignItems:      "center",
    justifyContent:  "center",
    gap:             "0.4rem",
    padding:         fullWidth ? "0.75rem 1rem" : "0.6rem 1.25rem",
    width:           fullWidth ? "100%" : undefined,
  };

  const handleHover = (e: React.MouseEvent<HTMLAnchorElement>, enter: boolean) => {
    e.currentTarget.style.backgroundColor = enter ? "#1B4332" : "#2D6A4F";
  };

  if (user) {
    return (
      <Link
        href="/dashboard"
        onClick={onClick}
        style={base}
        onMouseEnter={(e) => handleHover(e, true)}
        onMouseLeave={(e) => handleHover(e, false)}
      >
        <LayoutDashboard className="w-4 h-4" />
        لوحة التحكم
      </Link>
    );
  }

  return (
    <Link
      href="/login"
      onClick={onClick}
      style={base}
      onMouseEnter={(e) => handleHover(e, true)}
      onMouseLeave={(e) => handleHover(e, false)}
    >
      <LogIn className="w-4 h-4" />
      تسجيل الدخول
    </Link>
  );
}
