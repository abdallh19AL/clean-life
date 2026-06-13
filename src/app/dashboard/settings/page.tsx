"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import {
  Camera, User, Mail, Calendar, LogOut, Shield, Bell,
  Globe, ChevronRight, Edit3, Save, X, Lock, Crown,
  AlertTriangle, CheckCircle, RefreshCw, Eye, EyeOff,
} from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

/* ─── Types ──────────────────────────────────────────────────────────────── */

type Tab = "profile" | "account" | "notifications" | "security";

interface Profile {
  fullName:      string;
  email:         string;
  phone:         string;
  bio:           string;
  birthDate:     string;
  gender:        string;
  city:          string;
  targetWeight:  string;
  activityLevel: string;
  healthGoal:    string;
}

interface Notifs {
  appointments: boolean;
  workouts:     boolean;
  nutrition:    boolean;
  weeklyReport: boolean;
  offers:       boolean;
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase() || "CL";
}

function calcAge(dateStr: string) {
  if (!dateStr) return null;
  const birth = new Date(dateStr);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function daysSince(dateStr: string) {
  if (!dateStr) return 0;
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
}

function formatCreatedAt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" });
}

/* ─── Styled pieces ──────────────────────────────────────────────────────── */

const CARD: React.CSSProperties = {
  backgroundColor: "rgba(255,255,255,0.90)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  border: "1px solid rgba(190,175,155,0.22)",
  borderRadius: 20,
  boxShadow: "0 2px 16px rgba(80,60,30,0.07)",
};

const baseInput: React.CSSProperties = {
  width: "100%", boxSizing: "border-box",
  padding: "11px 14px", borderRadius: 12,
  border: "1.5px solid rgba(190,175,155,0.35)",
  backgroundColor: "#FCFAF6",
  fontSize: 16, fontFamily: "inherit", color: "#1a2e22",
  outline: "none", direction: "rtl", transition: "border-color 0.2s",
};

const disabledInput: React.CSSProperties = {
  ...baseInput,
  backgroundColor: "rgba(245,242,237,0.7)",
  color: "#aaa", cursor: "not-allowed",
};

