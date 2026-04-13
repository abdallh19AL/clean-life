"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import confetti from "canvas-confetti"; // استدعاء مكتبة الاحتفالات

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

  // خوارزمية الأوسمة والمكافآت
  const getBadgeInfo = (days: number) => {
    if (days >= 90) return { name: "التاج الذهبي", icon: "🥇", color: "text-yellow-600", bg: "bg-yellow-100", next: 365, progress: Math.min((days / 365) * 100, 100) };
    if (days >= 21) return { name: "الدرع الفضي", icon: "🥈", color: "text-slate-600", bg: "bg-slate-200", next: 90, progress: (days / 90) * 100 };
    if (days >= 7) return { name: "المحارب البرونزي", icon: "🥉", color: "text-amber-700", bg: "bg-amber-100", next: 21, progress: (days / 21) * 100 };
    return { name: "شجاعة البداية", icon: "🌱", color: "text-emerald-600", bg: "bg-emerald-100", next: 7, progress: (days / 7) * 100 };
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

    // إطلاق الاحتفالات العادية كل يوم
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 }, colors: ['#0ea5e9', '#38bdf8'] });

    // إطلاق احتفال ضخم إذا وصل لوسام جديد
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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-gray-100 max-w-2xl mx-auto space-y-8 relative overflow-hidden">
        
        {/* خلفية تجميلية */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-50 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

        <div className="flex justify-between items-center border-b border-gray-100 pb-4 relative z-10">
          <span className="text-gray-500 font-bold">رحلة التعافي</span>
          <span className="text-sky-500 bg-sky-50 px-3 py-1 rounded-full text-sm font-bold border border-sky-100">
            أعلى رقم: {bestStreak} أيام 🏆
          </span>
        </div>

        <div className="text-center py-4 relative z-10">
          {/* عرض الوسام الحالي */}
          <motion.div 
            key={currentBadge.name}
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl font-bold mb-6 ${currentBadge.bg} ${currentBadge.color}`}
          >
            <span className="text-2xl">{currentBadge.icon}</span>
            <span>{currentBadge.name}</span>
          </motion.div>

          <div className="text-8xl md:text-9xl font-black text-gray-900 drop-shadow-sm">{streak}</div>
          <p className="text-2xl font-bold text-gray-500 mt-2">يوم من الحرية</p>
        </div>

        {/* شريط التقدم للوسام القادم */}
        <div className="relative z-10 bg-slate-50 p-5 rounded-2xl border border-gray-100">
          <div className="flex justify-between text-sm font-bold text-gray-500 mb-2">
            <span>التقدم للوسام القادم</span>
            <span>الهدف: {currentBadge.next} يوم</span>
          </div>
          <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
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
                className="w-full py-5 bg-sky-500 text-white font-black text-xl rounded-2xl shadow-lg hover:bg-sky-600 hover:-translate-y-1 disabled:hover:translate-y-0 disabled:bg-emerald-100 disabled:text-emerald-700 disabled:shadow-none transition-all duration-300"
              >
                {lastCheckIn === new Date().toISOString().split("T")[0] ? "✅ تم الانتصار اليوم" : "🛡️ أنا نظيف اليوم"}
              </button>
              {streak > 0 && (
                <div className="text-center">
                  <button onClick={() => setShowRelapseConfirm(true)} className="text-gray-400 text-sm font-medium hover:text-red-500 underline decoration-gray-300 transition-colors">
                    سجلت انتكاسة؟ كن صادقاً مع نفسك.
                  </button>
                </div>
              )}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-50 p-6 rounded-3xl border border-red-100 space-y-4 text-center">
              <h4 className="font-bold text-red-700 text-lg">الانتكاسة ليست النهاية</h4>
              <p className="text-red-600/80 text-sm">الاعتراف بالخطأ هو طريق العودة. سيبدأ العداد من الصفر، لكن خبرتك لا تبدأ من الصفر.</p>
              <div className="flex gap-3">
                <button onClick={handleRelapse} className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition-colors">
                  نعم، سأبدأ من جديد
                </button>
                <button onClick={() => setShowRelapseConfirm(false)} className="flex-1 bg-white text-gray-700 font-bold py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                  تراجع
                </button>
              </div>
            </motion.div>
          )}
        </div>
    </motion.div>
  );
}