import React, { useState } from 'react';
import {
  Zap, Flame, CheckCircle2, Bot, Calendar, ArrowUpRight,
  Sparkles, Clock, Video, ChevronRight, TrendingUp, Shield,
  BookOpen, Play
} from 'lucide-react';
import {
  AGENT_ACTIVITY_LOG, UPCOMING_SESSIONS, COURSES
} from '../data/mockData';

export default function DashboardPage({ user, setActivePage, openDiagnostic, openMentorModal, tasks, setTasks }) {
  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const completedPct = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

  // Heatmap data: 30 cells with varying activity levels
  const heatmapData = Array.from({ length: 30 }, (_, i) => {
    if (i < 10) return 0;
    if (i === 17 || i === 22 || i === 25) return 0;
    const r = Math.random();
    if (r < 0.1) return 1;
    if (r < 0.4) return 2;
    if (r < 0.7) return 3;
    return 4;
  });

  // In-progress courses from user's enrolled courses
  const inProgressCourses = COURSES.filter(c =>
    (user?.enrolledCourses || []).includes(c.id)
  ).slice(0, 2);

  return (
    <div className="space-y-6 pb-16">

      {/* ── Welcome Header ─────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl glass-bright card-glow-cyan p-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-brand-teal font-mono uppercase tracking-widest font-bold">
            <Sparkles className="h-4 w-4 text-brand-amber animate-pulse" />
            <span>Welcome Back, {user?.name?.split(' ')[0] || 'Alex'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            Agentic Execution Dashboard
          </h1>
          <p className="text-sm text-slate-300 mt-1.5">
            Goal: <span className="text-brand-teal font-semibold">{(user?.goals || [])[0] || 'Secure AI Internship by Q4'}</span>
            &nbsp;·&nbsp; Pace: {user?.weeklyAvailabilityHours || 18} hrs/week
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={openDiagnostic}
            className="flex items-center gap-2 rounded-xl border border-brand-teal/40 bg-brand-teal/10 px-4 py-2.5 text-xs font-semibold text-brand-teal hover:bg-brand-teal/20 transition-all"
          >
            <Sparkles className="h-3.5 w-3.5 text-brand-amber" />
            Re-run AI Diagnostic
          </button>
          <button
            onClick={() => setActivePage('/challenges')}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-teal to-brand-cyan border border-brand-cyan/30 px-5 py-2.5 text-xs font-bold text-black shadow-lg shadow-brand-cyan/20 hover:opacity-90 transition-all"
          >
            Open Sprint Workspace
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── Quick Metrics Row ───────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Career Readiness', value: `${user?.readinessScore || 72}%`, sub: '+14% this month', icon: TrendingUp, color: 'text-brand-teal', bg: 'bg-brand-teal/10', border: 'border-brand-teal/20' },
          { label: 'Day Streak', value: `${user?.streak || 12}`, sub: 'days consecutive', icon: Flame, color: 'text-brand-amber', bg: 'bg-brand-amber/10', border: 'border-brand-amber/20' },
          { label: 'XP Earned', value: `${(user?.xp || 3450).toLocaleString()}`, sub: `Level ${user?.level || 14}`, icon: Zap, color: 'text-brand-indigo', bg: 'bg-brand-indigo/10', border: 'border-brand-indigo/20' },
          { label: 'Verified Projects', value: `${user?.metrics?.verifiedProofs || 3}`, sub: 'portfolio items', icon: Shield, color: 'text-brand-cyan', bg: 'bg-brand-cyan/10', border: 'border-brand-cyan/20' },
        ].map(({ label, value, sub, icon: Icon, color, bg, border }) => (
          <div key={label} className={`glass-bright p-4 rounded-2xl border ${border} flex items-center gap-3`}>
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg}`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <div>
              <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wide">{label}</p>
              <p className="text-xl font-black text-white leading-tight">{value}</p>
              <p className="text-[10px] text-slate-400">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Grid ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* CARD 1: Active Sprint */}
        <div className="glass-bright p-6 space-y-4 hover:card-glow-cyan transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wide">Active Sprint</span>
            <span className="rounded-full bg-brand-cyan/10 px-2.5 py-0.5 text-[10px] font-mono text-brand-cyan border border-brand-cyan/20 animate-pulse">In Progress</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{user?.sprintName || user?.currentPath || 'AI Internship Portfolio Sprint'}</h3>
            <p className="text-xs text-slate-400 mt-1">Day 8 of 30 · {tasks.length - completedCount} tasks remaining today</p>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Sprint Progress</span>
              <span className="text-brand-cyan font-bold">26.6%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-bright-bg border border-bright-border">
              <div className="progress-bar-gradient h-full rounded-full" style={{ width: '26.6%' }} />
            </div>
          </div>
          <button
            onClick={() => setActivePage('/challenges')}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-bright-bg border border-brand-cyan/30 py-2.5 text-xs font-bold text-brand-cyan hover:bg-brand-cyan/10 transition-all"
          >
            Continue Sprint Workspace
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* CARD 2: Today's Tasks */}
        <div className="glass-bright p-6 space-y-4 hover:card-glow-amber transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wide">Today's Tasks</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-brand-amber font-bold bg-brand-amber/10 px-2 py-0.5 rounded border border-brand-amber/20">
                {completedCount}/{tasks.length} Done
              </span>
            </div>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-bright-bg border border-bright-border">
            <div className="h-full rounded-full bg-gradient-to-r from-brand-amber to-brand-coral transition-all duration-500" style={{ width: `${completedPct}%` }} />
          </div>
          <div className="space-y-2 max-h-52 overflow-y-auto pr-1 scrollbar-thin">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                role="checkbox"
                aria-checked={task.completed}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && toggleTask(task.id)}
                className={`flex cursor-pointer items-start gap-3 rounded-xl p-3 border transition-all ${
                  task.completed
                    ? 'border-brand-teal/20 bg-brand-teal/5 text-slate-500 line-through opacity-50'
                    : 'border-bright-border bg-bright-bg text-slate-200 hover:border-brand-amber/40 hover:bg-brand-amber/5'
                }`}
              >
                <div className={`mt-0.5 h-4 w-4 shrink-0 rounded border flex items-center justify-center transition-all ${
                  task.completed ? 'border-brand-teal bg-brand-teal text-black' : 'border-slate-600'
                }`}>
                  {task.completed && <CheckCircle2 className="h-3 w-3" />}
                </div>
                <div className="flex-1 text-xs min-w-0">
                  <p className="font-semibold leading-snug truncate">{task.title}</p>
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-brand-amber" />{task.dueTime}</span>
                    <span>·</span>
                    <span>{task.estimate}</span>
                    <span className={`rounded px-1 ${task.difficulty === 'Hard' ? 'text-brand-coral' : task.difficulty === 'Medium' ? 'text-brand-amber' : 'text-brand-teal'}`}>{task.difficulty}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CARD 3: Gemini Agent Activity */}
        <div className="glass-bright p-6 space-y-4 hover:card-glow-indigo transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wide">Gemini Agent Feed</span>
            <span className="flex items-center gap-1.5 text-[10px] text-brand-indigo font-mono bg-brand-indigo/10 px-2.5 py-0.5 rounded-full border border-brand-indigo/20">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-indigo animate-ping" />
              Live
            </span>
          </div>
          <div className="space-y-4 max-h-52 overflow-y-auto pr-1 scrollbar-thin">
            {AGENT_ACTIVITY_LOG.map((log) => (
              <div key={log.id} className="flex items-start gap-3 text-xs group">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-indigo/10 text-brand-indigo border border-brand-indigo/30 group-hover:bg-brand-indigo group-hover:text-white transition-all">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-white">{log.action}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{log.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{log.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CARD 4: Upcoming Expert Sessions */}
        <div className="glass-bright p-6 space-y-4 hover:card-glow-rose transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wide">Expert Sessions</span>
            <button
              onClick={() => setActivePage('/experts')}
              className="text-[10px] text-brand-coral hover:text-white font-mono font-bold bg-brand-coral/10 px-2.5 py-0.5 rounded border border-brand-coral/30 transition-all"
            >
              Book New +
            </button>
          </div>
          <div className="space-y-3">
            {UPCOMING_SESSIONS.map((session) => (
              <div key={session.id} className="rounded-xl border border-bright-border bg-bright-bg p-4 text-xs space-y-3 hover:border-brand-coral/30 transition-colors">
                <div className="flex items-center gap-3">
                  <img src={session.avatar} alt={session.mentorName} className="h-9 w-9 rounded-full object-cover border-2 border-brand-coral/30" />
                  <div>
                    <p className="font-bold text-white text-sm">{session.mentorName}</p>
                    <p className="text-[10px] text-brand-coral font-mono">{session.mentorRole}</p>
                  </div>
                  <span className={`ml-auto text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                    session.status === 'Confirmed'
                      ? 'bg-brand-teal/10 text-brand-teal border-brand-teal/30'
                      : 'bg-brand-amber/10 text-brand-amber border-brand-amber/30'
                  }`}>{session.status}</span>
                </div>
                <p className="text-[11px] text-slate-300 font-medium bg-bright-card p-2 rounded-lg leading-relaxed">{session.topic}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3 text-brand-coral" />{session.date}</span>
                  <a href={session.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-white hover:text-brand-coral transition font-bold">
                    <Video className="h-3 w-3 text-brand-coral" /> Join Call
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CARD 5: Courses In Progress */}
        <div className="glass-bright p-6 space-y-4 hover:card-glow-emerald transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wide">Courses In Progress</span>
            <button onClick={() => setActivePage('/catalog')} className="text-[10px] text-brand-teal font-mono bg-brand-teal/10 px-2.5 py-0.5 rounded border border-brand-teal/30 hover:text-white transition-all">
              Browse +
            </button>
          </div>
          <div className="space-y-4">
            {(inProgressCourses.length > 0 ? inProgressCourses : [
              { id: 'langchain-agents', title: 'LangChain & AI Agents Bootcamp', instructor: 'Dr. Alex Chen', thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&auto=format&fit=crop&q=80' },
              { id: 'react-masterclass', title: 'React 19 Masterclass', instructor: 'Priya Sharma', thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&auto=format&fit=crop&q=80' }
            ]).map((course, idx) => {
              const progress = idx === 0 ? 40 : 65;
              return (
                <div key={course.id} className="flex items-center gap-3 rounded-xl border border-bright-border bg-bright-bg p-3">
                  <img src={course.thumbnail} alt={course.title} className="h-12 w-16 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">{course.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-mono">{course.instructor}</p>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span>Progress</span>
                        <span className="text-brand-teal font-bold">{progress}%</span>
                      </div>
                      <div className="h-1 w-full overflow-hidden rounded-full bg-bright-border">
                        <div className="h-full rounded-full bg-gradient-to-r from-brand-teal to-brand-cyan" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setActivePage('/learn', { courseId: course.id })}
                    className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-brand-teal/10 border border-brand-teal/30 text-brand-teal hover:bg-brand-teal hover:text-black transition-all"
                    aria-label={`Continue ${course.title}`}
                  >
                    <Play className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
          <button
            onClick={() => setActivePage('/catalog')}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-bright-border bg-bright-bg py-2 text-xs font-semibold text-slate-400 hover:text-white hover:border-slate-600 transition-all"
          >
            <BookOpen className="h-3.5 w-3.5" />
            Browse All Courses
          </button>
        </div>

        {/* CARD 6: XP & Streaks Heatmap */}
        <div className="glass-bright p-6 space-y-4 hover:card-glow-amber transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wide">XP & Streaks</span>
            <div className="flex items-center gap-1 text-brand-amber font-bold text-xs bg-brand-amber/10 px-2.5 py-0.5 rounded border border-brand-amber/20">
              <Flame className="h-3.5 w-3.5 fill-brand-amber" />
              {user?.streak || 12} Day Streak
            </div>
          </div>

          {/* Level & XP bar */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-white font-bold">Level {user?.level || 14} Executioner</span>
              <span className="text-brand-amber font-bold">{(user?.xp || 3450).toLocaleString()} / {(user?.nextLevelXp || 4000).toLocaleString()} XP</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-bright-bg border border-bright-border">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-amber via-brand-coral to-brand-indigo"
                style={{ width: `${Math.round(((user?.xp || 3450) / (user?.nextLevelXp || 4000)) * 100)}%` }}
              />
            </div>
          </div>

          {/* 30-day heatmap */}
          <div className="space-y-2 pt-2 border-t border-bright-border">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-slate-500 uppercase">30-Day Activity</span>
              <span className="text-[10px] font-mono text-brand-teal">{heatmapData.filter(v => v > 0).length} active days</span>
            </div>
            <div className="grid grid-cols-10 gap-1">
              {heatmapData.map((level, i) => (
                <div
                  key={i}
                  className={`h-4 rounded-md transition-all hover:scale-125 heatmap-tile-${level}`}
                  title={`Day ${i + 1}: ${level === 0 ? 'No activity' : `${level * 2}h of learning`}`}
                  role="img"
                  aria-label={`Day ${i + 1} activity level ${level}`}
                />
              ))}
            </div>
            <div className="flex items-center justify-end gap-1 text-[9px] text-slate-500 font-mono">
              <span>Less</span>
              {[0,1,2,3,4].map(l => <div key={l} className={`h-2.5 w-2.5 rounded heatmap-tile-${l}`} />)}
              <span>More</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
