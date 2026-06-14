"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { Plus, Trash2, X } from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────────────────── */

type Note = {
  id: string;
  title: string;
  content: string;
  tag: string;
  created_at: string;
  updated_at: string;
};

/* ─── Constants ──────────────────────────────────────────────────────────── */

const TAGS = [
  { value: "عام",    color: "#6B7280", bg: "rgba(107,114,128,0.10)" },
  { value: "تغذية",  color: "#D97706", bg: "rgba(217,119,6,0.10)"   },
  { value: "تمرين",  color: "#2D6A4F", bg: "rgba(45,106,79,0.10)"   },
  { value: "أهداف",  color: "#5B8CBF", bg: "rgba(91,140,191,0.10)"  },
  { value: "طبي",    color: "#7E57C2", bg: "rgba(126,87,194,0.10)"  },
];

const CARD: React.CSSProperties = {
  backgroundColor: "rgba(255,255,255,0.95)",
  border: "1px solid rgba(190,175,155,0.22)",
  borderRadius: 20,
  boxShadow: "0 2px 16px rgba(80,60,30,0.07)",
};

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function tagFor(value: string) {
  return TAGS.find(t => t.value === value) ?? TAGS[0];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ar-SA", {
    day: "numeric", month: "long", year: "numeric",
  });
}

/* ─── Skeleton ───────────────────────────────────────────────────────────── */

