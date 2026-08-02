import React, { useState } from 'react';
import { Compass, Clock, Award, Users, Star, ArrowRight, X, CheckCircle2, ChevronRight, Zap, Target } from 'lucide-react';
import { JOURNEYS } from '../data/mockData';

export default function JourneysPage({ setActivePage }) {
  const [selectedJourney, setSelectedJourney] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'AI & ML', 'Web Dev', 'Data Science'];

  const filteredJourneys = activeCategory === 'All'
    ? JOURNEYS
    : JOURNEYS.filter(j => j.category === activeCategory);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-brand-teal uppercase font-bold tracking-widest">
          <Compass className="h-4 w-4" />
          <span>Structured Career Sprints</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white mt-2">Career Journeys</h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed mt-2">
          Choose a journey to reach a specific career outcome. Every journey includes hands-on sprints, Gemini AI coaching, and verified mentor code reviews.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex space-x-3 border-b border-bright-border pb-4 overflow-x-auto scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap rounded-xl px-5 py-2.5 text-xs font-bold transition-all duration-300 ${
              activeCategory === cat
                ? 'bg-bright-gradient border border-brand-teal text-white shadow-lg shadow-brand-teal/20 glow-bright-cyan'
                : 'bg-bright-bg text-slate-400 hover:bg-bright-cardLight hover:text-white border border-bright-border'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Journeys Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {filteredJourneys.map((journey, idx) => {
          const glowClasses = ['hover:card-glow-teal', 'hover:card-glow-indigo', 'hover:card-glow-amber', 'hover:card-glow-cyan', 'hover:card-glow-rose'];
          const glowClass = glowClasses[idx % glowClasses.length];

          return (
            <div
              key={journey.id}
              className={`group flex flex-col justify-between glass-bright p-6 transition-all duration-300 ${glowClass} relative overflow-hidden`}
            >
              <div className="space-y-4 relative z-10">
                
                <div className="flex items-center justify-between">
                  <span className="rounded-lg bg-brand-teal/10 px-3 py-1.5 text-[10px] font-mono font-bold text-brand-teal border border-brand-teal/30">
                    {journey.category}
                  </span>
                  <span className="flex items-center text-xs font-mono font-black text-brand-amber bg-brand-amber/10 px-2 py-1 rounded-md border border-brand-amber/20">
                    <Star className="h-3 w-3 fill-brand-amber mr-1" /> {journey.rating}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-black text-white group-hover:text-brand-teal transition-colors leading-tight">
                    {journey.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-300 leading-relaxed font-medium line-clamp-2">
                    {journey.tagline}
                  </p>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-2 gap-3 text-[11px] font-mono font-bold pt-4 border-t border-bright-border">
                  <div className="flex items-center space-x-2 text-slate-400 bg-bright-bg p-2 rounded-lg border border-bright-border">
                    <Clock className="h-3.5 w-3.5 text-brand-cyan" />
                    <span>{journey.duration}</span>
                  </div>
                  <div className="flex items-center justify-end space-x-2 text-slate-400 bg-bright-bg p-2 rounded-lg border border-bright-border">
                    <Target className="h-3.5 w-3.5 text-brand-rose" />
                    <span>{journey.difficulty}</span>
                  </div>
                  <div className="col-span-2 flex items-center space-x-2 text-slate-300 bg-brand-amber/5 p-2 rounded-lg border border-brand-amber/20">
                    <Zap className="h-3.5 w-3.5 text-brand-amber" />
                    <span>{journey.timeCommitment}</span>
                  </div>
                </div>

                {/* Outcome Highlight */}
                <div className="rounded-xl border border-brand-teal/30 bg-brand-teal/10 p-4 shadow-[0_0_15px_rgba(6,214,160,0.05)]">
                  <span className="text-[10px] font-mono font-bold text-brand-teal uppercase tracking-widest flex items-center mb-1">
                    <Award className="h-3 w-3 mr-1" /> Target Outcome
                  </span>
                  <p className="text-sm font-bold text-white leading-snug">{journey.outcome}</p>
                </div>

              </div>

              <div className="mt-6 flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-bright-border relative z-10">
                <button
                  onClick={() => setSelectedJourney(journey)}
                  className="w-full sm:w-1/2 rounded-xl border border-bright-border bg-bright-bg py-3 text-xs font-bold text-slate-300 hover:border-brand-teal/40 hover:text-white transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={() => setActivePage('/challenges')}
                  className="w-full sm:w-1/2 flex items-center justify-center space-x-1.5 rounded-xl bg-bright-gradient border border-brand-cyan py-3 text-xs font-extrabold text-white shadow-lg shadow-brand-cyan/20 glow-bright-cyan hover:scale-105 transition-transform"
                >
                  <span>Start Journey</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Journey Detail View Drawer/Modal */}
      {selectedJourney && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl glass-bright card-glow-teal p-8 shadow-2xl space-y-8 scrollbar-thin">
            
            <button
              onClick={() => setSelectedJourney(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            <div>
              <span className="rounded-lg bg-brand-teal/10 px-3 py-1.5 text-[10px] font-mono font-bold text-brand-teal border border-brand-teal/30 uppercase tracking-widest">
                {selectedJourney.category}
              </span>
              <h2 className="text-3xl font-black text-white mt-4">{selectedJourney.title}</h2>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">{selectedJourney.tagline}</p>
            </div>

            {/* Phase Timeline: Discover -> Learn -> Build -> Review -> Publish */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center">
                <Compass className="h-4 w-4 mr-2 text-brand-cyan" /> Execution Phases Timeline
              </h4>
              <div className="space-y-3">
                {selectedJourney.phases.map((phase, idx) => (
                  <div
                    key={phase.step}
                    className="group flex items-start space-x-4 rounded-xl border border-bright-border bg-bright-bg p-4 hover:border-brand-cyan/40 transition-colors"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-cyan/10 text-brand-cyan font-mono font-black text-sm border border-brand-cyan/30 group-hover:bg-brand-cyan group-hover:text-white transition-colors">
                      0{phase.step}
                    </div>
                    <div>
                      <h5 className="text-base font-bold text-white group-hover:text-brand-cyan transition-colors">{phase.name} Phase</h5>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{phase.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Challenges Included */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center">
                <Target className="h-4 w-4 mr-2 text-brand-amber" /> Project Challenges Included
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedJourney.challenges.map((c, i) => (
                  <li key={i} className="flex items-center space-x-3 text-xs text-slate-300 rounded-xl bg-bright-bg p-3.5 border border-bright-border hover:border-brand-amber/30 transition-colors">
                    <CheckCircle2 className="h-4 w-4 text-brand-amber shrink-0" />
                    <span className="font-medium leading-snug">{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-bright-border">
              <div className="flex items-center space-x-2 text-xs font-mono font-bold text-slate-400 bg-bright-bg p-3 rounded-xl border border-bright-border">
                <Clock className="h-4 w-4 text-brand-teal" />
                <span>Duration: {selectedJourney.duration}</span>
              </div>
              <button
                onClick={() => {
                  setSelectedJourney(null);
                  setActivePage('/challenges');
                }}
                className="flex w-full sm:w-auto items-center justify-center space-x-2 rounded-xl bg-bright-gradient border border-brand-cyan px-8 py-4 text-sm font-extrabold text-white shadow-lg shadow-brand-cyan/20 glow-bright-cyan hover:scale-105 transition-transform"
              >
                <span>Enroll & Start Journey Now</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
