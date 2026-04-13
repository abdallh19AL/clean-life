import { createClient } from '@supabase/supabase-js';

// استدعاء المفاتيح من ملف .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// إنشاء العميل بطريقة مباشرة ومضمونة
export const supabase = createClient(supabaseUrl, supabaseAnonKey);