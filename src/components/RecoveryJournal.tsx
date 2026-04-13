"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface JournalEntry {
  id: number;
  date: string;
  text: string;
}

export default function RecoveryJournal() {
  const [isClient, setIsClient] = useState(false);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newEntry, setNewEntry] = useState("");

  useEffect(() => {
    setIsClient(true);
    const savedEntries = localStorage.getItem("cleanLife_journal");
    if (savedEntries) setEntries(JSON.parse(savedEntries));
  }, []);

  const handleSave = () => {
    if (!newEntry.trim()) return;

    const entry: JournalEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString("ar-EG", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      text: newEntry,
    };

    const updatedEntries = [entry, ...entries];
    setEntries(updatedEntries);
    localStorage.setItem("cleanLife_journal", JSON.stringify(updatedEntries));
    setNewEntry("");
  };

  const deleteEntry = (id: number) => {
    const updatedEntries = entries.filter((e) => e.id !== id);
    setEntries(updatedEntries);
    localStorage.setItem("cleanLife_journal", JSON.stringify(updatedEntries));
  };

  if (!isClient) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-12 px-4">
      {/* قسم الكتابة */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100"
      >
        <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
          <span>📓</span> يومياتك اليوم
        </h3>
        <textarea
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
          placeholder="كيف تشعر اليوم؟ ما الذي تعلمته؟"
          className="w-full h-32 p-6 bg-slate-50 border border-gray-100 rounded-3xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all resize-none text-gray-700 leading-relaxed"
        />
        <button
          onClick={handleSave}
          disabled={!newEntry.trim()}
          className="w-full mt-4 py-4 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-2xl shadow-lg shadow-sky-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          حفظ التدوينة
        </button>
      </motion.div>

      {/* قائمة التدوينات */}
      <div className="space-y-6">
        <h4 className="text-lg font-bold text-gray-500 px-4">التدوينات السابقة</h4>
        <AnimatePresence>
          {entries.length === 0 ? (
            <p className="text-center text-gray-400 py-10 bg-white/50 rounded-[2rem] border-2 border-dashed border-gray-200">
              لا توجد تدوينات بعد. ابدأ بكتابة ما يدور في ذهنك.
            </p>
          ) : (
            entries.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group relative"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold text-sky-500 bg-sky-50 px-3 py-1 rounded-full">
                    {entry.date}
                  </span>
                  <button 
                    onClick={() => deleteEntry(entry.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors"
                    title="حذف التدوينة"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">
                  {entry.text}
                </p>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}