"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDiagnosticStore } from '@/stores/diagnosticStore';
import { createClient } from '@/utils/supabase/client';
import { 
  Brain, Code, LineChart, Briefcase, 
  Upload, ArrowRight, ArrowLeft, Loader2, CheckCircle2 
} from 'lucide-react';

export default function DiagnosticWizard() {
  const store = useDiagnosticStore();
  const router = useRouter();
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
      else router.push('/login');
    });
  }, [supabase, router]);

  const handleNext = () => store.setStep((store.step + 1) as any);
  const handleBack = () => store.setStep((store.step - 1) as any);

  const handleResumeUpload = async (file: File) => {
    if (!userId || !file) return;
    store.updateForm({ resume_file: file });
    
    // In a full implementation, we'd upload this file:
    // const fileExt = file.name.split('.').pop();
    // const filePath = `${userId}/${Math.random()}.${fileExt}`;
    // await supabase.storage.from('resumes').upload(filePath, file);
    // store.updateForm({ resume_text: filePath }); // store the path
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'application/pdf' || file.type.includes('word'))) {
      handleResumeUpload(file);
    }
  }, [userId]);

  return (
    <div className="min-h-screen bg-bright-bg p-4 md:p-8 text-slate-100 font-sans flex flex-col items-center justify-center">
      
      {/* Progress Bar */}
      {store.step < 4 && (
        <div className="w-full max-w-3xl mb-8">
          <div className="flex justify-between text-sm text-slate-400 mb-2 font-medium">
            <span>Step {store.step} of 3</span>
            <span>{Math.round((store.step / 3) * 100)}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand-cyan transition-all duration-500 ease-out"
              style={{ width: `${(store.step / 3) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="w-full max-w-3xl glass-bright rounded-2xl p-6 md:p-10 min-h-[500px] flex flex-col relative overflow-hidden">
        
        {/* Step 1: Goal */}
        {store.step === 1 && (
          <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-3xl font-heading font-bold mb-2 text-white">What's your primary goal?</h2>
            <p className="text-slate-400 mb-8">We'll tailor your learning path based on what you want to achieve.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
              {[
                { id: 'ai_internship', title: 'AI Internship', icon: Brain, desc: 'Master GenAI, RAG, and LLMs' },
                { id: 'full_stack_portfolio', title: 'Full-Stack Portfolio', icon: Code, desc: 'Build modern end-to-end web apps' },
                { id: 'data_analyst', title: 'Data Analyst Readiness', icon: LineChart, desc: 'Learn SQL, Python, and BI tools' },
                { id: 'freelance_web', title: 'Freelance Web Developer', icon: Briefcase, desc: 'Master UI/UX and client projects' },
              ].map(goal => (
                <button
                  key={goal.id}
                  onClick={() => store.updateForm({ goal: goal.id })}
                  className={`p-6 rounded-xl border text-left transition-all ${
                    store.goal === goal.id 
                      ? 'bg-brand-cyan/10 border-brand-cyan glow-bright-cyan' 
                      : 'bg-slate-900/50 border-bright-border hover:border-slate-600'
                  }`}
                >
                  <div className={`p-3 rounded-lg inline-block mb-4 ${store.goal === goal.id ? 'bg-brand-cyan text-black' : 'bg-slate-800 text-brand-cyan'}`}>
                    <goal.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{goal.title}</h3>
                  <p className="text-sm text-slate-400">{goal.desc}</p>
                </button>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleNext}
                disabled={!store.goal}
                className="bg-brand-cyan hover:bg-brand-teal disabled:opacity-50 text-black font-semibold px-8 py-3 rounded-lg flex items-center transition-all"
              >
                Continue <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Skill & Time */}
        {store.step === 2 && (
          <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-3xl font-heading font-bold mb-2 text-white">Tell us about your background</h2>
            <p className="text-slate-400 mb-8">This helps us gauge the intensity of your personalized sprint.</p>

            <div className="space-y-8 flex-1">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-4">Current Skill Level</label>
                <div className="flex gap-4">
                  {['beginner', 'intermediate', 'advanced'].map(level => (
                    <label key={level} className={`flex-1 cursor-pointer text-center p-4 rounded-xl border transition-all ${
                      store.skill_level === level ? 'bg-brand-indigo/10 border-brand-indigo text-white' : 'bg-slate-900/50 border-bright-border text-slate-400 hover:border-slate-600'
                    }`}>
                      <input 
                        type="radio" 
                        name="skill" 
                        className="hidden" 
                        checked={store.skill_level === level}
                        onChange={() => store.updateForm({ skill_level: level })}
                      />
                      <span className="capitalize font-medium">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-slate-300">Time Commitment (Hours/Week)</label>
                  <span className="text-brand-cyan font-bold">{store.hours_per_week || 15} hrs</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="40" 
                  step="1"
                  value={store.hours_per_week || 15}
                  onChange={(e) => store.updateForm({ hours_per_week: parseInt(e.target.value) })}
                  className="w-full accent-brand-cyan h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>5 hrs (Relaxed)</span>
                  <span>40 hrs (Intense)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">University (Optional)</label>
                  <input 
                    type="text" 
                    value={store.university}
                    onChange={e => store.updateForm({ university: e.target.value })}
                    className="w-full bg-slate-900/50 border border-bright-border rounded-lg p-3 text-white focus:border-brand-cyan focus:outline-none"
                    placeholder="e.g. IIT Delhi"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Graduation Year</label>
                  <select 
                    value={store.graduation_year || ''}
                    onChange={e => store.updateForm({ graduation_year: parseInt(e.target.value) })}
                    className="w-full bg-slate-900/50 border border-bright-border rounded-lg p-3 text-white focus:border-brand-cyan focus:outline-none"
                  >
                    <option value="" disabled>Select Year</option>
                    {[2024, 2025, 2026, 2027, 2028].map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={handleBack}
                className="text-slate-400 hover:text-white px-6 py-3 rounded-lg flex items-center transition-colors"
              >
                <ArrowLeft className="mr-2 w-5 h-5" /> Back
              </button>
              <button
                onClick={handleNext}
                disabled={!store.skill_level || !store.hours_per_week || !store.graduation_year}
                className="bg-brand-cyan hover:bg-brand-teal disabled:opacity-50 text-black font-semibold px-8 py-3 rounded-lg flex items-center transition-all"
              >
                Continue <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Assets */}
        {store.step === 3 && (
          <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-3xl font-heading font-bold mb-2 text-white">Connect your work</h2>
            <p className="text-slate-400 mb-8">Give our AI more context to personalize your sprint.</p>

            <div className="space-y-6 flex-1">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">GitHub Profile (Optional)</label>
                <input 
                  type="url" 
                  value={store.github_url}
                  onChange={e => store.updateForm({ github_url: e.target.value })}
                  className="w-full bg-slate-900/50 border border-bright-border rounded-lg p-3 text-white focus:border-brand-cyan focus:outline-none"
                  placeholder="https://github.com/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Upload Resume (PDF/DOCX)</label>
                <div 
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="w-full border-2 border-dashed border-bright-border hover:border-brand-cyan bg-slate-900/30 rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer group"
                >
                  <Upload className="w-10 h-10 text-slate-500 group-hover:text-brand-cyan mb-3 transition-colors" />
                  {store.resume_file ? (
                    <p className="text-brand-cyan font-medium">{store.resume_file.name}</p>
                  ) : (
                    <>
                      <p className="text-slate-300 font-medium mb-1">Drag and drop your resume here</p>
                      <p className="text-slate-500 text-sm">or click to browse files (Max 5MB)</p>
                    </>
                  )}
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".pdf,.doc,.docx"
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        handleResumeUpload(e.target.files[0]);
                      }
                    }}
                  />
                </div>
              </div>
              
              {store.error && (
                <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                  {store.error}
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={handleBack}
                className="text-slate-400 hover:text-white px-6 py-3 rounded-lg flex items-center transition-colors"
              >
                <ArrowLeft className="mr-2 w-5 h-5" /> Back
              </button>
              <button
                onClick={() => store.submitDiagnostic()}
                className="bg-brand-cyan hover:bg-brand-teal text-black font-semibold px-8 py-3 rounded-lg flex items-center transition-all"
              >
                Generate Sprint <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: AI Loading */}
        {store.step === 4 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in duration-1000">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-brand-cyan blur-2xl opacity-20 rounded-full animate-pulse" />
              <Loader2 className="w-16 h-16 text-brand-cyan animate-spin relative z-10" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-white mb-2">Analyzing your profile...</h2>
            <p className="text-slate-400">Our AI is crafting a personalized roadmap based on your goals and experience.</p>
            
            {/* Fake progress items */}
            <div className="mt-12 space-y-4 text-left w-64 mx-auto">
              <div className="flex items-center text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-brand-cyan mr-3" />
                <span>Evaluating skill level</span>
              </div>
              <div className="flex items-center text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-brand-cyan mr-3 animate-pulse" />
                <span>Mapping career path</span>
              </div>
              <div className="flex items-center text-slate-500">
                <div className="w-5 h-5 rounded-full border-2 border-slate-700 mr-3" />
                <span>Generating daily tasks</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Results */}
        {store.step === 5 && store.ai_result && (
          <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="text-center mb-8">
              <div className="inline-block px-4 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-sm font-medium mb-4">
                Sprint Generated Successfully
              </div>
              <h2 className="text-3xl font-heading font-bold text-white mb-4">Your Path Forward</h2>
              <p className="text-slate-300 leading-relaxed max-w-2xl mx-auto text-sm md:text-base">
                {store.ai_result.career_map}
              </p>
            </div>

            <div className="bg-slate-900/50 border border-bright-border rounded-xl p-6 mb-8 flex-1">
              <h3 className="text-xl font-bold text-white mb-1">
                {store.ai_result.recommended_sprint.name}
              </h3>
              <p className="text-brand-cyan font-medium mb-6">
                {store.ai_result.recommended_sprint.duration_days}-Day Sprint
              </p>
              
              <div className="space-y-4">
                {store.ai_result.recommended_sprint.daily_tasks.slice(0, 3).map((task, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-sm">
                      {task.day}
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1">{task.title}</h4>
                      <p className="text-slate-400 text-sm">{task.description}</p>
                    </div>
                  </div>
                ))}
                <div className="text-center text-slate-500 text-sm italic mt-4">
                  + {store.ai_result.recommended_sprint.daily_tasks.length - 3} more tasks
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                store.startSprint();
                router.push('/dashboard'); // Mock redirect for now
              }}
              className="w-full bg-brand-cyan hover:bg-brand-teal text-black font-bold py-4 rounded-xl text-lg transition-all shadow-[0_0_20px_rgba(53,199,184,0.3)] hover:shadow-[0_0_30px_rgba(53,199,184,0.5)]"
            >
              Start My Sprint
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