function SkeletonCard() {
  return (
    <div style={{ ...CARD, padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ width: "55%", height: 16, borderRadius: 8, backgroundColor: "rgba(190,175,155,0.22)" }} />
        <div style={{ width: 52, height: 22, borderRadius: 999, backgroundColor: "rgba(190,175,155,0.18)" }} />
      </div>
      <div style={{ width: "100%", height: 11, borderRadius: 8, backgroundColor: "rgba(190,175,155,0.15)", marginBottom: 7 }} />
      <div style={{ width: "75%",  height: 11, borderRadius: 8, backgroundColor: "rgba(190,175,155,0.12)", marginBottom: 18 }} />
      <div style={{ width: 72,    height: 10, borderRadius: 8, backgroundColor: "rgba(190,175,155,0.12)" }} />
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function NotesPage() {
  const [notes,       setNotes]       = useState<Note[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [filter,      setFilter]      = useState("الكل");
  const [showModal,   setShowModal]   = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [form,        setForm]        = useState({ title: "", content: "", tag: "عام" });
  const [saving,      setSaving]      = useState(false);
  const [deleting,    setDeleting]    = useState(false);
  const [userId,      setUserId]      = useState<string | null>(null);

  /* ── Fetch ── */
  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }
        setUserId(user.id);

        const { data } = await supabase
          .from("notes")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        setNotes(data ?? []);
      } catch {
        // ignore — empty state shown
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ── Modal helpers ── */
  function openCreate() {
    setEditingNote(null);
    setForm({ title: "", content: "", tag: "عام" });
    setShowModal(true);
  }

  function openEdit(note: Note) {
    setEditingNote(note);
    setForm({ title: note.title, content: note.content, tag: note.tag });
    setShowModal(true);
  }

  function closeModal() {
    if (saving || deleting) return;
    setShowModal(false);
    setEditingNote(null);
  }

  /* ── Save (create or update) ── */
  async function saveNote() {
    if (!userId || !form.title.trim() || saving) return;
    setSaving(true);
    try {
      const supabase = createClient();
      const now = new Date().toISOString();

      if (editingNote) {
        const { data } = await supabase
          .from("notes")
          .update({
            title:      form.title.trim(),
            content:    form.content.trim(),
            tag:        form.tag,
            updated_at: now,
          })
          .eq("id", editingNote.id)
          .eq("user_id", userId)
          .select()
          .single();

        if (data) setNotes(prev => prev.map(n => n.id === data.id ? data : n));
      } else {
        const { data } = await supabase
          .from("notes")
          .insert({
            user_id:    userId,
            title:      form.title.trim(),
            content:    form.content.trim(),
            tag:        form.tag,
            created_at: now,
            updated_at: now,
          })
          .select()
          .single();

        if (data) setNotes(prev => [data, ...prev]);
      }
      closeModal();
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  }

  /* ── Delete ── */
  async function deleteNote() {
    if (!editingNote || !userId || deleting) return;
    setDeleting(true);
    try {
      const supabase = createClient();
      await supabase
        .from("notes")
        .delete()
        .eq("id", editingNote.id)
        .eq("user_id", userId);

      setNotes(prev => prev.filter(n => n.id !== editingNote.id));
      setShowModal(false);
      setEditingNote(null);
    } catch {
      // ignore
    } finally {
      setDeleting(false);
    }
  }

  const filteredNotes = filter === "الكل"
    ? notes
    : notes.filter(n => n.tag === filter);

  /* ── JSX ── */
  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100vh",
        backgroundColor: "#F8F5F0",
        fontFamily: "'Cairo','Segoe UI',sans-serif",
        padding: "28px 18px 80px",
        maxWidth: "100%",
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap", gap: 12,
          marginBottom: 22,
        }}
      >
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#1a1a1a", marginBottom: 3 }}>
            ملاحظاتي 📒
          </h1>
          <p style={{ fontSize: 13, color: "#aaa" }}>
            {loading ? "جاري التحميل..." : `${notes.length} ملاحظة محفوظة`}
          </p>
        </div>

        <motion.button
          onClick={openCreate}
          whileHover={{ y: -2, boxShadow: "0 10px 24px rgba(45,106,79,0.30)" }}
          whileTap={{ scale: 0.97 }}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 20px", borderRadius: 14,
            background: "linear-gradient(135deg, #2D6A4F, #40916C)",
            color: "white", border: "none",
            fontWeight: 800, fontSize: 14, fontFamily: "inherit",
            cursor: "pointer", minHeight: 44,
            boxShadow: "0 4px 16px rgba(45,106,79,0.25)",
            flexShrink: 0,
          }}
        >
          <Plus size={18} />
          ملاحظة جديدة
        </motion.button>
      </motion.div>

      {/* ── Filter bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.06 }}
        style={{
          display: "flex", gap: 8, flexWrap: "wrap",
          marginBottom: 24,
        }}
      >
        {/* "All" chip */}
        <button
          onClick={() => setFilter("الكل")}
          style={{
            display: "inline-flex", alignItems: "center",
            padding: "6px 16px", borderRadius: 999, minHeight: 36,
            fontSize: 13, fontWeight: 700,
            backgroundColor: filter === "الكل" ? "#2D6A4F" : "rgba(45,106,79,0.08)",
            color: filter === "الكل" ? "white" : "#2D6A4F",
            border: "1.5px solid rgba(45,106,79,0.25)",
            cursor: "pointer", fontFamily: "inherit",
            transition: "all 0.15s", whiteSpace: "nowrap",
          }}
        >
          الكل
        </button>

        {TAGS.map(tag => (
          <button
            key={tag.value}
            onClick={() => setFilter(tag.value)}
            style={{
              display: "inline-flex", alignItems: "center",
              padding: "6px 16px", borderRadius: 999, minHeight: 36,
              fontSize: 13, fontWeight: 700,
              backgroundColor: filter === tag.value ? tag.color : tag.bg,
              color: filter === tag.value ? "white" : tag.color,
              border: `1.5px solid ${tag.color}40`,
              cursor: "pointer", fontFamily: "inherit",
              transition: "all 0.15s", whiteSpace: "nowrap",
            }}
          >
            {tag.value}
          </button>
        ))}
      </motion.div>

      {/* ── Loading skeletons ── */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && filteredNotes.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{
            ...CARD, textAlign: "center",
            padding: "52px 28px",
          }}
        >
          <p style={{ fontSize: 52, marginBottom: 14, lineHeight: 1 }}>📒</p>
          <p style={{ fontSize: 18, fontWeight: 800, color: "#1a1a1a", marginBottom: 8 }}>
            {filter === "الكل"
              ? "لا توجد ملاحظات بعد"
              : `لا توجد ملاحظات في "${filter}"`}
          </p>
          <p style={{ fontSize: 13, color: "#aaa", marginBottom: 28, lineHeight: 1.9 }}>
            {filter === "الكل"
              ? "ابدأ بتسجيل ملاحظاتك حول تغذيتك وتمارينك وأهدافك الصحية"
              : "جرّب تصفية مختلفة أو أضف ملاحظة جديدة بهذا التصنيف"}
          </p>
          {filter === "الكل" && (
            <motion.button
              onClick={openCreate}
              whileHover={{ y: -2, boxShadow: "0 10px 24px rgba(45,106,79,0.28)" }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "13px 28px", borderRadius: 14, minHeight: 44,
                background: "linear-gradient(135deg, #2D6A4F, #40916C)",
                color: "white", border: "none",
                fontWeight: 800, fontSize: 15, fontFamily: "inherit",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(45,106,79,0.25)",
              }}
            >
              <Plus size={18} />
              أضف ملاحظتك الأولى
            </motion.button>
          )}
        </motion.div>
      )}

      {/* ── Notes grid ── */}
      {!loading && filteredNotes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredNotes.map((note, i) => {
              const tag = tagFor(note.tag);
              return (
                <motion.div
                  key={note.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: Math.min(i * 0.05, 0.25) }}
                  onClick={() => openEdit(note)}
                  whileHover={{ y: -3, boxShadow: "0 10px 32px rgba(80,60,30,0.13)" }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    ...CARD,
                    cursor: "pointer",
                    padding: 20,
                  }}
                >
                  {/* Title + tag row */}
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: "flex-start", gap: 10, marginBottom: 10,
                  }}>
                    <p style={{
                      fontSize: 15, fontWeight: 800, color: "#1a1a1a",
                      lineHeight: 1.4, flex: 1, minWidth: 0,
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}>
                      {note.title}
                    </p>
                    <span style={{
                      flexShrink: 0, padding: "4px 10px", borderRadius: 999,
                      fontSize: 11, fontWeight: 700,
                      backgroundColor: tag.bg, color: tag.color,
                      border: `1px solid ${tag.color}30`,
                      whiteSpace: "nowrap",
                    }}>
                      {note.tag}
                    </span>
                  </div>

                  {/* Content preview */}
                  {note.content.trim() && (
                    <p style={{
                      fontSize: 13, color: "#777", lineHeight: 1.7,
                      marginBottom: 14,
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                    }}>
                      {note.content}
                    </p>
                  )}

                  {/* Date */}
                  <p style={{ fontSize: 11, color: "#bbb", fontWeight: 600 }}>
                    {formatDate(note.updated_at)}
                  </p>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* ── Modal ── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            key="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeModal}
            style={{
              position: "fixed", inset: 0, zIndex: 200,
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: 16,
              backgroundColor: "rgba(0,0,0,0.38)",
              backdropFilter: "blur(5px)",
              WebkitBackdropFilter: "blur(5px)",
            }}
          >
            {/* Card — stop click propagation so overlay click doesn't fire */}
            <motion.div
              key="modal-card"
              initial={{ y: 32, scale: 0.96, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 24, scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={e => e.stopPropagation()}
              dir="rtl"
              style={{
                width: "100%", maxWidth: 520,
                maxHeight: "88vh", overflowY: "auto",
                backgroundColor: "white",
                borderRadius: 22,
                padding: "24px 22px 28px",
                boxShadow: "0 24px 64px rgba(0,0,0,0.20)",
                boxSizing: "border-box",
                fontFamily: "'Cairo','Segoe UI',sans-serif",
              }}
            >

              {/* Modal header */}
              <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center", marginBottom: 22,
              }}>
                <h2 style={{ fontSize: 18, fontWeight: 900, color: "#1a1a1a" }}>
                  {editingNote ? "تعديل الملاحظة" : "ملاحظة جديدة"}
                </h2>
                <button
                  onClick={closeModal}
                  style={{
                    width: 36, height: 36, borderRadius: 10,
                    border: "none", backgroundColor: "rgba(190,175,155,0.15)",
                    cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <X size={18} color="#888" />
                </button>
              </div>

              {/* Title */}
              <label style={{
                fontSize: 13, fontWeight: 700, color: "#555",
                display: "block", marginBottom: 6,
              }}>
                العنوان *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="عنوان الملاحظة"
                maxLength={100}
                style={{
                  width: "100%", boxSizing: "border-box",
                  padding: "12px 14px", borderRadius: 12,
                  border: "1.5px solid rgba(190,175,155,0.35)",
                  backgroundColor: "#FAFAF7",
                  fontSize: 16, fontFamily: "inherit",
                  outline: "none", color: "#333", direction: "rtl",
                  marginBottom: 18, display: "block",
                  transition: "border-color 0.2s",
                }}
                onFocus={e => { e.target.style.borderColor = "#3D7A5E"; }}
                onBlur={e  => { e.target.style.borderColor = "rgba(190,175,155,0.35)"; }}
              />

              {/* Content */}
              <label style={{
                fontSize: 13, fontWeight: 700, color: "#555",
                display: "block", marginBottom: 6,
              }}>
                المحتوى
              </label>
              <textarea
                value={form.content}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                placeholder="أضف تفاصيل ملاحظتك هنا..."
                maxLength={2000}
                rows={5}
                style={{
                  width: "100%", boxSizing: "border-box",
                  padding: "12px 14px", borderRadius: 12,
                  border: "1.5px solid rgba(190,175,155,0.35)",
                  backgroundColor: "#FAFAF7",
                  fontSize: 16, fontFamily: "inherit",
                  outline: "none", color: "#333", direction: "rtl",
                  lineHeight: 1.7, resize: "vertical",
                  marginBottom: 20, display: "block",
                  transition: "border-color 0.2s",
                }}
                onFocus={e => { e.target.style.borderColor = "#3D7A5E"; }}
                onBlur={e  => { e.target.style.borderColor = "rgba(190,175,155,0.35)"; }}
              />

              {/* Tag chips */}
              <label style={{
                fontSize: 13, fontWeight: 700, color: "#555",
                display: "block", marginBottom: 10,
              }}>
                التصنيف
              </label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 26 }}>
                {TAGS.map(tag => (
                  <button
                    key={tag.value}
                    onClick={() => setForm(f => ({ ...f, tag: tag.value }))}
                    style={{
                      padding: "7px 16px", borderRadius: 999, minHeight: 36,
                      fontSize: 13, fontWeight: 700,
                      backgroundColor: form.tag === tag.value ? tag.color : tag.bg,
                      color: form.tag === tag.value ? "white" : tag.color,
                      border: `1.5px solid ${tag.color}40`,
                      cursor: "pointer", fontFamily: "inherit",
                      transition: "all 0.15s",
                    }}
                  >
                    {tag.value}
                  </button>
                ))}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {editingNote && (
                  <button
                    onClick={deleteNote}
                    disabled={deleting || saving}
                    style={{
                      flexShrink: 0,
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "12px 16px", borderRadius: 12, minHeight: 44,
                      backgroundColor: "rgba(192,57,43,0.08)",
                      border: "1.5px solid rgba(192,57,43,0.22)",
                      color: "#c0392b", fontWeight: 700, fontSize: 13,
                      cursor: deleting ? "wait" : "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    <Trash2 size={15} />
                    {deleting ? "جاري الحذف..." : "حذف"}
                  </button>
                )}

                <button
                  onClick={closeModal}
                  disabled={saving || deleting}
                  style={{
                    flex: 1, minHeight: 44,
                    padding: "12px 16px", borderRadius: 12,
                    backgroundColor: "rgba(190,175,155,0.15)",
                    border: "1.5px solid rgba(190,175,155,0.30)",
                    color: "#777", fontWeight: 700, fontSize: 14,
                    cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  إلغاء
                </button>

                <button
                  onClick={saveNote}
                  disabled={saving || !form.title.trim()}
                  style={{
                    flex: 2, minHeight: 44,
                    padding: "12px 16px", borderRadius: 12,
                    background: saving || !form.title.trim()
                      ? "rgba(190,175,155,0.25)"
                      : "linear-gradient(135deg, #2D6A4F, #40916C)",
                    border: "none",
                    color: saving || !form.title.trim() ? "#aaa" : "white",
                    fontWeight: 800, fontSize: 14, fontFamily: "inherit",
                    cursor: saving || !form.title.trim() ? "not-allowed" : "pointer",
                    boxShadow: saving || !form.title.trim()
                      ? "none"
                      : "0 4px 14px rgba(45,106,79,0.28)",
                    transition: "background 0.2s",
                  }}
                >
                  {saving
                    ? "جاري الحفظ..."
                    : editingNote ? "حفظ التغييرات" : "إضافة الملاحظة"}
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
