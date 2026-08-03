import { SchemaType } from '@google/generative-ai';
import { z } from 'zod';
import { geminiPro } from '../config/gemini.js';
export class AiService {
    static async evaluateProfile(targetRole, weeklyHours, skills, experienceLevel) {
        const prompt = `
      You are an expert tech career coach evaluating a student.
      Student profile:
      - Target Role: ${targetRole}
      - Weekly Commitment: ${weeklyHours} hours
      - Current Skills: ${skills.join(', ')}
      - Experience Level: ${experienceLevel}
      
      Provide a comprehensive diagnostic evaluation for this student to get an internship or job.
    `;
        const schema = {
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
                            priority: { type: SchemaType.STRING, format: 'enum', enum: ["high", "medium", "low"] }
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
        const parsed = JSON.parse(text);
        // Validate using Zod
        const AiOutputSchema = z.object({
            readinessScore: z.number().min(0).max(100),
            recommendedJourney: z.string(),
            gapAnalysis: z.array(z.object({
                skill: z.string(),
                gap: z.string(),
                priority: z.enum(["high", "medium", "low"])
            }))
        });
        return AiOutputSchema.parse(parsed);
    }
}
