import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Clock, 
  Bell, 
  ShieldCheck, 
  CreditCard, 
  CheckCircle2, 
  AlertTriangle, 
  Lock,
  Save
} from 'lucide-react';

export default function SettingsPage({ user, setUser }) {
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);
  const [weeklyHrs, setWeeklyHrs] = useState(user.weeklyAvailabilityHours);
  const [notifications, setNotifications] = useState({
    email: true,
    whatsapp: true,
    inApp: true,
  });
  const [privacy, setPrivacy] = useState(user.privacy);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setUser({
      ...user,
      name,
      role,
      weeklyAvailabilityHours: weeklyHrs,
      privacy
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      
      {/* Top Header */}
      <div>
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-emerald-400 uppercase">
          <Settings className="h-4 w-4" />
          <span>Account Preferences & AI Controls</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white mt-1">Profile & Settings</h1>
        <p className="text-xs text-slate-300 mt-1">
          Manage your career targets, time availability, notification channels, plan billing, and AI privacy.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* SECTION 1: USER PROFILE & GOALS */}
        <div className="rounded-2xl border border-slate-800 bg-[#0f172a]/90 p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center space-x-2 text-sm font-bold text-white">
            <User className="h-4 w-4 text-emerald-400" />
            <span>1. User Profile & Career Goals</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Current Target Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Active Career Goals</label>
            <div className="space-y-2">
              {user.goals.map((goal, idx) => (
                <div key={idx} className="flex items-center space-x-2 rounded-xl bg-slate-900 p-2.5 text-xs text-slate-300 border border-slate-800">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>{goal}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 2: EXECUTION PREFERENCES */}
        <div className="rounded-2xl border border-slate-800 bg-[#0f172a]/90 p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center space-x-2 text-sm font-bold text-white">
            <Clock className="h-4 w-4 text-teal-400" />
            <span>2. Weekly Time Availability Slider</span>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300">
              <span>Time Committed:</span>
              <span className="font-bold text-emerald-400 font-mono">{weeklyHrs} Hours / week</span>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              value={weeklyHrs}
              onChange={(e) => setWeeklyHrs(Number(e.target.value))}
              className="mt-3 w-full accent-emerald-400 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div className="pt-2">
            <label className="block text-xs font-mono text-slate-400 mb-2">Notification Channels</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { key: 'email', label: 'Email Reports' },
                { key: 'whatsapp', label: 'WhatsApp Daily Reminders' },
                { key: 'inApp', label: 'In-App Live Alerts' }
              ].map((item) => (
                <label key={item.key} className="flex items-center space-x-2 rounded-xl bg-slate-900 p-3 text-xs text-slate-300 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications[item.key]}
                    onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                    className="accent-emerald-400 rounded h-4 w-4"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 3: PLAN & BILLING */}
        <div className="rounded-2xl border border-slate-800 bg-[#0f172a]/90 p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm font-bold text-white">
              <CreditCard className="h-4 w-4 text-purple-400" />
              <span>3. Plan & Billing</span>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-mono font-bold text-emerald-400 border border-emerald-500/20">
              CURRENT PLAN: {user.plan}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
              <span className="text-xs font-mono text-slate-400">Free Starter Tier</span>
              <p className="text-xl font-bold text-white">₹0 / month</p>
              <p className="text-[11px] text-slate-400">Access to 1 sprint + community doubts Q&A.</p>
            </div>

            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 space-y-2 relative">
              <span className="text-xs font-mono text-emerald-400 font-bold">Pro Execution Tier</span>
              <p className="text-xl font-bold text-white">₹1,499 / month</p>
              <p className="text-[11px] text-slate-300">Unlimited sprints, Gemini AI coach, 2 monthly mentor review credits.</p>
            </div>
          </div>
        </div>

        {/* SECTION 4: AI PRIVACY & LEGAL DISCLAIMER */}
        <div className="rounded-2xl border border-slate-800 bg-[#0f172a]/90 p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center space-x-2 text-sm font-bold text-white">
            <Lock className="h-4 w-4 text-teal-400" />
            <span>4. Gemini AI Data & Privacy Controls</span>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between rounded-xl bg-slate-900 p-3 text-xs text-slate-300 border border-slate-800 cursor-pointer">
              <span>Allow AI Agent to inspect GitHub pull requests for code audits</span>
              <input
                type="checkbox"
                checked={privacy.githubAccess}
                onChange={(e) => setPrivacy({ ...privacy, githubAccess: e.target.checked })}
                className="accent-emerald-400 rounded h-4 w-4"
              />
            </label>

            <label className="flex items-center justify-between rounded-xl bg-slate-900 p-3 text-xs text-slate-300 border border-slate-800 cursor-pointer">
              <span>Allow automated test execution reporting</span>
              <input
                type="checkbox"
                checked={privacy.codeInspection}
                onChange={(e) => setPrivacy({ ...privacy, codeInspection: e.target.checked })}
                className="accent-emerald-400 rounded h-4 w-4"
              />
            </label>
          </div>

          {/* Legal Disclaimer Box */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-xs text-amber-300 space-y-1">
            <div className="flex items-center space-x-2 font-bold font-mono">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>Platform Legal & Execution Disclaimer</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              SkillBridge Pro is a proof-of-work execution platform. We provide dynamic AI coaching and verified mentor code reviews. We offer <span className="font-bold text-amber-400">no guaranteed job or income outcomes</span>; career success is strictly driven by your verified execution and proof of work.
            </p>
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:opacity-95 transition"
          >
            <Save className="h-4 w-4" />
            <span>{saved ? 'Settings Saved!' : 'Save Preferences'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
