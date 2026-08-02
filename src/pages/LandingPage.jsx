import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Code, 
  Users, 
  Award, 
  Zap, 
  Star, 
  Flame, 
  ShieldCheck,
  TrendingUp,
  Brain,
  MessageSquareCode,
  BookOpen,
  MonitorPlay
} from 'lucide-react';
import EnergyTimeline from '../components/EnergyTimeline';

export default function LandingPage({ setActivePage, openDiagnostic, lenis }) {
  const [activePulse, setActivePulse] = useState([]);

  // Generate random pulses
  useEffect(() => {
    const names = ['ayush_jha', 'sarah_chen', 'neil_p', 'priya_k', 'marco_s', 'lin_d'];
    const generatePulse = () => {
      const newPulse = {
        id: Date.now(),
        name: names[Math.floor(Math.random() * names.length)],
        left: `${Math.random() * 80 + 10}%`,
        delay: `${Math.random() * 2}s`
      };
      setActivePulse(prev => [...prev.slice(-4), newPulse]);
    };
    const interval = setInterval(generatePulse, 3000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      if (lenis) {
        lenis.scrollTo(el, { offset: -70 });
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="space-y-32 pb-32">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 lg:pt-24 pb-12 overflow-hidden flex flex-col items-center text-center">
        
        {/* Floating Pulses Track */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
          {activePulse.map(pulse => (
            <div 
              key={pulse.id}
              className="absolute bottom-0 flex items-center space-x-2 bg-bright-card/80 border border-brand-teal/30 px-3 py-1.5 rounded-full animate-float-up shadow-glow"
              style={{ left: pulse.left, animationDelay: pulse.delay }}
            >
              <div className="h-5 w-5 rounded-full bg-gradient-to-br from-brand-indigo to-brand-cyan flex items-center justify-center text-[10px] font-bold text-white">
                {pulse.name.charAt(0).toUpperCase()}
              </div>
              <div className="h-1.5 w-1.5 rounded-full bg-brand-cyan animate-pulse"></div>
              <span className="text-[10px] text-slate-300 font-mono">
                <strong className="text-white">{pulse.name}</strong> just solved a doubt.
              </span>
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto space-y-6 px-4">
          <div className="inline-flex items-center space-x-2 rounded-full border border-brand-teal/50 bg-brand-teal/10 px-4 py-1.5 text-xs font-mono text-brand-teal font-bold shadow-md shadow-brand-teal/10 animate-float">
            <div className="h-2 w-2 rounded-full bg-brand-teal animate-ping mr-1"></div>
            <span>Now Live · Powered by Gemini AI</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white leading-tight">
            Bridge the Gap.<br />
            <span className="text-gradient-bright drop-shadow-2xl">Learn. Earn. Grow.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            STUDYARC turns your <strong className="text-white">academic doubts</strong> into answered questions, your <strong className="text-white">knowledge</strong> into reputation, and your <strong className="text-white">goals</strong> into mentored reality.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <button
              onClick={openDiagnostic}
              className="group flex items-center space-x-2 rounded-xl bg-bright-gradient border border-brand-teal px-8 py-4 text-base font-extrabold text-white shadow-2xl shadow-brand-teal/30 transition hover:opacity-95 hover:scale-105 glow-bright-cyan"
            >
              <span>Start for Free</span>
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="px-6 py-4 text-sm font-bold text-slate-400 hover:text-white transition"
            >
              See how it works ↓
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-12 max-w-2xl mx-auto border-t border-bright-border/50 mt-12">
            <div className="text-center">
              <div className="text-3xl font-black text-white">4,800+</div>
              <div className="text-[10px] uppercase font-mono text-brand-cyan tracking-wider mt-1">Doubts Solved</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-white">320+</div>
              <div className="text-[10px] uppercase font-mono text-brand-indigo tracking-wider mt-1">Expert Mentors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-white">12k+</div>
              <div className="text-[10px] uppercase font-mono text-brand-amber tracking-wider mt-1">Reputation Points</div>
            </div>
          </div>
        </div>
      </section>

      {/* INFINITE TICKER */}
      <section className="w-full overflow-hidden border-y border-bright-border bg-bright-card/50 py-3 relative z-10">
        <div className="flex w-[200%] animate-ticker">
          <div className="flex w-1/2 justify-around whitespace-nowrap">
            <span className="flex items-center text-sm font-bold text-slate-300">
              <span className="mr-2 text-brand-cyan">🧠</span> AI Doubt Solver <span className="ml-2 rounded bg-brand-cyan/20 px-1.5 py-0.5 text-[10px] text-brand-cyan uppercase">Live</span>
            </span>
            <span className="flex items-center text-sm font-bold text-slate-300">
              <span className="mr-2 text-brand-amber">⚡</span> Real-time Answers <span className="ml-2 rounded bg-brand-amber/20 px-1.5 py-0.5 text-[10px] text-brand-amber uppercase">New</span>
            </span>
            <span className="flex items-center text-sm font-bold text-slate-300">
              <span className="mr-2 text-brand-teal">🏆</span> Reputation Leaderboard <span className="ml-2 rounded bg-brand-teal/20 px-1.5 py-0.5 text-[10px] text-brand-teal uppercase">Hot</span>
            </span>
            <span className="flex items-center text-sm font-bold text-slate-300">
              <span className="mr-2 text-brand-indigo">📚</span> AI Practice Tests <span className="ml-2 rounded bg-brand-indigo/20 px-1.5 py-0.5 text-[10px] text-brand-indigo uppercase">Beta</span>
            </span>
            <span className="flex items-center text-sm font-bold text-slate-300">
              <span className="mr-2 text-brand-coral">🎓</span> Book Expert Mentors <span className="ml-2 rounded bg-brand-coral/20 px-1.5 py-0.5 text-[10px] text-brand-coral uppercase">Live</span>
            </span>
          </div>
          <div className="flex w-1/2 justify-around whitespace-nowrap">
            <span className="flex items-center text-sm font-bold text-slate-300">
              <span className="mr-2 text-brand-cyan">🧠</span> AI Doubt Solver <span className="ml-2 rounded bg-brand-cyan/20 px-1.5 py-0.5 text-[10px] text-brand-cyan uppercase">Live</span>
            </span>
            <span className="flex items-center text-sm font-bold text-slate-300">
              <span className="mr-2 text-brand-amber">⚡</span> Real-time Answers <span className="ml-2 rounded bg-brand-amber/20 px-1.5 py-0.5 text-[10px] text-brand-amber uppercase">New</span>
            </span>
            <span className="flex items-center text-sm font-bold text-slate-300">
              <span className="mr-2 text-brand-teal">🏆</span> Reputation Leaderboard <span className="ml-2 rounded bg-brand-teal/20 px-1.5 py-0.5 text-[10px] text-brand-teal uppercase">Hot</span>
            </span>
            <span className="flex items-center text-sm font-bold text-slate-300">
              <span className="mr-2 text-brand-indigo">📚</span> AI Practice Tests <span className="ml-2 rounded bg-brand-indigo/20 px-1.5 py-0.5 text-[10px] text-brand-indigo uppercase">Beta</span>
            </span>
            <span className="flex items-center text-sm font-bold text-slate-300">
              <span className="mr-2 text-brand-coral">🎓</span> Book Expert Mentors <span className="ml-2 rounded bg-brand-coral/20 px-1.5 py-0.5 text-[10px] text-brand-coral uppercase">Live</span>
            </span>
          </div>
        </div>
      </section>

      {/* NEON GLOWING FEATURES GRID */}
      <section id="features" className="max-w-6xl mx-auto px-4 scroll-mt-24 space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center font-mono text-xs text-brand-cyan uppercase font-bold tracking-widest">
            Platform Pillars
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white">
            Everything you need to<br/>
            <span className="italic font-light text-brand-teal">level up academically</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">Built for students who demand more than passive learning.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="glass-bright p-6 card-glow-indigo transition-transform hover:-translate-y-1">
            <div className="h-12 w-12 rounded-xl bg-brand-indigo/10 flex items-center justify-center text-brand-indigo mb-6 border border-brand-indigo/30">
              <Brain className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">AI Doubt Solver</h3>
            <p className="text-sm text-slate-400">Get instant, Gemini-powered hints to unblock your study sessions in seconds.</p>
          </div>

          <div className="glass-bright p-6 card-glow-emerald transition-transform hover:-translate-y-1">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6 border border-emerald-500/30">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Reputation Economy</h3>
            <p className="text-sm text-slate-400">Earn points for helping others and unlock exclusive mentor privileges.</p>
          </div>

          <div className="glass-bright p-6 card-glow-amber transition-transform hover:-translate-y-1">
            <div className="h-12 w-12 rounded-xl bg-brand-amber/10 flex items-center justify-center text-brand-amber mb-6 border border-brand-amber/30">
              <MonitorPlay className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">AI Practice Engine</h3>
            <p className="text-sm text-slate-400">Generate custom tests on any subject to master concepts through active recall.</p>
          </div>

          <div className="glass-bright p-6 card-glow-rose transition-transform hover:-translate-y-1">
            <div className="h-12 w-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 mb-6 border border-rose-500/30">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Supabase Realtime</h3>
            <p className="text-sm text-slate-400">Get instant notifications when mentors answer or community doubts are resolved.</p>
          </div>

          <div className="glass-bright p-6 card-glow-indigo transition-transform hover:-translate-y-1">
            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 border border-indigo-500/30">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Expert Mentors</h3>
            <p className="text-sm text-slate-400">Book verified mentors and graduate from sandbox models to real-world knowledge.</p>
          </div>

          <div className="glass-bright p-6 card-glow-pink transition-transform hover:-translate-y-1">
            <div className="h-12 w-12 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 mb-6 border border-pink-500/30">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Secure by Design</h3>
            <p className="text-sm text-slate-400">Every row is protected by Supabase RLS. Your academic data is private and secure.</p>
          </div>

        </div>
      </section>

      {/* FLASHCARDS INTERACTIVE SECTION */}
      <section className="max-w-5xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center font-mono text-xs text-brand-amber uppercase font-bold tracking-widest">
            Practice Mode
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white">
            Flashcards that <span className="text-brand-amber drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]">glow</span><br/>
            with every answer
          </h2>
          <p className="text-slate-400">Hover to flip. Study smarter with AI-generated question decks.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-64">
          
          <div className="flashcard w-full h-full cursor-pointer">
            <div className="flashcard-inner">
              <div className="flashcard-front bg-bright-card border border-brand-indigo/40 card-glow-indigo flex flex-col items-center justify-center p-6 text-center">
                <span className="text-xs font-mono font-bold text-brand-indigo bg-brand-indigo/10 px-3 py-1 rounded-full mb-4">💜 Data Structures</span>
                <p className="text-white font-bold text-lg">What is the time complexity of binary search on a sorted array?</p>
              </div>
              <div className="flashcard-back bg-brand-indigo text-black flex items-center justify-center p-6 text-center shadow-[0_0_40px_rgba(99,102,241,0.6)]">
                <p className="font-bold text-lg">O(log n) — each step halves the search space, making it extremely efficient for large datasets.</p>
              </div>
            </div>
          </div>

          <div className="flashcard w-full h-full cursor-pointer">
            <div className="flashcard-inner">
              <div className="flashcard-front bg-bright-card border border-emerald-400/40 card-glow-emerald flex flex-col items-center justify-center p-6 text-center">
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full mb-4">🟢 Operating Systems</span>
                <p className="text-white font-bold text-lg">Explain the difference between a process and a thread.</p>
              </div>
              <div className="flashcard-back bg-emerald-400 text-black flex items-center justify-center p-6 text-center shadow-[0_0_40px_rgba(16,185,129,0.6)]">
                <p className="font-bold text-lg">A process is an independent program in execution with its own memory space. A thread is a lightweight unit sharing memory.</p>
              </div>
            </div>
          </div>

          <div className="flashcard w-full h-full cursor-pointer">
            <div className="flashcard-inner">
              <div className="flashcard-front bg-bright-card border border-brand-amber/40 card-glow-amber flex flex-col items-center justify-center p-6 text-center">
                <span className="text-xs font-mono font-bold text-brand-amber bg-brand-amber/10 px-3 py-1 rounded-full mb-4">🟡 Machine Learning</span>
                <p className="text-white font-bold text-lg">What does the learning rate control in gradient descent?</p>
              </div>
              <div className="flashcard-back bg-brand-amber text-black flex items-center justify-center p-6 text-center shadow-[0_0_40px_rgba(245,158,11,0.6)]">
                <p className="font-bold text-lg">The step size for parameter updates. Too high → divergence; too low → slow convergence.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative max-w-4xl mx-auto px-4 text-center space-y-8 pb-12">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-brand-indigo/10 via-brand-cyan/10 to-brand-amber/10 blur-[100px] rounded-full pointer-events-none"></div>
        <h2 className="text-4xl sm:text-6xl font-black text-white relative z-10">
          Ready to bridge<br/>your skill gap?
        </h2>
        <p className="text-lg text-slate-300 relative z-10">
          Join 4,800+ students already growing on STUDYARC. Free forever for learners.
        </p>
        <button
          onClick={() => setActivePage('/login')}
          className="relative z-10 inline-flex items-center space-x-2 rounded-xl bg-bright-gradient border border-brand-cyan px-10 py-4 text-lg font-extrabold text-white shadow-2xl shadow-brand-cyan/40 transition hover:scale-105 glow-bright-cyan"
        >
          <span>Start Learning Free →</span>
        </button>
      </section>

    </div>
  );
}
