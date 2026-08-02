import React from 'react';
import { Target, TrendingUp, MessageCircle, Star, BadgeCheck } from 'lucide-react';

const features = [
  {
    icon: <Target className="w-10 h-10 text-classic-accent" />,
    title: "AI Diagnostic",
    description: "Assess your skills in real-time and get a highly personalized roadmap tailored to your target role."
  },
  {
    icon: <TrendingUp className="w-10 h-10 text-classic-accent" />,
    title: "Execution Sprints",
    description: "Transform your learning into doing with 30-day structured projects featuring daily tasks and AI feedback."
  },
  {
    icon: <MessageCircle className="w-10 h-10 text-classic-accent" />,
    title: "AI Coach",
    description: "Never get stuck again. Your 24/7 intelligent assistant is always ready to unblock your progress."
  },
  {
    icon: <Star className="w-10 h-10 text-classic-accent" />,
    title: "Expert Marketplace",
    description: "Book vetted senior engineers and mentors for resume reviews, project feedback, or mock interviews."
  },
  {
    icon: <BadgeCheck className="w-10 h-10 text-classic-success" />,
    title: "Verified Portfolio",
    description: "Showcase your completed projects and sprints with a cryptographic trust badge that employers respect."
  }
];

export default function FeaturesGridSection() {
  return (
    <section id="features" className="py-24 bg-classic-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-classic-textPrimary mb-4">Platform Features</h2>
          <p className="text-lg text-classic-textSecondary">
            Everything you need to bridge the gap between learning and getting hired.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-xl p-8 shadow-classic-card border border-classic-border hover:shadow-classic-modal transition-shadow duration-300 ${
                index === features.length - 1 ? 'lg:col-span-3 lg:w-2/3 mx-auto' : ''
              }`}
            >
              <div className="w-16 h-16 rounded-xl bg-classic-bg flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-classic-textPrimary mb-3">{feature.title}</h3>
              <p className="text-classic-textSecondary leading-relaxed mb-4">
                {feature.description}
              </p>
              <a href="#" className="text-classic-accent font-medium text-sm hover:text-classic-primary transition-colors flex items-center gap-1">
                Learn more <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
