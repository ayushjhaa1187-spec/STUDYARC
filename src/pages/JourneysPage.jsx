import React, { useState } from 'react';
import { JOURNEYS } from '../data/mockData';
import { Target, Clock, Star, Users, ArrowRight, BookOpen, CheckCircle2, ChevronRight, X } from 'lucide-react';

const JourneysPage = ({ setActivePage }) => {
  const [activeTab, setActiveTab] = useState('AI Engineer');
  const [selectedJourney, setSelectedJourney] = useState(null);

  const tabs = ['AI Engineer', 'Full-Stack Dev', 'Data Analyst', 'Product Manager', 'DevOps Engineer'];
  
  // Group journeys for demo purposes based on active tab
  // In reality, JOURNEYS might have category fields. We'll just filter mock data or show all.
  const displayJourneys = JOURNEYS.filter(j => 
    activeTab === 'AI Engineer' ? j.id.includes('ai') :
    activeTab === 'Full-Stack Dev' ? j.id.includes('full') : true
  );
  
  // If no match, just show first 2
  const journeysToShow = displayJourneys.length > 0 ? displayJourneys : JOURNEYS.slice(0, 2);

  return (
    <div className="min-h-screen bg-[#0C0F14] text-gray-200 pb-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-white font-display mb-4">Career Journeys</h1>
          <p className="text-lg text-gray-400 max-w-2xl">Structured paths to mastery. These journeys power your entire learning path, combining courses, projects, and expert mentorship.</p>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto pb-4 mb-8 scrollbar-none border-b border-[#262e3c]">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === tab ? 'border-brand-teal text-brand-teal' : 'border-transparent text-gray-400 hover:text-gray-200'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Journey Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {journeysToShow.map(journey => (
            <div key={journey.id} className="journey-card rounded-xl overflow-hidden glass-bright border border-[#262e3c] flex flex-col transition-all hover:border-gray-500 hover:shadow-lg hover:shadow-brand-teal/5">
              <div className={`h-2 w-full ${journey.id.includes('ai') ? 'bg-brand-violet' : 'bg-brand-cyan'}`}></div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-brand-teal/10 text-brand-teal text-xs font-semibold rounded-full border border-brand-teal/20">
                    Most Popular
                  </span>
                  <div className="flex items-center gap-1 text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded">
                    <Star size={12} className="text-brand-amber" fill="#F2A93B" />
                    <span className="font-medium text-gray-200">4.8</span>
                    <span>(1.2k)</span>
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-2">{journey.title}</h2>
                <p className="text-gray-400 text-sm mb-6">{journey.description}</p>
                
                <div className="flex flex-wrap gap-3 mb-6">
                  <div className="flex items-center gap-1.5 text-xs text-gray-300 bg-gray-800 px-2.5 py-1.5 rounded border border-gray-700">
                    <Target size={14} className="text-brand-teal" /> {journey.difficulty || 'Advanced'}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-300 bg-gray-800 px-2.5 py-1.5 rounded border border-gray-700">
                    <Clock size={14} className="text-brand-amber" /> {journey.duration || '6 months'}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-300 bg-gray-800 px-2.5 py-1.5 rounded border border-gray-700">
                    <Users size={14} className="text-brand-violet" /> 5k+ Enrolled
                  </div>
                </div>

                <div className="bg-[#161b22] border border-[#262e3c] rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-brand-teal" /> Outcome
                  </h4>
                  <p className="text-sm text-gray-400">Master production-ready LLM deployment, fine-tuning, and RAG architectures. Build a portfolio of 4 enterprise-grade applications.</p>
                </div>

                {/* Phase Timeline */}
                <div className="relative mb-8 pt-4 pb-2">
                  <div className="absolute top-6 left-4 right-4 h-0.5 bg-gray-700"></div>
                  <div className="flex justify-between relative z-10">
                    {['Discover', 'Learn', 'Build', 'Review', 'Publish'].map((phase, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-gray-800 border-2 border-brand-teal flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-[#0C0F14]">
                          {idx + 1}
                        </div>
                        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{phase}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-auto flex gap-3 pt-4 border-t border-[#262e3c]">
                  <button 
                    onClick={() => setSelectedJourney(journey)}
                    className="flex-1 py-2.5 rounded font-medium border border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-sm text-center"
                  >
                    View Full Path
                  </button>
                  <button 
                    onClick={() => setActivePage('/catalog')}
                    className="flex-1 py-2.5 rounded font-medium bg-brand-teal text-[#0C0F14] hover:bg-teal-400 transition-colors text-sm text-center"
                  >
                    Start Journey
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Journey Detail Drawer */}
      {selectedJourney && (
        <>
          <div className="drawer-overlay fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity" onClick={() => setSelectedJourney(null)}></div>
          <div className="drawer-panel fixed top-0 right-0 h-full w-full md:w-[600px] bg-[#0f131a] border-l border-[#262e3c] z-50 overflow-y-auto shadow-2xl animate-slide-up sm:animate-none transform transition-transform translate-x-0">
            <div className="p-6 sticky top-0 bg-[#0f131a]/95 backdrop-blur z-10 border-b border-[#262e3c] flex justify-between items-center">
              <h2 className="text-xl font-bold text-white truncate pr-4">{selectedJourney.title}</h2>
              <button onClick={() => setSelectedJourney(null)} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-3">Journey Overview</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{selectedJourney.description} This path is designed to take you from foundational concepts to advanced production deployments. You will engage with expert mentors throughout the process.</p>
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Required Courses</h3>
                <div className="space-y-4">
                  {selectedJourney.courses?.map((courseId, idx) => (
                    <div key={courseId} className="bg-[#161b22] border border-[#262e3c] p-4 rounded-lg flex items-center gap-4 hover:border-brand-teal/50 cursor-pointer transition-colors" onClick={() => setActivePage('/course', { courseId })}>
                      <div className="w-12 h-12 bg-gray-800 rounded flex items-center justify-center text-brand-teal font-bold text-lg">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-white text-sm">Core Module {idx + 1}</h4>
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                          <BookOpen size={12} /> View Course Details
                        </p>
                      </div>
                      <ChevronRight size={18} className="text-gray-500" />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-8 bg-brand-violet/5 border border-brand-violet/20 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-brand-violet mb-2 flex items-center gap-2">
                  <Target size={18} /> Capstone Project
                </h3>
                <p className="text-sm text-gray-300 mb-4">Build and deploy a full-scale multi-agent system. Your project will be reviewed by an industry expert before you receive your certification.</p>
                <button 
                  onClick={() => setActivePage('/catalog')}
                  className="w-full py-3 bg-brand-teal text-[#0C0F14] font-semibold rounded hover:bg-teal-400 transition-colors"
                >
                  Start Journey Now
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default JourneysPage;
