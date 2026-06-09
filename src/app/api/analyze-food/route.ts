import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { meal } = await req.json();
    if (!meal) return NextResponse.json({ error: "No meal provided" }, { status: 400 });

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

    const data = await response.json();
    const text = data.choices[0].message.content.trim();
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return NextResponse.json(parsed);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to analyze meal" }, { status: 500 });
  }
}
