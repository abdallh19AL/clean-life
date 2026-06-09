"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import {
  LayoutDashboard, TrendingUp, Utensils, Dumbbell, CalendarDays,
  X, Menu, User, Home, ShoppingBag, Calculator,
  ChevronDown, Settings, LogOut,
} from "lucide-react";

/* ─── Sidebar nav links ──────────────────────────────────────────────────── */
const navLinks = [
  { href: "/dashboard",              label: "نظرة عامة",      icon: LayoutDashboard },
  { href: "/dashboard/progress",     label: "متابعة التقدم",  icon: TrendingUp      },
  { href: "/dashboard/nutrition",    label: "الخطة الغذائية", icon: Utensils        },
  { href: "/dashboard/workout",      label: "جدول التدريب",   icon: Dumbbell        },
  { href: "/dashboard/appointments", label: "المواعيد",        icon: CalendarDays    },
  { href: "/dashboard/calculator",   label: "حاسبة التغذية",  icon: Calculator      },
];

/* ─── Top nav links ──────────────────────────────────────────────────────── */
const topLinks = [
  { href: "/",           label: "الرئيسية",      icon: Home        },
  { href: "/store",      label: "المتجر",         icon: ShoppingBag },
  { href: "/calculator", label: "حاسبة السعرات", icon: Calculator  },
];

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function TopNavLink({ href, label, Icon }: { href: string; label: string; Icon: React.ElementType }) {
  return (
    <Link
      href={href}
      style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "6px 12px", borderRadius: 10,
        color: "#4A6B5C", fontSize: 13.5, fontWeight: 600,
        textDecoration: "none", transition: "background 0.15s, color 0.15s",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.backgroundColor = "rgba(61,122,94,0.08)";
        el.style.color = "#2D6A4F";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.backgroundColor = "transparent";
        el.style.color = "#4A6B5C";
      }}
    >
      <Icon size={14} />
      {label}
    </Link>
  );
}

function DropdownItem({
  icon: Icon, label, href, color = "#333", onClick,
}: {
  icon: React.ElementType; label: string; href?: string;
  color?: string; onClick?: () => void;
}) {
  const shared: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: 8,
    padding: "8px 12px", borderRadius: 8, cursor: "pointer",
    fontSize: 13, fontWeight: 600, color,
    textDecoration: "none", width: "100%", boxSizing: "border-box",
    background: "transparent", border: "none", fontFamily: "inherit",
    textAlign: "right", transition: "background 0.15s",
  };

  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick}
        style={shared}
        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "#F5F2ED")}
        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}
      >
        <Icon size={15} color={color === "#333" ? "#666" : color} />
        {label}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      style={shared}
      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = color === "#E07A5F" ? "#FFF5F3" : "#F5F2ED")}
      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}
    >
      <Icon size={15} color={color === "#333" ? "#666" : color} />
      {label}
    </button>
  );
}

