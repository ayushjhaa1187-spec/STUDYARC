import { supabaseAdmin } from '../config/supabase.js';
import { AiService } from './aiService.js';

export class DiagnosticService {
  static async processDiagnostic(userId: string, targetRole: string, weeklyHours: number, skills: string[], experienceLevel: string) {
    const aiAnalysis = await AiService.evaluateProfile(targetRole, weeklyHours, skills, experienceLevel);

    const { data: assessment, error } = await supabaseAdmin
      .from('assessments')
      .insert({
        user_id: userId,
        target_role: targetRole,
        weekly_hours: weeklyHours,
        skills: JSON.stringify(skills),
        readiness_score: aiAnalysis.readinessScore,
        recommended_journey: aiAnalysis.recommendedJourney,
        gap_analysis: JSON.stringify(aiAnalysis.gapAnalysis),
        ai_output: aiAnalysis,
        status: 'completed'
      })
      .select()
      .single();

    if (error) throw error;
    return assessment;
  }
}
