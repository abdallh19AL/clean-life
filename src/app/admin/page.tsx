"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { motion } from 'framer-motion';
import { Plus, Trash2, Package, LogOut } from 'lucide-react';

export default function AdminDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // نموذج إضافة منتج جديد
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'برامج تدريب',
    image_url: '',
    whatsapp_message: ''
  });

  // 1. التحقق من الدخول وجلب المنتجات
  useEffect(() => {
    async function checkAuthAndFetch() {
      const { data: { user } } = await supabase.auth.getUser();
      
      // هنا نضع إيميلك الشخصي كـ Admin
      // قم بتغيير هذا الإيميل لإيميلك الحقيقي اللي مسجل فيه بـ Supabase
     if (user && user.email === 'versionlast58@gmail.com') {
  setIsAdmin(true);
  fetchProducts();
} else {
  setLoading(false);
}
    }
    checkAuthAndFetch();
  }, []);

  async function fetchProducts() {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (!error && data) setProducts(data);
    setLoading(false);
  }

  // 2. دالة إضافة منتج
  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.from('products').insert([{
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      image_url: formData.image_url,
      whatsapp_message: formData.whatsapp_message || `مرحباً، أريد طلب ${formData.name}`
    }]);

    if (!error) {
      alert('تمت إضافة المنتج بنجاح يا وحش! 🚀');
      setFormData({ name: '', description: '', price: '', category: 'برامج تدريب', image_url: '', whatsapp_message: '' });
      fetchProducts(); // تحديث القائمة
    } else {
      alert('صار خطأ أثناء الإضافة: ' + error.message);
    }
    setLoading(false);
  }

  // 3. دالة حذف منتج
  async function handleDeleteProduct(id: string) {
    if(confirm('متأكد إنك بدك تحذف هاد المنتج؟')) {
      await supabase.from('products').delete().eq('id', id);
      fetchProducts(); // تحديث القائمة
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center dark:bg-slate-900"><p className="text-xl font-bold dark:text-white">جاري التحميل...</p></div>;

  // إذا لم يكن المستخدم هو الـ Admin
  if (!isAdmin) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 text-center px-4">
      <h1 className="text-4xl font-black text-red-500 mb-4">⛔ الدخول ممنوع</h1>
      <p className="text-slate-600 dark:text-slate-400">هذه الصفحة مخصصة لمدير مشروع حياة أنظف فقط.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-10 px-4 text-right transition-colors" dir="rtl">
      <div className="max-w-6xl mx-auto">
        
        <header className="flex justify-between items-center bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm mb-8 border border-slate-100 dark:border-slate-700">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">غرفة القيادة 🛠️</h1>
            <p className="text-slate-500 dark:text-slate-400">أضف، عدّل، وتحكم بمتجرك</p>
          </div>
          <Package size={48} className="text-sky-500 opacity-20" />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* قسم إضافة منتج جديد */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700">
              <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="text-sky-500" /> منتج جديد
              </h2>
              
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">اسم المنتج</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-sky-500 outline-none" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">السعر (JOD)</label>
                    <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-sky-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">الفئة</label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-sky-500 outline-none">
                      <option value="برامج تدريب">برامج تدريب</option>
                      <option value="أنظمة غذائية">أنظمة غذائية</option>
                      <option value="كتب ومقالات">كتب ومقالات</option>
                      <option value="أخرى">أخرى</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">الوصف</label>
                  <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-sky-500 outline-none"></textarea>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">رابط الصورة (URL)</label>
                  <input required type="url" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-left" dir="ltr" />
                </div>

                <button type="submit" disabled={loading} className="w-full py-4 bg-sky-500 hover:bg-sky-600 text-white font-black rounded-xl shadow-lg transition-all disabled:opacity-50 mt-4">
                  إضافة للمتجر
                </button>
              </form>
            </div>
          </div>

          {/* قسم عرض المنتجات الحالية */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map(product => (
                <motion.div key={product.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 flex gap-4">
                  <img src={product.image_url} alt={product.name} className="w-24 h-24 object-cover rounded-2xl" />
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">{product.name}</h3>
                      <p className="text-sky-500 font-black text-sm mt-1">{product.price} JOD</p>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 px-2 py-1 rounded-md">{product.category}</span>
                      <button onClick={() => handleDeleteProduct(product.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-2 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {products.length === 0 && (
                <div className="col-span-2 text-center py-10 text-slate-400">
                  لا يوجد منتجات حالياً. ابدأ بإضافة منتجك الأول!
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}