/* ─── Top Navbar ─────────────────────────────────────────────────────────── */
function TopNavbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

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
        boxShadow: "0 1px 16px rgba(60,50,30,0.06)",
        padding: "0 28px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        fontFamily: "'Cairo','Segoe UI',sans-serif",
      }}
    >
      {/* RIGHT: Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
          <p style={{ fontSize: 14, fontWeight: 900, color: "#1a2e22", lineHeight: 1.2 }}>Clean Life</p>
          <p style={{ fontSize: 10, fontWeight: 600, color: "#6B9E80" }}>عيادة الصحة</p>
        </div>
      </div>

      {/* CENTER: Nav links */}
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {topLinks.map(({ href, label, icon: Icon }) => (
          <TopNavLink key={href} href={href} label={label} Icon={Icon} />
        ))}
      </div>

      {/* LEFT: Profile dropdown */}
      <div ref={dropdownRef} style={{ position: "relative" }}>
        {/* Trigger button */}
        <button
          onClick={() => setIsOpen(v => !v)}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "5px 10px 5px 12px", borderRadius: 12,
            background: "transparent",
            border: "1.5px solid rgba(190,175,155,0.28)",
            cursor: "pointer", fontFamily: "inherit",
            transition: "background 0.15s",
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(61,122,94,0.06)")}
          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = "transparent")}
        >
          {/* Avatar */}
          <div style={{
            width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(135deg, #2D6A4F, #52B788)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 800, color: "white",
          }}>
            AK
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#2D6A4F" }}>أحمد</span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            style={{ display: "flex" }}
          >
            <ChevronDown size={14} color="#888" />
          </motion.div>
        </button>

        {/* Dropdown menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              style={{
                position: "absolute", left: 0, top: "calc(100% + 8px)",
                width: 200,
                backgroundColor: "white",
                border: "1.5px solid rgba(190,175,155,0.22)",
                borderRadius: 14, padding: 8,
                boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
                zIndex: 200,
              }}
            >
              {/* User info header */}
              <div style={{ padding: "8px 12px 10px" }}>
                <p style={{ fontSize: 13, fontWeight: 800, color: "#1a1a1a", marginBottom: 2 }}>أحمد خليل</p>
                <p style={{ fontSize: 11, color: "#bbb" }}>ahmad@example.com</p>
              </div>

              <div style={{ height: 1, background: "rgba(190,175,155,0.20)", margin: "4px 0 6px" }} />

              <DropdownItem icon={User}     label="الملف الشخصي" href="/dashboard"  onClick={() => setIsOpen(false)} />
              <DropdownItem icon={Settings} label="الإعدادات"     href="/dashboard"  onClick={() => setIsOpen(false)} />

              <div style={{ height: 1, background: "rgba(190,175,155,0.20)", margin: "6px 0" }} />

              <DropdownItem
                icon={LogOut} label="تسجيل الخروج" color="#E07A5F"
                onClick={async () => { setIsOpen(false); await handleLogout(); }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── Layout ─────────────────────────────────────────────────────────────── */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex", flexDirection: "column",
        fontFamily: "'Cairo','Segoe UI',sans-serif",
        backgroundImage: "url('/clinic-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundColor: "#F5F2ED",
      }}
    >
      {/* ── Top navbar (sticky, above everything) ── */}
      <TopNavbar />

      {/* ── Mobile overlay ── */}
      {open && (
        <div
          className="fixed inset-0 bg-black/25 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Sidebar + page area row ── */}
      <div
        className="flex"
        style={{
          flex: 1,
          position: "relative",
          zIndex: 1,
          backgroundColor: "rgba(245,242,237,0.72)",
        }}
      >
        {/* ── Sidebar ── */}
        <aside
          className={`
            fixed top-0 right-0 h-full w-72
            bg-white/85 backdrop-blur-2xl
            border-l border-white/70 shadow-2xl shadow-teal-900/5
            flex flex-col z-50
            transition-transform duration-300 ease-in-out
            ${open ? "translate-x-0" : "translate-x-full"}
            lg:sticky lg:top-[60px] lg:h-[calc(100vh-60px)]
            lg:translate-x-0 lg:shadow-none lg:flex-shrink-0
          `}
        >
          {/* Mobile: title row */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100/80 lg:hidden">
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-xl bg-gray-100/70 text-gray-400 hover:bg-gray-200/80 hover:text-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="text-teal-700 font-black text-xl">لوحة التحكم</span>
          </div>

          {/* Desktop: brand */}
          <div className="hidden lg:flex items-center gap-3 px-6 py-6 border-b border-gray-100/80">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-600 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-teal-600/30">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
              </svg>
            </div>
            <div>
              <p className="text-gray-900 font-black text-sm leading-tight">Clean Life</p>
              <p className="text-teal-500 text-[10px] font-semibold mt-0.5">لوحة التحكم</p>
            </div>
          </div>

          {/* Section label */}
          <div className="px-6 pt-5 pb-2">
            <span className="text-gray-400 text-[10px] font-bold tracking-[0.15em] uppercase">
              القائمة الرئيسية
            </span>
          </div>

          {/* Nav links */}
          <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold
                    transition-all duration-200 group
                    ${active
                      ? "bg-teal-500/10 text-teal-700 ring-1 ring-teal-200/60"
                      : "text-gray-500 hover:bg-white/70 hover:text-gray-900"
                    }
                  `}
                >
                  <Icon
                    className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${
                      active ? "text-teal-600" : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  />
                  <span className="flex-1">{label}</span>
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User card */}
          <div className="px-3 py-4 border-t border-gray-100/80">
            <div className="flex items-center gap-3 bg-gradient-to-l from-teal-50/90 to-cyan-50/90 hover:from-teal-100/90 hover:to-cyan-100/90 rounded-2xl px-4 py-3.5 cursor-pointer transition-all duration-200 ring-1 ring-teal-100/60">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-sm shadow-teal-400/40">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-gray-900 text-sm font-bold truncate">أحمد</p>
                <p className="text-teal-500 text-xs font-semibold truncate">عضو مميز</p>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Page area ── */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Mobile frosted header */}
          <header className="lg:hidden flex items-center justify-between px-4 py-3.5 bg-white/75 backdrop-blur-xl border-b border-white/60 sticky top-[60px] z-30 shadow-sm shadow-teal-900/5">
            <button
              onClick={() => setOpen(true)}
              className="p-2 rounded-xl bg-white/60 border border-gray-200/60 text-gray-500 hover:text-teal-700 hover:border-teal-200 hover:bg-white/80 transition-all active:scale-95"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-teal-700 font-black text-lg">لوحة التحكم</span>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-sm shadow-teal-400/40">
              <User className="w-4 h-4 text-white" />
            </div>
          </header>

          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}
