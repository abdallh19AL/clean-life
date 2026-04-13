"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// إنشاء سياق (Context) لنقل حالة اللون لجميع أجزاء الموقع
const ThemeContext = createContext({ theme: "light", toggleTheme: () => {} });

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // التحقق من اللون المفضل المحفوظ سابقاً
    const savedTheme = localStorage.getItem("cleanLife_theme") || "light";
    setTheme(savedTheme);
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("cleanLife_theme", newTheme);
    
    // تفعيل أو تعطيل الكلاس المسؤول عن الوضع الليلي في Tailwind
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // إخفاء المحتوى للحظة لمنع الوميض الأبيض المزعج (FOUC)
  if (!mounted) return <div className="opacity-0">{children}</div>;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// دالة جاهزة للاستخدام في أي مكان في الموقع
export const useTheme = () => useContext(ThemeContext);