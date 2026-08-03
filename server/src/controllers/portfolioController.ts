import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.js';
import { geminiPro } from '../config/gemini.js';
import { supabaseAdmin } from '../config/supabase.js';

export const submitPortfolio = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { sprintId, title, githubUrl, liveDemoUrl, description } = req.body;

    // AI Pre-check
    const prompt = `
      Perform a pre-check on this student's portfolio submission.
      Title: ${title}
      Description: ${description}
      GitHub: ${githubUrl}
      Live Demo: ${liveDemoUrl}

      Is this a valid tech project submission? Return strict JSON:
      {
        "status": "approved" | "needs_work",
        "feedback": "constructive feedback string"
      }
    `;

    const result = await geminiPro.generateContent(prompt);
    let text = result.response.text().trim();
    if (text.startsWith('\`\`\`json')) {
      text = text.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '');
    } else if (text.startsWith('\`\`\`')) {
      text = text.replace(/\`\`\`/g, '');
    }

    const aiFeedback = JSON.parse(text);

    const { data: submission, error } = await supabaseAdmin
      .from('portfolio_submissions')
      .insert({
        user_id: userId,
        sprint_id: sprintId,
        title,
        github_url: githubUrl,
        live_demo_url: liveDemoUrl,
        description,
        ai_feedback: aiFeedback,
        status: aiFeedback.status === 'approved' ? 'approved' : 'needs_work'
      })
      .select()
      .single();

    if (error) throw error;

    // Add XP if approved
    if (submission.status === 'approved') {
       await supabaseAdmin.rpc('reward_task_xp', { user_id: userId });
    }

    res.json({ success: true, submission });
  } catch (error: any) {
    console.error('Portfolio Error:', error);
    res.status(500).json({ error: 'Failed to process portfolio', details: error.message });
  }
};
