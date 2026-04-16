"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import confetti from "canvas-confetti"; 

export default function RecoveryTracker() {
  const [isClient, setIsClient] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [lastCheckIn, setLastCheckIn] = useState("");
  const [showRelapseConfirm, setShowRelapseConfirm] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedStreak = localStorage.getItem("cleanLife_streak");
    const savedBest = localStorage.getItem("cleanLife_bestStreak");
    const savedLastCheckIn = localStorage.getItem("cleanLife_lastCheckIn");
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedBest) setBestStreak(parseInt(savedBest));
    if (savedLastCheckIn) setLastCheckIn(savedLastCheckIn);
  }, []);

  // خوارزمية الأوسمة والمكافآت (مع ألوان الوضع الليلي)
  const getBadgeInfo = (days: number) => {
    if (days >= 90) return { name: "التاج الذهبي", icon: "🥇", color: "text-yellow-600 dark:text-yellow-500", bg: "bg-yellow-100 dark:bg-yellow-900/30", next: 365, progress: Math.min((days / 365) * 100, 100) };
    if (days >= 21) return { name: "الدرع الفضي", icon: "🥈", color: "text-slate-600 dark:text-slate-300", bg: "bg-slate-200 dark:bg-slate-700", next: 90, progress: (days / 90) * 100 };
    if (days >= 7) return { name: "المحارب البرونزي", icon: "🥉", color: "text-amber-700 dark:text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30", next: 21, progress: (days / 21) * 100 };
    return { name: "شجاعة البداية", icon: "🌱", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/30", next: 7, progress: (days / 7) * 100 };
  };

  const currentBadge = getBadgeInfo(streak);

  const handleCheckIn = () => {
    const today = new Date().toISOString().split("T")[0];
    if (lastCheckIn === today) return;
    
    const newStreak = streak + 1;
    setStreak(newStreak);
    setLastCheckIn(today);
    
    if (newStreak > bestStreak) {
      setBestStreak(newStreak);
      localStorage.setItem("cleanLife_bestStreak", newStreak.toString());
    }
    
    localStorage.setItem("cleanLife_streak", newStreak.toString());
    localStorage.setItem("cleanLife_lastCheckIn", today);

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 }, colors: ['#0ea5e9', '#38bdf8'] });

    if (newStreak === 7 || newStreak === 21 || newStreak === 90) {
      setTimeout(() => {
        confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 }, zIndex: 9999 });
      }, 500);
    }
  };

  const handleRelapse = () => {
    setStreak(0);
    setLastCheckIn("");
    setShowRelapseConfirm(false);
    localStorage.setItem("cleanLife_streak", "0");
    localStorage.setItem("cleanLife_lastCheckIn", "");
  };

  if (!isClient) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-gray-100 dark:border-slate-800 max-w-2xl mx-auto space-y-8 relative overflow-hidden transition-colors duration-300">
        
        {/* خلفية تجميلية */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-50 dark:bg-sky-900/20 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/4 pointer-events-none transition-colors duration-300"></div>

        <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-800 pb-4 relative z-10 transition-colors duration-300">
          <span className="text-gray-500 dark:text-slate-400 font-bold">رحلة التعافي</span>
          <span className="text-sky-500 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/30 px-3 py-1 rounded-full text-sm font-bold border border-sky-100 dark:border-sky-800 transition-colors duration-300">
            أعلى رقم: {bestStreak} أيام 🏆
          </span>
        </div>

        <div className="text-center py-4 relative z-10">
          {/* عرض الوسام الحالي */}
          <motion.div 
            key={currentBadge.name}
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl font-bold mb-6 transition-colors duration-300 ${currentBadge.bg} ${currentBadge.color}`}
          >
            <span className="text-2xl">{currentBadge.icon}</span>
            <span>{currentBadge.name}</span>
          </motion.div>

          <div className="text-8xl md:text-9xl font-black text-gray-900 dark:text-white drop-shadow-sm transition-colors duration-300">{streak}</div>
          <p className="text-2xl font-bold text-gray-500 dark:text-slate-400 mt-2 transition-colors duration-300">يوم من الحرية</p>
        </div>

        {/* شريط التقدم للوسام القادم */}
        <div className="relative z-10 bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-gray-100 dark:border-slate-700 transition-colors duration-300">
          <div className="flex justify-between text-sm font-bold text-gray-500 dark:text-slate-400 mb-2 transition-colors duration-300">
            <span>التقدم للوسام القادم</span>
            <span>الهدف: {currentBadge.next} يوم</span>
          </div>
          <div className="h-3 w-full bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden transition-colors duration-300">
            <motion.div 
              initial={{ width: 0 }} animate={{ width: `${currentBadge.progress}%` }} transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-sky-500 rounded-full"
            />
          </div>
        </div>

        <div className="relative z-10">
          {!showRelapseConfirm ? (
            <div className="space-y-4">
              <button 
                onClick={handleCheckIn} 
                disabled={lastCheckIn === new Date().toISOString().split("T")[0]} 
                className="w-full py-5 bg-sky-500 text-white font-black text-xl rounded-2xl shadow-lg hover:bg-sky-600 hover:-translate-y-1 disabled:hover:translate-y-0 disabled:bg-emerald-100 disabled:text-emerald-700 dark:disabled:bg-emerald-900/40 dark:disabled:text-emerald-400 disabled:shadow-none transition-all duration-300"
              >
                {lastCheckIn === new Date().toISOString().split("T")[0] ? "✅ تم الانتصار اليوم" : "🛡️ أنا نظيف اليوم"}
              </button>
              {streak > 0 && (
                <div className="text-center">
                  <button onClick={() => setShowRelapseConfirm(true)} className="text-gray-400 dark:text-slate-500 text-sm font-medium hover:text-red-500 dark:hover:text-red-400 underline decoration-gray-300 dark:decoration-slate-600 transition-colors">
                    سجلت انتكاسة؟ كن صادقاً مع نفسك.
                  </button>
                </div>
              )}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-50 dark:bg-red-950/30 p-6 rounded-3xl border border-red-100 dark:border-red-900/50 space-y-4 text-center transition-colors duration-300">
              <h4 className="font-bold text-red-700 dark:text-red-400 text-lg">الانتكاسة ليست النهاية</h4>
              <p className="text-red-600/80 dark:text-red-400/80 text-sm">الاعتراف بالخطأ هو طريق العودة. سيبدأ العداد من الصفر، لكن خبرتك لا تبدأ من الصفر.</p>
              <div className="flex gap-3">
                <button onClick={handleRelapse} className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition-colors">
                  نعم، سأبدأ من جديد
                </button>
                <button onClick={() => setShowRelapseConfirm(false)} className="flex-1 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 font-bold py-3 rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  تراجع
                </button>
              </div>
            </motion.div>
          )}
        </div>
    </motion.div>
  );
}