"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export function useCalorieGoal(): { goal: number | null; loading: boolean } {
  const [goal,    setGoal]    = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }

        const { data } = await supabase
          .from("profiles")
          .select("calorie_goal")
          .eq("id", user.id)
          .maybeSingle();

        setGoal(data?.calorie_goal ?? null);
      } catch {
        // network / auth error → null goal, never crash
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { goal, loading };
}
