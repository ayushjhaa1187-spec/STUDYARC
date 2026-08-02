import React from 'react';
import { Sparkles, Globe, MessageSquare, Mail, Heart } from 'lucide-react';

export default function Footer({ setActivePage }) {
  const handleNav = (e, path) => {
    e.preventDefault();
    if (setActivePage && path) {
      setActivePage(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleExternal = (e) => {
    e.preventDefault();
    alert('This external link will open in a new tab in the full version.');
  };

  return (
    <footer className="w-full border-t border-bright-border bg-bright-bg mt-auto z-10 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div 
              onClick={(e) => handleNav(e, '/')}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden bg-bright-gradient border border-brand-teal group-hover:shadow-[0_0_15px_rgba(53,199,184,0.4)] transition duration-300">
                <img src="/logo.png" alt="STUDYARC Logo" className="h-full w-full object-cover rounded-lg" />
              </div>
              <div>
                <div className="text-xl font-heading font-bold tracking-tight text-white uppercase group-hover:text-brand-teal transition">STUDYARC</div>
              </div>
            </div>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              The AI-first career execution platform. Turn doubts into code, and learning into cryptographic proof.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <button onClick={handleExternal} className="text-slate-400 hover:text-brand-teal transition"><MessageSquare className="h-5 w-5" /></button>
              <button onClick={handleExternal} className="text-slate-400 hover:text-brand-teal transition"><Globe className="h-5 w-5" /></button>
              <button onClick={handleExternal} className="text-slate-400 hover:text-brand-cyan transition"><Mail className="h-5 w-5" /></button>
            </div>
          </div>

          {/* Links Col 1 */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4 font-mono uppercase tracking-wider">Ecosystem</h3>
            <ul className="space-y-3">
              <li><button onClick={(e) => handleNav(e, '/journeys')} className="text-xs text-slate-400 hover:text-brand-cyan transition">Career Journeys</button></li>
              <li><button onClick={(e) => handleNav(e, '/community')} className="text-xs text-slate-400 hover:text-brand-cyan transition">AI Doubt Solver</button></li>
              <li><button onClick={(e) => handleNav(e, '/mentors')} className="text-xs text-slate-400 hover:text-brand-cyan transition">Expert Mentors</button></li>
              <li><button onClick={(e) => handleNav(e, '/community')} className="text-xs text-slate-400 hover:text-brand-cyan transition">Reputation Leaderboard</button></li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4 font-mono uppercase tracking-wider">Resources</h3>
            <ul className="space-y-3">
              <li><button onClick={handleExternal} className="text-xs text-slate-400 hover:text-brand-amber transition">Documentation</button></li>
              <li><button onClick={handleExternal} className="text-xs text-slate-400 hover:text-brand-amber transition">Gemini Setup Guide</button></li>
              <li><button onClick={handleExternal} className="text-xs text-slate-400 hover:text-brand-amber transition">Open Source</button></li>
              <li><button onClick={(e) => handleNav(e, '/pricing')} className="text-xs text-slate-400 hover:text-brand-amber transition">Pricing</button></li>
            </ul>
          </div>

          {/* Links Col 3 */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4 font-mono uppercase tracking-wider">Legal</h3>
            <ul className="space-y-3">
              <li><button onClick={(e) => handleNav(e, '/privacy')} className="text-xs text-slate-400 hover:text-brand-pink transition">Privacy Policy</button></li>
              <li><button onClick={(e) => handleNav(e, '/terms')} className="text-xs text-slate-400 hover:text-brand-pink transition">Terms of Service</button></li>
              <li><button onClick={(e) => handleNav(e, '/privacy')} className="text-xs text-slate-400 hover:text-brand-pink transition">Cookie Policy</button></li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-bright-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 font-mono">
            &copy; {new Date().getFullYear()} STUDYARC Inc. All rights reserved.
          </p>
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-mono">
            <span>Built with</span>
            <Heart className="h-3.5 w-3.5 text-brand-coral animate-pulse" />
            <span>and Gemini AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
