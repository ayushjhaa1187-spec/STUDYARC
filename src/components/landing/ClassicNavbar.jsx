import React from 'react';
import { useLenis } from 'lenis/react';

export default function ClassicNavbar({ openDiagnostic, setActivePage }) {
  const lenis = useLenis();

  const handleScrollTo = (e, target) => {
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo(target, { immediate: false, duration: 1.2 });
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 border-b border-classic-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <div className="flex-shrink-0 flex items-center cursor-pointer space-x-3" onClick={() => { setActivePage('/'); lenis?.scrollTo(0); }}>
            <div className="h-10 w-10 overflow-hidden rounded-lg bg-brand-emerald flex items-center justify-center p-0.5 shadow-sm">
              <img src="/logo.png" alt="STUDYARC Logo" className="h-full w-full object-cover rounded-lg" />
            </div>
            <span className="text-2xl font-bold text-classic-primary uppercase">STUDYARC</span>
          </div>
          
          <div className="hidden md:flex space-x-8">
            <a href="#how-it-works" onClick={(e) => handleScrollTo(e, '#how-it-works')} className="text-classic-textSecondary hover:text-classic-primary font-medium transition-colors">How It Works</a>
            <a href="#features" onClick={(e) => handleScrollTo(e, '#features')} className="text-classic-textSecondary hover:text-classic-primary font-medium transition-colors">Features</a>
            <a href="#testimonials" onClick={(e) => handleScrollTo(e, '#testimonials')} className="text-classic-textSecondary hover:text-classic-primary font-medium transition-colors">Testimonials</a>
            <a href="#pricing" onClick={(e) => handleScrollTo(e, '#pricing')} className="text-classic-textSecondary hover:text-classic-primary font-medium transition-colors">Pricing</a>
          </div>
          
          <div className="flex items-center space-x-4">
            <button onClick={() => setActivePage('/login')} className="hidden md:block text-classic-primary font-medium hover:text-classic-primaryLight transition-colors">Log In</button>
            <button 
              onClick={openDiagnostic}
              className="bg-classic-primary hover:bg-classic-primaryLight text-white px-6 py-2.5 rounded-lg font-medium shadow-classic-btn transition-all active:scale-95"
            >
              Start Free Diagnostic
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
