"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

// جميع المقالات المتوفرة (مع صورك الخاصة)
const allArticles = [
  { 
    id: "relapse", 
    title: "الانتكاسة ليست النهاية: دليلك للإسعافات الأولية", 
    excerpt: "تعلم كيف تتعامل مع زلاتك بذكاء، وتوقف النزيف فوراً دون جلد للذات.", 
    category: "التعافي",
    image: "https://png.pngtree.com/thumb_back/fh260/background/20240705/pngtree-view-of-green-rice-fields-with-morning-dew-and-mountains-with-image_15859864.jpg"
  },
  { 
    id: "screens", 
    title: "سجن الشاشات: الدليل العملي لصيام الدوبامين", 
    excerpt: "توقف عن إهدار انتباهك. اكتشف كيف تتلاعب الخوارزميات بدماغك.", 
    category: "الوعي الجذري",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=600&auto=format&fit=crop"
  },
  { 
    id: "habits", 
    title: "قوة الـ 1%: كيف تبني عادات جبارة", 
    excerpt: "توقف عن الأهداف الكبيرة. تعلم كيف تخدع دماغك بخطوات مجهرية تتراكم يومياً.", 
    category: "تطوير الذات",
    image: "https://i.pinimg.com/736x/a4/86/c2/a486c2daa5263cfda8bf7541e63870f4.jpg"
  },
  { 
    id: "environment", 
    title: "عدو في غرفتك: صمم بيئة تمنعك من السقوط", 
    excerpt: "الإرادة تنفد، أما البيئة فتعمل دائماً. تخلص من المشتتات في محيطك.", 
    category: "الوعي الجذري",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop"
  },
  { 
    id: "passion", 
    title: "أسطورة الشغف: الانضباط هو الحل", 
    excerpt: "لا تنتظر المزاج المناسب. ابنِ نظاماً قوياً يتفوق على تقلبات شغفك.", 
    category: "تطوير الذات",
    image: "https://i.pinimg.com/736x/16/59/f3/1659f3db1becd034aca8d0ed6d6d5d84.jpg"
  },
  { 
    id: "dopamine", 
    title: "وهم الدوبامين: كيف تسرق الإباحية عقلك", 
    excerpt: "اكتشف كيف تؤثر العادات السلبية على كيمياء الدماغ وكيف تستعيد السيطرة.", 
    category: "الوعي الجذري",
    image: "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=600&auto=format&fit=crop"
  },
  { 
    id: "smoking", 
    title: "حين يتحكم بك شيء صغير: سيكولوجية التدخين", 
    excerpt: "كيف لأسطوانة ورقية صغيرة أن تملي عليك متى تخرج من اجتماعك؟ تفكيك وهم السيجارة.", 
    category: "التعافي",
    image: "https://i.pinimg.com/736x/bb/19/ad/bb19ade6298874be08396caf33b32e67.jpg"
  },
  { 
    id: "identity", 
    title: "وهم البداية الجديدة: لماذا تعود لنقطة الصفر؟", 
    excerpt: "السر لا يكمن في قوة الإرادة، بل في فهم كيف يخدعك دماغك بحماس البدايات.", 
    category: "تطوير الذات",
    image: "https://i.pinimg.com/1200x/af/c3/e4/afc3e45a701d1769e34b01281591909d.jpg"
  }
];

