import React, { useState } from 'react';
import { 
  Briefcase, 
  ExternalLink, 
  Code2, 
  CheckCircle2, 
  ShieldCheck, 
  Share2, 
  FileText, 
  Copy, 
  Clock, 
  Sparkles,
  Award
} from 'lucide-react';
import { PORTFOLIO_PROJECTS } from '../data/mockData';

export default function PortfolioPage() {
  const [copied, setCopied] = useState(false);
  const [projects] = useState(PORTFOLIO_PROJECTS);

  const featured = projects.find(p => p.isFeatured) || projects[0];

  const handleCopyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* Header + Sharing Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-brand-teal uppercase font-bold tracking-widest">
            <ShieldCheck className="h-4 w-4" />
            <span>Cryptographic Proof Engine</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mt-2 tracking-tight">Your Verified Portfolio</h1>
          <p className="text-sm text-slate-300 mt-3 max-w-2xl leading-relaxed">
            Proof-based portfolio verified by Gemini automated audits and Senior Tech Lead code roasts. This is your undeniable proof of work.
          </p>
        </div>

        {/* Sharing Action Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleCopyLink}
            className="flex items-center space-x-2 rounded-xl border border-bright-border bg-bright-bg px-4 py-2.5 text-xs font-bold text-slate-300 hover:border-brand-teal/40 hover:text-white transition-colors"
          >
            <Copy className="h-4 w-4 text-brand-cyan" />
            <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
          </button>
          
          <button
            onClick={() => alert('Generating cryptographic PDF certificate...')}
            className="flex items-center space-x-2 rounded-xl border border-brand-amber/30 bg-brand-amber/10 px-4 py-2.5 text-xs font-bold text-brand-amber hover:bg-brand-amber/20 transition-colors shadow-[0_0_10px_rgba(245,158,11,0.1)]"
          >
            <FileText className="h-4 w-4" />
            <span>Export PDF</span>
          </button>

          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-2 rounded-xl bg-bright-gradient border border-brand-teal px-5 py-2.5 text-xs font-extrabold text-white hover:scale-105 shadow-lg shadow-brand-teal/20 glow-bright-cyan transition-transform"
          >
            <Share2 className="h-4 w-4" />
            <span>Share on LinkedIn</span>
          </a>
        </div>
      </div>

      {/* FEATURED PROJECT SECTION */}
      <div className="relative overflow-hidden rounded-3xl glass-bright card-glow-teal p-8 md:p-10 border-2 border-brand-teal/40 shadow-[0_0_30px_rgba(6,214,160,0.15)]">
        {/* Animated Glow Orb */}
        <div className="absolute -top-24 -right-24 h-64 w-64 bg-brand-teal/20 blur-[80px] rounded-full animate-pulse-slow"></div>

        <div className="relative z-10 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-teal/20 pb-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-lg bg-brand-teal px-4 py-1.5 text-xs font-mono font-black text-[#0B0E14] uppercase tracking-widest shadow-[0_0_15px_rgba(6,214,160,0.4)]">
                Featured Verified Proof
              </span>
              <span className="flex items-center space-x-1.5 text-xs text-brand-cyan font-mono font-bold bg-brand-cyan/10 px-3 py-1.5 rounded-lg border border-brand-cyan/30">
                <ShieldCheck className="h-4 w-4" />
                <span>{featured.verificationBadge}</span>
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <a
                href={featured.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1.5 text-xs font-bold text-slate-300 hover:text-white font-mono bg-bright-bg px-4 py-2 rounded-xl border border-bright-border transition-colors"
              >
                <Code2 className="h-4 w-4" />
                <span>GitHub</span>
              </a>
              <a
                href={featured.liveDemoUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1.5 text-xs font-bold text-brand-teal hover:bg-brand-teal/20 font-mono bg-brand-teal/10 px-4 py-2 rounded-xl border border-brand-teal/30 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Live Demo</span>
              </a>
            </div>
          </div>

          <div>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">{featured.title}</h2>
            <p className="mt-4 text-sm md:text-base text-slate-300 max-w-3xl leading-relaxed font-medium">
              {featured.description}
            </p>
          </div>

          {/* Tech Stack Pills */}
          <div className="flex flex-wrap gap-2.5">
            {featured.techStack.map((tech) => (
              <span key={tech} className="rounded-lg bg-bright-bg px-3.5 py-1.5 text-xs font-mono font-bold text-brand-teal border border-bright-border hover:border-brand-teal/40 transition-colors cursor-default">
                {tech}
              </span>
            ))}
          </div>

          {/* Mentor Review Summary */}
          <div className="rounded-2xl border border-brand-cyan/30 bg-brand-cyan/5 p-6 relative overflow-hidden group">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-cyan group-hover:shadow-[0_0_10px_rgba(6,214,160,0.8)] transition-shadow"></div>
            <div className="flex items-center space-x-2 text-xs text-brand-cyan font-mono font-black uppercase tracking-widest mb-3">
              <Award className="h-5 w-5" />
              <span>Expert Mentor Review Audit</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-medium italic">
              "{featured.mentorReviewSummary}"
            </p>
          </div>

          {/* Evidence Timeline for Featured Project */}
          <div className="space-y-4 pt-4 border-t border-brand-teal/20">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-2 text-brand-amber" /> Verification Evidence Audit Trail
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              {featured.timeline.map((step, idx) => (
                <div key={idx} className="rounded-xl border border-bright-border bg-bright-bg p-4 space-y-2 hover:border-brand-amber/40 transition-colors group">
                  <div className="flex items-center justify-between border-b border-bright-border pb-2">
                    <span className="font-mono text-[10px] text-brand-amber font-black bg-brand-amber/10 px-2 py-0.5 rounded">0{idx + 1}</span>
                    <CheckCircle2 className="h-4 w-4 text-brand-teal group-hover:shadow-[0_0_8px_rgba(53,199,184,0.5)] transition-shadow rounded-full" />
                  </div>
                  <p className="font-bold text-white text-xs leading-snug">{step.step}</p>
                  <span className="text-[10px] text-slate-500 font-mono block">{step.date}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ALL PROJECTS GRID */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center space-x-3 border-b border-bright-border pb-4">
          <h3 className="text-2xl font-black text-white">All Verified Portfolio Apps</h3>
          <span className="rounded-full bg-bright-bg px-3 py-1 text-xs font-mono font-bold text-slate-400 border border-bright-border">
            {projects.length - 1} Apps
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.slice(1).map((project, idx) => {
            const isVerified = project.status === 'Verified';
            const statusColor = isVerified ? 'text-brand-teal' : 'text-brand-amber';
            const statusBg = isVerified ? 'bg-brand-teal/10' : 'bg-brand-amber/10';
            const statusBorder = isVerified ? 'border-brand-teal/30' : 'border-brand-amber/30';
            const hoverGlow = isVerified ? 'hover:card-glow-cyan' : 'hover:card-glow-amber';

            return (
              <div
                key={project.id}
                className={`flex flex-col justify-between rounded-2xl glass-bright p-6 transition-all duration-300 ${hoverGlow} space-y-5`}
              >
                <div className="space-y-4">
                  
                  <div className="flex items-center justify-between">
                    <span className={`rounded-lg px-3 py-1.5 text-[10px] font-mono font-black uppercase tracking-widest border ${statusBg} ${statusColor} ${statusBorder}`}>
                      {project.status}
                    </span>
                    <div className="flex space-x-3 text-xs font-mono font-bold">
                      <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors bg-bright-bg px-2.5 py-1.5 rounded-lg border border-bright-border flex items-center">
                        <Code2 className="h-3.5 w-3.5 mr-1.5" />Code
                      </a>
                      <a href={project.liveDemoUrl} target="_blank" rel="noreferrer" className="text-brand-cyan hover:text-brand-teal transition-colors bg-brand-cyan/10 px-2.5 py-1.5 rounded-lg border border-brand-cyan/30 flex items-center">
                        <ExternalLink className="h-3.5 w-3.5 mr-1.5" />Demo
                      </a>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-white">{project.title}</h4>
                    <p className="mt-2 text-xs text-slate-300 leading-relaxed line-clamp-2 font-medium">{project.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span key={tech} className="rounded-md bg-bright-bg px-2.5 py-1 text-[10px] font-mono font-bold text-slate-400 border border-bright-border">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Review Summary */}
                <div className={`rounded-xl ${isVerified ? 'bg-brand-cyan/5 border-brand-cyan/20' : 'bg-bright-bg border-bright-border'} p-4 text-xs border`}>
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-widest block mb-1.5 ${isVerified ? 'text-brand-cyan' : 'text-slate-500'}`}>
                    Audit Note
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed italic">"{project.mentorReviewSummary}"</p>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
