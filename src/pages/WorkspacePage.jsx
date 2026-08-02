import React, { useState } from 'react';
import { 
  CheckSquare, 
  Clock, 
  Code, 
  Bot, 
  Sparkles, 
  ChevronRight, 
  Plus, 
  CheckCircle2, 
  BarChart2, 
  Layers 
} from 'lucide-react';
import AICoachPanel from '../components/AICoachPanel';
import { DAILY_TASKS } from '../data/mockData';

export default function WorkspacePage() {
  const [activeTab, setActiveTab] = useState('Today');
  const [tasks, setTasks] = useState(DAILY_TASKS);
  const [showAIChat, setShowAIChat] = useState(true);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const filteredTasks = tasks.filter(t => {
    if (activeTab === 'Today') return !t.completed || t.id === 1;
    if (activeTab === 'Completed') return t.completed;
    return true; // Backlog
  });

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-emerald-400 uppercase">
            <CheckSquare className="h-4 w-4" />
            <span>Sprint Workspace & Execution Workbench</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Challenges & Daily Tasks</h1>
        </div>

        <button
          onClick={() => setShowAIChat(!showAIChat)}
          className="flex items-center space-x-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition"
        >
          <Bot className="h-4 w-4" />
          <span>{showAIChat ? 'Hide AI Coach Panel' : 'Open AI Coach Panel'}</span>
        </button>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left / Center Tasks & Challenges (7 cols or 12 cols if chat hidden) */}
        <div className={`${showAIChat ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-6`}>
          
          {/* Tab Navigation */}
          <div className="flex space-x-2 border-b border-slate-800 pb-3">
            {['Today', 'Backlog', 'Completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                {tab} {tab === 'Today' && `(${tasks.filter(t => !t.completed).length})`}
              </button>
            ))}
          </div>

          {/* Today's Featured Challenge Card */}
          {activeTab === 'Today' && (
            <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-[#0f172a] to-slate-950 p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="rounded font-mono text-[10px] uppercase text-emerald-400 bg-emerald-500/10 px-2.5 py-1 border border-emerald-500/20">
                  MAIN SPRINT TASK TODAY
                </span>
                <span className="text-xs font-mono text-slate-400">Est. 45 mins</span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">
                  Implement vector search chunking strategy in RAG pipeline
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Journey: AI Internship Portfolio Sprint | Challenge #4
                </p>
              </div>

              {/* Subtasks checklist */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-[11px] font-mono text-slate-400 uppercase">Subtasks Execution</span>
                <div className="space-y-2">
                  {[
                    "Configure RecursiveCharacterTextSplitter with 500 chunk size",
                    "Add 50 character overlap between adjacent document windows",
                    "Run benchmark test against sample 50-page PDF dataset",
                    "Verify latency under 100ms in FastAPI test route"
                  ].map((sub, idx) => (
                    <label key={idx} className="flex items-center space-x-3 text-xs text-slate-200 cursor-pointer">
                      <input type="checkbox" defaultChecked={idx < 2} className="accent-emerald-400 rounded h-4 w-4" />
                      <span>{sub}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-800">
                <span className="text-xs text-slate-400 font-mono">+150 XP on completion</span>
                <button
                  onClick={() => setShowAIChat(true)}
                  className="flex items-center space-x-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition"
                >
                  <Bot className="h-3.5 w-3.5" />
                  <span>Ask AI Coach For Debug Help</span>
                </button>
              </div>
            </div>
          )}

          {/* List of Challenge Cards */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
              Sprint Task Backlog
            </h4>
            {filteredTasks.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#0f172a]/90 p-4 transition hover:border-slate-700"
              >
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => toggleTask(t.id)}
                    className={`mt-0.5 h-5 w-5 rounded border flex items-center justify-center transition ${
                      t.completed ? 'border-emerald-400 bg-emerald-500 text-black' : 'border-slate-600'
                    }`}
                  >
                    {t.completed && <CheckCircle2 className="h-3.5 w-3.5" />}
                  </button>
                  <div>
                    <h4 className={`text-sm font-bold ${t.completed ? 'text-slate-500 line-through' : 'text-white'}`}>
                      {t.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">{t.journey}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-xs font-mono text-slate-400">
                  <span className="rounded bg-slate-800 px-2 py-0.5">{t.difficulty}</span>
                  <span className="flex items-center"><Clock className="h-3 w-3 mr-1" /> {t.estimate}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Sprint Progress Summary Box */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-300 font-bold">Sprint Task Completion Rate</span>
              <span className="text-emerald-400">{completedCount} of {tasks.length} Done</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-500"
                style={{ width: `${(completedCount / tasks.length) * 100}%` }}
              ></div>
            </div>
          </div>

        </div>

        {/* Right Side Panel: Interactive AI Coach Panel */}
        {showAIChat && (
          <div className="lg:col-span-5 h-[560px]">
            <AICoachPanel />
          </div>
        )}

      </div>
    </div>
  );
}
