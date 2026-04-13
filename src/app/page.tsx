"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import RecoveryTracker from "@/components/RecoveryTracker";
import RecoveryJournal from "@/components/RecoveryJournal";

export default function Home() {
  const featuredArticles = [
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
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 text-gray-800 dark:text-gray-100 pb-20 font-sans transition-colors duration-500">
      
      {/* 1. مقدمة العيادة */}
      <section className="max-w-7xl mx-auto px-4 py-24 flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 space-y-8 text-right z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="text-sky-600 dark:text-sky-400 font-bold bg-sky-100/50 dark:bg-sky-900/30 border border-sky-200 dark:border-sky-800 px-5 py-2.5 rounded-full text-sm">
              مساحتك الآمنة للتعافي
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white leading-[1.2]"
          >
            نحن نفهم معاناتك.<br/> <span className="text-sky-500">الحل يبدأ بالعلم.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.3 }}
            className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl"
          >
            توقف عن لوم نفسك. الإدمان والعادات السلبية ليست دليلاً على ضعفك، بل هي استجابة كيميائية في دماغك. في "حياة أنظف"، نقدم لك التشخيص، المعرفة، والأدوات لاستعادة السيطرة.
          </motion.p>
          
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.6 }} className="flex gap-4 pt-4">
            <Link href="/articles" className="px-8 py-4 bg-sky-500 text-white font-bold rounded-2xl shadow-lg shadow-sky-500/30 hover:-translate-y-1 hover:shadow-sky-500/50 transition-all duration-300">
              ابدأ الفحص والتشخيص
            </Link>
            <Link href="#knowledge" className="px-8 py-4 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 font-bold rounded-2xl border border-gray-200 dark:border-slate-700 hover:border-sky-500 dark:hover:border-sky-500 hover:text-sky-500 dark:hover:text-sky-400 transition-all duration-300">
              اكتشف كيف نعمل
            </Link>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="flex-1 w-full relative">
          <div className="absolute inset-0 bg-sky-100 dark:bg-sky-900/20 rounded-[3rem] -rotate-3 scale-105 opacity-50"></div>
          <img 
            src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop" 
            alt="الهدوء والوضوح العقلي" 
            className="relative rounded-[3rem] shadow-2xl border-8 border-white dark:border-slate-800 object-cover h-[500px] w-full transition-colors duration-500"
          />
        </motion.div>
      </section>

      {/* 2. قسم الأدوات التفاعلية (العداد واليوميات) */}
      <section className="max-w-5xl mx-auto px-4 py-12 relative z-20 space-y-12">
        <RecoveryTracker />
        <RecoveryJournal />
      </section>

      {/* 3. قسم الحقائق المريحة */}
      <section id="knowledge" className="bg-white dark:bg-slate-900 py-24 border-y border-gray-100 dark:border-slate-800 relative overflow-hidden mt-12 transition-colors duration-500">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-50 dark:bg-sky-900/10 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">ثلاث حقائق ستغير نظرتك لنفسك</h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">قبل أن تبدأ رحلة التعافي، يجب أن تفهم كيف يعمل دماغك لكي تتوقف عن القتال في المعركة الخاطئة.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "🧪", title: "المشكلة كيميائية", desc: "الفشل المتكرر ليس نقصاً في الأخلاق أو الإرادة. هو مجرد 'اختطاف' لنظام الدوبامين في دماغك بسبب محفزات العصر الحديث السريعة." },
              { icon: "🌱", title: "المرونة العصبية", desc: "الخبر السار: دماغك يشبه البلاستيك، يتشكل ويتغير. مهما كانت مسارات الإدمان عميقة، يمكنك إعادة بناء مسارات عصبية جديدة وصحية بالتدريج." },
              { icon: "🧩", title: "قوة النظام لا الحماس", desc: "الحماس ينتهي بعد يومين. التعافي الحقيقي يُبنى من خلال هندسة بيئتك وصنع عادات مجهرية (Micro-habits) لا تتطلب جهداً كبيراً." }
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }} className="bg-slate-50 dark:bg-slate-800/50 p-10 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-700 hover:shadow-xl hover:shadow-sky-100 dark:hover:shadow-none transition-all duration-300 group">
                <div className="text-5xl mb-6 bg-white dark:bg-slate-700 w-20 h-20 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">{item.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. جرعة وعي */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="bg-sky-500 dark:bg-sky-600 text-white rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-sky-500/20 dark:shadow-none">
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1516534775068-ba3e7458af70?q=80&w=1200&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
          <div className="relative z-10">
            <span className="text-sky-200 dark:text-sky-100 font-bold tracking-wider text-sm mb-6 block uppercase">جرعة وعي</span>
            <blockquote className="text-3xl md:text-4xl font-black leading-tight mb-8">
              "أنت لا ترتقي إلى مستوى طموحاتك، بل تسقط إلى مستوى أنظمتك. التغيير لا يبدأ بقرار كبير، بل ببيئة صحية."
            </blockquote>
            <p className="text-sky-100 dark:text-sky-200 text-lg">عيادة حياة أنظف</p>
          </div>
        </motion.div>
      </section>

      {/* 5. مكتبة العيادة */}
      <section className="max-w-7xl mx-auto px-4 py-20 border-t border-gray-100 dark:border-slate-800">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="text-sky-500 dark:text-sky-400 font-bold text-sm mb-2 block">المكتبة المعرفية</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">وصفات معرفية للتعافي</h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg">اخترنا لك هذه المقالات بعناية لتكون نقطة انطلاقك في فهم مشكلتك والبدء بحلها.</p>
          </div>
          <Link href="/articles" className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 font-bold rounded-xl hover:bg-sky-50 dark:hover:bg-slate-700 hover:text-sky-600 dark:hover:text-sky-400 transition-colors flex items-center gap-2">
            تصفح كل الأبحاث <span>←</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredArticles.map((article, index) => (
            <Link href={`/articles/${article.id}`} key={index}>
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl dark:hover:shadow-none hover:-translate-y-2 transition-all duration-500 group border border-gray-100 dark:border-slate-700 h-full flex flex-col">
                <div className="h-56 overflow-hidden shrink-0 relative">
                  <div className="absolute inset-0 bg-sky-900/20 dark:bg-sky-900/40 group-hover:bg-transparent transition-colors z-10"></div>
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <span className="text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/30 px-3 py-1 rounded-full mb-4 inline-block w-fit border border-sky-100 dark:border-sky-800">{article.category}</span>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors leading-snug">{article.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed flex-1">{article.excerpt}</p>
                  <div className="mt-auto border-t border-gray-50 dark:border-slate-700 pt-4 flex items-center justify-between">
                    <span className="text-sky-500 dark:text-sky-400 font-bold text-sm">اقرأ التحليل</span>
                    <span className="text-sky-300 dark:text-sky-500 group-hover:translate-x-[-8px] transition-transform">←</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}