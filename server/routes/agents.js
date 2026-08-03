import express from 'express';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { supabaseAdmin } from '../supabaseClient.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// We use gemini-1.5-flash as it supports JSON Schema Structured Outputs and is fast
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Helper to log agent events to Supabase
async function logAgentEvent(agentName, userId, action, details) {
  try {
    await supabaseAdmin.from('agent_events').insert({
      agent_name: agentName,
      user_id: userId,
      action,
      details,
      created_at: new Date().toISOString()
    });
  } catch (err) {
    console.error(`Error logging agent event for ${agentName}:`, err.message);
  }
}

// 1. Diagnostic Agent
router.post('/diagnostic', async (req, res) => {
  try {
    const { target_role, experience_level, weekly_hours, selected_skills, resume_text, github_urls, user_id } = req.body;
    
    const diagnosticSchema = {
      type: SchemaType.OBJECT,
      properties: {
        readiness_score: { type: SchemaType.INTEGER, description: "Score from 0-100" },
        strengths: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        skill_gaps: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        recommended_journey: { type: SchemaType.STRING },
        seven_day_starter_plan: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        suggested_thirty_day_sprint: { type: SchemaType.STRING },
        explanation: { type: SchemaType.STRING, description: "Clear explanation in simple Hinglish/English based on preference" }
      },
      required: ["readiness_score", "strengths", "skill_gaps", "recommended_journey", "seven_day_starter_plan", "suggested_thirty_day_sprint", "explanation"]
    };

    const prompt = `
      You are an expert technical career coach Diagnostic Agent.
      Analyze the user profile:
      Target Role: ${target_role}
      Experience Level: ${experience_level || 'Beginner'}
      Weekly Hours: ${weekly_hours}
      Selected Skills: ${selected_skills?.join(', ')}
      Resume: ${resume_text || 'None provided'}
      GitHub URLs: ${github_urls?.join(', ') || 'None provided'}
      
      Provide a diagnostic assessment strictly following the JSON schema.
    `;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: diagnosticSchema,
      }
    });

    const responseText = result.response.text();
    const data = JSON.parse(responseText);

    // Persist to database
    if (user_id) {
      // Upsert learner profile score
      await supabaseAdmin.from('learner_profiles').upsert({
        id: user_id,
        readiness_score: data.readiness_score,
        target_role,
        updated_at: new Date().toISOString()
      });
      
      // Insert diagnostic result
      await supabaseAdmin.from('diagnostic_results').insert({
        user_id,
        result_data: data,
        created_at: new Date().toISOString()
      });

      await logAgentEvent('Diagnostic Agent', user_id, 'COMPLETED_DIAGNOSTIC', { readiness_score: data.readiness_score });
    }

    res.json(data);
  } catch (error) {
    console.error('Diagnostic Agent Error:', error);
    res.status(500).json({ error: 'Failed to process diagnostic.' });
  }
});

// 2. Sprint Planner Agent
router.post('/sprint-plan', async (req, res) => {
  try {
    const { user_id, journey_id, diagnostic_result_id, available_hours, start_date } = req.body;
    
    const sprintSchema = {
      type: SchemaType.OBJECT,
      properties: {
        thirty_day_plan: { type: SchemaType.STRING },
        phases: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        tasks: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              title: { type: SchemaType.STRING },
              description: { type: SchemaType.STRING },
              estimated_hours: { type: SchemaType.NUMBER },
              priority: { type: SchemaType.STRING, enum: ["HIGH", "MEDIUM", "LOW"] }
            },
            required: ["title", "description", "estimated_hours", "priority"]
          }
        },
        project_milestones: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        completion_criteria: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        recovery_plan: { type: SchemaType.STRING }
      },
      required: ["thirty_day_plan", "phases", "tasks", "project_milestones", "completion_criteria", "recovery_plan"]
    };

    const prompt = `
      Create a 30-day sprint plan for the user based on their diagnostic result.
      Available Hours: ${available_hours}
      Start Date: ${start_date}
      
      Design an actionable, phased plan with tasks, milestones, and a recovery plan if they fall behind.
    `;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: sprintSchema,
      }
    });

    const data = JSON.parse(result.response.text());

    if (user_id) {
      await logAgentEvent('Sprint Planner Agent', user_id, 'CREATED_SPRINT_PLAN', { journey_id, diagnostic_result_id });
    }

    res.json(data);
  } catch (error) {
    console.error('Sprint Planner Agent Error:', error);
    res.status(500).json({ error: 'Failed to generate sprint plan.' });
  }
});

// 3. AI Coach Agent (Streaming)
router.post('/coach', async (req, res) => {
  try {
    const { message, context, user_id, task_id } = req.body;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const prompt = `
      You are an expert AI Coach helping a user.
      Context: ${context || 'General query.'}
      User asks: ${message}
      
      Guidelines:
      - Answer task/project questions.
      - Debug code conceptually.
      - Explain next action.
      - Review architecture.
      - Detect learner block/confusion.
      - Recommend mentor escalation when confidence is low or issue is high-stakes.
      - Return source/resource suggestions only from curated/retrieved data where possible.
    `;

    const resultStream = await model.generateContentStream(prompt);
    
    let fullResponse = "";
    
    for await (const chunk of resultStream) {
      const chunkText = chunk.text();
      fullResponse += chunkText;
      // SSE format requires "data: <payload>\n\n"
      res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
    }

    res.write('data: [DONE]\n\n');
    res.end();

    if (user_id) {
      // Log to Supabase
      await supabaseAdmin.from('ai_conversations').upsert({
        user_id,
        last_updated: new Date().toISOString()
      }, { onConflict: 'user_id' }); // Mock logic depending on real schema
      
      await supabaseAdmin.from('ai_messages').insert({
        user_id,
        user_message: message,
        ai_response: fullResponse,
        task_id: task_id || null,
        created_at: new Date().toISOString()
      });

      await logAgentEvent('AI Coach Agent', user_id, 'COACH_INTERACTION', { message_length: message.length });
    }

  } catch (error) {
    console.error('AI Coach Agent Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to communicate with coach.' });
    } else {
      res.write(`data: ${JSON.stringify({ error: 'Stream interrupted.' })}\n\n`);
      res.end();
    }
  }
});

