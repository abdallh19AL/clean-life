import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/* ── In-memory rate limit: max 10 requests per user per 60 seconds ── */
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT  = 10;
const WINDOW_MS   = 60_000;

function checkRateLimit(userId: string): boolean {
  const now        = Date.now();
  const timestamps = (rateLimitMap.get(userId) ?? []).filter(t => now - t < WINDOW_MS);
  if (timestamps.length >= RATE_LIMIT) return false;
  timestamps.push(now);
  rateLimitMap.set(userId, timestamps);
  return true;
}

export async function POST(req: NextRequest) {
  /* ── 1. Auth ── */
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

  /* ── 2. Rate limit ── */
  if (!checkRateLimit(user.id)) {
    return NextResponse.json(
      { error: "Too many requests — please wait a minute before trying again" },
      { status: 429 }
    );
  }

  /* ── 3. Parse & validate input ── */
  try {
    const { meal } = await req.json();

    if (!meal) {
      return NextResponse.json({ error: "No meal provided" }, { status: 400 });
    }
    if (typeof meal !== "string" || meal.length > 500) {
      return NextResponse.json(
        { error: "Meal description must be a string under 500 characters" },
        { status: 400 }
      );
    }

    /* ── 4. Call OpenRouter ── */
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

    return NextResponse.json(parsed);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to analyze meal" }, { status: 500 });
  }
}
