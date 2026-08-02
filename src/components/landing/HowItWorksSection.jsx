import React from 'react';
import { Search, Zap, MessageSquare, UserCheck, ShieldCheck } from 'lucide-react';

const steps = [
  {
    icon: <Search className="w-6 h-6" />,
    title: "Diagnose",
    description: "Take our AI-powered assessment to identify your precise skill gaps."
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Sprint",
    description: "Join a 30-day execution sprint with daily actionable tasks."
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "Coach",
    description: "Get 24/7 unblocking assistance from our intelligent AI coach."
  },
  {
    icon: <UserCheck className="w-6 h-6" />,
    title: "Expert",
    description: "Book vetted industry experts for 1-on-1 reviews and guidance."
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Proof",
    description: "Earn a verified portfolio badge to showcase your real-world capability."
  }
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-classic-textPrimary mb-4">How SkillBridge Pro Works</h2>
          <p className="text-lg text-classic-textSecondary">
            From ambiguity to a verified outcome in five simple steps.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-0.5 bg-classic-border border-dashed border-t-2 border-classic-border"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-4 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-classic-bg border-4 border-white rounded-full shadow-classic-card flex items-center justify-center text-classic-primary mb-6 relative">
                  {step.icon}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-classic-accent text-white rounded-full flex items-center justify-center font-bold text-sm border-2 border-white">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-classic-textPrimary mb-3">{step.title}</h3>
                <p className="text-classic-textSecondary text-sm leading-relaxed px-2">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
