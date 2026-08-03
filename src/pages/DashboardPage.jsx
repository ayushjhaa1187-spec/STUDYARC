import React from 'react';
import { Target, Flame, Shield, Play, CheckCircle2, Bot, Calendar, ChevronRight, Activity, ArrowUpRight } from 'lucide-react';
import { COURSES, AGENT_ACTIVITY_LOG, UPCOMING_SESSIONS } from '../data/mockData';

const DashboardPage = ({ user, setActivePage, openDiagnostic, openMentorModal, tasks, setTasks }) => {

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };
  
  const completedTasks = tasks.filter(t => t.completed).length;
  const taskProgress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0C0F14] text-gray-200 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Welcome Header Card */}
        <div className="glass-bright rounded-2xl p-6 md:p-8 border border-brand-cyan/20 card-glow-cyan relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-cyan/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
          
          <div className="z-10">
            <span className="text-brand-teal font-mono text-sm tracking-wider uppercase font-semibold mb-2 block">Welcome Back, {user?.name?.split(' ')[0] || 'Alex'}</span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 font-display">Agentic Execution Dashboard</h1>
            <p className="text-gray-400 text-sm md:text-base flex items-center gap-2">
              <Target size={16} className="text-brand-amber" /> 
              Current Goal: Secure AI Internship by Q4 &middot; 18 hrs/week pace
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 z-10 w-full md:w-auto">
            <button 
              onClick={openDiagnostic}
              className="px-5 py-2.5 rounded-lg font-medium border border-gray-600 bg-gray-800/50 text-gray-200 hover:bg-gray-700 hover:text-white transition-colors text-sm text-center"
            >
              Re-run AI Diagnostic
            </button>
            <button 
              onClick={() => setActivePage('/challenges')}
              className="px-5 py-2.5 rounded-lg font-semibold bg-brand-teal text-[#0C0F14] hover:bg-teal-400 transition-colors text-sm text-center shadow-lg shadow-brand-teal/20"
            >
              Open Sprint Workspace
            </button>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#161b22] border border-[#262e3c] rounded-xl p-4 flex flex-col hover:border-gray-500 transition-colors">
            <span className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Career Readiness</span>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-white">78%</span>
              <span className="text-xs text-brand-teal flex items-center mb-1"><ArrowUpRight size={14}/> 14%</span>
            </div>
          </div>
          <div className="bg-[#161b22] border border-[#262e3c] rounded-xl p-4 flex flex-col hover:border-brand-amber/50 transition-colors">
            <span className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Streak</span>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-white">12</span>
              <Flame size={20} className="text-brand-amber mb-1" />
            </div>
          </div>
          <div className="bg-[#161b22] border border-[#262e3c] rounded-xl p-4 flex flex-col hover:border-brand-violet/50 transition-colors">
            <span className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">XP Points</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">3,450</span>
              <span className="px-1.5 py-0.5 bg-brand-violet/20 text-brand-violet text-[10px] font-bold rounded">LVL 4</span>
            </div>
          </div>
          <div className="bg-[#161b22] border border-[#262e3c] rounded-xl p-4 flex flex-col hover:border-emerald-500/50 transition-colors">
            <span className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Projects</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">4</span>
              <Shield size={16} className="text-emerald-500" />
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Active Sprint */}
          <div className="glass-bright rounded-xl p-5 border border-[#262e3c] card-glow-cyan flex flex-col">
            <h3 className="font-semibold text-white mb-1">Active Sprint: React Mastery</h3>
            <p className="text-xs text-gray-400 mb-4">Day 12 of 30</p>
            
            <div className="mt-auto">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-gray-300">Progress</span>
                <span className="text-brand-cyan">26.6%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2 mb-5">
                <div className="bg-brand-cyan h-2 rounded-full" style={{ width: '26.6%' }}></div>
              </div>
              <button 
                onClick={() => setActivePage('/challenges')}
                className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-white rounded text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                Continue Sprint <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Today's Tasks */}
          <div className="glass-bright rounded-xl p-5 border border-[#262e3c] card-glow-amber flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-white">Today's Plan</h3>
              <span className="px-2 py-0.5 bg-brand-amber/10 text-brand-amber text-xs font-bold rounded">{completedTasks}/{tasks.length} Done</span>
            </div>
            
            <div className="space-y-3 flex-1 mb-4">
              {tasks.slice(0,4).map(task => (
                <div key={task.id} className="flex items-start gap-3 cursor-pointer group" onClick={() => toggleTask(task.id)}>
                  <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors ${task.completed ? 'bg-brand-amber border-brand-amber text-[#0C0F14]' : 'border-gray-500 group-hover:border-brand-amber'}`}>
                    {task.completed && <CheckCircle2 size={12} strokeWidth={3} />}
                  </div>
                  <span className={`text-sm ${task.completed ? 'text-gray-500 line-through' : 'text-gray-200'}`}>{task.title}</span>
                </div>
              ))}
            </div>
            
            <div className="w-full bg-gray-800 rounded-full h-1.5">
              <div className="bg-brand-amber h-1.5 rounded-full transition-all" style={{ width: `${taskProgress}%` }}></div>
            </div>
          </div>

          {/* Gemini Agent Activity */}
          <div className="glass-bright rounded-xl p-5 border border-[#262e3c] card-glow-indigo flex flex-col h-[280px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Bot size={18} className="text-brand-indigo" /> Agent Activity
              </h3>
              <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-brand-indigo bg-brand-indigo/10 px-2 py-0.5 rounded">
                <span className="w-1.5 h-1.5 bg-brand-indigo rounded-full animate-ping"></span> Live
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto scrollbar-none space-y-4 pr-2">
              {AGENT_ACTIVITY_LOG.map(log => (
                <div key={log.id} className="flex gap-3 relative before:absolute before:left-3.5 before:top-6 before:bottom-[-16px] before:w-[1px] before:bg-gray-800 last:before:hidden">
                  <div className="w-7 h-7 rounded-full bg-[#161b22] border border-gray-700 flex items-center justify-center shrink-0 z-10">
                    <Activity size={12} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-200">{log.action}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{log.detail}</p>
                    <span className="text-[10px] text-gray-600 mt-1 block">{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Courses In Progress */}
          <div className="glass-bright rounded-xl p-5 border border-[#262e3c] lg:col-span-2">
            <h3 className="font-semibold text-white mb-4">Continue Learning</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {COURSES.slice(0, 2).map((course, idx) => {
                const progress = idx === 0 ? 65 : 40;
                return (
                  <div key={course.id} className="bg-[#161b22] rounded-lg border border-[#262e3c] p-4 flex gap-4 hover:border-gray-500 transition-colors">
                    <div className="w-16 h-16 rounded bg-gray-800 shrink-0 overflow-hidden relative">
                      <div className="absolute inset-0 bg-brand-teal/20 flex items-center justify-center">
                        <Play size={20} className="text-brand-teal" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-white truncate">{course.title}</h4>
                        <p className="text-xs text-gray-400 mt-1">{course.instructor}</p>
                      </div>
                      <div className="mt-2">
                        <div className="flex justify-between text-[10px] mb-1">
                          <span className="text-brand-teal">{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-1">
                          <div className="bg-brand-teal h-1 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Upcoming Sessions */}
          <div className="glass-bright rounded-xl p-5 border border-[#262e3c] card-glow-rose">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-white">Upcoming Sessions</h3>
              <button onClick={() => setActivePage('/experts')} className="text-xs text-brand-coral hover:underline">Book New +</button>
            </div>
            
            <div className="space-y-3">
              {UPCOMING_SESSIONS.slice(0, 2).map(session => (
                <div key={session.id} className="bg-[#161b22] border border-[#262e3c] rounded-lg p-3">
                  <div className="flex gap-3 items-center mb-2">
                    <img src={session.expertAvatar} alt={session.expertName} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <h4 className="text-sm font-medium text-white leading-none">{session.expertName}</h4>
                      <span className="text-[10px] text-gray-400">{session.topic}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-800">
                    <span className="text-xs text-gray-300 flex items-center gap-1"><Calendar size={12}/> {session.date}</span>
                    <button className="text-xs font-medium text-brand-coral bg-brand-coral/10 px-2 py-1 rounded">Join Call</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
