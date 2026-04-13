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
            const HeadingTag = `h${block.level}` as keyof React.JSX.IntrinsicElements;
            return <motion.div key={index} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`text-gray-900 font-black mb-6 mt-16 ${block.level === 2 ? 'text-4xl' : 'text-3xl'}`}><HeadingTag>{block.text}</HeadingTag></motion.div>;
          case 'image':
            return (
              <motion.figure key={index} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="my-10 flex flex-col items-center">
                {/* تعديل الارتفاع هنا ليكون متجاوباً */}
                <img 
                  src={block.url} 
                  alt={block.caption} 
                  className="rounded-2xl shadow-xl w-full h-auto max-h-[300px] md:max-h-[500px] object-cover border-2 border-white" 
                />
                {block.caption && <figcaption className="mt-3 text-center text-gray-500 text-sm font-medium">{block.caption}</figcaption>}
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-gray-800">
        <h1 className="text-4xl font-black text-sky-500 mb-4">المقال غير موجود</h1>
        <Link href="/articles" className="px-8 py-4 bg-sky-500 text-white font-bold rounded-2xl shadow-lg">العودة للمقالات</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white text-gray-800 pb-20">
      <section className="bg-slate-50 border-b border-gray-100 mb-10 relative">
        <div className="max-w-4xl mx-auto px-4 pt-16 pb-10 text-center relative z-10">
          <Link href="/articles" className="text-sky-500 font-bold hover:text-sky-600 mb-6 inline-block transition-colors">
             العودة للمقالات ←
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-sky-500 font-bold bg-sky-100 px-4 py-2 rounded-full text-xs mb-4 inline-block">
              {article.hero.category}
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight mb-6 px-2">
              {article.hero.title}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* تعديل صورة الـ Hero لتناسب شاشة الموبايل */}
      <section className="max-w-5xl mx-auto px-4 mb-12 relative z-10">
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
          <img 
            src={article.hero.mainImage} 
            alt={article.hero.title} 
            className="w-full h-[250px] md:h-[500px] lg:h-[600px] object-cover rounded-2xl shadow-2xl border-2 border-white" 
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