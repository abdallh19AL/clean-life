"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, MessageCircle } from 'lucide-react'; // تأكد من تنبيهي إذا ما عندك lucide-react

export default function StorePage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("الكل");

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        setProducts(data);
        setFilteredProducts(data);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  // نظام الفلترة والبحث الذكي
  useEffect(() => {
    let result = products;
    if (category !== "الكل") {
      result = result.filter(p => p.category === category);
    }
    if (search) {
      result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    setFilteredProducts(result);
  }, [search, category, products]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-bold">جاري تجهيز المتجر...</p>
      </div>
    </div>
  );

  const categories = ["الكل", ...new Set(products.map(p => p.category))];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 text-right" dir="rtl">
      {/* Header الفخم */}
      <section className="bg-white border-b border-slate-100 pt-20 pb-12 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-3">متجر حياة أنظف 🛍️</h1>
              <p className="text-slate-500 text-lg">استثمر في نفسك.. أنت تستحق الأفضل</p>
            </div>
            
            <div className="relative w-full md:w-96">
              <input 
                type="text"
                placeholder="ابحث عن منتج..."
                className="w-full pr-12 pl-4 py-4 bg-slate-100 rounded-2xl focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            </div>
          </div>

          {/* فلاتر الفئات */}
          <div className="flex gap-3 mt-10 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-6 py-2.5 rounded-full font-bold whitespace-nowrap transition-all ${
                  category === cat ? 'bg-sky-500 text-white shadow-lg shadow-sky-200' : 'bg-white text-slate-600 border border-slate-200 hover:border-sky-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* عرض المنتجات */}
      <main className="max-w-7xl mx-auto px-4 mt-12">
        <AnimatePresence mode='popLayout'>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={product.id}
                className="group bg-white rounded-[2.5rem] p-4 shadow-xl hover:shadow-2xl transition-all border border-transparent hover:border-sky-100 flex flex-col"
              >
                <div className="relative h-72 w-full mb-6 overflow-hidden rounded-[2rem]">
                  <img src={product.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={product.name} />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-xs font-black text-sky-600 shadow-sm">
                    {product.category}
                  </div>
                </div>

                <div className="px-2 flex-grow">
                  <h3 className="text-2xl font-black text-slate-900 mb-3">{product.name}</h3>
                  <p className="text-slate-500 leading-relaxed line-clamp-2 mb-6">{product.description}</p>
                </div>

                <div className="mt-auto bg-slate-50 rounded-3xl p-6 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-slate-900">{product.price} <span className="text-sm">JOD</span></span>
                  </div>
                  <a 
                    href={`https://wa.me/962XXXXXXXXX?text=${encodeURIComponent(`مرحباً حياة أنظف، أريد طلب: ${product.name}`)}`}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-2xl font-black transition-all"
                  >
                    <span>اطلب الآن</span>
                    <MessageCircle size={18} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <ShoppingBag size={64} className="mx-auto text-slate-200 mb-4" />
            <h3 className="text-2xl font-bold text-slate-400">لم نجد أي منتج يطابق بحثك</h3>
          </div>
        )}
      </main>
    </div>
  );
}