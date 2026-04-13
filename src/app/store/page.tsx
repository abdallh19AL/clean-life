"use client";
import { motion } from "framer-motion";

// مصفوفة المنتجات (محتوى حقيقي يناسب "حياة أنظف")
const products = [
  {
    id: 1,
    title: "دليل 'الخروج من السجن الرقمي'",
    price: "15.00",
    description: "كتاب إلكتروني شامل (PDF) يشرح سيكولوجية الإدمان الرقمي وخطوات عملية للتعافي.",
    category: "كتب رقمية",
    badge: "الأكثر مبيعاً",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "مخطط 'نظام الـ 90 يوماً'",
    price: "9.99",
    description: "مخطط يومي مطبوع (أو رقمي) لمتابعة العادات والانتصارات الصغيرة طوال رحلة التغيير.",
    category: "أدوات تنظيم",
    badge: "جديد",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "جلسة استشارية خاصة (30 دقيقة)",
    price: "45.00",
    description: "حديث مباشر لمناقشة تحدياتك وتصميم نظام بيئي مخصص يساعدك على الاستمرار.",
    category: "استشارات",
    badge: "موصى به",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=600&auto=format&fit=crop"
  }
];

export default function StorePage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 text-gray-800 dark:text-gray-100 pb-20 font-sans transition-colors duration-500">
      
      {/* رأس صفحة المتجر */}
      <section className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 py-20 transition-colors duration-500">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-sky-600 dark:text-sky-400 font-bold bg-sky-50 dark:bg-sky-900/30 px-5 py-2.5 rounded-full text-sm border border-sky-100 dark:border-sky-800">
              متجر حياة أنظف
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">
            أدوات تساعدك على النجاح
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            استثمر في نفسك. نقدم لك موارد مختارة بعناية لتسريع رحلة تعافيك وبناء انضباطك الذاتي.
          </motion.p>
        </div>
      </section>

      {/* شبكة المنتجات */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl dark:hover:shadow-none hover:-translate-y-2 transition-all duration-500 border border-gray-100 dark:border-slate-700 flex flex-col h-full group"
            >
              {/* صورة المنتج */}
              <div className="h-64 overflow-hidden relative">
                <div className="absolute top-4 right-4 z-20">
                  <span className="bg-sky-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                    {product.badge}
                  </span>
                </div>
                <div className="absolute inset-0 bg-sky-900/10 dark:bg-sky-900/30 group-hover:bg-transparent transition-colors z-10"></div>
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
              </div>

              {/* تفاصيل المنتج */}
              <div className="p-8 flex flex-col flex-1">
                <span className="text-xs font-bold text-sky-500 dark:text-sky-400 mb-2 block">{product.category}</span>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 leading-snug">{product.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-8 flex-1">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50 dark:border-slate-700">
                  <div className="flex flex-col">
                    <span className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-wider">السعر</span>
                    <span className="text-2xl font-black text-gray-900 dark:text-white">JOD {product.price}</span>
                  </div>
                  <button className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-2xl font-bold hover:bg-sky-500 dark:hover:bg-sky-400 dark:hover:text-white transition-all duration-300 shadow-lg shadow-gray-200 dark:shadow-none">
                    شراء الآن
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* قسم الضمان */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-sky-50 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-800 rounded-[2rem] p-8 text-center">
          <p className="text-sky-700 dark:text-sky-300 font-medium">
            🛡️ جميع الموارد الرقمية محمية بضمان استعادة الأموال لمدة 14 يوماً إذا لم تجد القيمة المرجوة.
          </p>
        </div>
      </section>

    </main>
  );
}