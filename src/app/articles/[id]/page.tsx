"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { articlesDB } from "@/data/articles";

function ContentRenderer({ blocks }: { blocks: any[] }) {
  return (
    // 👈 ضفنا dark:prose-invert هون عشان يقلب ألوان تيلويند للمقالات
    <div className="max-w-3xl mx-auto px-4 prose prose-lg md:prose-xl prose-sky dark:prose-invert text-gray-800 dark:text-gray-200 leading-relaxed text-right whitespace-pre-line">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'paragraph':
            return <motion.p key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.5, delay: 0.1 }} className="mb-8 text-justify font-serif text-lg leading-relaxed text-gray-800 dark:text-gray-200">{block.text}</motion.p>;
          case 'quote':
            return <motion.blockquote key={index} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="my-12 p-8 bg-sky-50 dark:bg-slate-800 rounded-2xl border-r-4 border-sky-500 font-bold text-2xl text-sky-800 dark:text-sky-300 italic relative shadow-inner"><span className="absolute -top-6 -right-6 text-9xl text-sky-200 dark:text-slate-700 opacity-50">"</span>{block.text}</motion.blockquote>;
          case 'heading':
            const HeadingTag = `h${block.level}` as keyof React.JSX.IntrinsicElements;
            return <motion.div key={index} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`text-gray-900 dark:text-white font-black mb-6 mt-16 ${block.level === 2 ? 'text-4xl' : 'text-3xl'}`}><HeadingTag>{block.text}</HeadingTag></motion.div>;
          case 'image':
            return (
              <motion.figure key={index} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="my-10 flex flex-col items-center">
                <img 
                  src={block.url} 
                  alt={block.caption} 
                  className="rounded-2xl shadow-xl w-full h-auto max-h-[300px] md:max-h-[500px] object-cover border-2 border-white dark:border-slate-800" 
                />
                {block.caption && <figcaption className="mt-3 text-center text-gray-500 dark:text-gray-400 text-sm font-medium">{block.caption}</figcaption>}
              </motion.figure>
            );
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 text-gray-800 dark:text-white">
        <h1 className="text-4xl font-black text-sky-500 mb-4">المقال غير موجود</h1>
        <Link href="/articles" className="px-8 py-4 bg-sky-500 hover:bg-sky-600 transition-colors text-white font-bold rounded-2xl shadow-lg">العودة للمقالات</Link>
      </div>
    );
  }

  return (
    // 👈 ضفنا الألوان الغامقة للخلفية والنصوص
    <main className="min-h-screen bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100 pb-20 transition-colors duration-300">
      <section className="bg-slate-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 mb-10 relative transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 pt-16 pb-10 text-center relative z-10">
          <Link href="/articles" className="text-sky-500 dark:text-sky-400 font-bold hover:text-sky-600 dark:hover:text-sky-300 mb-6 inline-block transition-colors">
             العودة للمقالات ←
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-sky-500 dark:text-sky-300 font-bold bg-sky-100 dark:bg-slate-800 px-4 py-2 rounded-full text-xs mb-4 inline-block transition-colors duration-300">
              {article.hero.category}
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight mb-6 px-2 transition-colors duration-300">
              {article.hero.title}
            </h1>
          </motion.div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 mb-12 relative z-10">
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
          <img 
            src={article.hero.mainImage} 
            alt={article.hero.title} 
            className="w-full h-[250px] md:h-[500px] lg:h-[600px] object-cover rounded-2xl shadow-2xl border-2 border-white dark:border-slate-800 transition-colors duration-300" 
          />
        </motion.div>
      </section>

      <section className="relative z-10">
        <ContentRenderer blocks={article.body} />
        {/* ... باقي الكود كما هو ... */}
      </section>
    </main>
  );
}