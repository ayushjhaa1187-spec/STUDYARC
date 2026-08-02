import React, { useState } from 'react';
import { X, Upload, Link as LinkIcon, CheckCircle2, ChevronRight } from 'lucide-react';

export default function ArtifactSubmissionModal({ isOpen, onClose }) {
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [selfAssessment, setSelfAssessment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Auto close after success
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl border border-emerald-500/30 bg-[#0f172a] p-6 shadow-2xl shadow-emerald-500/10">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
        >
          <X className="h-6 w-6" />
        </button>

        {!isSuccess ? (
          <>
            <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs uppercase tracking-wider">
              <Upload className="h-4 w-4" />
              <span>Submit Sprint Artifact</span>
            </div>
            
            <h3 className="mt-1 text-xl font-bold text-white mb-6">
              Finalize Your Challenge
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide font-mono">
                  GitHub Repository URL *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LinkIcon className="h-4 w-4 text-slate-500" />
                  </div>
                  <input
                    type="url"
                    required
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username/project"
                    className="w-full pl-10 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide font-mono">
                  Live Deployment URL (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LinkIcon className="h-4 w-4 text-slate-500" />
                  </div>
                  <input
                    type="url"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://my-project.vercel.app"
                    className="w-full pl-10 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide font-mono">
                  Self-Assessment vs Rubric *
                </label>
                <textarea
                  required
                  rows="3"
                  value={selfAssessment}
                  onChange={(e) => setSelfAssessment(e.target.value)}
                  placeholder="Explain how you met the acceptance criteria..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition resize-none"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !githubUrl || !selfAssessment}
                  className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-2.5 text-sm font-bold text-slate-950 hover:opacity-95 shadow-md shadow-emerald-500/20 disabled:opacity-50 transition"
                >
                  {isSubmitting ? (
                    <span className="flex items-center space-x-2">
                      <div className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </span>
                  ) : (
                    <>
                      <span>Submit for Verification</span>
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-bold text-white">Artifact Submitted!</h3>
            <p className="text-sm text-slate-400 max-w-xs">
              Great job! Your project artifact has been saved to your portfolio and marked for AI review.
            </p>
          </div>
        )}
        
      </div>
    </div>
  );
}
