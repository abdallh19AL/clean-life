import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { meal } = await req.json();
    if (!meal) return NextResponse.json({ error: "No meal provided" }, { status: 400 });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `You are an expert nutritionist. The user will describe a meal in Arabic.
      You must estimate the nutritional value and return ONLY a valid JSON object with these exact keys:
      - calories (number)
      - protein (number in grams)
      - carbs (number in grams)
      - fats (number in grams)
      - vitamins (short Arabic string mentioning key vitamins)
      - tip (short professional Arabic nutritional tip about this meal)
      Return ONLY raw JSON, no markdown, no backticks, no explanation.`,
    });

    const result = await model.generateContent(meal);
    const text = result.response.text().trim();
    const clean = text.replace(/```json|```/g, "").trim();
    const data = JSON.parse(clean);

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to analyze meal" }, { status: 500 });
  }
}
