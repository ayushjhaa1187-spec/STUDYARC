import React, { useEffect, useRef } from 'react';
import { BookOpen, Users, Bot, Star, ArrowRight, ArrowUpRight, ExternalLink, Globe, Link2, CheckCircle2 } from 'lucide-react';
import { JOURNEYS, EXPERTS } from '../data/mockData';

// Hook for scroll reveal animation
const useScrollReveal = () => {
  const ref = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('opacity-0', 'translate-y-8');
          entry.target.classList.add('opacity-100', 'translate-y-0');
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);
  
  return ref;
};

const FadeInSection = ({ children, className = '', delay = 0 }) => {
  const ref = useScrollReveal();
  // Using custom inline style for delay if needed or a set of preset classes
  return (
    <div 
      ref={ref} 
      className={`opacity-0 translate-y-8 transition-all duration-700 ease-out ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default function LandingPage({ setActivePage, openDiagnostic }) {
  const featuredJourneys = JOURNEYS.slice(0, 3);
  const featuredExperts = EXPERTS.slice(0, 5);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Frontend Engineer",
      company: "Stripe",
      text: "The AI agent created a personalized path for me, and my mentor guided me through complex React patterns. I doubled my salary in 6 months.",
      rating: 5
    },
    {
      id: 2,
      name: "David Kumar",
      role: "Data Scientist",
      company: "Google",
      text: "SkillBridge Pro bridges the gap between theory and actual industry practice. The 1-on-1 expert sessions are invaluable for mock interviews.",
      rating: 5
    },
    {
      id: 3,
      name: "Elena Rodriguez",
      role: "Product Manager",
      company: "Netflix",
      text: "Unlike standard courses, the journeys here focus on real-world artifacts. I built a portfolio that actually got me hired.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-[#0C0F14] text-white selection:bg-brand-teal selection:bg-opacity-30">
      
      {/* 1. Hero Section */}
      <section className="relative min-h-screen flex flex-col hero-gradient overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-teal rounded-full mix-blend-screen filter blur-[120px] opacity-10 animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-brand-violet rounded-full mix-blend-screen filter blur-[150px] opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-1/4 left-1/2 w-[400px] h-[400px] bg-brand-amber rounded-full mix-blend-screen filter blur-[100px] opacity-10 animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        {/* Custom Navbar */}
        <nav className="relative z-10 flex items-center justify-between px-6 py-4 md:px-12 border-b border-white/5 backdrop-blur-md bg-[#0C0F14]/50">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActivePage('/landing')}>
            <Bot className="w-8 h-8 text-brand-teal" />
            <span className="text-xl font-bold font-display tracking-tight">SkillBridge <span className="text-brand-teal">Pro</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => setActivePage('/catalog')} className="text-gray-300 hover:text-white transition-colors">Catalog</button>
            <button onClick={() => setActivePage('/journeys')} className="text-gray-300 hover:text-white transition-colors">Journeys</button>
            <button onClick={() => setActivePage('/experts')} className="text-gray-300 hover:text-white transition-colors">Experts</button>
            <button onClick={() => setActivePage('/community')} className="text-gray-300 hover:text-white transition-colors">Community</button>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setActivePage('/login')} className="hidden md:block text-gray-300 hover:text-white transition-colors font-medium">Login</button>
            <button onClick={() => setActivePage('/login')} className="bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-full font-medium transition-all backdrop-blur-sm border border-white/10">Get Started</button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 md:px-12 max-w-5xl mx-auto pt-12 pb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-brand-teal text-sm font-medium mb-8 animate-slide-up">
            <Bot className="w-4 h-4" />
            <span>AI-Powered Career Accelerator</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold font-display leading-tight mb-6 animate-slide-up-delay-1">
            Build proof,<br/>
            <span className="text-gradient-ai">not just certificates.</span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-10 max-w-2xl animate-slide-up-delay-2">
            Master high-demand skills with personalized AI-driven learning journeys. 
            Get unstuck instantly with on-demand 1-on-1 mentorship from top 1% industry experts.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 animate-slide-up-delay-3 w-full sm:w-auto">
            <button 
              onClick={openDiagnostic}
              className="w-full sm:w-auto px-8 py-4 bg-brand-teal hover:bg-[#2bb4a5] text-black font-bold rounded-full transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(53,199,184,0.3)]"
            >
              Get My Free Career Diagnostic
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setActivePage('/catalog')}
              className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-full transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              Browse Courses
            </button>
          </div>

          {/* Floating Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 w-full pt-10 border-t border-white/10 animate-slide-up" style={{ animationDelay: '0.8s' }}>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-white mb-1">14,200+</span>
              <span className="text-sm text-gray-400">Learners</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-white mb-1">89</span>
              <span className="text-sm text-gray-400">Expert Mentors</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-white mb-1">4.9★</span>
              <span className="text-sm text-gray-400">Average Rating</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-white mb-1">₹2.8Cr+</span>
              <span className="text-sm text-gray-400">Earned by Experts</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Story Scroll Section */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/5">
        <FadeInSection>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">The ultimate learning stack</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Combining the structure of traditional MOOCs with the personalization of AI and the experience of top-tier human mentors.</p>
          </div>
        </FadeInSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FadeInSection delay={0}>
            <div className="glass-bright rounded-2xl p-8 border border-bright-border h-full flex flex-col relative overflow-hidden group hover:border-brand-indigo/50 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-indigo/10 rounded-bl-full blur-2xl"></div>
              <div className="w-14 h-14 rounded-xl bg-brand-indigo/20 flex items-center justify-center text-brand-indigo mb-6">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Structured Learning</h3>
              <p className="text-gray-400 flex-1">World-class curriculum bridging the gap between academia and industry. Courses → Specializations → Career Certificates.</p>
              <div className="mt-6 pt-6 border-t border-white/10 flex items-center text-sm text-gray-500 gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-indigo" /> The Coursera Layer
              </div>
            </div>
          </FadeInSection>
          
          <FadeInSection delay={150}>
            <div className="glass-bright rounded-2xl p-8 border border-bright-border h-full flex flex-col relative overflow-hidden group hover:border-brand-teal/50 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-teal/10 rounded-bl-full blur-2xl"></div>
              <div className="w-14 h-14 rounded-xl bg-brand-teal/20 flex items-center justify-center text-brand-teal mb-6">
                <Bot className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Gemini AI Coach</h3>
              <p className="text-gray-400 flex-1">Your personal AI agent that plans your learning path, explains complex concepts, and recommends the right human experts when needed.</p>
              <div className="mt-6 pt-6 border-t border-white/10 flex items-center text-sm text-gray-500 gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-teal" /> The AI Layer
              </div>
            </div>
          </FadeInSection>

          <FadeInSection delay={300}>
            <div className="glass-bright rounded-2xl p-8 border border-bright-border h-full flex flex-col relative overflow-hidden group hover:border-brand-amber/50 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-amber/10 rounded-bl-full blur-2xl"></div>
              <div className="w-14 h-14 rounded-xl bg-brand-amber/20 flex items-center justify-center text-brand-amber mb-6">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Expert Access</h3>
              <p className="text-gray-400 flex-1">1-on-1 sessions with ex-FAANG mentors on demand. Code reviews, mock interviews, and career guidance when you need it most.</p>
              <div className="mt-6 pt-6 border-t border-white/10 flex items-center text-sm text-gray-500 gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-amber" /> The Astrotalk Layer
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* 3. Featured Journeys */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <FadeInSection>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Outcome-Driven Journeys</h2>
              <p className="text-gray-400 text-lg">Curated paths designed to take you from beginner to job-ready.</p>
            </div>
            <button 
              onClick={() => setActivePage('/journeys')}
              className="text-brand-teal hover:text-white flex items-center gap-2 transition-colors font-medium whitespace-nowrap"
            >
              View All Journeys <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </FadeInSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredJourneys.map((journey, idx) => (
            <FadeInSection key={journey.id} delay={idx * 150}>
              <div className="glass-bright rounded-2xl border border-bright-border overflow-hidden hover:border-brand-teal/30 transition-all duration-300 flex flex-col h-full group">
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`category-pill category-pill-${journey.category.toLowerCase().replace(/\s+/g, '-')}`}>
                      {journey.category}
                    </span>
                    <span className="text-xs font-mono text-gray-400 bg-white/5 px-2 py-1 rounded">
                      {journey.difficulty}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-brand-teal transition-colors">{journey.title}</h3>
                  <p className="text-gray-400 text-sm mb-6 flex-1">{journey.description}</p>
                  
                  <div className="bg-white/5 rounded-xl p-4 mb-6">
                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Outcome</p>
                    <p className="text-sm text-gray-200 font-medium">{journey.outcome}</p>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-6">
                    <span>{journey.duration}</span>
                    <span>{journey.enrolledCount.toLocaleString()} enrolled</span>
                  </div>
                  
                  <button 
                    onClick={() => setActivePage('/journeys')}
                    className="w-full py-3 rounded-xl bg-white/5 hover:bg-brand-teal hover:text-black font-medium transition-all text-white border border-white/10 hover:border-transparent flex items-center justify-center gap-2 mt-auto"
                  >
                    View Path <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* 4. Expert Snapshots */}
      <section className="py-24 border-y border-white/5 bg-[#0a0d12]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <FadeInSection>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Learn from the top 1%</h2>
                <p className="text-gray-400 text-lg">Book 1-on-1 sessions with industry leaders for guidance, review, and mock interviews.</p>
              </div>
              <button 
                onClick={() => setActivePage('/experts')}
                className="text-brand-amber hover:text-white flex items-center gap-2 transition-colors font-medium whitespace-nowrap"
              >
                Explore Experts <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </FadeInSection>

          {/* Horizontal scroll container */}
          <div className="flex overflow-x-auto pb-8 -mx-6 px-6 md:-mx-12 md:px-12 gap-6 snap-x snap-mandatory scrollbar-thin">
            {featuredExperts.map((expert, idx) => (
              <FadeInSection key={expert.id} delay={idx * 100} className="snap-start shrink-0 w-[280px]">
                <div className="expert-card p-6 h-full flex flex-col rounded-2xl">
                  <div className="flex items-start justify-between mb-4">
                    <img src={expert.avatar} alt={expert.name} className="w-16 h-16 rounded-full object-cover border-2 border-brand-amber/30" />
                    <div className="flex items-center gap-1 bg-amber-500/10 text-brand-amber px-2 py-1 rounded-md text-xs font-bold">
                      <Star className="w-3 h-3 fill-current" /> {expert.rating}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold truncate">{expert.name}</h3>
                  <p className="text-brand-amber text-sm font-medium mb-1 truncate">{expert.role}</p>
                  <p className="text-gray-500 text-xs mb-4 truncate">{expert.company}</p>
                  
                  <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Starts at</span>
                      <span className="font-mono font-medium text-white">{expert.hourlyRate}/hr</span>
                    </div>
                    <button 
                      onClick={() => setActivePage('/experts')}
                      className="px-4 py-2 bg-white/5 hover:bg-brand-amber hover:text-black rounded-lg text-sm font-medium transition-all text-white border border-white/10 hover:border-transparent"
                    >
                      Book
                    </button>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Testimonial Strip */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <FadeInSection>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-center mb-16">Stories of impact</h2>
        </FadeInSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <FadeInSection key={t.id} delay={idx * 150}>
              <div className="glass-bright rounded-2xl p-8 border border-bright-border h-full flex flex-col relative">
                <div className="text-brand-teal/20 absolute top-6 right-6">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.017 21L16.411 14.623H11.758V3H21.722V14.623L18.069 21H14.017ZM3.264 21L5.658 14.623H1.005V3H10.969V14.623L7.316 21H3.264Z" />
                  </svg>
                </div>
                <div className="flex items-center gap-1 text-amber-400 mb-6">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-gray-300 text-lg leading-relaxed mb-8 flex-1 italic">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-teal to-brand-violet flex items-center justify-center text-white font-bold text-lg">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{t.name}</h4>
                    <p className="text-sm text-gray-500">{t.role} at <span className="text-gray-400">{t.company}</span></p>
                  </div>
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* 6. Final CTA */}
      <section className="py-24 px-6 md:px-12 max-w-5xl mx-auto text-center">
        <FadeInSection>
          <div className="glass-bright rounded-3xl p-12 md:p-20 border border-brand-teal/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-brand-teal/5"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-teal rounded-full mix-blend-screen filter blur-[200px] opacity-10 pointer-events-none"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold font-display mb-6">Ready to upgrade your career?</h2>
              <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">Join thousands of professionals accelerating their growth with AI-guided learning and expert mentorship.</p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={openDiagnostic}
                  className="w-full sm:w-auto px-8 py-4 bg-brand-teal hover:bg-[#2bb4a5] text-black font-bold rounded-full transition-all hover:scale-105 flex items-center justify-center gap-2"
                >
                  Get My Free Diagnostic
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setActivePage('/catalog')}
                  className="w-full sm:w-auto px-8 py-4 bg-[#1A1F26] hover:bg-[#232A34] text-white font-medium rounded-full transition-all border border-white/10 flex items-center justify-center gap-2"
                >
                  Browse 15+ Courses
                </button>
              </div>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* 7. Footer */}
      <footer className="bg-[#050608] pt-20 pb-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <Bot className="w-6 h-6 text-brand-teal" />
                <span className="text-xl font-bold font-display tracking-tight">SkillBridge <span className="text-brand-teal">Pro</span></span>
              </div>
              <p className="text-gray-500 text-sm mb-6">The modern learning platform combining structured curriculum, AI agents, and 1-on-1 human mentorship.</p>
              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors" aria-label="Twitter">
                  <Globe className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors" aria-label="LinkedIn">
                  <Link2 className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors" aria-label="GitHub">
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6">Platform</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><button onClick={() => setActivePage('/catalog')} className="hover:text-brand-teal transition-colors">Courses</button></li>
                <li><button onClick={() => setActivePage('/journeys')} className="hover:text-brand-teal transition-colors">Career Journeys</button></li>
                <li><button onClick={() => setActivePage('/experts')} className="hover:text-brand-teal transition-colors">Expert Mentors</button></li>
                <li><a href="#" className="hover:text-brand-teal transition-colors">For Enterprise</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6">Resources</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><a href="#" className="hover:text-brand-teal transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-brand-teal transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-brand-teal transition-colors">Success Stories</a></li>
                <li><a href="#" className="hover:text-brand-teal transition-colors">Help Center</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><a href="#" className="hover:text-brand-teal transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-brand-teal transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-brand-teal transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-brand-teal transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-gray-600 gap-4">
            <p>&copy; {new Date().getFullYear()} SkillBridge Pro. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-gray-400">Privacy</a>
              <a href="#" className="hover:text-gray-400">Terms</a>
              <a href="#" className="hover:text-gray-400">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
