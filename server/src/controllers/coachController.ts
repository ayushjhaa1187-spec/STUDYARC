import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.js';
import { geminiPro } from '../config/gemini.js';
import { supabaseAdmin } from '../config/supabase.js';

export const chatWithCoach = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { message, sprintId } = req.body;

    // Fetch previous chat history
    let chatHistory: { role: 'user' | 'model', parts: { text: string }[] }[] = [];
    if (sprintId) {
      const { data: history } = await supabaseAdmin
        .from('chat_history')
        .select('role, message')
        .eq('sprint_id', sprintId)
        .order('created_at', { ascending: true })
        .limit(10);
      
      if (history) {
        chatHistory = history.map(h => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.message }]
        }));
      }
    }

    const chat = geminiPro.startChat({
      history: chatHistory,
      systemInstruction: "You are an AI learning coach. Help the user complete their daily learning tasks. Be concise and motivational."
    });

    const result = await chat.sendMessage(message);
    const aiResponse = result.response.text().trim();

    // Save history
    if (sprintId) {
      await supabaseAdmin.from('chat_history').insert([
        { user_id: userId, sprint_id: sprintId, role: 'user', message },
        { user_id: userId, sprint_id: sprintId, role: 'assistant', message: aiResponse }
      ]);
    }

    res.json({ reply: aiResponse });
  } catch (error: any) {
    console.error('Chat Error:', error);
    res.status(500).json({ error: 'Failed to chat', details: error.message });
  }
};