// 4. Mentor Matching Agent
router.post('/match-mentor', async (req, res) => {
  try {
    const { skill_gaps, target_role, current_journey, budget, availability, service_type, user_id } = req.body;

    const mentorSchema = {
      type: SchemaType.OBJECT,
      properties: {
        matches: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              mentor_id: { type: SchemaType.STRING },
              name: { type: SchemaType.STRING },
              match_score: { type: SchemaType.INTEGER },
              match_explanation: { type: SchemaType.STRING }
            },
            required: ["mentor_id", "name", "match_score", "match_explanation"]
          }
        },
        suggested_session_type: { type: SchemaType.STRING },
        expected_outcome: { type: SchemaType.STRING }
      },
      required: ["matches", "suggested_session_type", "expected_outcome"]
    };

    const prompt = `
      You are a Mentor Matching Agent.
      Learner gaps: ${skill_gaps?.join(', ')}
      Target Role: ${target_role}
      Current Challenge: ${current_journey}
      Budget: ${budget}
      Availability: ${availability}
      Service Type: ${service_type}
      
      Rank the best mock mentors (e.g., ID: M1 "Alice", ID: M2 "Bob") based on these constraints.
      Prioritize availability, expertise, rating, price, and quality score. Do not make discriminatory decisions.
    `;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: mentorSchema,
      }
    });

    const data = JSON.parse(result.response.text());

    if (user_id) {
      await logAgentEvent('Mentor Matching Agent', user_id, 'MATCHED_MENTORS', { num_matches: data.matches.length });
    }

    res.json(data);
  } catch (error) {
    console.error('Mentor Matching Agent Error:', error);
    res.status(500).json({ error: 'Failed to match mentors.' });
  }
});

// 5. Portfolio Verification Agent
router.post('/verify-project', async (req, res) => {
  try {
    const { project_title, description, github_url, live_demo_url, tech_stack, rubric, evidence_links, user_id } = req.body;

    const verifySchema = {
      type: SchemaType.OBJECT,
      properties: {
        ai_review_summary: { type: SchemaType.STRING },
        rubric_scores: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              criterion: { type: SchemaType.STRING },
              score: { type: SchemaType.INTEGER },
              comment: { type: SchemaType.STRING }
            },
            required: ["criterion", "score", "comment"]
          }
        },
        missing_evidence: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        risk_flags: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        recommendation: { type: SchemaType.STRING, enum: ["pass_to_human_review", "needs_changes", "reject"] }
      },
      required: ["ai_review_summary", "rubric_scores", "missing_evidence", "risk_flags", "recommendation"]
    };

    const prompt = `
      You are a Portfolio Verification Agent. You do NOT issue final "human verified" badges. You pre-check projects.
      Project: ${project_title}
      Description: ${description}
      GitHub: ${github_url}
      Demo: ${live_demo_url}
      Tech Stack: ${tech_stack?.join(', ')}
      Rubric: ${JSON.stringify(rubric)}
      Evidence: ${evidence_links?.join(', ')}
      
      Evaluate the project based on the rubric, find missing evidence, and output risk flags.
    `;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: verifySchema,
      }
    });

    const data = JSON.parse(result.response.text());

    if (user_id) {
      await logAgentEvent('Portfolio Verification Agent', user_id, 'VERIFICATION_PRECHECK', { recommendation: data.recommendation });
    }

    res.json(data);
  } catch (error) {
    console.error('Portfolio Verification Agent Error:', error);
    res.status(500).json({ error: 'Failed to verify project.' });
  }
});

// 6. Retention / Progress Agent
// This should be called by Google Cloud Scheduler daily.
router.post('/retention-progress', async (req, res) => {
  try {
    // In a real scenario, check an authorization header here from GC Scheduler.
    const { admin_secret } = req.body;
    if (process.env.ADMIN_SECRET && admin_secret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const progressSchema = {
      type: SchemaType.OBJECT,
      properties: {
        overdue_tasks_processed: { type: SchemaType.INTEGER },
        inactive_learners_flagged: { type: SchemaType.INTEGER },
        rescheduled_tasks: { type: SchemaType.INTEGER },
        mentor_escalations: { type: SchemaType.INTEGER },
        actions_summary: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
      },
      required: ["overdue_tasks_processed", "inactive_learners_flagged", "rescheduled_tasks", "mentor_escalations", "actions_summary"]
    };

    const prompt = `
      You are a Retention / Progress Agent analyzing daily user progress.
      Identify overdue tasks and inactive learners.
      Reschedule non-critical tasks based on remaining time.
      Send helpful notifications without spamming.
      Escalate to mentor recommendation only when meaningful.
      
      Generate a realistic daily summary report of actions taken (mock data for now).
    `;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: progressSchema,
      }
    });

    const data = JSON.parse(result.response.text());

    await logAgentEvent('Retention Agent', 'SYSTEM', 'DAILY_PROGRESS_CHECK', data);

    res.json(data);
  } catch (error) {
    console.error('Retention / Progress Agent Error:', error);
    res.status(500).json({ error: 'Failed to run retention process.' });
  }
});

export default router;
