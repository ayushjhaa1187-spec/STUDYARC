import React, { useState } from 'react';
import { Star, Clock, Users, BookOpen, ChevronDown, ChevronUp, Video, CheckSquare, Layers, Award, Shield, ArrowRight, PlayCircle, Plus } from 'lucide-react';
import { COURSES, EXPERTS } from '../data/mockData';

export default function CourseDetailPage({ courseId, setActivePage, openMentorModal }) {
  // Find course or default to a known one if not found
  const course = COURSES.find(c => c.id === courseId) || COURSES[2] || COURSES[0];
  
  // Find relevant experts based on course category (just picking top 2 matching or default)
  const relevantExperts = EXPERTS.filter(e => e.role.toLowerCase().includes(course.category.toLowerCase().split(' ')[0])).slice(0, 2);
  const expertsToShow = relevantExperts.length > 0 ? relevantExperts : EXPERTS.slice(0, 2);

  const [expandedModules, setExpandedModules] = useState({ 1: true });
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const toggleModule = (id) => {
    setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleEnroll = () => {
    setIsEnrolled(true);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#0C0F14] text-white pb-24 relative">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-green-500/20 border border-green-500/50 text-green-300 px-6 py-3 rounded-full flex items-center gap-2 z-50 animate-slide-up backdrop-blur-md">
          <Award className="w-5 h-5" />
          <span className="font-medium">Successfully enrolled in course!</span>
        </div>
      )}

      {/* 1. Course Header Section */}
      <div className="bg-[#12161E] border-b border-bright-border pt-8 pb-12 px-6 md:px-12 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 relative z-10">
          
          <div className="flex-1">
            <div className="text-sm text-gray-400 mb-6 flex items-center gap-2 flex-wrap">
              <span className="hover:text-white cursor-pointer" onClick={() => setActivePage('/catalog')}>Catalog</span>
              <ChevronDown className="w-3 h-3 -rotate-90" />
              <span className="hover:text-white cursor-pointer" onClick={() => setActivePage('/catalog')}>{course.category}</span>
              <ChevronDown className="w-3 h-3 -rotate-90" />
              <span className="text-gray-200">{course.title}</span>
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <span className={`category-pill category-pill-${course.category.toLowerCase().replace(/\s+/g, '-').replace('&', '')}`}>
                {course.category}
              </span>
              <span className="bg-white/10 border border-white/20 text-white text-xs uppercase font-bold px-2 py-1 rounded">
                {course.type || 'Course'}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold font-display mb-4 leading-tight">{course.title}</h1>
            <p className="text-lg text-gray-300 mb-8 max-w-3xl">{course.description}</p>
            
            <div className="flex flex-wrap items-center gap-y-4 gap-x-8 text-sm text-gray-300 mb-8 bg-white/5 p-4 rounded-xl border border-white/5 inline-flex">
              <div className="flex items-center gap-2 text-amber-400 font-medium">
                <Star className="w-5 h-5 fill-current" />
                <span className="text-lg">{course.rating}</span>
                <span className="text-gray-400 underline">({course.reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span>{course.learnersCount.toLocaleString()} enrolled</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-gray-400" />
                <span>{course.difficulty}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-gray-400" />
                <span>English</span>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <img src={course.instructor.avatar} alt={course.instructor.name} className="w-12 h-12 rounded-full border border-white/20" />
              <div>
                <div className="text-sm text-gray-400 mb-0.5">Instructor</div>
                <div className="font-bold flex items-center gap-2">
                  {course.instructor.name}
                  <span className="text-xs font-normal text-gray-400 bg-white/10 px-2 py-0.5 rounded-full">{course.instructor.company || 'Expert'}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {isEnrolled ? (
                <button 
                  onClick={() => setActivePage('/learn', { courseId: course.id })}
                  className="px-8 py-4 bg-brand-teal hover:bg-[#2bb4a5] text-black font-bold rounded-xl transition-all flex items-center gap-2"
                >
                  <PlayCircle className="w-5 h-5" /> Go to Workspace
                </button>
              ) : (
                <button 
                  onClick={handleEnroll}
                  className="px-8 py-4 bg-brand-teal hover:bg-[#2bb4a5] text-black font-bold rounded-xl transition-all flex items-center gap-2"
                >
                  {course.price === 'Free' ? 'Enroll for Free' : `Enroll Now - ${course.price}`}
                </button>
              )}
              <button className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl transition-all flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add to Path
              </button>
            </div>
            
            <div className="mt-8">
              <h4 className="text-sm font-semibold text-gray-400 mb-3">Skills you will gain</h4>
              <div className="flex flex-wrap gap-2">
                {course.skills && course.skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Sidebar - Preview Image */}
          <div className="w-full lg:w-[400px] shrink-0">
            <div className="rounded-2xl overflow-hidden border border-bright-border glass-bright shadow-2xl relative group">
              <img src={course.thumbnail} alt={course.title} className="w-full h-[300px] object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 cursor-pointer hover:scale-110 transition-transform">
                  <PlayCircle className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Main Content Area (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* 2. What You'll Learn */}
          <section>
            <h2 className="text-2xl font-bold font-display mb-6">What you'll learn</h2>
            <div className="glass-bright p-8 rounded-2xl border border-bright-border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {[
                  "Build end-to-end production ready applications",
                  "Understand core architectural patterns and best practices",
                  "Deploy and scale your projects on modern cloud infrastructure",
                  "Write clean, maintainable, and well-tested code",
                  "Integrate with external APIs and services securely",
                  "Master state management and data flow"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-brand-teal shrink-0 mt-0.5" />
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 3. Syllabus */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold font-display">Syllabus</h2>
              <span className="text-gray-400 text-sm">{course.modulesCount || 4} Modules • {course.duration} total</span>
            </div>
            
            <div className="space-y-4">
              {[
                { id: 1, title: 'Introduction & Foundations', lessons: 4, duration: '1.5 hours', type: 'Concepts' },
                { id: 2, title: 'Core Mechanics & State', lessons: 6, duration: '2.5 hours', type: 'Deep Dive' },
                { id: 3, title: 'Advanced Patterns', lessons: 5, duration: '2 hours', type: 'Architecture' },
                { id: 4, title: 'Final Project', lessons: 3, duration: '4 hours', type: 'Hands-on' }
              ].map((module) => (
                <div key={module.id} className="glass-bright border border-bright-border rounded-xl overflow-hidden syllabus-item transition-colors hover:border-white/20">
                  <div 
                    className="p-5 flex items-center justify-between cursor-pointer bg-white/[0.02]"
                    onClick={() => toggleModule(module.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-bold text-gray-400 shrink-0">
                        {module.id}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{module.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                          <span className="flex items-center gap-1"><Video className="w-3 h-3"/> {module.lessons} lessons</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {module.duration}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      {expandedModules[module.id] ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                    </div>
                  </div>
                  
                  {expandedModules[module.id] && (
                    <div className="p-5 border-t border-white/5 bg-black/20 space-y-3">
                      {[
                        { title: 'Welcome to the module', type: 'video', time: '10 min' },
                        { title: 'Core principles explained', type: 'video', time: '25 min' },
                        { title: 'Knowledge check', type: 'quiz', time: '15 min' },
                        { title: 'Hands-on practice assignment', type: 'project', time: '40 min' },
                      ].map((lesson, idx) => (
                        <div key={idx} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/5 transition-colors group cursor-pointer">
                          <div className="flex items-center gap-3">
                            {lesson.type === 'video' && <PlayCircle className="w-4 h-4 text-brand-indigo" />}
                            {lesson.type === 'quiz' && <CheckSquare className="w-4 h-4 text-brand-amber" />}
                            {lesson.type === 'project' && <Layers className="w-4 h-4 text-brand-teal" />}
                            <span className="text-gray-300 group-hover:text-white">{lesson.title}</span>
                          </div>
                          <span className="text-xs text-gray-500">{lesson.time}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* 4. Career Outcomes */}
          <section>
            <h2 className="text-2xl font-bold font-display mb-6">Career Outcomes</h2>
            <div className="glass-bright p-8 rounded-2xl border border-bright-border flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-3">Build a real-world portfolio</h3>
                <p className="text-gray-400 mb-6">This course is part of a project-based curriculum. You won't just watch videos—you'll build an artifact you can show employers.</p>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Final Artifact</div>
                  <div className="font-semibold text-brand-teal">Production-ready AI Application</div>
                </div>
              </div>
              <div className="w-full md:w-1/3">
                <div className="bg-gradient-to-br from-[#1A1F26] to-[#0C0F14] border border-white/10 rounded-xl p-5 text-center">
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6 text-green-400" />
                  </div>
                  <h4 className="font-bold mb-1">Verifiable Certificate</h4>
                  <p className="text-xs text-gray-400">Add to your LinkedIn profile upon completion</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          
          {/* 5. Expert Support Box */}
          <div className="glass-bright rounded-2xl border border-brand-amber/30 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-amber/10 blur-2xl rounded-full"></div>
            
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="w-10 h-10 bg-brand-amber/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-brand-amber" />
              </div>
              <div>
                <h3 className="font-bold">Need 1-on-1 help?</h3>
                <p className="text-xs text-gray-400">Book an expert for this topic</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-6 relative z-10">
              {expertsToShow.map(expert => (
                <div key={expert.id} className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
                  <img src={expert.avatar} alt={expert.name} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{expert.name}</div>
                    <div className="text-xs text-brand-amber truncate">{expert.role}</div>
                  </div>
                  <button 
                    onClick={() => openMentorModal(expert)}
                    className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded transition-colors"
                  >
                    Book
                  </button>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => setActivePage('/experts')}
              className="w-full text-center text-sm text-gray-400 hover:text-white transition-colors relative z-10"
            >
              Browse all relevant experts
            </button>
          </div>

          {/* 6. Reviews Summary */}
          <div className="glass-bright rounded-2xl border border-bright-border p-6">
            <h3 className="font-bold text-lg mb-4">Learner Reviews</h3>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="text-4xl font-bold font-display">{course.rating}</div>
              <div>
                <div className="flex items-center text-amber-400 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(course.rating) ? 'fill-current' : 'text-gray-600'}`} />
                  ))}
                </div>
                <div className="text-sm text-gray-400">{course.reviews} reviews</div>
              </div>
            </div>
            
            <div className="space-y-4">
              {[
                { name: 'Alex M.', text: 'Exactly what I needed. The projects are actually challenging.', rating: 5 },
                { name: 'Sam J.', text: 'Great explanations of complex concepts.', rating: 5 },
              ].map((review, idx) => (
                <div key={idx} className="border-t border-white/10 pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-sm">{review.name}</span>
                    <div className="flex text-amber-400">
                      {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 italic">"{review.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
