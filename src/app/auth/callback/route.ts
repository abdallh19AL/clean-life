import { supabase } from "@/utils/supabase";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    // استبدال الكود بجلسة دخول حقيقية
    await supabase.auth.exchangeCodeForSession(code);
  }

  // بعد التأكيد، نرسل المستخدم للوحة التحكم
  return NextResponse.redirect(`${origin}/dashboard`);
}