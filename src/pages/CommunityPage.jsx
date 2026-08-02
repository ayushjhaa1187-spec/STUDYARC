import React, { useState } from 'react';
import { 
  MessageSquareCode, 
  ThumbsUp, 
  CheckCircle2, 
  Bot, 
  Plus, 
  X, 
  Award, 
  User, 
  Send,
  Zap,
  Video
} from 'lucide-react';
import { COMMUNITY_THREADS, LEADERBOARD } from '../data/mockData';

export default function CommunityPage({ openMentorModal }) {
  const [threads, setThreads] = useState(COMMUNITY_THREADS);
  const [activeThread, setActiveThread] = useState(null);
  const [showComposer, setShowComposer] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCode, setNewCode] = useState('');

  const handleUpvote = (id, e) => {
    e.stopPropagation();
    setThreads(threads.map(t => t.id === id ? { ...t, upvotes: t.upvotes + 1 } : t));
  };

  const handleCreateThread = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newPost = {
      id: Date.now(),
      title: newTitle,
      author: "Alex Rivera (You)",
      authorRole: "AI Aspirant",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      tags: ["Python", "General"],
      upvotes: 1,
      status: "Open",
      snippet: newDesc,
      aiAnswer: "Gemini is analyzing your code snippet... Suggesting syntax fix in line 12.",
      humanAnswersCount: 0,
      hasAcceptedSolution: false,
      timeAgo: "Just now"
    };

    setThreads([newPost, ...threads]);
    setShowComposer(false);
    setNewTitle('');
    setNewDesc('');
    setNewCode('');
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-brand-cyan uppercase font-bold tracking-widest">
            <MessageSquareCode className="h-4 w-4 text-brand-teal" />
            <span>DEV-FUSION Ecosystem</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-2">Doubts & Community Q&A</h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Ask technical doubts, get instant Gemini AI answers, and get verified solutions from senior peer developers.
          </p>
        </div>

        <button
          onClick={() => setShowComposer(true)}
          className="flex items-center space-x-2 rounded-xl bg-bright-gradient border border-brand-cyan px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-brand-cyan/20 hover:scale-105 transition glow-bright-cyan"
        >
          <Plus className="h-4 w-4 text-brand-teal" />
          <span>Ask a Doubt</span>
        </button>
      </div>

      {/* Main Grid: Feed + Leaderboard Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Q&A Thread Feed */}
        <div className="lg:col-span-8 space-y-4">
          {threads.map((thread) => (
            <div
              key={thread.id}
              onClick={() => setActiveThread(thread)}
              className="group cursor-pointer glass-bright p-6 transition-all duration-300 hover:card-glow-indigo space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                
                {/* Author Info */}
                <div className="flex items-center space-x-3">
                  <img src={thread.authorAvatar} alt={thread.author} className="h-10 w-10 rounded-xl object-cover border border-brand-teal/30 group-hover:border-brand-indigo transition-colors" />
                  <div>
                    <h4 className="text-base font-bold text-white group-hover:text-brand-indigo transition-colors">{thread.title}</h4>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">{thread.author} • {thread.authorRole} • {thread.timeAgo}</p>
                  </div>
                </div>

                {/* Upvote Button */}
                <button
                  onClick={(e) => handleUpvote(thread.id, e)}
                  className="flex flex-col items-center justify-center rounded-xl border border-bright-border bg-bright-bg px-3 py-2 text-xs font-bold text-slate-300 hover:border-brand-indigo/50 hover:bg-brand-indigo/10 hover:text-brand-indigo transition-all"
                >
                  <ThumbsUp className="h-4 w-4 mb-1" />
                  <span>{thread.upvotes}</span>
                </button>
              </div>

              {/* Tag Chips */}
              <div className="flex items-center space-x-2 pt-1">
                {thread.tags.map((tag) => (
                  <span key={tag} className="rounded-md bg-bright-bg px-2.5 py-1 text-[10px] font-mono font-bold text-brand-teal border border-bright-border">
                    #{tag}
                  </span>
                ))}
                <span className={`rounded-md px-2.5 py-1 text-[10px] font-mono font-bold ${
                  thread.status === 'Answered' || thread.status === 'Verified Solution'
                    ? 'bg-brand-teal/10 text-brand-teal border border-brand-teal/30'
                    : 'bg-brand-amber/10 text-brand-amber border border-brand-amber/30'
                }`}>
                  {thread.status}
                </span>
              </div>

              {/* Snippet Preview */}
              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed bg-bright-bg/80 p-3 rounded-xl border border-bright-border font-mono">
                {thread.snippet}
              </p>

              {/* AI Suggested Summary Badge */}
              {thread.aiAnswer && (
                <div className="flex items-center space-x-2 text-[11px] text-brand-cyan bg-brand-cyan/10 p-3 rounded-xl border border-brand-cyan/30 font-mono shadow-[0_0_10px_rgba(6,214,160,0.15)]">
                  <Bot className="h-4 w-4 shrink-0 text-brand-cyan animate-pulse" />
                  <span className="truncate"><strong className="text-white">Gemini AI:</strong> {thread.aiAnswer}</span>
                </div>
              )}

            </div>
          ))}
        </div>

        {/* Leaderboard & Recent Completions Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Leaderboard Card */}
          <div className="glass-bright card-glow-emerald p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-bright-border">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">Top Executioners</span>
              <Award className="h-5 w-5 text-brand-amber" />
            </div>

            <div className="space-y-3">
              {LEADERBOARD.map((user) => (
                <div key={user.rank} className="flex items-center justify-between rounded-xl bg-bright-bg p-3 border border-bright-border text-xs hover:border-brand-emerald/40 transition-colors group">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-black text-brand-amber text-sm w-5 text-center">#{user.rank}</span>
                    <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full object-cover border-2 border-brand-teal/30" />
                    <div>
                      <p className="font-bold text-white leading-tight group-hover:text-brand-teal transition-colors">{user.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{user.projects} Shipped Apps</p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-brand-cyan">{user.score}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Mentor Referral Banner */}
          <div className="glass-bright card-glow-amber p-6 space-y-4 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 h-24 w-24 bg-brand-amber/20 blur-2xl rounded-full"></div>
            
            <div className="flex items-center space-x-2 text-brand-amber text-xs font-mono font-bold uppercase tracking-wide">
              <Zap className="h-4 w-4" />
              <span>Stuck on a complex doubt?</span>
            </div>
            
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              Convert your open Q&A thread directly into a 1-on-1 expert code roast session with a verified mentor.
            </p>
            
            <button
              onClick={() => openMentorModal()}
              className="w-full flex items-center justify-center space-x-2 rounded-xl bg-bright-bg border border-brand-amber py-3 text-xs font-extrabold text-brand-amber shadow-md hover:bg-brand-amber/10 transition-colors mt-2"
            >
              <Video className="h-4 w-4" />
              <span>Convert to 1-on-1 Session</span>
            </button>
          </div>

        </div>

      </div>

      {/* COMPOSER MODAL */}
      {showComposer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl rounded-2xl glass-bright card-glow-cyan p-8 shadow-2xl space-y-6">
            <button onClick={() => setShowComposer(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white transition">
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-2xl font-black text-white">Ask a Technical Doubt</h3>
            
            <form onSubmit={handleCreateThread} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase tracking-wider">Question Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. How to handle connection timeouts in FastAPI WebSockets?"
                  className="w-full rounded-xl border border-bright-border bg-bright-bg px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-brand-teal focus:outline-none focus:ring-1 focus:ring-brand-teal transition"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase tracking-wider">Description & Details</label>
                <textarea
                  rows="4"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Describe what you tried and expected output..."
                  className="w-full rounded-xl border border-bright-border bg-bright-bg px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-brand-teal focus:outline-none focus:ring-1 focus:ring-brand-teal transition"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase tracking-wider">Code Snippet (Optional)</label>
                <textarea
                  rows="3"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="Paste your code block here..."
                  className="w-full rounded-xl border border-bright-border bg-[#0C0F14] font-mono text-[11px] text-brand-teal px-4 py-3 placeholder-slate-600 focus:border-brand-teal focus:outline-none focus:ring-1 focus:ring-brand-teal transition"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-bright-border">
                <button type="button" onClick={() => setShowComposer(false)} className="px-5 py-2.5 text-sm text-slate-400 font-bold hover:text-white transition">Cancel</button>
                <button
                  type="submit"
                  className="flex items-center space-x-2 rounded-xl bg-bright-gradient border border-brand-cyan px-6 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-brand-cyan/20 glow-bright-cyan hover:scale-105 transition"
                >
                  <Send className="h-4 w-4" />
                  <span>Post Doubt</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* THREAD DETAIL MODAL */}
      {activeThread && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl glass-bright card-glow-indigo p-8 shadow-2xl space-y-6 scrollbar-thin">
            <button onClick={() => setActiveThread(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white transition">
              <X className="h-6 w-6" />
            </button>

            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-brand-cyan font-bold tracking-widest uppercase">
                <span>Thread #{activeThread.id}</span>
                <span>• {activeThread.status}</span>
              </div>
              <h2 className="text-2xl font-black text-white mt-2">{activeThread.title}</h2>
              <p className="text-xs text-slate-400 font-mono mt-1.5">Asked by {activeThread.author} ({activeThread.authorRole})</p>
            </div>

            {/* Original question snippet */}
            <div className="rounded-xl border border-bright-border bg-bright-bg p-5 text-sm text-slate-300 leading-relaxed font-mono">
              {activeThread.snippet}
            </div>

            {/* Gemini AI Suggested Answer */}
            <div className="rounded-xl border border-brand-cyan/40 bg-brand-cyan/10 p-5 space-y-3 shadow-[0_0_15px_rgba(6,214,160,0.1)]">
              <div className="flex items-center space-x-2 text-sm font-black text-brand-cyan font-mono tracking-wide uppercase">
                <Bot className="h-5 w-5 animate-pulse" />
                <span>Gemini AI Verified Answer</span>
              </div>
              <p className="text-sm text-white leading-relaxed">{activeThread.aiAnswer}</p>
            </div>

            {/* Convert to Mentor Session Callout */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-brand-amber/30 bg-brand-amber/5 p-5">
              <div>
                <h5 className="text-sm font-bold text-white">Need live hands-on pair programming?</h5>
                <p className="text-xs text-slate-400 mt-1">Book a 30-min instant session with an expert mentor for this issue.</p>
              </div>
              <button
                onClick={() => {
                  setActiveThread(null);
                  openMentorModal();
                }}
                className="rounded-xl bg-bright-bg border border-brand-amber px-5 py-2.5 text-xs font-extrabold text-brand-amber shadow-md hover:bg-brand-amber/10 whitespace-nowrap transition"
              >
                Book Mentor
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
