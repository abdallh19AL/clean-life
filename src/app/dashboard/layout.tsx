"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  Utensils,
  Dumbbell,
  CalendarDays,
  X,
  Menu,
  User,
} from "lucide-react";

const navLinks = [
  { href: "/dashboard",              label: "نظرة عامة",      icon: LayoutDashboard },
  { href: "/dashboard/progress",     label: "متابعة التقدم",  icon: TrendingUp      },
  { href: "/dashboard/diet",         label: "الخطة الغذائية", icon: Utensils        },
  { href: "/dashboard/training",     label: "جدول التدريب",   icon: Dumbbell        },
  { href: "/dashboard/appointments", label: "المواعيد",        icon: CalendarDays    },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div
      style={{
        minHeight: "100vh",
        fontFamily: "'Cairo','Segoe UI',sans-serif",
        backgroundImage: "url('/clinic-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundColor: "#F5F2ED",
      }}
    >

      {/* ── Mobile overlay ── */}
      {open && (
        <div
          className="fixed inset-0 bg-black/25 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── RTL flex: aside first → renders RIGHT; div second → renders LEFT ── */}
      <div
        className="flex"
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
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
            lg:sticky lg:top-0 lg:h-screen
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
              <span className="text-white text-xs font-black tracking-tight">CL</span>
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
          <header className="lg:hidden flex items-center justify-between px-4 py-3.5 bg-white/75 backdrop-blur-xl border-b border-white/60 sticky top-0 z-30 shadow-sm shadow-teal-900/5">
            {/* hamburger — first in DOM = RIGHT side in RTL */}
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
