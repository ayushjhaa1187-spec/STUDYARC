import React, { useState } from 'react';
import { Bot, Send, Sparkles, Code, Terminal, CheckCircle2, ChevronRight } from 'lucide-react';

export default function AICoachPanel() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hello Alex! I'm your Gemini AI Execution Coach. I reviewed your current sprint task ('Implement vector search chunking strategy'). How can I assist you right now?",
      timestamp: '12:04 PM'
    },
    {
      id: 2,
      sender: 'user',
      text: "Should I use fixed-size character chunking or semantic paragraph splitting for technical documentation PDFs?",
      timestamp: '12:05 PM'
    },
    {
      id: 3,
      sender: 'ai',
      text: "For technical PDF documentation, **Semantic Paragraph Splitting** with overlap (e.g., 500 chars chunk, 50 chars overlap) yields ~34% higher precision. Markdown header-aware chunking is even better if you parse headers first!",
      codeSnippet: "from langchain.text_splitter import RecursiveCharacterTextSplitter\n\nsplitter = RecursiveCharacterTextSplitter(\n    chunk_size=500,\n    chunk_overlap=50,\n    separators=[\"\\n\\n\", \"\\n\", \" \"]\n)",
      timestamp: '12:05 PM'
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    "Debug my code error",
    "Suggest next logical task",
    "Review my pull request",
    "Explain vector embeddings"
  ];

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('http://localhost:3001/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, context: "Implement vector search chunking strategy" })
      });

      if (!res.ok) throw new Error('Failed to fetch from coach API');
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: data.text,
          codeSnippet: data.codeSnippet || null,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: "I'm currently unable to connect to the backend server. Please check if the API is running.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-emerald-500/30 bg-[#0f172a]/95 backdrop-blur-md shadow-xl">
      
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-slate-800 p-4">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-black shadow-md shadow-emerald-500/20">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
              <span>Gemini AI Coach</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </h3>
            <p className="text-[11px] font-mono text-emerald-400">Execution Assistant</p>
          </div>
        </div>

        <span className="rounded font-mono text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 border border-slate-700">
          PRO ENGINE
        </span>
      </div>

      {/* Message Chat History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[420px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-medium rounded-br-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
              }`}
            >
              <p>{msg.text}</p>

              {msg.codeSnippet && (
                <div className="mt-2.5 overflow-x-auto rounded-lg bg-[#020617] p-2.5 font-mono text-[11px] text-emerald-400 border border-slate-800">
                  <pre>{msg.codeSnippet}</pre>
                </div>
              )}
            </div>
            <span className="mt-1 text-[10px] text-slate-500 font-mono px-1">{msg.timestamp}</span>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center space-x-2 text-xs text-emerald-400 font-mono">
            <Sparkles className="h-4 w-4 animate-spin" />
            <span>Gemini is generating response...</span>
          </div>
        )}
      </div>

      {/* Quick Suggestion Pills */}
      <div className="border-t border-slate-800/80 p-2 overflow-x-auto flex space-x-1.5 bg-slate-950/40">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="whitespace-nowrap rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-[11px] text-slate-300 hover:border-emerald-500/40 hover:text-emerald-300 transition"
          >
            + {prompt}
          </button>
        ))}
      </div>

      {/* Input Composer */}
      <div className="border-t border-slate-800 p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI coach for debug hints or feedback..."
            className="flex-1 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
          />
          <button
            type="submit"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:opacity-90 transition shadow-md shadow-emerald-500/20"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
