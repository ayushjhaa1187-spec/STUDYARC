import React from 'react';
import { Target, Cpu, Play, UserCheck, Award, Briefcase } from 'lucide-react';

export default function EnergyTimeline() {
  const steps = [
    {
      num: "01",
      title: "Choose your goal",
      desc: "Select target career outcome: AI Engineer, Full-Stack, or Data Analyst.",
      icon: Target,
      color: "emerald"
    },
    {
      num: "02",
      title: "Run AI diagnostic",
      desc: "Gemini agent analyzes your current code repositories & skill gap.",
      icon: Cpu,
      color: "teal"
    },
    {
      num: "03",
      title: "Start execution sprint",
      desc: "Execute daily structured tasks with AI coach guidance & XP streaks.",
      icon: Play,
      color: "cyan"
    },
    {
      num: "04",
      title: "Book expert review",
      desc: "Get 1-on-1 code roast & architecture review from ex-FAANG mentors.",
      icon: UserCheck,
      color: "emerald"
    },
    {
      num: "05",
      title: "Ship portfolio projects",
      desc: "Deploy live production applications with automated test coverage.",
      icon: Award,
      color: "teal"
    },
    {
      num: "06",
      title: "Use verified proof",
      desc: "Share cryptographic proof badges with recruiters for direct hiring.",
      icon: Briefcase,
      color: "emerald"
    }
  ];

  return (
    <div className="relative w-full py-8">
      {/* Background glowing energy line */}
      <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 opacity-30 shadow-[0_0_15px_rgba(34,197,94,0.5)]"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 relative z-10">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-[#0f172a]/90 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    STEP {step.num}
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <h4 className="text-base font-semibold text-white group-hover:text-emerald-400 transition">
                  {step.title}
                </h4>
                <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {/* Connecting dot indicator */}
              <div className="mt-4 flex items-center space-x-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Active Pipeline</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