export default function ClinicArticles() {
  const [isClient, setIsClient] = useState(false);
  const [step, setStep] = useState<"form" | "loading" | "results" | "all">("form");
  const [answers, setAnswers] = useState({ obstacle: "", attempts: "", feeling: "" });

  const [diagnosisTitle, setDiagnosisTitle] = useState("");
  const [diagnosisText, setDiagnosisText] = useState("");
  const [recommendedArticles, setRecommendedArticles] = useState(allArticles);

  useEffect(() => {
    setIsClient(true);
    const savedDiagnosis = localStorage.getItem("cleanLife_diagnosis");
    if (savedDiagnosis) {
      const data = JSON.parse(savedDiagnosis);
      setDiagnosisTitle(data.title);
      setDiagnosisText(data.text);
      setRecommendedArticles(allArticles.filter(a => data.recIds.includes(a.id)));
      setStep("results");
    }
  }, []);

  const handleDiagnosis = () => {
    if (!answers.obstacle || !answers.attempts || !answers.feeling) {
      alert("يرجى الإجابة على جميع الأسئلة لنتمكن من تشخيص حالتك بدقة.");
      return;
    }

    setStep("loading");

    setTimeout(() => {
      let recIds: string[] = [];
      let diagTitle = "";
      let diagText = "";

      if (answers.obstacle === "التدخين") {
        diagTitle = "ارتباط شرطي قوي";
        diagText = "يبدو أن التدخين أصبح أداة للتعامل مع مشاعرك وليس مجرد عادة. محاولاتك السابقة ربما اعتمدت على الإرادة فقط وتجاهلت الجانب النفسي.";
        recIds = ["smoking", "identity", "habits", "relapse"];
      } else if (answers.obstacle === "فقدان المتعة" || answers.obstacle === "عادات سلبية أخرى") {
        diagTitle = "خلل في نظام المكافأة";
        diagText = "الشعور بالإرهاق وفقدان المتعة هو نتيجة طبيعية لاستهلاك الدوبامين الرخيص والشاشات المستمرة. دماغك يحتاج إلى إعادة ضبط ليتمكن من الاستمتاع بالحياة الطبيعية مجدداً.";
        recIds = ["dopamine", "screens", "environment", "habits"];
      } else if (answers.obstacle === "غياب الحافز") {
        diagTitle = "فخ انتظار الشغف";
        diagText = "الاعتماد على الحماس للبدء هو أسرع طريق للانتكاس. أنت لا تعاني من الكسل، بل تفتقد إلى هندسة بيئة وأنظمة تلزمك بالعمل حتى في أسوأ أيامك.";
        recIds = ["passion", "habits", "identity", "environment"];
      } else {
        diagTitle = "صراع مع الهوية والنظام";
        diagText = "المشكلة ليست في ضعفك، بل في أنك تحاول تغيير السلوك دون تغيير المعتقد الداخلي وبناء نظام صارم. أنت بحاجة لبيئة ترفض هذه القيود تماماً.";
        recIds = ["identity", "environment", "habits", "relapse"];
      }

      setDiagnosisTitle(diagTitle);
      setDiagnosisText(diagText);
      setRecommendedArticles(allArticles.filter(a => recIds.includes(a.id)));
      
      localStorage.setItem("cleanLife_diagnosis", JSON.stringify({
        title: diagTitle,
        text: diagText,
        recIds: recIds
      }));

      setStep("results");
    }, 1500);
  };

  const handleReset = () => {
    localStorage.removeItem("cleanLife_diagnosis");
    setAnswers({ obstacle: "", attempts: "", feeling: "" });
    setStep("form");
  };

  if (!isClient) return null;

  return (
    // تمت إضافة dark:bg-slate-900 هنا
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 text-gray-800 dark:text-gray-100 pb-20 font-sans transition-colors duration-500">
      
      {/* القسم العلوي */}
      <section className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 py-16 transition-colors duration-500">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-sky-600 dark:text-sky-400 font-bold bg-sky-50 dark:bg-sky-900/30 px-5 py-2.5 rounded-full text-sm border border-sky-100 dark:border-sky-800 shadow-sm">
              المكتبة المعرفية الشاملة
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">
            {step === "all" ? "جميع الأبحاث والمقالات" : "العيادة الرقمية للتشخيص"}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            {step === "all" 
              ? "تصفح مكتبتنا الكاملة التي تغطي أحدث الطرق العلمية للتعافي وبناء العادات." 
              : "أجب بصدق على الأسئلة التالية لنقدم لك 'وصفة معرفية' مخصصة لحالتك."}
          </motion.p>
        </div>
      </section>

      {/* منطقة التفاعل */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        
        {step === "form" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-slate-700 space-y-12 transition-colors duration-500">
            
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">1. ما هي العقبة الرئيسية التي تواجهها حاليًا؟</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {['التدخين', 'عادات سلبية أخرى', 'غياب الحافز', 'فقدان المتعة', 'كل ما سبق'].map((opt) => (
                  <button key={opt} onClick={() => setAnswers({...answers, obstacle: opt})} className={`p-4 text-right rounded-2xl border-2 transition-all ${answers.obstacle === opt ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 font-bold' : 'border-gray-100 dark:border-slate-700 hover:border-sky-200 dark:hover:border-slate-600 text-gray-600 dark:text-gray-300'}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">2. كم مرة حاولت التوقف أو التغيير سابقًا؟</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {['أبدًا، هذه المرة الأولى', 'مرة واحدة', 'عدة مرات وفشلت', 'لا أعرف من أين أبدأ'].map((opt) => (
                  <button key={opt} onClick={() => setAnswers({...answers, attempts: opt})} className={`p-4 text-right rounded-2xl border-2 transition-all ${answers.attempts === opt ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 font-bold' : 'border-gray-100 dark:border-slate-700 hover:border-sky-200 dark:hover:border-slate-600 text-gray-600 dark:text-gray-300'}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">3. ما هو شعورك الغالب الآن؟</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['تفاؤل', 'قلق', 'إرهاق', 'غضب أو يأس'].map((opt) => (
                  <button key={opt} onClick={() => setAnswers({...answers, feeling: opt})} className={`p-4 text-center rounded-2xl border-2 transition-all ${answers.feeling === opt ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 font-bold' : 'border-gray-100 dark:border-slate-700 hover:border-sky-200 dark:hover:border-slate-600 text-gray-600 dark:text-gray-300'}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-8">
              <button onClick={handleDiagnosis} className="w-full py-5 bg-sky-500 hover:bg-sky-600 text-white font-black text-xl rounded-2xl shadow-lg transition-colors">
                احصل على التشخيص المبدئي
              </button>
              <button onClick={() => setStep("all")} className="w-full py-4 bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-300 font-bold border-2 border-gray-100 dark:border-slate-700 hover:border-gray-200 dark:hover:border-slate-600 rounded-2xl transition-colors">
                تخطي الفحص وتصفح جميع المقالات
              </button>
            </div>
          </motion.div>
        )}

        {step === "loading" && (
          <div className="py-32 flex flex-col items-center justify-center space-y-6 text-sky-500 dark:text-sky-400">
            <div className="w-16 h-16 border-4 border-sky-200 dark:border-sky-800 border-t-sky-500 dark:border-t-sky-400 rounded-full animate-spin"></div>
            <p className="text-xl font-bold animate-pulse">جاري تحليل إجاباتك واستخراج الوصفة المعرفية...</p>
          </div>
        )}

        {step === "results" && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12">
            
            <div className="bg-sky-500 dark:bg-sky-600 text-white p-8 md:p-12 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl"></div>
              <span className="bg-white/20 px-4 py-1.5 rounded-full text-sm font-bold mb-6 inline-block">نتيجة التحليل المحفوظة</span>
              <h2 className="text-3xl font-black mb-4">التشخيص: {diagnosisTitle}</h2>
              <p className="text-lg text-sky-50 leading-relaxed mb-8">{diagnosisText}</p>
              
              <div className="flex flex-wrap gap-4 relative z-10">
                <button onClick={handleReset} className="text-sm font-bold bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-xl transition-colors border border-white/20">
                  إعادة الفحص من جديد
                </button>
                <button onClick={() => setStep("all")} className="text-sm font-bold bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-slate-700 px-5 py-2.5 rounded-xl transition-colors shadow-sm">
                  عرض جميع المقالات
                </button>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">وصفتك المعرفية المخصصة</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">بناءً على تشخيصك، نوصي بالبدء بهذه المقالات فوراً:</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {recommendedArticles.map((article, index) => (
                  <Link href={`/articles/${article.id}`} key={index}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl dark:hover:shadow-none hover:-translate-y-2 transition-all duration-300 group border border-gray-100 dark:border-slate-700 h-full flex flex-col">
                      <div className="h-48 overflow-hidden shrink-0 relative">
                         <div className="absolute inset-0 bg-sky-900/20 dark:bg-sky-900/40 group-hover:bg-transparent transition-colors z-10"></div>
                        <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <span className="text-sm font-bold text-sky-500 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/30 px-3 py-1 rounded-full mb-4 inline-block w-fit">{article.category}</span>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors">{article.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed flex-1">{article.excerpt}</p>
                        <span className="text-sky-500 dark:text-sky-400 font-bold text-sm mt-auto">اقرأ المقال لتلقي العلاج ←</span>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === "all" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm mb-8 transition-colors duration-500">
               <h3 className="text-xl font-bold text-gray-800 dark:text-white">تصفح المكتبة بالكامل</h3>
               <button onClick={() => {
                 const saved = localStorage.getItem("cleanLife_diagnosis");
                 if(saved) setStep("results");
                 else setStep("form");
               }} className="text-sm font-bold text-sky-500 dark:text-sky-400 hover:text-sky-600 dark:hover:text-sky-300 bg-sky-50 dark:bg-sky-900/30 px-4 py-2 rounded-xl">
                 العودة للتشخيص
               </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {allArticles.map((article, index) => (
                <Link href={`/articles/${article.id}`} key={index}>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl dark:hover:shadow-none hover:-translate-y-2 transition-all duration-300 group border border-gray-100 dark:border-slate-700 h-full flex flex-col">
                    <div className="h-48 overflow-hidden shrink-0 relative">
                       <div className="absolute inset-0 bg-sky-900/10 dark:bg-sky-900/40 group-hover:bg-transparent transition-colors z-10"></div>
                      <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <span className="text-sm font-bold text-sky-500 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/30 px-3 py-1 rounded-full mb-4 inline-block w-fit">{article.category}</span>
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors">{article.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed flex-1">{article.excerpt}</p>
                      <span className="text-sky-500 dark:text-sky-400 font-bold text-sm mt-auto">اقرأ المقال ←</span>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

      </section>
    </main>
  );
}