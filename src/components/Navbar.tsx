"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion"; // 👈 ضفنا AnimatePresence
import { supabase } from "@/utils/supabase";
import { LayoutDashboard, LogIn, Menu, X } from "lucide-react"; // 👈 ضفنا أيقونات القائمة

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false); // 👈 حالة فتح وإغلاق القائمة

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const navLinks = [
    { href: "/", label: "الرئيسية" },
    { href: "/articles", label: "المقالات والوعي" },
    { href: "/store", label: "المتجر والحلول" }
  ];

  return (
    <nav className="bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-100 dark:border-slate-800 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* اللوجو */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link href="/" className="text-2xl font-black text-gray-950 dark:text-white group flex items-center gap-2">
              <span className="text-3xl">🌱</span>
              <span>حياة <span className="text-sky-500">أنظف</span></span>
            </Link>
          </div>

          {/* روابط الشاشات الكبيرة */}
          <div className="hidden md:flex gap-8 items-center">
            {navLinks.map((link, index) => {
              const isActive = link.href === "/" 
                ? pathname === "/" 
                : pathname?.startsWith(link.href);

              return (
                <Link key={index} href={link.href} className="relative group py-2">
                  <span className={`text-base transition-all duration-300 ${
                    isActive ? 'text-sky-500 font-black' : 'text-gray-700 dark:text-gray-300 hover:text-sky-500 font-bold'
                  }`}>
                    {link.label}
                  </span>
                  {isActive && (
                    <motion.div layoutId="activeTab" className="absolute -bottom-1 left-0 right-0 h-1 bg-sky-500 rounded-full shadow-[0_2px_10px_rgba(14,165,233,0.4)]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* أزرار الإجراء والقائمة */}
          <div className="flex items-center gap-4">
            {/* أزرار الشاشات الكبيرة */}
            <div className="hidden md:block">
              {user ? (
                <Link href="/dashboard" className="bg-sky-500 text-white px-6 py-2.5 rounded-xl font-black hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/25 flex items-center gap-2.5 active:scale-95 text-sm">
                  <LayoutDashboard className="w-5 h-5 text-sky-100" />
                  <span>لوحة التحكم</span>
                </Link>
              ) : (
                <Link href="/login" className="text-sky-500 border-2 border-sky-500/30 px-6 py-2 rounded-xl font-black hover:bg-sky-500 hover:text-white transition-all active:scale-95 flex items-center gap-2 text-sm">
                  <LogIn className="w-5 h-5" />
                  <span>تسجيل الدخول</span>
                </Link>
              )}
            </div>

            {/* زر القائمة للموبايل */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white active:scale-95 transition-all"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* قائمة الموبايل المنسدلة (تظهر فقط عالشاشات الصغيرة) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link, index) => {
                const isActive = link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);
                return (
                  <Link 
                    key={index} 
                    href={link.href} 
                    onClick={() => setIsOpen(false)} // يسكر القائمة بس تضغط
                    className={`p-3 rounded-xl transition-all ${isActive ? 'bg-sky-50 dark:bg-slate-900 text-sky-500 font-black' : 'text-slate-700 dark:text-slate-300 font-bold'}`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <hr className="border-slate-100 dark:border-slate-800 my-2" />
              {user ? (
                <Link href="/dashboard" onClick={() => setIsOpen(false)} className="bg-sky-500 text-white px-6 py-3 rounded-xl font-black flex justify-center items-center gap-2">
                  <LayoutDashboard className="w-5 h-5" />
                  <span>لوحة التحكم</span>
                </Link>
              ) : (
                <Link href="/login" onClick={() => setIsOpen(false)} className="text-sky-500 border-2 border-sky-500/30 px-6 py-3 rounded-xl font-black flex justify-center items-center gap-2">
                  <LogIn className="w-5 h-5" />
                  <span>تسجيل الدخول</span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}