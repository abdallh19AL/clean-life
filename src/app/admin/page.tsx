"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { Plus, Pencil, Trash2, X, Check, LogOut, Package } from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────────────── */

type Product = {
  id:               string;
  name:             string;
  description:      string;
  price:            number;
  category:         string;
  image_url:        string;
  whatsapp_message: string;
  created_at:       string;
};

type FormData = {
  name:             string;
  description:      string;
  price:            string;
  category:         string;
  image_url:        string;
  whatsapp_message: string;
};

type Status = { type: "success" | "error"; msg: string };

/* ─── Constants ─────────────────────────────────────────────────────── */

const ADMIN_EMAIL = "versionlast58@gmail.com";
const CATEGORIES  = ["برامج تدريب", "أنظمة غذائية", "كتب ومقالات", "أخرى"];
const EMPTY_FORM: FormData = {
  name: "", description: "", price: "", category: CATEGORIES[0],
  image_url: "", whatsapp_message: "",
};

/* ─── Small helpers ─────────────────────────────────────────────────── */

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#4A6B5C", marginBottom: 5 }}>
      {children}
    </label>
  );
}

function Input({
  value, onChange, placeholder, type = "text", as, rows, options, required,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string;
  type?: string; as?: "textarea" | "select"; rows?: number;
  options?: string[]; required?: boolean;
}) {
  const shared: React.CSSProperties = {
    width: "100%", boxSizing: "border-box",
    padding: "10px 12px", borderRadius: 10,
    border: "1.5px solid rgba(190,175,155,0.35)",
    backgroundColor: "#FAFAF8", fontSize: 13,
    fontFamily: "inherit", color: "#1a2e22",
    outline: "none", direction: "rtl",
    transition: "border-color 0.2s",
  };
  const focus = { borderColor: "#0D9488" };
  const blur  = { borderColor: "rgba(190,175,155,0.35)" };

  if (as === "textarea") return (
    <textarea
      required={required} value={value} rows={rows ?? 3} placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      onFocus={e => Object.assign(e.currentTarget.style, focus)}
      onBlur={e  => Object.assign(e.currentTarget.style, blur)}
      style={{ ...shared, resize: "vertical" }}
    />
  );

  if (as === "select") return (
    <select
      required={required} value={value}
      onChange={e => onChange(e.target.value)}
      style={{ ...shared, cursor: "pointer" }}
    >
      {options?.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );

  return (
    <input
      required={required} type={type} value={value} placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      onFocus={e => Object.assign(e.currentTarget.style, focus)}
      onBlur={e  => Object.assign(e.currentTarget.style, blur)}
      style={shared}
    />
  );
}

/* ─── Page ──────────────────────────────────────────────────────────── */

export default function AdminPage() {
  const [isAdmin,    setIsAdmin]    = useState(false);
  const [authReady,  setAuthReady]  = useState(false);
  const [products,   setProducts]   = useState<Product[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId,  setEditingId]  = useState<string | null>(null);
  const [form,       setForm]       = useState<FormData>(EMPTY_FORM);
  const [status,     setStatus]     = useState<Status | null>(null);

  /* ── Auth check (getUser — server-verified) ── */
  useEffect(() => {
    createClient().auth.getUser().then(({ data: { user } }) => {
      if (user?.email === ADMIN_EMAIL) {
        setIsAdmin(true);
        fetchProducts();
      } else {
        setLoading(false);
      }
      setAuthReady(true);
    });
  }, []);

  /* Auto-clear status after 4 s */
  useEffect(() => {
    if (!status) return;
    const t = setTimeout(() => setStatus(null), 4000);
    return () => clearTimeout(t);
  }, [status]);

  /* ── Data fetching ── */
  async function fetchProducts() {
    const { data, error } = await createClient()
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setProducts(data);
    setLoading(false);
  }

  /* ── Form helpers ── */
  function set(field: keyof FormData) {
    return (v: string) => setForm(prev => ({ ...prev, [field]: v }));
  }

  function startEdit(p: Product) {
    setEditingId(p.id);
    setForm({
      name: p.name, description: p.description,
      price: String(p.price), category: p.category,
      image_url: p.image_url, whatsapp_message: p.whatsapp_message ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  /* ── Submit (add or update) ── */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatus(null);

    const payload = {
      name:             form.name.trim(),
      description:      form.description.trim(),
      price:            parseFloat(form.price),
      category:         form.category,
      image_url:        form.image_url.trim(),
      whatsapp_message: form.whatsapp_message.trim() ||
                        `أريد الاستفسار عن ${form.name.trim()}`,
    };

    const supabase = createClient();
    let error;

    if (editingId) {
      ({ error } = await supabase.from("products").update(payload).eq("id", editingId));
    } else {
      ({ error } = await supabase.from("products").insert([payload]));
    }

    if (error) {
      setStatus({ type: "error", msg: error.message });
    } else {
      setStatus({ type: "success", msg: editingId ? "✓ تم تحديث المنتج" : "✓ تمت الإضافة بنجاح" });
      cancelEdit();
      await fetchProducts();
    }
    setSaving(false);
  }

  /* ── Delete ── */
  async function handleDelete(id: string, name: string) {
    if (!confirm(`هل أنت متأكد من حذف "${name}"؟`)) return;
    setDeletingId(id);
    const { error } = await createClient().from("products").delete().eq("id", id);
    if (error) {
      setStatus({ type: "error", msg: error.message });
    } else {
      setStatus({ type: "success", msg: "✓ تم حذف المنتج" });
      setProducts(prev => prev.filter(p => p.id !== id));
    }
    setDeletingId(null);
  }

  /* ── Logout ── */
  async function handleLogout() {
    await createClient().auth.signOut();
    window.location.href = "/login";
  }

  /* ── Auth states ── */
  if (!authReady) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#F8F5F0", fontFamily: "'Cairo',sans-serif" }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid #0D9488", borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div dir="rtl" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#F8F5F0", fontFamily: "'Cairo',sans-serif", textAlign: "center", padding: 24 }}>
        <p style={{ fontSize: 52, marginBottom: 16 }}>⛔</p>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: "#E07A5F", marginBottom: 8 }}>الدخول ممنوع</h1>
        <p style={{ color: "#6B7280" }}>هذه الصفحة مخصصة لمدير المشروع فقط.</p>
      </div>
    );
  }

  /* ── Admin UI ── */
  const isEditing = editingId !== null;

  return (
    <div dir="rtl" style={{ minHeight: "100vh", backgroundColor: "#F8F5F0", fontFamily: "'Cairo','Segoe UI',sans-serif" }}>

      {/* ── Top bar ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        backgroundColor: "rgba(252,250,246,0.92)",
        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(190,175,155,0.22)",
        padding: "0 24px", height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: "linear-gradient(135deg, #2D6A4F, #52B788)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 8px rgba(45,106,79,0.28)",
          }}>
            <Package size={18} color="white" />
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 900, color: "#1a2e22", lineHeight: 1.2, margin: 0 }}>لوحة الإدارة</p>
            <p style={{ fontSize: 10, fontWeight: 600, color: "#6B9E80", margin: 0 }}>Clean Life</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "7px 14px", borderRadius: 10,
            border: "1.5px solid rgba(190,175,155,0.35)",
            backgroundColor: "transparent", cursor: "pointer",
            fontSize: 13, fontWeight: 700, color: "#E07A5F",
            fontFamily: "inherit", transition: "background 0.15s",
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(224,122,95,0.08)")}
          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent")}
        >
          <LogOut size={14} />
          خروج
        </button>
      </div>

      {/* ── Status toast ── */}
      <AnimatePresence>
        {status && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed", top: 72, left: "50%", transform: "translateX(-50%)",
              zIndex: 200, padding: "10px 20px", borderRadius: 12,
              backgroundColor: status.type === "success" ? "#ECFDF5" : "#FEF2F2",
              border: `1.5px solid ${status.type === "success" ? "#A7F3D0" : "#FECACA"}`,
              color: status.type === "success" ? "#065F46" : "#DC2626",
              fontSize: 13, fontWeight: 700,
              boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
              whiteSpace: "nowrap",
            }}
          >
            {status.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main layout ── */}
      <div
        className="grid grid-cols-1 lg:grid-cols-5 gap-6"
        style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 20px 60px" }}
      >

        {/* ══ FORM (right column in RTL) ══ */}
        <div className="lg:col-span-2">
          <motion.div
            layout
            style={{
              backgroundColor: "rgba(255,255,255,0.90)",
              border: "1px solid rgba(190,175,155,0.22)",
              borderRadius: 20,
              padding: 24,
              boxShadow: "0 2px 16px rgba(60,50,30,0.07)",
              position: "sticky", top: 72,
            }}
          >
            {/* Form header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 3, height: 20, borderRadius: 99, backgroundColor: isEditing ? "#D97706" : "#0D9488" }} />
                <h2 style={{ fontSize: 16, fontWeight: 900, color: "#1a2e22", margin: 0 }}>
                  {isEditing ? "تعديل المنتج" : "إضافة منتج جديد"}
                </h2>
              </div>
              {isEditing && (
                <button
                  onClick={cancelEdit}
                  style={{
                    display: "flex", alignItems: "center", gap: 4,
                    padding: "4px 10px", borderRadius: 8, border: "none",
                    backgroundColor: "rgba(190,175,155,0.18)", cursor: "pointer",
                    fontSize: 12, fontWeight: 700, color: "#888", fontFamily: "inherit",
                  }}
                >
                  <X size={12} /> إلغاء
                </button>
              )}
            </div>

            {/* Image preview */}
            {form.image_url && (
              <div style={{ marginBottom: 16, borderRadius: 12, overflow: "hidden", height: 140, backgroundColor: "#F0EDE8" }}>
                <img
                  src={form.image_url}
                  alt="preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <Label>اسم المنتج / الخدمة *</Label>
                <Input required value={form.name} onChange={set("name")} placeholder="مثال: برنامج التنشيف 90 يوم" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>السعر (دينار) *</Label>
                  <Input required type="number" value={form.price} onChange={set("price")} placeholder="99" />
                </div>
                <div>
                  <Label>الفئة *</Label>
                  <Input required as="select" value={form.category} onChange={set("category")} options={CATEGORIES} />
                </div>
              </div>

              <div>
                <Label>الوصف *</Label>
                <Input required as="textarea" rows={3} value={form.description} onChange={set("description")} placeholder="وصف مختصر للمنتج أو الخدمة..." />
              </div>

              <div>
                <Label>رابط الصورة (URL)</Label>
                <Input type="url" value={form.image_url} onChange={set("image_url")} placeholder="https://..." />
              </div>

              <div>
                <Label>رسالة واتساب (اختياري)</Label>
                <Input value={form.whatsapp_message} onChange={set("whatsapp_message")} placeholder="أريد الاستفسار عن..." />
                <p style={{ fontSize: 11, color: "#aaa", marginTop: 4 }}>تُملأ تلقائياً إذا تُركت فارغة</p>
              </div>

              <button
                type="submit"
                disabled={saving}
                style={{
                  marginTop: 4,
                  width: "100%", padding: "12px",
                  borderRadius: 12, border: "none",
                  background: saving ? "rgba(190,175,155,0.25)"
                    : isEditing ? "linear-gradient(135deg, #D97706, #B45309)"
                    : "linear-gradient(135deg, #0D9488, #0F766E)",
                  color: saving ? "#aaa" : "white",
                  fontWeight: 800, fontSize: 14, fontFamily: "inherit",
                  cursor: saving ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  boxShadow: saving ? "none" : "0 4px 14px rgba(13,148,136,0.25)",
                  transition: "background 0.2s",
                }}
              >
                {saving ? "جاري الحفظ..." : isEditing ? <><Check size={16} /> حفظ التعديلات</> : <><Plus size={16} /> إضافة للمتجر</>}
              </button>
            </form>
          </motion.div>
        </div>

        {/* ══ PRODUCTS LIST (left column in RTL) ══ */}
        <div className="lg:col-span-3">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 900, color: "#1a2e22", margin: 0 }}>المنتجات</h2>
            <span style={{
              fontSize: 12, fontWeight: 800, padding: "2px 10px", borderRadius: 999,
              backgroundColor: "rgba(13,148,136,0.10)", color: "#0D9488",
            }}>
              {products.length}
            </span>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "48px 0", color: "#aaa", fontSize: 14 }}>جاري التحميل...</div>
          ) : products.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "48px 24px",
              backgroundColor: "rgba(255,255,255,0.6)",
              border: "1.5px dashed rgba(190,175,155,0.35)",
              borderRadius: 16, color: "#bbb", fontSize: 14, fontWeight: 600,
            }}>
              لا توجد منتجات بعد — ابدأ بإضافة أول منتج من النموذج
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {products.map((p) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.25 }}
                    style={{
                      display: "flex", alignItems: "center", gap: 14,
                      backgroundColor: "rgba(255,255,255,0.90)",
                      border: editingId === p.id
                        ? "1.5px solid rgba(217,119,6,0.45)"
                        : "1px solid rgba(190,175,155,0.22)",
                      borderRadius: 16, padding: "12px 16px",
                      boxShadow: editingId === p.id
                        ? "0 0 0 3px rgba(217,119,6,0.08)"
                        : "0 2px 10px rgba(60,50,30,0.05)",
                      transition: "border-color 0.2s, box-shadow 0.2s",
                    }}
                  >
                    {/* Thumbnail */}
                    <div style={{
                      width: 60, height: 60, borderRadius: 10, flexShrink: 0,
                      overflow: "hidden", backgroundColor: "#F0EDE8",
                    }}>
                      {p.image_url ? (
                        <img
                          src={p.image_url} alt={p.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = "0"; }}
                        />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🏷️</div>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 800, color: "#1a2e22", margin: 0, lineHeight: 1.3 }}
                        className="truncate">
                        {p.name}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 13, fontWeight: 900, color: "#0D9488" }}>{p.price} دينار</span>
                        <span style={{
                          fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6,
                          backgroundColor: "rgba(190,175,155,0.15)", color: "#888",
                        }}>{p.category}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      <button
                        onClick={() => startEdit(p)}
                        title="تعديل"
                        style={{
                          width: 34, height: 34, borderRadius: 9,
                          border: "1.5px solid rgba(217,119,6,0.30)",
                          backgroundColor: editingId === p.id ? "rgba(217,119,6,0.12)" : "transparent",
                          color: "#D97706", cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(217,119,6,0.10)")}
                        onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = editingId === p.id ? "rgba(217,119,6,0.12)" : "transparent")}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        disabled={deletingId === p.id}
                        title="حذف"
                        style={{
                          width: 34, height: 34, borderRadius: 9,
                          border: "1.5px solid rgba(224,122,95,0.30)",
                          backgroundColor: "transparent", color: "#E07A5F",
                          cursor: deletingId === p.id ? "not-allowed" : "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          opacity: deletingId === p.id ? 0.5 : 1,
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(224,122,95,0.10)")}
                        onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent")}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
