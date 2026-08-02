import React from 'react';
import { Sparkles, Zap, Flame, Wifi, WifiOff, LogIn, User } from 'lucide-react';

export default function Navbar({ 
  activePage, 
  setActivePage, 
  openDiagnostic, 
  user,
  simulatedSlow,
  setSimulatedSlow
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-bright-border glass-bright shadow-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActivePage('/')} 
          className="flex cursor-pointer items-center space-x-3 transition hover:opacity-90"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden bg-bright-gradient border border-brand-teal glow-bright-cyan p-0.5">
            <img src="/logo.png" alt="STUDYARC Logo" className="h-full w-full object-cover rounded-lg" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xl font-heading font-bold tracking-tight text-white uppercase">STUDYARC</span>
            </div>
            <p className="text-[10px] tracking-wider text-brand-teal font-mono uppercase font-bold opacity-80">AI Career Execution Platform</p>
          </div>
        </div>



        {/* Right Section */}
        <div className="flex items-center space-x-2.5">
          


          {/* Agent Online Badge */}
          <div className="hidden sm:flex items-center space-x-2 rounded-full bg-bright-card px-3 py-1 border border-brand-cyan/30">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-cyan"></span>
            </span>
            <span className="text-[10px] font-bold text-brand-cyan font-mono uppercase tracking-widest">Agent Online</span>
          </div>

          {/* Streak Badge */}
          <div className="flex items-center space-x-1 text-brand-amber bg-brand-amber/10 px-2.5 py-1 rounded-full border border-brand-amber/30 text-xs font-bold">
            <Flame className="h-4 w-4 fill-brand-amber" />
            <span>{user.streak}d</span>
          </div>

          {/* AI Diagnostic CTA Button */}
          <button
            onClick={openDiagnostic}
            className="flex items-center space-x-2 rounded-xl bg-bright-gradient border border-brand-teal px-3.5 py-1.5 text-xs sm:text-sm font-bold text-white glow-bright-cyan transition hover:bg-bright-surface hover:text-white"
          >
            <Sparkles className="h-4 w-4 text-brand-amber" />
            <span className="hidden sm:inline">AI Diagnostic</span>
          </button>

          {/* Login / Auth Button */}
          <button
            onClick={() => setActivePage('/login')}
            className={`flex items-center space-x-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition border ${
              activePage === '/login'
                ? 'bg-brand-indigo/20 text-brand-indigo border-brand-indigo'
                : 'bg-bright-card text-slate-300 border-bright-border hover:bg-bright-cardLight hover:text-white'
            }`}
          >
            <LogIn className="h-3.5 w-3.5 text-brand-indigo" />
            <span className="hidden sm:inline">Sign In</span>
          </button>

          {/* Profile Avatar */}
          <button 
            onClick={() => setActivePage('/settings')}
            className="flex items-center space-x-2 rounded-full p-0.5 ring-2 ring-brand-teal/60 hover:ring-brand-cyan transition"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="h-8 w-8 rounded-full object-cover"
            />
          </button>
        </div>

      </div>
    </header>
  );
}
