import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.js';
import { supabaseAdmin } from '../config/supabase.js';

export const submitPortfolio = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { title, description, githubUrl, liveDemoUrl, projectCategory } = req.body;

    // 1. Create the project record
    const { data: project, error } = await supabaseAdmin
      .from('portfolio_projects')
      .insert({
        user_id: userId,
        title: title || 'Untitled Project',
        description: description || '',
        github_url: githubUrl,
        live_demo_url: liveDemoUrl,
        project_category: projectCategory || 'General',
        status: 'submitted',
        submitted_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    // 2. Insert Evidence rows
    const evidenceData = [];
    if (githubUrl) evidenceData.push({ project_id: project.id, evidence_type: 'github', url: githubUrl });
    if (liveDemoUrl) evidenceData.push({ project_id: project.id, evidence_type: 'live_demo', url: liveDemoUrl });

    if (evidenceData.length > 0) {
      await supabaseAdmin.from('project_evidence').insert(evidenceData);
    }

    // 3. Log the event
    await supabaseAdmin
      .from('portfolio_verification_events')
      .insert({
        project_id: project.id,
        actor_id: userId,
        actor_type: 'learner',
        event_type: 'submitted',
        notes: 'Initial submission'
      });
    
    res.json({ 
      success: true, 
      message: 'Portfolio submitted and queued for verification',
      project 
    });
  } catch (error: any) {
    console.error('Portfolio Error:', error);
    res.status(500).json({ error: 'Failed to queue portfolio submission', details: error.message });
  }
};