function Field({ label, children, sub }: { label: string; children: React.ReactNode; sub?: string }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ fontSize: 12, fontWeight: 800, color: "#4A6B5C", display: "block", marginBottom: 6 }}>
        {label}
      </label>
      {children}
      {sub && <p style={{ fontSize: 11, color: "#bbb", marginTop: 4 }}>{sub}</p>}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, marginTop: 8 }}>
      <div style={{ flex: 1, height: 1, backgroundColor: "rgba(190,175,155,0.28)" }} />
      <span style={{ fontSize: 12, fontWeight: 800, color: "#aaa", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>
        {children}
      </span>
      <div style={{ flex: 1, height: 1, backgroundColor: "rgba(190,175,155,0.28)" }} />
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <motion.div
      onClick={() => onChange(!value)}
      animate={{ backgroundColor: value ? "#3D7A5E" : "rgba(190,175,155,0.30)" }}
      transition={{ duration: 0.2 }}
      style={{
        width: 44, height: 24, borderRadius: 999, cursor: "pointer",
        position: "relative", flexShrink: 0,
      }}
    >
      <motion.div
        animate={{ x: value ? 22 : 2 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        style={{
          position: "absolute", top: 2, width: 20, height: 20,
          borderRadius: "50%", backgroundColor: "white",
          boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
        }}
      />
    </motion.div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */

export default function SettingsPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [user,          setUser]          = useState<SupabaseUser | null>(null);
  const [profile,       setProfile]       = useState<Profile>({
    fullName: "", email: "", phone: "", bio: "",
    birthDate: "", gender: "", city: "",
    targetWeight: "", activityLevel: "", healthGoal: "",
  });
  const [isEditing,     setIsEditing]     = useState(false);
  const [isSaving,      setIsSaving]      = useState(false);
  const [savedOk,       setSavedOk]       = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [heightCm,      setHeightCm]      = useState("");
  const [activeTab,     setActiveTab]     = useState<Tab>("profile");

  // Notification toggles
  const [notifs, setNotifs] = useState<Notifs>({
    appointments: true,
    workouts:     true,
    nutrition:    false,
    weeklyReport: true,
    offers:       false,
  });

  // Security
  const [passwords,    setPasswords]    = useState({ current: "", next: "", confirm: "" });
  const [showPw,       setShowPw]       = useState({ current: false, next: false, confirm: false });
  const [pwSaving,     setPwSaving]     = useState(false);
  const [pwMsg,        setPwMsg]        = useState<{ ok: boolean; text: string } | null>(null);

  // Danger zone
  const [deletePhrase, setDeletePhrase] = useState("");
  const [deleteError,  setDeleteError]  = useState("");

  /* ── Fetch user ── */
  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        setProfile(p => ({
          ...p,
          fullName: user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "",
          email:    user.email ?? "",
        }));

        const { data: prof } = await supabase
          .from("profiles")
          .select("height_cm")
          .eq("id", user.id)
          .maybeSingle();
        if (prof?.height_cm != null) setHeightCm(String(prof.height_cm));
      }
    })();
  }, []);

  /* ── Avatar upload ── */
  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setAvatarPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    setIsSaving(true);
    if (user && heightCm !== "") {
      const supabase = createClient();
      await supabase
        .from("profiles")
        .upsert({ id: user.id, height_cm: parseFloat(heightCm) }, { onConflict: "id" });
    }
    setIsSaving(false);
    setIsEditing(false);
    setSavedOk(true);
    setTimeout(() => setSavedOk(false), 3000);
  }

  /* ── Logout ── */
  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  /* ── Password change ── */
  async function handlePasswordChange() {
    if (!passwords.next) return;
    if (passwords.next !== passwords.confirm) {
      setPwMsg({ ok: false, text: "كلمتا المرور غير متطابقتين" });
      return;
    }
    if (passwords.next.length < 6) {
      setPwMsg({ ok: false, text: "يجب أن تكون كلمة المرور 6 أحرف على الأقل" });
      return;
    }
    setPwSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: passwords.next });
      if (error) throw error;
      setPwMsg({ ok: true, text: "تم تحديث كلمة المرور بنجاح" });
      setPasswords({ current: "", next: "", confirm: "" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "حدث خطأ ما";
      setPwMsg({ ok: false, text: message });
    } finally {
      setPwSaving(false);
      setTimeout(() => setPwMsg(null), 4000);
    }
  }

  const initials = getInitials(profile.fullName || "CL");
  const age      = calcAge(profile.birthDate);
  const days     = daysSince(user?.created_at ?? "");

  /* ─── Sidebar tabs ─────────────────────────────────────────────────────── */
  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "profile",       label: "الملف الشخصي",   icon: User    },
    { id: "account",       label: "معلومات الحساب",  icon: Crown   },
    { id: "notifications", label: "الإشعارات",       icon: Bell    },
    { id: "security",      label: "الأمان",           icon: Shield  },
  ];

  /* ─── Tab content ──────────────────────────────────────────────────────── */

  function ProfileTab() {
    return (
      <div>
        {/* ── Basic info ── */}
        <SectionTitle>المعلومات الأساسية</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <Field label="الاسم الكامل">
            <input
              value={profile.fullName}
              disabled={!isEditing}
              onChange={e => setProfile(p => ({ ...p, fullName: e.target.value }))}
              style={isEditing ? baseInput : disabledInput}
              onFocus={e => { if (isEditing) e.target.style.borderColor = "#3D7A5E"; }}
              onBlur={e  => { e.target.style.borderColor = "rgba(190,175,155,0.35)"; }}
            />
          </Field>
          <Field label="البريد الإلكتروني" sub="لا يمكن تغيير البريد الإلكتروني">
            <div style={{ position: "relative" }}>
              <input value={profile.email} disabled style={disabledInput} />
              <Lock size={13} color="#ccc" style={{ position: "absolute", top: "50%", left: 12, transform: "translateY(-50%)" }} />
            </div>
          </Field>
          <Field label="رقم الهاتف">
            <input
              value={profile.phone}
              disabled={!isEditing}
              onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
              placeholder="+962 XX XXX XXXX"
              style={isEditing ? baseInput : disabledInput}
              onFocus={e => { if (isEditing) e.target.style.borderColor = "#3D7A5E"; }}
              onBlur={e  => { e.target.style.borderColor = "rgba(190,175,155,0.35)"; }}
            />
          </Field>
          <Field label="المدينة">
            <input
              value={profile.city}
              disabled={!isEditing}
              onChange={e => setProfile(p => ({ ...p, city: e.target.value }))}
              placeholder="مثال: عمّان"
              style={isEditing ? baseInput : disabledInput}
              onFocus={e => { if (isEditing) e.target.style.borderColor = "#3D7A5E"; }}
              onBlur={e  => { e.target.style.borderColor = "rgba(190,175,155,0.35)"; }}
            />
          </Field>
        </div>
        <Field label={`نبذة عنك (${profile.bio.length}/200 حرف)`}>
          <textarea
            value={profile.bio}
            disabled={!isEditing}
            maxLength={200}
            rows={3}
            onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
            placeholder="اكتب نبذة مختصرة عن نفسك..."
            style={{ ...(isEditing ? baseInput : disabledInput), resize: "none" }}
            onFocus={e => { if (isEditing) e.target.style.borderColor = "#3D7A5E"; }}
            onBlur={e  => { e.target.style.borderColor = "rgba(190,175,155,0.35)"; }}
          />
        </Field>

        {/* ── Personal info ── */}
        <SectionTitle>المعلومات الشخصية</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
          <Field label="تاريخ الميلاد">
            <input
              type="date"
              value={profile.birthDate}
              disabled={!isEditing}
              onChange={e => setProfile(p => ({ ...p, birthDate: e.target.value }))}
              style={isEditing ? baseInput : disabledInput}
              onFocus={e => { if (isEditing) e.target.style.borderColor = "#3D7A5E"; }}
              onBlur={e  => { e.target.style.borderColor = "rgba(190,175,155,0.35)"; }}
            />
          </Field>
          <Field label="العمر" sub="يُحسب تلقائياً">
            <input
              value={age !== null ? `${age} سنة` : "—"}
              disabled
              style={disabledInput}
            />
          </Field>
          <Field label="الجنس">
            <select
              value={profile.gender}
              disabled={!isEditing}
              onChange={e => setProfile(p => ({ ...p, gender: e.target.value }))}
              style={{ ...(isEditing ? baseInput : disabledInput), cursor: isEditing ? "pointer" : "not-allowed" }}
              onFocus={e => { if (isEditing) e.target.style.borderColor = "#3D7A5E"; }}
              onBlur={e  => { e.target.style.borderColor = "rgba(190,175,155,0.35)"; }}
            >
              <option value="">اختر</option>
              <option value="male">ذكر</option>
              <option value="female">أنثى</option>
            </select>
          </Field>
        </div>

        {/* ── Health goals ── */}
        <SectionTitle>الأهداف الصحية</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <Field label="الطول بالسنتيمتر (سم)" sub="يستخدم لحساب مؤشر كتلة الجسم BMI في صفحة التقدم">
            <input
              type="number" min="100" max="250" step="1"
              value={heightCm}
              disabled={!isEditing}
              onChange={e => setHeightCm(e.target.value)}
              placeholder="مثال: 175"
              style={isEditing ? baseInput : disabledInput}
              onFocus={e => { if (isEditing) e.target.style.borderColor = "#3D7A5E"; }}
              onBlur={e  => { e.target.style.borderColor = "rgba(190,175,155,0.35)"; }}
            />
          </Field>
          <Field label="الوزن المستهدف (كغ)">
            <input
              type="number" min="30" max="300" step="0.5"
              value={profile.targetWeight}
              disabled={!isEditing}
              onChange={e => setProfile(p => ({ ...p, targetWeight: e.target.value }))}
              placeholder="مثال: 75"
              style={isEditing ? baseInput : disabledInput}
              onFocus={e => { if (isEditing) e.target.style.borderColor = "#3D7A5E"; }}
              onBlur={e  => { e.target.style.borderColor = "rgba(190,175,155,0.35)"; }}
            />
          </Field>
          <Field label="مستوى النشاط">
            <select
              value={profile.activityLevel}
              disabled={!isEditing}
              onChange={e => setProfile(p => ({ ...p, activityLevel: e.target.value }))}
              style={{ ...(isEditing ? baseInput : disabledInput), cursor: isEditing ? "pointer" : "not-allowed" }}
            >
              <option value="">اختر</option>
              <option value="sedentary">خامل</option>
              <option value="light">خفيف</option>
              <option value="moderate">معتدل</option>
              <option value="active">نشيط</option>
              <option value="very-active">مكثف</option>
            </select>
          </Field>
          <Field label="الهدف الصحي">
            <select
              value={profile.healthGoal}
              disabled={!isEditing}
              onChange={e => setProfile(p => ({ ...p, healthGoal: e.target.value }))}
              style={{ ...(isEditing ? baseInput : disabledInput), cursor: isEditing ? "pointer" : "not-allowed" }}
            >
              <option value="">اختر</option>
              <option value="lose">خسارة وزن</option>
              <option value="gain">زيادة كتلة</option>
              <option value="maintain">صحة عامة</option>
            </select>
          </Field>
        </div>

        {/* ── Action buttons ── */}
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          {isEditing ? (
            <>
              <motion.button
                whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                onClick={handleSave}
                disabled={isSaving}
                style={{
                  padding: "11px 24px", borderRadius: 12, border: "none",
                  background: "linear-gradient(135deg, #2D6A4F, #40916C)",
                  color: "white", fontWeight: 800, fontSize: 14,
                  fontFamily: "inherit", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 8,
                  boxShadow: "0 4px 16px rgba(45,106,79,0.28)",
                }}
              >
                {isSaving ? <RefreshCw size={15} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={15} />}
                {isSaving ? "جاري الحفظ..." : "حفظ التغييرات"}
              </motion.button>
              <motion.button
                whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
                onClick={() => setIsEditing(false)}
                style={{
                  padding: "11px 20px", borderRadius: 12,
                  border: "1.5px solid rgba(190,175,155,0.40)",
                  background: "transparent", color: "#888",
                  fontWeight: 700, fontSize: 14,
                  fontFamily: "inherit", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 6,
                }}
              >
                <X size={15} /> إلغاء
              </motion.button>
            </>
          ) : (
            <motion.button
              whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
              onClick={() => setIsEditing(true)}
              style={{
                padding: "11px 24px", borderRadius: 12,
                border: "1.5px solid rgba(61,122,94,0.35)",
                background: "rgba(61,122,94,0.06)",
                color: "#3D7A5E", fontWeight: 800, fontSize: 14,
                fontFamily: "inherit", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8,
              }}
            >
              <Edit3 size={15} /> تعديل المعلومات
            </motion.button>
          )}
        </div>

        {/* Save success toast */}
        <AnimatePresence>
          {savedOk && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              style={{
                marginTop: 16,
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 16px", borderRadius: 12,
                backgroundColor: "rgba(39,174,96,0.08)",
                border: "1.5px solid rgba(39,174,96,0.25)",
                color: "#27AE60", fontSize: 14, fontWeight: 700,
              }}
            >
              <CheckCircle size={16} /> تم حفظ التغييرات بنجاح
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  function AccountTab() {
    const created = user?.created_at ? formatCreatedAt(user.created_at) : "—";
    const stats = [
      { label: "أيام العضوية",         value: days },
      { label: "الجلسات المكتملة",     value: 24  },
      { label: "التمارين المنجزة",     value: 87  },
    ];
    return (
      <div>
        {/* Account info card */}
        <div style={{ ...CARD, padding: 24, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 16,
              background: "linear-gradient(135deg, #D4A017, #F0C040)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 16px rgba(212,160,23,0.30)",
            }}>
              <Crown size={26} color="white" />
            </div>
            <div>
              <p style={{ fontSize: 18, fontWeight: 900, color: "#1a1a1a" }}>عضو مميز</p>
              <p style={{ fontSize: 13, color: "#aaa" }}>Premium Member</p>
            </div>
          </div>
          <p style={{ fontSize: 13, color: "#888", marginBottom: 4 }}>
            <span style={{ fontWeight: 700, color: "#555" }}>تاريخ التسجيل:</span> {created}
          </p>
          <p style={{ fontSize: 13, color: "#888" }}>
            <span style={{ fontWeight: 700, color: "#555" }}>البريد:</span> {profile.email || "—"}
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-[14px] mb-5">
          {stats.map(({ label, value }) => (
            <motion.div
              key={label}
              whileHover={{ y: -3 }}
              style={{ ...CARD, padding: "20px 16px", textAlign: "center" }}
            >
              <p style={{ fontSize: 30, fontWeight: 900, color: "#3D7A5E", lineHeight: 1 }}>{value}</p>
              <p style={{ fontSize: 12, color: "#aaa", marginTop: 4 }}>{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Account actions */}
        <SectionTitle>إجراءات الحساب</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <motion.button
            whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
            onClick={handleLogout}
            style={{
              padding: "13px 20px", borderRadius: 14,
              border: "1.5px solid rgba(190,175,155,0.35)",
              background: "transparent",
              color: "#555", fontWeight: 700, fontSize: 14,
              fontFamily: "inherit", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 10,
            }}
          >
            <RefreshCw size={16} color="#888" /> تبديل الحساب
          </motion.button>
          <motion.button
            whileHover={{ y: -2, backgroundColor: "rgba(224,122,95,0.09)" }}
            whileTap={{ scale: 0.97 }}
            onClick={handleLogout}
            style={{
              padding: "13px 20px", borderRadius: 14,
              border: "1.5px solid rgba(224,122,95,0.35)",
              background: "rgba(224,122,95,0.06)",
              color: "#E07A5F", fontWeight: 800, fontSize: 14,
              fontFamily: "inherit", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 10,
            }}
          >
            <LogOut size={16} /> تسجيل الخروج
          </motion.button>
        </div>
      </div>
    );
  }

  function NotificationsTab() {
    const items: { key: keyof Notifs; label: string; sub: string }[] = [
      { key: "appointments", label: "إشعارات المواعيد",        sub: "تذكيرات قبل كل موعد بساعة"          },
      { key: "workouts",     label: "تذكيرات التمارين",         sub: "تنبيه يومي في وقت تمرينك"           },
      { key: "nutrition",    label: "نصائح التغذية اليومية",    sub: "نصيحة غذائية كل صباح"               },
      { key: "weeklyReport", label: "تقارير التقدم الأسبوعية",  sub: "ملخص أسبوعي لإنجازاتك"              },
      { key: "offers",       label: "العروض والتحديثات",         sub: "أحدث العروض والخدمات الجديدة"       },
    ];
    return (
      <div>
        <p style={{ fontSize: 13, color: "#aaa", marginBottom: 24 }}>
          تحكم في الإشعارات التي تريد تلقيها من العيادة
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {items.map(({ key, label, sub }) => (
            <div
              key={key}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "16px 18px", borderRadius: 14,
                border: "1.5px solid rgba(190,175,155,0.18)",
                backgroundColor: notifs[key] ? "rgba(61,122,94,0.04)" : "rgba(255,255,255,0.7)",
                marginBottom: 8,
              }}
            >
              <div>
                <p style={{ fontSize: 14, fontWeight: 800, color: "#1a1a1a", marginBottom: 2 }}>{label}</p>
                <p style={{ fontSize: 12, color: "#aaa" }}>{sub}</p>
              </div>
              <Toggle
                value={notifs[key]}
                onChange={v => setNotifs(n => ({ ...n, [key]: v }))}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  function SecurityTab() {
    return (
      <div>
        {/* Password change */}
        <SectionTitle>تغيير كلمة المرور</SectionTitle>
        <div style={{ ...CARD, padding: 24, marginBottom: 24 }}>
          {(["current", "next", "confirm"] as const).map(k => {
            const labels: Record<typeof k, string> = {
              current: "كلمة المرور الحالية",
              next:    "كلمة المرور الجديدة",
              confirm: "تأكيد كلمة المرور الجديدة",
            };
            return (
              <Field key={k} label={labels[k]}>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPw[k] ? "text" : "password"}
                    value={passwords[k]}
                    onChange={e => setPasswords(p => ({ ...p, [k]: e.target.value }))}
                    placeholder="••••••••"
                    style={{ ...baseInput, paddingLeft: 40 }}
                    onFocus={e => { e.target.style.borderColor = "#3D7A5E"; }}
                    onBlur={e  => { e.target.style.borderColor = "rgba(190,175,155,0.35)"; }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(s => ({ ...s, [k]: !s[k] }))}
                    style={{
                      position: "absolute", top: "50%", left: 12,
                      transform: "translateY(-50%)",
                      background: "none", border: "none", cursor: "pointer", padding: 0,
                    }}
                  >
                    {showPw[k]
                      ? <EyeOff size={15} color="#bbb" />
                      : <Eye size={15} color="#bbb" />
                    }
                  </button>
                </div>
              </Field>
            );
          })}

          <AnimatePresence>
            {pwMsg && (
              <motion.div
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{
                  padding: "10px 14px", borderRadius: 10, marginBottom: 14,
                  backgroundColor: pwMsg.ok ? "rgba(39,174,96,0.08)" : "rgba(224,122,95,0.08)",
                  border: `1.5px solid ${pwMsg.ok ? "rgba(39,174,96,0.25)" : "rgba(224,122,95,0.25)"}`,
                  color: pwMsg.ok ? "#27AE60" : "#E07A5F",
                  fontSize: 13, fontWeight: 700,
                  display: "flex", alignItems: "center", gap: 8,
                }}
              >
                {pwMsg.ok ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                {pwMsg.text}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
            onClick={handlePasswordChange}
            disabled={pwSaving || !passwords.next || !passwords.confirm}
            style={{
              padding: "12px 24px", borderRadius: 12, border: "none",
              background: passwords.next && passwords.confirm
                ? "linear-gradient(135deg, #2D6A4F, #40916C)"
                : "rgba(190,175,155,0.25)",
              color: passwords.next && passwords.confirm ? "white" : "#aaa",
              fontWeight: 800, fontSize: 14,
              fontFamily: "inherit",
              cursor: passwords.next && passwords.confirm ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", gap: 8,
              boxShadow: passwords.next && passwords.confirm ? "0 4px 16px rgba(45,106,79,0.25)" : "none",
            }}
          >
            {pwSaving ? <RefreshCw size={15} /> : <Lock size={15} />}
            {pwSaving ? "جاري التحديث..." : "تحديث كلمة المرور"}
          </motion.button>
        </div>

        {/* Danger zone */}
        <SectionTitle>منطقة الخطر</SectionTitle>
        <div style={{
          ...CARD, padding: 24,
          border: "1.5px solid rgba(224,122,95,0.30)",
          backgroundColor: "rgba(224,122,95,0.03)",
        }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 20 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, flexShrink: 0,
              backgroundColor: "rgba(224,122,95,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <AlertTriangle size={20} color="#E07A5F" />
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 900, color: "#E07A5F", marginBottom: 4 }}>حذف الحساب</p>
              <p style={{ fontSize: 13, color: "#888", lineHeight: 1.7 }}>
                سيتم حذف جميع بياناتك نهائياً ولا يمكن التراجع عن هذا الإجراء.
                اكتب <strong style={{ color: "#E07A5F" }}>احذف حسابي</strong> للتأكيد.
              </p>
            </div>
          </div>

          <input
            value={deletePhrase}
            onChange={e => { setDeletePhrase(e.target.value); setDeleteError(""); }}
            placeholder="اكتب: احذف حسابي"
            style={{ ...baseInput, borderColor: deleteError ? "#E07A5F" : "rgba(224,122,95,0.30)", marginBottom: 12 }}
          />
          {deleteError && (
            <p style={{ color: "#E07A5F", fontSize: 12, marginBottom: 10 }}>{deleteError}</p>
          )}
          <motion.button
            whileHover={deletePhrase === "احذف حسابي" ? { y: -1 } : {}}
            whileTap={deletePhrase === "احذف حسابي" ? { scale: 0.97 } : {}}
            onClick={() => {
              if (deletePhrase !== "احذف حسابي") {
                setDeleteError("يرجى كتابة العبارة بشكل صحيح");
              }
            }}
            style={{
              padding: "11px 20px", borderRadius: 12, border: "none",
              background: deletePhrase === "احذف حسابي"
                ? "linear-gradient(135deg, #E07A5F, #C0392B)"
                : "rgba(190,175,155,0.25)",
              color: deletePhrase === "احذف حسابي" ? "white" : "#aaa",
              fontWeight: 800, fontSize: 14,
              fontFamily: "inherit",
              cursor: deletePhrase === "احذف حسابي" ? "pointer" : "not-allowed",
            }}
          >
            حذف الحساب نهائياً
          </motion.button>
        </div>
      </div>
    );
  }

  /* ─── Render ──────────────────────────────────────────────────────────── */
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      dir="rtl"
      style={{
        minHeight: "100vh", backgroundColor: "#F8F5F0",
        fontFamily: "'Cairo','Segoe UI',sans-serif",
        padding: "28px 24px 80px",
      }}
    >
      {/* ── Page header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <motion.button
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/dashboard")}
            style={{
              width: 40, height: 40, borderRadius: 12, border: "none",
              backgroundColor: "rgba(255,255,255,0.85)",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <ChevronRight size={18} color="#3D7A5E" />
          </motion.button>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: "#1a1a1a", marginBottom: 2 }}>الإعدادات</h1>
            <p style={{ fontSize: 13, color: "#aaa" }}>إدارة ملفك الشخصي وتفضيلاتك</p>
          </div>
        </div>

        <AnimatePresence>
          {isEditing && (
            <motion.button
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
              onClick={handleSave}
              style={{
                padding: "10px 22px", borderRadius: 12, border: "none",
                background: "linear-gradient(135deg, #2D6A4F, #40916C)",
                color: "white", fontWeight: 800, fontSize: 14,
                fontFamily: "inherit", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8,
                boxShadow: "0 4px 16px rgba(45,106,79,0.28)",
              }}
            >
              <Save size={15} /> حفظ التغييرات
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── 2-column layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">

        {/* ── LEFT SIDEBAR ── */}
        <div className="lg:sticky lg:top-[88px]">
          <div style={{ ...CARD, padding: 24 }}>

            {/* Avatar */}
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ position: "relative", display: "inline-block", marginBottom: 12 }}>
                <div style={{
                  width: 80, height: 80, borderRadius: "50%",
                  background: avatarPreview ? "transparent" : "linear-gradient(135deg, #2D6A4F, #52B788)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 28, fontWeight: 900, color: "white",
                  boxShadow: "0 4px 20px rgba(45,106,79,0.28)",
                  overflow: "hidden",
                }}>
                  {avatarPreview
                    ? <img src={avatarPreview} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : initials
                  }
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={() => fileRef.current?.click()}
                  style={{
                    position: "absolute", bottom: 0, left: 0,
                    width: 26, height: 26, borderRadius: "50%", border: "none",
                    backgroundColor: "#3D7A5E",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
                  }}
                >
                  <Camera size={13} color="white" />
                </motion.button>
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} />
              </div>

              <p style={{ fontSize: 16, fontWeight: 900, color: "#1a1a1a", marginBottom: 2 }}>
                {profile.fullName || "مستخدم"}
              </p>
              <p style={{ fontSize: 12, color: "#aaa", marginBottom: 10 }}>{profile.email}</p>
              <span style={{
                fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 999,
                background: "linear-gradient(135deg, rgba(212,160,23,0.15), rgba(240,192,64,0.15))",
                border: "1.5px solid rgba(212,160,23,0.30)",
                color: "#C4900A",
                display: "inline-flex", alignItems: "center", gap: 4,
              }}>
                <Crown size={11} /> عضو مميز
              </span>
              {user?.created_at && (
                <p style={{ fontSize: 11, color: "#ccc", marginTop: 8 }}>
                  عضو منذ {new Date(user.created_at).getFullYear()}
                </p>
              )}
            </div>

            <div style={{ height: 1, backgroundColor: "rgba(190,175,155,0.20)", marginBottom: 16 }} />

            {/* Tab nav */}
            <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {tabs.map(({ id, label, icon: Icon }) => (
                <motion.button
                  key={id}
                  whileHover={{ x: -3 }}
                  onClick={() => setActiveTab(id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 14px", borderRadius: 12, border: "none",
                    backgroundColor: activeTab === id ? "rgba(61,122,94,0.10)" : "transparent",
                    color: activeTab === id ? "#3D7A5E" : "#888",
                    fontWeight: activeTab === id ? 800 : 600,
                    fontSize: 14, fontFamily: "inherit", cursor: "pointer",
                    textAlign: "right", width: "100%",
                    borderRight: activeTab === id ? "3px solid #3D7A5E" : "3px solid transparent",
                    transition: "background 0.15s, color 0.15s",
                  }}
                >
                  <Icon size={16} />
                  <span style={{ flex: 1 }}>{label}</span>
                  {activeTab === id && <ChevronRight size={14} />}
                </motion.button>
              ))}
            </nav>
          </div>
        </div>

        {/* ── RIGHT MAIN CONTENT ── */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          style={{ ...CARD, padding: 32, minHeight: 500 }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 900, color: "#1a1a1a", marginBottom: 24 }}>
            {tabs.find(t => t.id === activeTab)?.label}
          </h2>
          {activeTab === "profile"       && ProfileTab()}
          {activeTab === "account"       && AccountTab()}
          {activeTab === "notifications" && NotificationsTab()}
          {activeTab === "security"      && SecurityTab()}
        </motion.div>
      </div>
    </motion.div>
  );
}
