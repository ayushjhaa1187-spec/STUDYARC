import React from 'react';
import { useLenis } from 'lenis/react';
import { Target, Users, Award } from 'lucide-react';

export default function HeroSection({ openDiagnostic }) {
  const lenis = useLenis();

  return (
    <section className="relative w-full pt-24 pb-32 overflow-hidden bg-classic-bg">
      {/* Subtle Geometric Overlay using pure CSS pseudo-elements is done via background classes or explicit elements */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#E2E8F0 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.4 }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-classic-primary leading-[1.1] mb-6 tracking-tight">
            Bridge the Gap.<br className="hidden md:block"/> Learn. Earn. Grow.
          </h1>
          <p className="text-lg md:text-xl text-classic-textSecondary mb-10 max-w-2xl mx-auto leading-relaxed">
            AI-powered career execution that turns your goals into a verified portfolio and real opportunities.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button 
              onClick={openDiagnostic}
              className="w-full sm:w-auto bg-classic-accent hover:bg-blue-600 text-white px-8 py-3.5 rounded-lg font-medium text-lg shadow-classic-btn transition-all active:scale-95"
            >
              Start Your Free Career Readiness Scan
            </button>
            <button 
              onClick={(e) => { e.preventDefault(); lenis?.scrollTo('#how-it-works', { duration: 1.2 }); }}
              className="w-full sm:w-auto bg-white hover:bg-gray-50 text-classic-primary border border-classic-border px-8 py-3.5 rounded-lg font-medium text-lg shadow-sm transition-all active:scale-95"
            >
              Explore How It Works
            </button>
          </div>
          
          {/* Statistics Bar */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 pt-8 border-t border-classic-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-classic-success/10 flex items-center justify-center text-classic-success">
                <Target size={20} />
              </div>
              <div className="text-left">
                <p className="text-xl font-bold text-classic-textPrimary">4,800+</p>
                <p className="text-sm text-classic-textSecondary font-medium">Doubts Solved</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-classic-primaryLight/10 flex items-center justify-center text-classic-primaryLight">
                <Users size={20} />
              </div>
              <div className="text-left">
                <p className="text-xl font-bold text-classic-textPrimary">320+</p>
                <p className="text-sm text-classic-textSecondary font-medium">Expert Mentors</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-classic-warning/10 flex items-center justify-center text-classic-warning">
                <Award size={20} />
              </div>
              <div className="text-left">
                <p className="text-xl font-bold text-classic-textPrimary">12k+</p>
                <p className="text-sm text-classic-textSecondary font-medium">Reputation Points</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
