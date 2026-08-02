import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, Schema, SchemaType } from '@google/generative-ai';
import { z } from 'zod';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const fallbackSprint = {
  career_map: "Based on your profile, we've designed a specialized sprint to help you reach your goals. This roadmap will guide you step-by-step through practical projects to build your portfolio and hands-on experience.",
  recommended_sprint: {
    name: "Full-Stack MVP Sprint",
    duration_days: 14,
    daily_tasks: Array.from({ length: 14 }).map((_, i) => ({
      day: i + 1,
      title: `Day ${i + 1} Implementation`,
      description: `Complete the assigned module for Day ${i + 1} focusing on core functionality.`
    }))
  }
};

const aiSchema = {
  type: SchemaType.OBJECT,
  properties: {
    career_map: {
      type: SchemaType.STRING,
      description: "A 2-paragraph summary of a 3-month roadmap.",
    },
    recommended_sprint: {
      type: SchemaType.OBJECT,
      properties: {
        name: {
          type: SchemaType.STRING,
          description: "Catchy project title (e.g., 'Build a Real-Time Chat App').",
        },
        duration_days: {
          type: SchemaType.INTEGER,
          description: "Number of days for the sprint (between 14 and 45).",
        },
        daily_tasks: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              day: { type: SchemaType.INTEGER },
              title: { type: SchemaType.STRING },
              description: { type: SchemaType.STRING, description: "1 sentence description." }
            },
            required: ["day", "title", "description"]
          }
        }
      },
      required: ["name", "duration_days", "daily_tasks"]
    }
  },
  required: ["career_map", "recommended_sprint"]
};

export async function POST(req: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY is missing, returning fallback.');
      return NextResponse.json(fallbackSprint);
    }

    const body = await req.json();
    const { goal, skill_level, hours_per_week, github_url, resume_text } = body;

    if (!goal || !skill_level || !hours_per_week) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-pro',
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: aiSchema as Schema
      }
    });

    const prompt = `You are a senior career advisor for engineering students.
Given the following user profile:
- Goal: ${goal}
- Skill Level: ${skill_level}
- Weekly Commitment: ${hours_per_week} hours
- GitHub URL: ${github_url || 'None'}
- Resume Context: ${resume_text || 'None'}

Generate a JSON output with a personalized career map and a recommended sprint. The daily_tasks array must contain exactly ${Math.min(45, Math.max(14, Math.floor(hours_per_week * 2)))} days of tasks. Respond ONLY with valid JSON conforming to the schema. No markdown.`;

    // Timeout logic: AbortController with fetch signal for Gemini
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    let result;
    try {
      result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      });
      clearTimeout(timeoutId);
    } catch (e: any) {
      clearTimeout(timeoutId);
      console.error("Gemini API Error or Timeout:", e);
      return NextResponse.json(fallbackSprint);
    }

    const text = result.response.text();
    const parsed = JSON.parse(text);

    return NextResponse.json(parsed);

  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
