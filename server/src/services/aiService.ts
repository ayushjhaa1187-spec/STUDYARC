import { SchemaType, Schema } from '@google/generative-ai';
import { geminiPro } from '../config/gemini.js';

export class AiService {
  static async evaluateProfile(targetRole: string, weeklyHours: number, skills: string[], experienceLevel: string) {
    const prompt = `
      You are an expert tech career coach evaluating a student.
      Student profile:
      - Target Role: ${targetRole}
      - Weekly Commitment: ${weeklyHours} hours
      - Current Skills: ${skills.join(', ')}
      - Experience Level: ${experienceLevel}
      
      Provide a comprehensive diagnostic evaluation for this student to get an internship or job.
    `;

    const schema: Schema = {
      type: SchemaType.OBJECT,
      properties: {
        readinessScore: { type: SchemaType.INTEGER, description: "A score from 0 to 100 indicating readiness" },
        recommendedJourney: { type: SchemaType.STRING, description: "Name of the recommended learning sprint (e.g., 'Full-Stack Job Ready Sprint')" },
        gapAnalysis: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              skill: { type: SchemaType.STRING },
              gap: { type: SchemaType.STRING },
              priority: { type: SchemaType.STRING, enum: ["high", "medium", "low"] }
            },
            required: ["skill", "gap", "priority"]
          }
        }
      },
      required: ["readinessScore", "recommendedJourney", "gapAnalysis"]
    };

    const result = await geminiPro.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const text = result.response.text();
    return JSON.parse(text);
  }
}
