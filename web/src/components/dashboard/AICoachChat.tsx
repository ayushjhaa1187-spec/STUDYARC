'use client';
import { useState, useRef, useEffect } from 'react';
import { useSprintStore } from '@/stores/sprintStore';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function AICoachChat() {
  const { sprint, chatHistory, sendChatMessage, isChatLoading } = useSprintStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isChatLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isChatLoading || !sprint) return;
    
    const message = input.trim();
    setInput('');
    await sendChatMessage(message, sprint.id);
  };

  return (
    <div className="flex flex-col bg-white rounded-xl shadow-sm border overflow-hidden h-[500px]">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b bg-gray-50/50">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
          <Bot className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">AI Career Coach</h3>
          <p className="text-xs text-gray-500">Ask for hints, resources, or debugging help</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {chatHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 p-6">
            <Bot className="w-12 h-12 text-gray-300 mb-3" />
            <p>I'm your AI Coach. I know you're working on Day {sprint?.current_day}. How can I help you with today's task?</p>
          </div>
        ) : (
          chatHistory.map((msg) => (
            <div 
              key={msg.id} 
              className={cn(
                "flex gap-3 max-w-[85%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                msg.role === 'user' ? "bg-gray-200 text-gray-600" : "bg-blue-100 text-blue-600"
              )}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              
              <div className={cn(
                "p-3.5 rounded-2xl",
                msg.role === 'user' 
                  ? "bg-gray-900 text-white rounded-tr-sm" 
                  : "bg-gray-100 text-gray-800 rounded-tl-sm border"
              )}>
                <div className={cn(
                  "prose prose-sm max-w-none",
                  msg.role === 'user' ? "prose-invert" : ""
                )}>
                  <ReactMarkdown>{msg.message}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))
        )}
        
        {isChatLoading && (
          <div className="flex gap-3 max-w-[85%] mr-auto">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-gray-100 text-gray-800 rounded-tl-sm border flex items-center gap-2">
               <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
               <span className="text-sm text-gray-500">Coach is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t">
        <form onSubmit={handleSubmit} className="relative flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Type your question here..."
            className="w-full max-h-32 min-h-[44px] p-3 pr-12 bg-gray-50 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 scrollbar-thin transition-all"
            rows={1}
            disabled={isChatLoading || !sprint}
          />
          <button
            type="submit"
            disabled={!input.trim() || isChatLoading || !sprint}
            className="absolute right-2 bottom-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
