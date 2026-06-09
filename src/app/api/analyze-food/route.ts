import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are an expert nutritionist. The user will describe a meal in Arabic.
You must estimate the nutritional value and return ONLY a valid JSON object with these exact keys:
- calories (number)
- protein (number in grams)
- carbs (number in grams)
- fats (number in grams)
- vitamins (short Arabic string mentioning key vitamins)
- tip (short professional Arabic nutritional tip about this meal)
Return ONLY raw JSON, no markdown, no backticks, no explanation.`;

export async function POST(req: NextRequest) {
  try {
    const { meal } = await req.json();
    if (!meal) return NextResponse.json({ error: "No meal provided" }, { status: 400 });

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY!,
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ parts: [{ text: meal }] }],
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("Gemini API error:", err);
      return NextResponse.json({ error: "Gemini API error" }, { status: 500 });
    }

    const json = await response.json();
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const clean = text.replace(/```json|```/g, "").trim();
    const data = JSON.parse(clean);

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to analyze meal" }, { status: 500 });
  }
}
