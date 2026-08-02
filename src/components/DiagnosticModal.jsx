import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, ChevronRight, Zap, Award, BarChart3, Bot } from 'lucide-react';

export default function DiagnosticModal({ isOpen, onClose, onComplete }) {
  const [step, setStep] = useState(1);
  const [targetRole, setTargetRole] = useState('AI Engineer');
  const [hours, setHours] = useState(15);
  const [selectedSkills, setSelectedSkills] = useState(['Python', 'Git', 'REST APIs']);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const roles = [
    { id: 'AI Engineer', title: 'AI & LLM Engineer', desc: 'Agentic Workflows, LangChain, PyTorch, RAG Pipelines' },
    { id: 'Full-Stack Dev', title: 'Full-Stack Developer', desc: 'Next.js 14, Node.js, WebSockets, Prisma, Docker' },
    { id: 'Data Analyst', title: 'Data Analytics & Engineering', desc: 'SQL, Python ETL, Pandas, Airflow, Tableau' },
    { id: 'Product Manager', title: 'Technical Product Manager', desc: 'SaaS UX, Metrics, API Specs, Sprint Planning' },
  ];

  const skillOptions = [
    'Python', 'JavaScript/TypeScript', 'React/Next.js', 'PyTorch/TensorFlow', 
    'SQL Databases', 'Docker/K8s', 'Git & GitHub', 'REST & GraphQL APIs', 'Vector DBs (Qdrant/Pinecone)'
  ];

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('http://localhost:3001/api/diagnostic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetRole,
          hours,
          selectedSkills
        }),
      });

      if (!response.ok) {
        throw new Error('API Error');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      // Fallback if backend is down or fails
      setResult({
        score: 75,
        targetRole,
        recommendedJourney: 'Error: API Unavailable - Mock Sprint',
        timeToProof: 'N/A',
        gapAnalysis: [
          'Failed to connect to the backend server.',
          'Please ensure the Express server is running on port 3001.',
          'Check the console logs for details.'
        ]
      });
    } finally {
      setIsAnalyzing(false);
      setStep(4);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-2xl border border-emerald-500/30 bg-[#0f172a] p-6 shadow-2xl shadow-emerald-500/10">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs uppercase tracking-wider">
          <Sparkles className="h-4 w-4" />
          <span>Gemini AI Career Diagnostic</span>
        </div>
        <h3 className="mt-1 text-xl font-bold text-white">
          {step === 4 ? 'Your Career Readiness Diagnostic' : 'Build Your Personalized Execution Plan'}
        </h3>
        
        {/* Progress Bar */}
        {step < 4 && (
          <div className="mt-4 flex items-center space-x-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  step >= s ? 'bg-gradient-to-r from-emerald-400 to-teal-400' : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        )}

        {/* Step 1: Target Role */}
        {step === 1 && (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-slate-300">Select your target career outcome:</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setTargetRole(role.id)}
                  className={`flex flex-col text-left rounded-xl p-4 transition border ${
                    targetRole === role.id
                      ? 'border-emerald-500 bg-emerald-500/10 text-white shadow-md shadow-emerald-500/10'
                      : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-white">{role.title}</span>
                    {targetRole === role.id && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                  </div>
                  <span className="mt-2 text-xs text-slate-400">{role.desc}</span>
                </button>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:opacity-95 shadow-md shadow-emerald-500/20"
              >
                <span>Next Step</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Time availability */}
        {step === 2 && (
          <div className="mt-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300">
                Weekly Time Commitment: <span className="font-bold text-emerald-400 font-mono">{hours} Hours / week</span>
              </label>
              <input
                type="range"
                min="5"
                max="40"
                step="1"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="mt-3 w-full accent-emerald-400 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="mt-1 flex justify-between text-xs text-slate-500 font-mono">
                <span>5 hrs (Casual)</span>
                <span>20 hrs (Recommended)</span>
                <span>40 hrs (Full-time Bootcamp)</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
              <div className="flex items-center space-x-2 text-xs text-teal-400 font-medium">
                <Bot className="h-4 w-4" />
                <span>Estimated Pace</span>
              </div>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                At <span className="text-white font-semibold">{hours} hours/week</span>, you can complete your first verified portfolio sprint in <span className="text-emerald-400 font-bold">{Math.max(2, Math.round(60 / hours))} weeks</span>.
              </p>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 text-sm text-slate-400 hover:text-white"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:opacity-95 shadow-md shadow-emerald-500/20"
              >
                <span>Select Existing Skills</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Skill Checklist */}
        {step === 3 && (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-slate-300">Select skills you have already built projects with:</p>
            <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto pr-1">
              {skillOptions.map((skill) => {
                const selected = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition border ${
                      selected
                        ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                        : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {selected ? '✓ ' : '+ '}{skill}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 text-sm text-slate-400 hover:text-white"
              >
                Back
              </button>

              <button
                onClick={runAnalysis}
                disabled={isAnalyzing}
                className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-2.5 text-sm font-semibold text-slate-950 hover:opacity-95 shadow-md shadow-emerald-500/20 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <Zap className="h-4 w-4 animate-spin" />
                    <span>Analyzing Code Repos & Skills...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Run AI Diagnostic</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Diagnostic Result */}
        {step === 4 && result && (
          <div className="mt-6 space-y-5">
            <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <div>
                <span className="text-xs font-mono text-emerald-400 uppercase">Target Readiness Score</span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-extrabold text-white">{result.score}%</span>
                  <span className="text-xs text-emerald-400">Ready for Junior/Mid AI Roles</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full border-2 border-emerald-400 flex items-center justify-center bg-slate-900 font-bold text-emerald-400">
                <BarChart3 className="h-6 w-6" />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Gemini AI Gap Analysis</h4>
              <ul className="space-y-1.5">
                {result.gapAnalysis.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <span className="text-xs font-mono text-teal-400">RECOMMENDED PATHWAY</span>
              <h5 className="text-base font-bold text-white mt-1">{result.recommendedJourney}</h5>
              <p className="text-xs text-slate-400 mt-0.5">Duration: {result.timeToProof} | Outcome: 2 Verified Portfolio Apps</p>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-slate-400 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onClose();
                  if (onComplete) onComplete(result);
                }}
                className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-2.5 text-sm font-bold text-slate-950 hover:opacity-95 shadow-lg shadow-emerald-500/20"
              >
                <Zap className="h-4 w-4" />
                <span>Activate My Career Plan</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
