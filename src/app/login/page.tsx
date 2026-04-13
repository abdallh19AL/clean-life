"use client";
import { useState } from "react";
import { supabase } from "@/utils/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage("خطأ في تسجيل الدخول: " + error.message);
    } else {
      router.push("/dashboard");
    }
    setLoading(false);
  };

  const handleSignUp = async () => {
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage("خطأ في إنشاء الحساب: " + error.message);
    } else {
      setMessage("تم إرسال رسالة تأكيد إلى بريدك الإلكتروني!");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4 transition-colors duration-500">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-slate-700 w-full max-w-md space-y-8"
      >
        <div className="text-center space-y-2">
          <span className="text-4xl">🔐</span>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">مرحباً بك مجدداً</h1>
          <p className="text-gray-500 dark:text-gray-400">سجل دخولك لمتابعة رحلة تعافيك</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2 text-right">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mr-2">البريد الإلكتروني</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-700 border-2 border-transparent focus:border-sky-500 dark:text-white outline-none transition-all"
              placeholder="name@example.com"
            />
          </div>

          <div className="space-y-2 text-right">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mr-2">كلمة المرور</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-700 border-2 border-transparent focus:border-sky-500 dark:text-white outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          {message && (
            <p className={`text-center font-bold text-sm ${message.includes("خطأ") ? "text-red-500" : "text-green-500"}`}>
              {message}
            </p>
          )}

          <div className="flex flex-col gap-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-sky-500 hover:bg-sky-600 text-white font-black rounded-2xl shadow-lg shadow-sky-500/20 transition-all disabled:opacity-50"
            >
              {loading ? "جاري التحميل..." : "تسجيل الدخول"}
            </button>
            <button 
              type="button"
              onClick={handleSignUp}
              disabled={loading}
              className="w-full py-4 bg-white dark:bg-slate-800 text-sky-500 border-2 border-sky-100 dark:border-slate-600 font-bold rounded-2xl hover:bg-sky-50 dark:hover:bg-slate-700 transition-all"
            >
              إنشاء حساب جديد
            </button>
          </div>
        </form>
      </motion.div>
    </main>
  );
}