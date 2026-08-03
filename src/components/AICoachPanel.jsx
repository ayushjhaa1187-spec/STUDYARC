import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, Mic, RefreshCw, ChevronDown } from 'lucide-react';

// Mock AI responses keyed by rough intent
const AI_RESPONSES = {
  default: "I'm analyzing your question... Great question! Here's what I'd suggest based on your current learning path:",
  explain: "Let me break this down for you. Think of it this way: this concept works by taking input data, processing it through a transformation layer, and producing a structured output. The key insight is that the model maintains state across steps, which allows it to reason about multi-step problems.",
  debug: "Looking at the code you're describing, the most common issue here is usually one of three things:\n\n1. **State mutation** — you might be modifying state directly instead of returning a new object.\n2. **Async/await mismatch** — check if all async calls are awaited correctly.\n3. **Type mismatch** — verify your input types match the function signature.\n\nWant me to review a specific code snippet?",
  example: "Here's a practical example you can use directly in your project:\n\n```python\nimport langchain\nfrom langchain.agents import AgentExecutor\n\n# Initialize agent with tools\nagent = AgentExecutor(\n    agent=llm_with_tools,\n    tools=[search_tool, calculator],\n    max_iterations=5,  # Prevent loops\n    verbose=True\n)\n```\n\nThis pattern prevents cyclic loops by setting a hard limit on iterations.",
  rag: "RAG (Retrieval-Augmented Generation) works in 3 phases:\n\n1. **Index** — Chunk your documents and embed them into vectors\n2. **Retrieve** — When a query comes in, find the k most similar chunks\n3. **Generate** — Pass the retrieved context + query to the LLM\n\nThe key advantage is the LLM always has fresh, accurate context — it's not limited to training data.",
  career: "Based on your current readiness score of 72% and Q4 AI internship goal, here's what I recommend:\n\n**This Week:**\n- Complete the LangChain Agents Bootcamp (Module 4)\n- Ship your RAG pipeline to GitHub with a solid README\n\n**Next Week:**\n- Book a code review with Dr. Alex Chen\n- Apply to 10 AI internship roles\n\nYou're on track! Keep the 18hr/week pace.",
};

function getAIResponse(userMessage) {
  const msg = userMessage.toLowerCase();
  if (msg.includes('rag') || msg.includes('retrieval')) return AI_RESPONSES.rag;
  if (msg.includes('debug') || msg.includes('error') || msg.includes('fix')) return AI_RESPONSES.debug;
  if (msg.includes('example') || msg.includes('code') || msg.includes('show')) return AI_RESPONSES.example;
  if (msg.includes('explain') || msg.includes('what is') || msg.includes('how does')) return AI_RESPONSES.explain;
  if (msg.includes('career') || msg.includes('job') || msg.includes('internship') || msg.includes('path')) return AI_RESPONSES.career;
  return AI_RESPONSES.default + "\n\nBased on your current sprint (AI Internship Portfolio), I'd focus on completing the vector search implementation first, then tackle the streaming UI. You're 26% through the sprint — great momentum!";
}

