import React from 'react';
import { ExternalLink, Code, Shield, CheckCircle2, ChevronRight, BookOpen, Map } from 'lucide-react';
import { PORTFOLIO_PROJECTS, COURSES, JOURNEYS } from '../data/mockData';

const PortfolioPage = ({ user, setActivePage }) => {
  const featured = PORTFOLIO_PROJECTS[0];
  const others = PORTFOLIO_PROJECTS.slice(1);

  return (
    <div className="min-h-screen bg-[#0C0F14] text-gray-200 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Profile Header */}
        <div className="glass-bright rounded-2xl p-8 border border-[#262e3c] mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-teal/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
            <img 
              src="https://i.pravatar.cc/150?u=alex" 
              alt="Alex Rivera" 
              className="w-24 h-24 rounded-full ring-2 ring-brand-teal object-cover"
            />
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-1">Alex Rivera</h1>
              <p className="text-brand-teal text-sm font-medium mb-3">AI & Full-Stack Engineer</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-400 mb-4">
                <span className="flex items-center gap-1.5"><Code size={16}/> 4 Projects</span>
                <span className="flex items-center gap-1.5"><Shield size={16} className="text-emerald-500"/> 3 Verified</span>
                <span className="flex items-center gap-1.5">128 Hours</span>
              </div>
              
              <div className="inline-block bg-gray-800/80 px-3 py-1.5 rounded text-xs text-gray-300 border border-gray-700">
                Targeting: Staff AI Engineer
              </div>
            </div>
            
            <div className="flex flex-col items-center md:items-end gap-3">
              <button className="px-4 py-2 border border-gray-600 rounded-lg text-sm font-medium text-white hover:bg-gray-800 transition-colors">
                Edit Portfolio
              </button>
              <div className="flex gap-3 text-gray-400">
                <a href="#" className="hover:text-white transition-colors" aria-label="GitHub"><ExternalLink size={20} /></a>
                <a href="#" className="hover:text-white transition-colors"><ExternalLink size={20} /></a>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Project */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4">Featured Work</h2>
          <div className="glass-bright rounded-2xl p-6 md:p-8 border border-[#262e3c] card-glow-cyan">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs font-bold tracking-wider text-brand-cyan uppercase mb-2 block">Featured Project</span>
                <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                  {featured.title}
                  <span className="bg-emerald-500/10 text-emerald-500 text-[10px] px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1 uppercase tracking-wider font-bold">
                    <Shield size={10} /> Verified
                  </span>
                </h3>
              </div>
            </div>
            
            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6 max-w-3xl">
              {featured.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {featured.techStack.map(tech => (
                <span key={tech} className="bg-[#161b22] border border-gray-700 px-3 py-1 rounded-full text-xs text-gray-300">
                  {tech}
                </span>
              ))}
            </div>
            
            {/* Review Quote */}
            <blockquote className="border-l-2 border-brand-amber pl-4 mb-8 bg-gray-800/30 p-4 rounded-r-lg">
              <p className="text-sm italic text-gray-300 mb-2">"Excellent implementation of vector search. The architecture choices here show a deep understanding of scaling AI features in production."</p>
              <footer className="text-xs text-brand-amber font-medium">— Sarah Jenkins, Staff Engineer @ Anthropic (Expert Reviewer)</footer>
            </blockquote>
            
            {/* Verification Timeline */}
            <div className="mb-8 overflow-x-auto pb-2">
              <div className="flex items-center min-w-[500px]">
                <div className="flex flex-col items-center flex-1">
                  <div className="w-6 h-6 rounded-full bg-brand-teal text-[#0C0F14] flex items-center justify-center mb-2 z-10"><CheckCircle2 size={14}/></div>
                  <span className="text-[10px] text-gray-400">Submitted</span>
                  <span className="text-[10px] text-gray-500">Oct 12</span>
                </div>
                <div className="h-[2px] bg-brand-teal flex-1 -mx-8 -mt-6"></div>
                <div className="flex flex-col items-center flex-1">
                  <div className="w-6 h-6 rounded-full bg-brand-teal text-[#0C0F14] flex items-center justify-center mb-2 z-10"><CheckCircle2 size={14}/></div>
                  <span className="text-[10px] text-gray-400">Code Review</span>
                  <span className="text-[10px] text-gray-500">Oct 14</span>
                </div>
                <div className="h-[2px] bg-brand-teal flex-1 -mx-8 -mt-6"></div>
                <div className="flex flex-col items-center flex-1">
                  <div className="w-6 h-6 rounded-full bg-brand-teal text-[#0C0F14] flex items-center justify-center mb-2 z-10"><Shield size={14}/></div>
                  <span className="text-[10px] text-brand-teal font-bold">Verified</span>
                  <span className="text-[10px] text-gray-500">Oct 15</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button className="px-5 py-2.5 bg-gray-100 text-gray-900 rounded font-medium text-sm flex items-center gap-2 hover:bg-white transition-colors">
               <Code size={16} /> View Source
              </button>
              <button className="px-5 py-2.5 border border-gray-600 text-gray-300 rounded font-medium text-sm flex items-center gap-2 hover:bg-gray-800 transition-colors">
                <ExternalLink size={16} /> Live Demo
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Projects List */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-white mb-4">Other Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {others.map(proj => (
                <div key={proj.id} className="bg-[#161b22] border border-[#262e3c] rounded-xl p-5 flex flex-col hover:border-gray-500 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-white text-lg">{proj.title}</h3>
                    {proj.status === 'verified' && <Shield size={16} className="text-emerald-500"/>}
                    {proj.status === 'in_review' && <span className="text-[10px] bg-brand-amber/10 text-brand-amber px-2 py-0.5 rounded border border-brand-amber/20 uppercase">In Review</span>}
                  </div>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2 flex-1">{proj.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {proj.techStack.slice(0,3).map(tech => (
                      <span key={tech} className="text-[10px] bg-gray-800 text-gray-300 px-2 py-1 rounded">{tech}</span>
                    ))}
                    {proj.techStack.length > 3 && <span className="text-[10px] text-gray-500">+{proj.techStack.length - 3}</span>}
                  </div>
                  <div className="flex gap-3 mt-auto pt-4 border-t border-gray-800">
                     <button className="text-xs text-gray-400 hover:text-white flex items-center gap-1"><Code size={14}/> Code</button>
                     <button className="text-xs text-gray-400 hover:text-white flex items-center gap-1"><ExternalLink size={14}/> Demo</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills & Activity Sidebar */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Technical Skills</h2>
              <div className="glass-bright rounded-xl p-5 border border-[#262e3c]">
                <div className="mb-4">
                  <h4 className="text-xs text-gray-400 uppercase mb-2">AI & Data</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="category-pill ai-ml">PyTorch</span>
                    <span className="category-pill ai-ml">LangChain</span>
                    <span className="category-pill data">Pandas</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs text-gray-400 uppercase mb-2">Web Full-Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="category-pill web-dev">React</span>
                    <span className="category-pill web-dev">Node.js</span>
                    <span className="category-pill devops">Docker</span>
                    <span className="category-pill devops">AWS</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">Learning Activity</h2>
              <div className="glass-bright rounded-xl p-5 border border-[#262e3c]">
                <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><Map size={16} className="text-brand-violet"/> Completed Paths</h4>
                <div className="bg-[#161b22] border border-gray-800 p-3 rounded mb-6 text-sm text-gray-300">
                  {JOURNEYS[0].title}
                </div>
                
                <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><BookOpen size={16} className="text-brand-teal"/> Completed Courses</h4>
                <div className="space-y-2">
                  {COURSES.slice(0,3).map(c => (
                    <div key={c.id} className="bg-[#161b22] border border-gray-800 p-2 rounded text-xs text-gray-300 truncate">
                      {c.title}
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;
