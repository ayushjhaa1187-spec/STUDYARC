import React, { useState } from 'react';
import { 
  Zap, 
  Flame, 
  CheckSquare, 
  Bot, 
  Calendar, 
  Award, 
  ArrowUpRight, 
  CheckCircle2, 
  Sparkles,
  Clock,
  Video,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { AGENT_ACTIVITY_LOG, UPCOMING_SESSIONS, DAILY_TASKS } from '../data/mockData';

export default function DashboardPage({ user, setActivePage, openDiagnostic, openMentorModal, tasks, setTasks }) {
  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl glass-bright card-glow-cyan p-6">
        <div>
          <div className="flex items-center space-x-2 text-xs text-brand-teal font-mono uppercase tracking-widest font-bold">
            <Sparkles className="h-4 w-4 text-brand-amber animate-pulse" />
            <span>WELCOME BACK, {user?.name?.split(' ')[0] || 'ALEX'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            Agentic Execution Dashboard
          </h1>
          <p className="text-sm text-slate-300 mt-1.5 font-medium">
            Goal: Secure AI Internship by Q4 &nbsp;|&nbsp; Current Pace: 18 hrs/week
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={openDiagnostic}
            className="flex items-center space-x-2 rounded-xl bg-bright-bg px-4 py-3 text-xs font-semibold text-brand-teal border border-brand-teal hover:bg-brand-teal/10 transition"
          >
            <Sparkles className="h-4 w-4 text-brand-amber" />
            <span>Re-run AI Diagnostic</span>
          </button>
          <button
            onClick={() => setActivePage('/challenges')}
            className="flex items-center space-x-2 rounded-xl bg-bright-gradient border border-brand-cyan px-5 py-3 text-xs font-bold text-white shadow-md shadow-brand-cyan/20 hover:opacity-95 transition glow-bright-cyan"
          >
            <span>Open Sprint Workspace</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main 6-Card Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* CARD 1: Career Readiness Gauge */}
        <div className="glass-bright p-6 space-y-4 hover:card-glow-emerald transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wide">1. Career Readiness</span>
            <span className="rounded bg-brand-teal/10 px-2 py-0.5 text-[10px] font-mono text-brand-teal border border-brand-teal/20">
              Verified
            </span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <div className="flex items-baseline space-x-2">
                <span className="text-5xl font-black text-white">{user.readinessScore}%</span>
                <span className="text-xs font-bold text-brand-teal flex items-center">
                  <TrendingUp className="h-3.5 w-3.5 mr-0.5" /> +14%
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Ready for AI Internship roles</p>
            </div>

            {/* Circular Gauge Representation */}
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-4 border-brand-teal/30 bg-bright-bg text-brand-teal font-bold font-mono group-hover:shadow-[0_0_15px_rgba(53,199,184,0.5)] transition">
              <div className="absolute inset-0 rounded-full border-4 border-brand-teal border-t-transparent animate-spin-slow"></div>
              <span>{user.readinessScore}%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-bright-border text-xs">
            <div className="bg-bright-bg/50 p-2 rounded-lg border border-bright-border">
              <span className="text-slate-500 font-mono block text-[10px] uppercase">Shipped Projects</span>
              <span className="font-bold text-white text-sm">{user.metrics.projectsShipped} Verified</span>
            </div>
            <div className="bg-bright-bg/50 p-2 rounded-lg border border-bright-border">
              <span className="text-slate-500 font-mono block text-[10px] uppercase">Hours Logged</span>
              <span className="font-bold text-brand-cyan text-sm">{user.metrics.hoursExecuted} hrs</span>
            </div>
          </div>
        </div>

        {/* CARD 2: Current Sprint */}
        <div className="glass-bright p-6 space-y-4 hover:card-glow-cyan transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wide">2. Active Sprint</span>
            <span className="rounded bg-brand-cyan/10 px-2 py-0.5 text-[10px] font-mono text-brand-cyan border border-brand-cyan/20 animate-pulse">
              In Progress
            </span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">{user.sprintName || 'AI Agent Portfolio Sprint'}</h3>
            <p className="text-xs text-slate-400 mt-1">Day 8 of 30 | {tasks.length - completedCount} remaining tasks today</p>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Sprint Progress</span>
              <span className="text-brand-cyan font-bold">26.6%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-bright-bg border border-bright-border">
              <div className="h-full w-[26.6%] rounded-full bg-gradient-to-r from-brand-teal to-brand-cyan shadow-glow"></div>
            </div>
          </div>

          <button
            onClick={() => setActivePage('/challenges')}
            className="w-full flex items-center justify-center space-x-2 rounded-xl bg-bright-bg py-2.5 text-xs font-bold text-brand-cyan hover:bg-brand-cyan/10 transition border border-brand-cyan/30 mt-2"
          >
            <span>Continue Sprint Workspace</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        {/* CARD 3: Next Actions Today */}
        <div className="glass-bright p-6 space-y-4 hover:card-glow-amber transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wide">3. Next Actions Today</span>
            <span className="text-xs font-mono text-brand-amber font-bold bg-brand-amber/10 px-2 py-0.5 rounded border border-brand-amber/20">{completedCount}/{tasks.length} Done</span>
          </div>

          <div className="space-y-3 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`flex cursor-pointer items-start space-x-3 rounded-xl p-3 border transition-all ${
                  task.completed
                    ? 'border-brand-teal/30 bg-brand-teal/5 text-slate-500 line-through opacity-60'
                    : 'border-bright-border bg-bright-bg text-slate-200 hover:border-brand-amber/50 hover:bg-brand-amber/5'
                }`}
              >
                <div className={`mt-0.5 h-4 w-4 shrink-0 rounded border flex items-center justify-center transition-colors ${
                  task.completed ? 'border-brand-teal bg-brand-teal text-black' : 'border-slate-600'
                }`}>
                  {task.completed && <CheckCircle2 className="h-3 w-3" />}
                </div>
                <div className="flex-1 text-xs">
                  <p className="font-semibold leading-snug">{task.title}</p>
                  <div className="mt-1 flex items-center space-x-2 text-[10px] text-slate-500 font-mono">
                    <span className="flex items-center"><Clock className="h-3 w-3 mr-1 text-brand-amber" /> {task.dueTime}</span>
                    <span>• {task.estimate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CARD 4: Agent Activity Log */}
        <div className="glass-bright p-6 space-y-4 hover:card-glow-indigo transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wide">4. Gemini Agent Activity</span>
            <span className="flex items-center space-x-1.5 text-[10px] text-brand-indigo font-mono bg-brand-indigo/10 px-2 py-0.5 rounded border border-brand-indigo/20">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-indigo animate-ping"></span>
              <span className="font-bold">Live Feed</span>
            </span>
          </div>

          <div className="space-y-4 max-h-48 overflow-y-auto pr-1 scrollbar-thin pt-2">
            {AGENT_ACTIVITY_LOG.map((log) => (
              <div key={log.id} className="flex items-start space-x-3 text-xs group">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-indigo/10 text-brand-indigo border border-brand-indigo/30 group-hover:bg-brand-indigo group-hover:text-white transition-colors">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white">{log.action}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{log.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{log.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CARD 5: Upcoming Sessions */}
        <div className="glass-bright p-6 space-y-4 hover:card-glow-rose transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wide">5. Expert Reviews</span>
            <button 
              onClick={() => setActivePage('/mentors')}
              className="text-[10px] text-brand-coral hover:text-white transition font-mono font-bold bg-brand-coral/10 px-2 py-0.5 rounded border border-brand-coral/30"
            >
              Book New +
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {UPCOMING_SESSIONS.map((session) => (
              <div key={session.id} className="rounded-xl border border-bright-border bg-bright-bg p-4 text-xs space-y-3 hover:border-brand-coral/30 transition-colors">
                <div className="flex items-center space-x-3">
                  <img src={session.avatar} alt={session.mentorName} className="h-10 w-10 rounded-full object-cover border-2 border-brand-coral/30" />
                  <div>
                    <h4 className="font-bold text-white text-sm">{session.mentorName}</h4>
                    <p className="text-[10px] text-brand-coral font-mono">{session.mentorRole}</p>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 font-medium bg-bright-card p-2 rounded-lg">{session.topic}</p>

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-2 border-t border-bright-border">
                  <span className="flex items-center"><Calendar className="h-3.5 w-3.5 mr-1.5 text-brand-coral" /> {session.date}</span>
                  <a
                    href={session.link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1 text-white hover:text-brand-coral transition font-bold"
                  >
                    <Video className="h-3.5 w-3.5 text-brand-coral" />
                    <span>Join Call</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CARD 6: XP & Streaks Heatmap */}
        <div className="glass-bright p-6 space-y-4 hover:card-glow-amber transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wide">6. XP & Streaks</span>
            <div className="flex items-center space-x-1 text-brand-amber font-bold text-xs bg-brand-amber/10 px-2 py-0.5 rounded border border-brand-amber/20">
              <Flame className="h-3.5 w-3.5 fill-brand-amber" />
              <span>{user.streak} Day Streak</span>
            </div>
          </div>

          <div className="pt-2">
            <div className="flex justify-between text-xs font-mono mb-2">
              <span className="text-white font-bold text-sm">Level {user.level} Executioner</span>
              <span className="text-brand-amber font-bold">{user.xp} / {user.nextLevelXp} XP</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-bright-bg border border-bright-border">
              <div className="h-full w-[86%] rounded-full bg-gradient-to-r from-brand-amber via-brand-coral to-brand-pink shadow-glow"></div>
            </div>
          </div>

          {/* Activity heatmap grid */}
          <div className="space-y-2 pt-3 border-t border-bright-border">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-slate-500 uppercase">30-Day Consistency</span>
            </div>
            <div className="grid grid-cols-10 gap-1.5">
              {Array.from({ length: 30 }).map((_, i) => {
                const active = i > 12;
                const levelClass = active 
                  ? (i % 3 === 0 ? 'bg-brand-amber shadow-[0_0_8px_rgba(245,158,11,0.6)]' : 'bg-brand-amber/60') 
                  : 'bg-bright-bg border border-bright-border';
                return (
                  <div
                    key={i}
                    className={`h-4 rounded-md transition-all hover:scale-125 ${levelClass}`}
                    title={`Day ${i + 1}: ${active ? 'Tasks completed' : 'No tasks'}`}
                  />
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
