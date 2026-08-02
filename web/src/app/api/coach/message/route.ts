import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase/server';
import { geminiFlash } from '@/lib/gemini';
import { z } from 'zod';

const MessageSchema = z.object({
  sprint_id: z.string().uuid(),
  message: z.string().min(1).max(1000)
});

export async function POST(request: Request) {
  try {
    const { user, supabase } = await getAuthenticatedUser();
    const body = await request.json();
    const { sprint_id, message } = MessageSchema.parse(body);

    // 1. Verify sprint belongs to user
    const { data: sprint, error: sprintError } = await supabase
      .from('sprints')
      .select('*, daily_tasks')
      .eq('id', sprint_id)
      .eq('user_id', user.id)
      .single();

    if (sprintError || !sprint) {
      return NextResponse.json({ error: 'Sprint not found' }, { status: 404 });
    }

    // 2. Fetch last 5 chat history entries
    const { data: history, error: historyError } = await supabase
      .from('chat_history')
      .select('role, content')
      .eq('sprint_id', sprint_id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (historyError) throw historyError;

    // Reverse to chronological order
    const conversation = history ? history.reverse().map(h => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.content }]
    })) : [];

    // 3. Build system prompt
    const currentTask = sprint.daily_tasks.find((t: any) => t.day === sprint.current_day) || {};
    const systemPrompt = `You are the AI Career Coach for SkillBridge Pro.
Current Sprint: ${sprint.name}
Total Days: ${sprint.total_days}
Current Day: ${sprint.current_day}
Today's Task: ${currentTask.title || 'N/A'} - ${currentTask.description || 'N/A'}

Context: The user is building a project. You are their technical mentor.
Rules:
1. Give concise, actionable advice (2-3 paragraphs max).
2. Do NOT write the full code. Guide with hints, docs, strategies.
3. If they ask general career questions, answer briefly but steer them back to today's task.
4. Format code with triple backticks.
5. Be encouraging.`;

    // 4. Send to Gemini
    const chat = geminiFlash.startChat({
      history: conversation,
      systemInstruction: systemPrompt
    });

    // Handle timeout with Promise.race
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000));
    const result = await Promise.race([
      chat.sendMessage(message),
      timeout
    ]) as any;

    const responseText = result.response.text();

    // 5. Save user message and assistant response
    const { error: insertError } = await supabase
      .from('chat_history')
      .insert([
        { sprint_id, user_id: user.id, role: 'user', content: message },
        { sprint_id, user_id: user.id, role: 'assistant', content: responseText }
      ]);

    if (insertError) throw insertError;

    return NextResponse.json({ response: responseText });

  } catch (error: any) {
    console.error('Coach Message Error:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error.message === 'Timeout') {
      return NextResponse.json({ response: "I'm experiencing high traffic right now, but you're doing great! Keep working on today's task and try asking me again in a moment." });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
