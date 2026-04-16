"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/utils/supabase";
import { useRouter } from "next/navigation";
import { BarChart3, Target, Banknote, ShieldCheck, LogOut, CheckCircle2, Circle, Loader2 } from "lucide-react";

export default function Dashboard() {
  const [days, setDays] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const router = useRouter();

  // 1. دالة جلب المهام من قاعدة البيانات (مع التصفير التلقائي)
  const fetchTasks = useCallback(async (userId: string) => {
    // 👈 التعديل السحري: فحص اليوم الجديد وتصفير المهام
    const today = new Date().toDateString();
    const lastReset = localStorage.getItem(`tasks_reset_${userId}`);

    if (lastReset !== today) {
      // إزالة علامة الصح من جميع المهام في قاعدة البيانات لهذا المستخدم
      await supabase.from('tasks').update({ is_completed: false }).eq('user_id', userId);
      // حفظ تاريخ اليوم لمنع التصفير مرة أخرى في نفس اليوم
      localStorage.setItem(`tasks_reset_${userId}`, today);
    }

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    
    if (!error && data) {
      if (data.length === 0) {
        const defaultTasks = [
          { user_id: userId, text: "قراءة 10 صفحات من كتاب ملهم", is_completed: false },
          { user_id: userId, text: "تمرين رياضي مكثف", is_completed: false },
          { user_id: userId, text: "جلسة تأمل لمدة 10 دقائق", is_completed: false }
        ];
        const { data: inserted } = await supabase.from('tasks').insert(defaultTasks).select();
        setTasks(inserted || []);
      } else {
        setTasks(data);
      }
    }
  }, []);

  // 2. دالة جلب بيانات المستخدم والتعافي
  const fetchUserData = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }
    setUser(user);
    await fetchTasks(user.id);

    let { data: profile } = await supabase
      .from("profiles")
      .select("recovery_start_date")
      .eq("id", user.id)
      .single();

    if (profile?.recovery_start_date) {
      const start = new Date(profile.recovery_start_date);
      const now = new Date();
      const diffInMs = now.getTime() - start.getTime();
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      setDays(diffInDays);
    }
    setLoading(false);
  }, [router, fetchTasks]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // 3. دالة تحديث حالة المهمة (Check/Uncheck)
  const toggleTask = async (taskId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('tasks')
      .update({ is_completed: !currentStatus })
      .eq('id', taskId);

    if (!error) {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, is_completed: !currentStatus } : t));
    }
  };

  const handleRelapse = async () => {
    if (confirm("هل أنت متأكد؟ الانتكاسة جزء من الرحلة، المهم أن نبدأ فوراً.")) {
      const { error } = await supabase
        .from("profiles")
        .update({ recovery_start_date: new Date().toISOString() })
        .eq("id", user.id);
      if (!error) setDays(0);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
      <Loader2 className="w-10 h-10 text-sky-500 animate-spin mb-4" />
      <p className="text-slate-500 font-bold">جاري تحديث بياناتك الرقمية...</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16 transition-colors">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 sticky top-0 z-40 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <BarChart3 className="w-8 h-8 text-sky-500" />
            <h1 className="text-xl font-black text-gray-900 dark:text-white">لوحة الإنجاز</h1>
          </div>
          <button 
            onClick={() => supabase.auth.signOut().then(() => router.push("/login"))}
            className="flex items-center gap-2 text-gray-500 hover:text-red-500 font-bold text-sm transition"
          >
            <LogOut className="w-4 h-4" /> خروج
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* العداد (4 أعمدة) */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-gray-100 dark:border-slate-800 shadow-xl text-center relative overflow-hidden"
          >
            <span className="text-sky-500 font-black uppercase tracking-tighter text-sm">أنت بطل منذ</span>
            <div className="text-9xl font-black text-slate-900 dark:text-white my-4 tracking-tighter">{days}</div>
            <span className="text-xl font-bold text-slate-400">يوماً من النقاء</span>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl"></div>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800">
              <Banknote className="text-green-500 mb-2" />
              <div className="text-sm text-slate-400 font-bold">توفير تقديري</div>
              <div className="text-xl font-black text-green-500">{days * 5} JOD</div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 text-center">
              <button onClick={handleRelapse} className="text-red-500 font-black text-xs hover:underline">تسجيل انتكاسة</button>
            </div>
          </div>
        </div>

        {/* المهام (8 أعمدة) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-black mb-6 flex items-center gap-3">
              <Target className="text-sky-500" /> أهداف اليوم لثباتك
            </h3>
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} onClick={() => toggleTask(task.id, task.is_completed)}
                  className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    task.is_completed ? 'bg-sky-50 dark:bg-sky-950/30 border-sky-100 dark:border-sky-800 opacity-60' : 'bg-slate-50 dark:bg-slate-800 border-transparent hover:border-sky-200'
                  }`}
                >
                  {task.is_completed ? <CheckCircle2 className="text-sky-500" /> : <Circle className="text-slate-300" />}
                  <span className={`font-bold flex-1 ${task.is_completed ? 'line-through text-slate-400' : ''}`}>{task.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}