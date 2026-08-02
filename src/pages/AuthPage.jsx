import React, { useState } from 'react';
import { 
  Zap, 
  Sparkles, 
  ArrowRight, 
  Mail, 
  Lock, 
  User, 
  ShieldCheck, 
  CheckCircle2, 
  Eye, 
  EyeOff,
  Code2,
  Globe
} from 'lucide-react';

export default function AuthPage({ onLoginSuccess, setActivePage }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('alex.rivera@example.com');
  const [password, setPassword] = useState('••••••••••••');
  const [name, setName] = useState('Alex Rivera');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        name: isSignUp ? name : 'Alex Rivera',
        role: role === 'student' ? 'AI & Full-Stack Aspirant' : 'Mentor Lead',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        plan: 'Pro Tier'
      });
      setActivePage('/dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-8">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl border border-slate-700/60 bg-[#1e293b]/90 shadow-2xl overflow-hidden backdrop-blur-xl">
        
        {/* Left Side: Auth Form */}
        <div className="lg:col-span-6 p-8 sm:p-10 space-y-6 flex flex-col justify-between">
          <div>
            
            {/* Header Brand */}
            <div className="flex items-center space-x-2.5 cursor-pointer mb-6" onClick={() => setActivePage('/')}>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-400 via-teal-400 to-cyan-400 text-black shadow-lg shadow-emerald-500/30">
                <Zap className="h-6 w-6 fill-black" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">SkillBridge <span className="text-emerald-400">PRO</span></span>
            </div>

            {/* Form Title */}
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {isSignUp ? 'Create your execution account' : 'Welcome back, Executioner'}
              </h2>
              <p className="text-xs text-slate-300">
                {isSignUp ? 'Join 15,000+ engineers building verified proof.' : 'Sign in to continue your active sprint and daily streak.'}
              </p>
            </div>

            {/* Auth Mode Toggle Tabs */}
            <div className="flex rounded-xl bg-slate-900/80 p-1 border border-slate-800 mt-6">
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                  !isSignUp ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                  isSignUp ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Role Switcher */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { id: 'student', label: 'Learner / Aspirant' },
                { id: 'mentor', label: 'Expert Mentor' },
                { id: 'recruiter', label: 'Recruiter' }
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`rounded-lg py-1.5 px-2 text-[11px] font-semibold transition border ${
                    role === r.id
                      ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300 font-bold'
                      : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              
              {isSignUp && (
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Rivera"
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/90 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@skillbridge.pro"
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-emerald-400 rounded h-3.5 w-3.5" />
                  <span>Remember session</span>
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset link dispatched to your email.'); }} className="text-emerald-400 hover:underline">
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 py-3 text-sm font-bold text-slate-950 shadow-xl shadow-emerald-500/25 hover:opacity-95 transition disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Authenticating Session...</span>
                ) : (
                  <>
                    <span>{isSignUp ? 'Create Execution Account' : 'Sign In to Dashboard'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Social Logins */}
            <div className="mt-6 space-y-3">
              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-800 w-full"></div>
                <span className="bg-[#1e293b] px-3 text-[11px] font-mono text-slate-400 uppercase relative">or continue with</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleSubmit({ preventDefault: () => {} })}
                  className="flex items-center justify-center space-x-2 rounded-xl border border-slate-700 bg-slate-900/80 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition"
                >
                  <Globe className="h-4 w-4 text-cyan-400" />
                  <span>Google SSO</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSubmit({ preventDefault: () => {} })}
                  className="flex items-center justify-center space-x-2 rounded-xl border border-slate-700 bg-slate-900/80 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition"
                >
                  <Code2 className="h-4 w-4 text-emerald-400" />
                  <span>GitHub Auth</span>
                </button>
              </div>
            </div>

          </div>

          <p className="text-[11px] text-slate-400 text-center font-mono pt-4">
            Protected by Gemini Proof-of-Work Verification • Terms & Privacy
          </p>
        </div>

        {/* Right Side: High-Impact Visual Banner */}
        <div className="hidden lg:flex lg:col-span-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-emerald-950 p-10 flex-col justify-between relative overflow-hidden border-l border-slate-800">
          <div className="absolute -top-10 -right-10 w-72 h-72 bg-emerald-500/20 blur-3xl rounded-full"></div>
          <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-cyan-500/20 blur-3xl rounded-full"></div>

          <div className="relative space-y-6">
            <div className="inline-flex items-center space-x-2 rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-mono text-emerald-400 border border-emerald-500/30">
              <Sparkles className="h-3.5 w-3.5" />
              <span>AGENTIC CAREER PLATFORM</span>
            </div>

            <h3 className="text-3xl font-extrabold text-white leading-snug">
              Build proof that employers trust, not static certificates.
            </h3>

            <div className="space-y-3 pt-2">
              {[
                "Gemini AI automated code audits & test coverage",
                "1-on-1 expert code roasts from ex-FAANG tech leads",
                "Cryptographic proof badges for LinkedIn & GitHub",
                "Structured 30-day career execution sprints"
              ].map((feat, i) => (
                <div key={i} className="flex items-center space-x-3 text-xs text-slate-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Live Proof Visual Metric Badge */}
          <div className="relative rounded-2xl border border-emerald-500/30 bg-[#0f172a]/90 p-5 backdrop-blur-md space-y-2 glow-bright-green">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-emerald-400 font-bold">LIVE METRIC SHOWCASE</span>
              <span className="text-slate-400">72% Readiness Score</span>
            </div>
            <p className="text-xs text-slate-200 font-medium">
              "After completing 2 verified AI sprints on SkillBridge Pro, I received 3 direct recruiter interview invites!"
            </p>
            <div className="flex items-center space-x-2 pt-1">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" className="h-6 w-6 rounded-full" alt="User" />
              <span className="text-[11px] text-slate-400 font-mono">Alex R. • AI Engineer Sprint Graduate</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
