"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { articlesDB } from "@/data/articles";

function ContentRenderer({ blocks }: { blocks: any[] }) {
  return (
    <div className="max-w-3xl mx-auto px-4 prose prose-lg md:prose-xl prose-sky text-gray-800 leading-relaxed text-right whitespace-pre-line">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'paragraph':
            return <motion.p key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.5, delay: 0.1 }} className="mb-8 text-justify font-serif text-lg leading-relaxed text-gray-800">{block.text}</motion.p>;
          case 'quote':
            return <motion.blockquote key={index} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="my-12 p-8 bg-sky-50 rounded-2xl border-r-4 border-sky-500 font-bold text-2xl text-sky-800 italic relative shadow-inner"><span className="absolute -top-6 -right-6 text-9xl text-sky-200 opacity-50">"</span>{block.text}</motion.blockquote>;
          case 'heading':
            // هنا تم حل مشكلة التايب سكريبت بإضافة React.JSX
            const HeadingTag = `h${block.level}` as keyof React.JSX.IntrinsicElements;
            return <motion.div key={index} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`text-gray-900 font-black mb-6 mt-16 ${block.level === 2 ? 'text-4xl' : 'text-3xl'}`}><HeadingTag>{block.text}</HeadingTag></motion.div>;
          case 'image':
            return <motion.figure key={index} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="my-16 flex flex-col items-center"><img src={block.url} alt={block.caption} className="rounded-3xl shadow-xl w-full h-[450px] object-cover border-4 border-white" />{block.caption && <figcaption className="mt-4 text-center text-gray-500 font-medium">{block.caption}</figcaption>}</motion.figure>;
          default:
            return null;
        }
      })}
    </div>
  );
}

export default function ArticlePage() {
  const params = useParams();
  const articleId = params.id as keyof typeof articlesDB; 
  
  const article = articlesDB[articleId];

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-gray-800">
        <h1 className="text-4xl font-black text-sky-500 mb-4">المقال غير موجود</h1>
        <p className="text-xl mb-8">يبدو أنك تبحث عن مقال تم نقله أو حذفه.</p>
        <Link href="/articles" className="px-8 py-4 bg-sky-500 text-white font-bold rounded-2xl shadow-lg">العودة للمقالات</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white text-gray-800 pb-20">
      <section className="bg-slate-50 border-b border-gray-100 mb-16 relative">
        <div className="max-w-4xl mx-auto px-4 pt-20 pb-16 text-center relative z-10">
          <Link href="/articles" className="text-sky-500 font-bold hover:text-sky-600 mb-8 inline-block transition-colors flex items-center gap-2 justify-center">
             العودة للمقالات ←
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="text-sky-500 font-bold bg-sky-100 px-5 py-2.5 rounded-full text-sm mb-6 inline-block shadow-sm">
              {article.hero.category}
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight mb-8">
              {article.hero.title}
            </h1>
            <div className="flex items-center justify-center gap-6 text-gray-600 font-medium">
              <p>{article.hero.date}</p>
              <p>•</p>
              <p>وقت القراءة: {article.hero.readingTime}</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 mb-20 relative z-10">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
          <img src={article.hero.mainImage} alt={article.hero.title} className="w-full h-[500px] md:h-[700px] object-cover rounded-3xl shadow-2xl border-4 border-white" />
        </motion.div>
      </section>

      <section className="relative z-10">
        <ContentRenderer blocks={article.body} />
        
        <div className="max-w-3xl mx-auto px-4 mt-24">
          <div className="p-12 bg-sky-500 text-white rounded-3xl border border-sky-600 text-center shadow-xl space-y-6">
            <h3 className="text-3xl font-black">هل أنت مستعد للتغيير الفعلي؟</h3>
            <p className="text-xl text-sky-100">لقد امتلكت الوعي الآن. الخطوة التالية هي التطبيق العملي من خلال الجداول والخطط.</p>
            <Link href="/store" className="inline-block px-10 py-4 bg-white text-sky-600 font-black rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300 text-lg">
              ابدأ الآن مع حلول المتجر
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}