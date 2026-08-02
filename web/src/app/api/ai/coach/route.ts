import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { message, sprint_id } = await req.json();

    if (!message || !sprint_id) {
      return NextResponse.json({ error: 'Missing message or sprint_id' }, { status: 400 });
    }

    // Fetch Sprint details
    const { data: sprintData, error: sprintError } = await supabase
      .from('sprints')
      .select('title, total_days, current_day')
      .eq('id', sprint_id)
      .single();
    const sprint = sprintData as any;

    if (sprintError || !sprint) {
      return NextResponse.json({ error: 'Sprint not found' }, { status: 404 });
    }

    // Fetch Today's Task
    const { data: task } = await supabase
      .from('tasks')
      .select('title, description')
      .eq('sprint_id', sprint_id)
      .eq('day', sprint.current_day)
      .single();

    // Fetch Chat History
    const { data: history } = await supabase
      .from('chat_history')
      .select('role, message')
      .eq('sprint_id', sprint_id)
      .order('created_at', { ascending: false })
      .limit(5);
    
    // Save User message immediately
    await supabase.from('chat_history').insert({
      user_id: user.id,
      sprint_id: sprint_id,
      role: 'user',
      message
    } as any);

    const systemPrompt = `You are the AI Career Coach for SkillBridge Pro.
Current Sprint: ${sprint.title}
Total Days: ${sprint.total_days}
Current Day: ${sprint.current_day}
Today's Task: ${task?.title || 'Unknown'} - ${task?.description || 'Unknown'}

Context: The user is building a project. You are their technical mentor.
Rules:
1. Give concise, actionable advice (2-3 paragraphs max).
2. Do NOT write the full code for them. Guide them with hints, documentation links, and debugging strategies.
3. If they ask a general career question, answer it briefly but steer them back to focusing on today's task.
4. Format code snippets with markdown triple backticks.
5. Be encouraging and supportive.`;

    const model = 'gemini-2.5-flash';
    
    // Format history for Gemini
    const contents = [];
    if (history) {
      history.reverse().forEach(msg => {
        contents.push({ role: msg.role === 'assistant' ? 'model' : 'user', parts: [{ text: msg.message }] });
      });
    }
    contents.push({ role: 'user', parts: [{ text: message }] });

    let responseText = '';
    try {
      const response = await genAI.models.generateContent({
        model,
        contents,
        config: { systemInstruction: systemPrompt }
      });
      responseText = response.text || 'I am unable to respond at this time.';
    } catch (genError) {
      console.error(genError);
      responseText = "I'm having trouble connecting right now. Please try again.";
    }

    // Save Assistant message
    await supabase.from('chat_history').insert({
      user_id: user.id,
      sprint_id: sprint_id,
      role: 'assistant',
      message: responseText
    } as any);

    return NextResponse.json({ response: responseText });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
