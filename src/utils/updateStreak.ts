import { createClient } from "@/utils/supabase/client";
import { localToday, localYesterday } from "@/utils/dateUtils";

/**
 * Fire-and-forget — call after any successful log write (weight, water, calories).
 * Never throws; failure is silent so the calling UI is never affected.
 *
 * Rules:
 *  - last == today        → already logged today, do nothing
 *  - last == yesterday    → increment current_streak by 1
 *  - last is older / null → reset current_streak to 1 (missed a day or first ever)
 *  - always: longest_streak = max(longest_streak, current_streak)
 */
export async function updateStreak(userId: string): Promise<void> {
  try {
    const supabase = createClient();
    const today     = localToday();
    const yesterday = localYesterday();

    const { data: profile } = await supabase
      .from("profiles")
      .select("current_streak, longest_streak, last_log_date")
      .eq("id", userId)
      .maybeSingle();

    const last           = (profile?.last_log_date as string | null) ?? null;
    const currentStreak  = (profile?.current_streak  as number) ?? 0;
    const longestStreak  = (profile?.longest_streak   as number) ?? 0;

    if (last === today) return; // idempotent — already counted today

    const newStreak  = last === yesterday ? currentStreak + 1 : 1;
    const newLongest = Math.max(longestStreak, newStreak);

    await supabase
      .from("profiles")
      .upsert(
        { id: userId, current_streak: newStreak, longest_streak: newLongest, last_log_date: today },
        { onConflict: "id" }
      );
  } catch {
    // never surface errors to the calling UI
  }
}
