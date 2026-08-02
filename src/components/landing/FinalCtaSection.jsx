import React from 'react';

export default function FinalCtaSection({ openDiagnostic }) {
  return (
    <section className="py-24 bg-classic-primary w-full">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
          Ready to bridge your skill gap?
        </h2>
        
        <p className="text-xl text-blue-100 mb-10 leading-relaxed max-w-2xl mx-auto">
          Join thousands of students who are turning their goals into real opportunities.
        </p>
        
        <button 
          onClick={openDiagnostic}
          className="bg-white hover:bg-gray-50 text-classic-primary px-10 py-4 rounded-xl font-bold text-lg shadow-classic-btn transition-transform active:scale-95"
        >
          Start Free Now
        </button>
        
      </div>
    </section>
  );
}
