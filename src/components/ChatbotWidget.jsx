import React, { useState } from 'react';
import { MessageCircle, X, Send, Bot, Sparkles } from 'lucide-react';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hi! I'm your SkillBridge Pro support bot. How can I help you today?",
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text })
      });
      
      const data = await res.json();
      setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: data.text }]);
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: "I'm having trouble connecting right now." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-brand-cyan text-slate-950 shadow-[0_0_20px_rgba(53,199,184,0.4)] hover:scale-110 transition-transform z-50 ${isOpen ? 'hidden' : 'block'}`}
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 rounded-2xl border border-brand-cyan/30 bg-[#0f172a]/95 backdrop-blur-md shadow-2xl z-50 overflow-hidden flex flex-col h-[500px]">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-teal to-brand-cyan p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-slate-950">
              <Bot className="h-5 w-5" />
              <h3 className="font-bold text-sm">SkillBridge Support</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-950 hover:bg-black/10 p-1 rounded-lg transition">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 text-xs shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-brand-cyan text-slate-950 rounded-br-none font-medium'
                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center space-x-2 text-xs text-brand-cyan font-mono">
                <Sparkles className="h-3 w-3 animate-spin" />
                <span>Typing...</span>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="border-t border-slate-800 p-3 bg-slate-900">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan"
              />
              <button type="submit" disabled={isTyping} className="bg-brand-cyan text-slate-950 p-2 rounded-xl hover:opacity-90 transition disabled:opacity-50">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
