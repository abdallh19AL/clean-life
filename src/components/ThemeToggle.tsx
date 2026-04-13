"use client";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 p-4 rounded-full bg-white dark:bg-slate-800 shadow-xl border border-gray-200 dark:border-slate-700 text-2xl z-50 hover:scale-110 transition-transform"
      title="تبديل الوضع الليلي"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}