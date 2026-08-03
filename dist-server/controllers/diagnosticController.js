import { geminiPro } from '../config/gemini.js';
import { supabaseAdmin } from '../config/supabase.js';
export const evaluateDiagnostic = async (req, res) => {
    try {
        const userId = req.user.id;
        const { targetRole, weeklyHours, skills, experienceLevel } = req.body;
        const prompt = `
      You are an expert tech career coach evaluating a student.
      Student profile:
      - Target Role: ${targetRole}
      - Weekly Commitment: ${weeklyHours} hours
      - Current Skills: ${skills.join(', ')}
      - Experience Level: ${experienceLevel}

      Provide a diagnostic evaluation in strict JSON format. 
      Schema requirement:
      {
        "readinessScore": number (0-100),
        "recommendedJourney": string (e.g. 'Full-Stack Job Ready Sprint'),
        "gapAnalysis": [
          { "skill": string, "gap": string, "priority": "high" | "medium" | "low" }
        ]
      }
    `;
        const result = await geminiPro.generateContent(prompt);
        let text = result.response.text().trim();
        if (text.startsWith('\`\`\`json')) {
            text = text.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '');
        }
        else if (text.startsWith('\`\`\`')) {
            text = text.replace(/\`\`\`/g, '');
        }
        const aiAnalysis = JSON.parse(text);
        // Save to database
        const { data: assessment, error } = await supabaseAdmin
            .from('assessments')
            .insert({
            user_id: userId,
            target_role: targetRole,
            weekly_hours: weeklyHours,
            skills: JSON.stringify(skills),
            readiness_score: aiAnalysis.readinessScore,
            recommended_journey: aiAnalysis.recommendedJourney,
            gap_analysis: JSON.stringify(aiAnalysis.gapAnalysis)
        })
            .select()
            .single();
        if (error)
            throw error;
        res.json({ success: true, assessment });
    }
    catch (error) {
        console.error('Diagnostic Evaluation Error:', error);
        res.status(500).json({ error: 'Failed to process diagnostic', details: error.message });
    }
};