export default function AICoachPanel({ courseContext = null, compact = false }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: courseContext
        ? `Hi! I'm your Gemini Coach for this lesson. I can explain concepts, help debug code, or suggest next steps. What do you need?`
        : `Hi Alex! I'm your AI Career Coach powered by Gemini. I can help you with your learning plan, debug your code, explain concepts, or guide your career strategy. What's on your mind?`,
      time: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = {
      id: messages.length + 1,
      role: 'user',
      content: input.trim(),
      time: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI streaming response
    const responseText = getAIResponse(userMsg.content);
    
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        role: 'assistant',
        content: responseText,
        time: 'Just now'
      }]);
    }, 1500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const QUICK_PROMPTS = compact
    ? ['Explain this', 'Debug my code', 'Give example']
    : ['Explain this concept', 'Debug my code', 'Give me an example', 'What should I learn next?'];

  const handleQuickPrompt = (prompt) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  if (compact) {
    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-bright-border">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-indigo/30 to-brand-violet/20 border border-brand-indigo/30">
              <Bot className="h-3.5 w-3.5 text-brand-indigo" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Gemini Coach</p>
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan animate-pulse" />
                <span className="text-[10px] text-brand-cyan font-mono">Online</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsMinimized(p => !p)}
            className="text-slate-400 hover:text-white transition-colors"
            aria-label={isMinimized ? 'Expand chat' : 'Minimize chat'}
          >
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isMinimized ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin min-h-0 max-h-48">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-3 py-2 text-xs leading-relaxed ${
                    msg.role === 'user' ? 'chat-bubble-user text-brand-cyan' : 'chat-bubble-ai text-slate-200'
                  }`}>
                    <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="chat-bubble-ai px-4 py-3">
                    <div className="flex gap-1.5 items-center">
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick prompts */}
            <div className="px-3 py-2 flex gap-1.5 flex-wrap border-t border-bright-border">
              {QUICK_PROMPTS.map(p => (
                <button
                  key={p}
                  onClick={() => handleQuickPrompt(p)}
                  className="rounded-full border border-bright-border bg-bright-bg px-2.5 py-0.5 text-[10px] font-semibold text-slate-300 hover:border-brand-teal/40 hover:text-brand-teal transition-all"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 p-3 border-t border-bright-border">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Gemini anything..."
                className="flex-1 rounded-xl border border-bright-border bg-bright-bg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-brand-teal focus:outline-none focus:ring-1 focus:ring-brand-teal/30 transition-all"
                aria-label="Message Gemini AI Coach"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="flex h-7 w-7 items-center justify-center rounded-xl bg-brand-teal/20 border border-brand-teal/40 text-brand-teal hover:bg-brand-teal hover:text-black disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                aria-label="Send message"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // Full size variant (for dashboard etc.)
  return (
    <div className="glass-bright flex flex-col h-full min-h-[480px]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-bright-border">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-indigo/30 to-brand-violet/20 border border-brand-indigo/30">
              <Bot className="h-5 w-5 text-brand-indigo" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-bright-bg bg-brand-cyan animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-white">Gemini AI Coach</p>
              <span className="ai-badge">
                <Sparkles className="h-2.5 w-2.5" />
                Powered by Gemini
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Your personalized career execution agent</p>
          </div>
        </div>
        <button
          onClick={() => setMessages([messages[0]])}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-[10px] font-mono text-slate-400 hover:text-white border border-bright-border hover:border-slate-600 transition-all"
          aria-label="Clear conversation"
          title="Clear conversation"
        >
          <RefreshCw className="h-3 w-3" />
          Clear
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-indigo/20 border border-brand-indigo/30 mt-0.5">
                <Bot className="h-3.5 w-3.5 text-brand-indigo" />
              </div>
            )}
            <div className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'chat-bubble-user text-brand-cyan'
                : 'chat-bubble-ai text-slate-200'
            }`}>
              <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
              <p className="text-[10px] text-slate-500 font-mono mt-2">{msg.time}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-2.5 justify-start">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-indigo/20 border border-brand-indigo/30">
              <Bot className="h-3.5 w-3.5 text-brand-indigo" />
            </div>
            <div className="chat-bubble-ai px-4 py-3">
              <div className="flex gap-1.5 items-center">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="text-[11px] text-slate-500 ml-1 font-mono">Gemini is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompts */}
      <div className="px-4 py-2.5 flex gap-2 flex-wrap border-t border-bright-border">
        {QUICK_PROMPTS.map(p => (
          <button
            key={p}
            onClick={() => handleQuickPrompt(p)}
            className="rounded-full border border-bright-border bg-bright-bg px-3 py-1 text-xs font-semibold text-slate-300 hover:border-brand-teal/40 hover:text-brand-teal hover:bg-brand-teal/5 transition-all"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-end gap-3 p-4 border-t border-bright-border">
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Gemini anything about your learning, career, or code..."
            rows={2}
            className="w-full resize-none rounded-xl border border-bright-border bg-bright-bg px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-brand-teal focus:outline-none focus:ring-1 focus:ring-brand-teal/30 transition-all scrollbar-none"
            aria-label="Message Gemini AI Coach"
          />
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          <button
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-bright-border bg-bright-bg text-slate-400 hover:text-white transition-colors"
            aria-label="Voice input"
            title="Voice input (coming soon)"
          >
            <Mic className="h-4 w-4" />
          </button>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-teal to-brand-cyan text-black hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_0_12px_rgba(6,214,160,0.3)]"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
