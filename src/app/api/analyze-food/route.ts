import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const LIMIT_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function POST(req: NextRequest) {
  /* ── 1. Auth (server-side — never trust client-sent id) ── */
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll()                { return cookieStore.getAll(); },
        setAll(cookiesToSet)    { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  /* ── 2. 24-hour rate limit (DB-backed, per user) ── */
  const { data: profile } = await supabase
    .from("profiles")
    .select("last_ai_calc_at")
    .eq("id", user.id)
    .maybeSingle();

  const lastUsedAt: string | null = profile?.last_ai_calc_at ?? null;
  if (lastUsedAt !== null && Date.now() - new Date(lastUsedAt).getTime() < LIMIT_MS) {
    return NextResponse.json(
      {
        error: "يمكنك استخدام الحاسبة مرة واحدة كل 24 ساعة",
        lastUsedAt,
      },
      { status: 429 }
    );
  }

  /* ── 3. Parse & validate input ── */
  let meal: string;
  try {
    const body = await req.json();
    meal = body.meal;
    if (!meal) return NextResponse.json({ error: "No meal provided" }, { status: 400 });
    if (typeof meal !== "string" || meal.length > 500) {
      return NextResponse.json(
        { error: "Meal description must be a string under 500 characters" },
        { status: 400 }
      );
    }
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  /* ── 4. Call OpenRouter ── */
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://cleanlife.top",
        "X-Title": "Clean Life Nutrition Calculator",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        max_tokens: 500,
        messages: [
          {
            role: "system",
            content: "You are an expert nutritionist. The user will describe a meal in Arabic. Return ONLY a valid JSON object with these exact keys: calories (number), protein (number in grams), carbs (number in grams), fats (number in grams), vitamins (short Arabic string mentioning key vitamins), tip (short professional Arabic nutritional tip). No markdown, no backticks, just raw JSON.",
          },
          {
            role: "user",
            content: meal,
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("OpenRouter API error:", err);
      return NextResponse.json({ error: "OpenRouter API error" }, { status: 500 });
    }

    const data   = await response.json();
    const text   = data.choices[0].message.content.trim();
    const clean  = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    /* ── 5. Record usage — only after a successful AI response ── */
    await supabase
      .from("profiles")
      .upsert({ id: user.id, last_ai_calc_at: new Date().toISOString() }, { onConflict: "id" });

    return NextResponse.json(parsed);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to analyze meal" }, { status: 500 });
  }
}
