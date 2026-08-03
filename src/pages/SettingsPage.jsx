import React, { useState } from 'react';
import {
  User, BookOpen, Bell, Shield, CreditCard, Save, CheckCircle2,
  Camera, Sliders, Moon, Sun, ChevronRight, Zap, AlertTriangle,
  Download, Trash2, Info
} from 'lucide-react';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'learning', label: 'Learning', icon: BookOpen },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy & Data', icon: Shield },
  { id: 'billing', label: 'Billing', icon: CreditCard },
];

function Toggle({ checked, onChange, id }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      id={id}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:ring-offset-2 focus:ring-offset-bright-bg ${
        checked ? 'border-brand-teal bg-brand-teal/20' : 'border-bright-border bg-bright-bg'
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full transition-all duration-200 shadow ${
          checked ? 'left-5 bg-brand-teal' : 'left-0.5 bg-slate-500'
        }`}
      />
    </button>
  );
}

function Toast({ message, onClose }) {
  React.useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className="toast" role="alert">
      <CheckCircle2 className="h-4 w-4 text-brand-teal shrink-0" />
      <span>{message}</span>
    </div>
  );
}

export default function SettingsPage({ user, setUser }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Profile state
  const [profile, setProfile] = useState({
    name: user?.name || 'Alex Rivera',
    email: user?.email || 'alex@example.com',
    bio: user?.bio || 'Full-stack engineer focused on AI product development.',
    targetRole: user?.targetRole || 'Staff AI Engineer',
    website: user?.website || 'https://alexrivera.dev',
    timezone: 'Asia/Kolkata',
    language: 'English',
  });

  // Learning prefs
  const [learningPrefs, setLearningPrefs] = useState({
    weeklyHours: user?.weeklyAvailabilityHours || 18,
    learningTimes: { morning: true, afternoon: false, evening: true, weekend: false },
    difficulty: 'Intermediate',
    aiCoaching: true,
    emailDigest: true,
  });

  // Notifications
  const [notifs, setNotifs] = useState({
    bookings: { email: true, inApp: true, push: false },
    expertReply: { email: true, inApp: true, push: true },
    courseCompletion: { email: true, inApp: true, push: false },
    agentUpdates: { email: false, inApp: true, push: false },
    communityAnswers: { email: true, inApp: true, push: false },
    weeklyReport: { email: true, inApp: false, push: false },
  });

  // Privacy
  const [privacy, setPrivacy] = useState({
    githubAccess: true,
    codeInspection: true,
    dataSharing: false,
  });

  const showToast = (msg) => setToast(msg);
  const handleSaveProfile = () => {
    setUser?.(prev => ({ ...prev, name: profile.name, email: profile.email }));
    showToast('Profile saved successfully ✓');
  };

  const toggleNotif = (key, channel) => {
    setNotifs(prev => ({
      ...prev,
      [key]: { ...prev[key], [channel]: !prev[key][channel] }
    }));
  };

  const NOTIF_ROWS = [
    { key: 'bookings', label: 'New session bookings' },
    { key: 'expertReply', label: 'Expert reply to question' },
    { key: 'courseCompletion', label: 'Course completion' },
    { key: 'agentUpdates', label: 'AI agent updates' },
    { key: 'communityAnswers', label: 'Community answers' },
    { key: 'weeklyReport', label: 'Weekly progress report' },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <p className="text-xs font-mono font-bold text-brand-teal uppercase tracking-widest mb-1">Account</p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Settings</h1>
        <p className="text-sm text-slate-400 mt-1">Manage your profile, preferences, and account</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">

        {/* Left tab nav */}
        <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible md:w-52 shrink-0">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                activeTab === id
                  ? 'bg-brand-teal/10 text-brand-teal border border-brand-teal/30'
                  : 'text-slate-400 hover:text-white hover:bg-bright-cardLight border border-transparent'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </button>
          ))}
        </div>

        {/* Right content */}
        <div className="flex-1 min-w-0">

          {/* ── Profile Tab ── */}
          {activeTab === 'profile' && (
            <div className="glass-bright rounded-2xl p-6 space-y-6">
              <h2 className="text-lg font-bold text-white">Profile Information</h2>

              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'}
                    alt="Avatar"
                    className="h-20 w-20 rounded-2xl object-cover border-2 border-brand-teal/40"
                  />
                  <button
                    className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-brand-teal text-black shadow-md hover:opacity-90 transition-opacity"
                    title="Change avatar"
                    aria-label="Change avatar"
                  >
                    <Camera className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{profile.name}</p>
                  <p className="text-xs text-brand-teal font-mono">{user?.plan || 'Free Tier'}</p>
                  <p className="text-xs text-slate-400 mt-1">Click camera icon to upload a new photo</p>
                </div>
              </div>

              {/* Form fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { label: 'Full Name', key: 'name', placeholder: 'Your full name' },
                  { label: 'Email', key: 'email', placeholder: 'you@example.com', type: 'email' },
                  { label: 'Target Role', key: 'targetRole', placeholder: 'e.g. Staff AI Engineer' },
                  { label: 'Website', key: 'website', placeholder: 'https://yoursite.com', type: 'url' },
                ].map(({ label, key, placeholder, type = 'text' }) => (
                  <div key={key} className="space-y-1.5">
                    <label htmlFor={`pf-${key}`} className="block text-xs font-semibold text-slate-300">{label}</label>
                    <input
                      id={`pf-${key}`}
                      type={type}
                      value={profile[key]}
                      onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full rounded-xl border border-bright-border bg-bright-bg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-brand-teal focus:outline-none focus:ring-1 focus:ring-brand-teal/30 transition-all"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="pf-bio" className="block text-xs font-semibold text-slate-300">Bio</label>
                <textarea
                  id="pf-bio"
                  rows={3}
                  value={profile.bio}
                  onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                  placeholder="Tell mentors and learners about yourself..."
                  className="w-full rounded-xl border border-bright-border bg-bright-bg px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-brand-teal focus:outline-none focus:ring-1 focus:ring-brand-teal/30 transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                {[
                  { label: 'Timezone', key: 'timezone', options: ['Asia/Kolkata', 'UTC', 'America/New_York', 'Europe/London'] },
                  { label: 'Language', key: 'language', options: ['English', 'Hindi', 'Tamil', 'Telugu'] },
                ].map(({ label, key, options }) => (
                  <div key={key} className="space-y-1.5">
                    <label htmlFor={`pf-${key}`} className="block text-xs font-semibold text-slate-300">{label}</label>
                    <select
                      id={`pf-${key}`}
                      value={profile[key]}
                      onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))}
                      className="w-full rounded-xl border border-bright-border bg-bright-bg px-4 py-2.5 text-sm text-white focus:border-brand-teal focus:outline-none focus:ring-1 focus:ring-brand-teal/30 transition-all"
                    >
                      {options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSaveProfile}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-teal to-brand-cyan px-6 py-2.5 text-sm font-bold text-black hover:opacity-90 transition-all shadow-lg shadow-brand-teal/20"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* ── Learning Tab ── */}
          {activeTab === 'learning' && (
            <div className="glass-bright rounded-2xl p-6 space-y-6">
              <h2 className="text-lg font-bold text-white">Learning Preferences</h2>

              {/* Weekly hours slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label htmlFor="weekly-hours" className="text-sm font-semibold text-slate-200">Weekly Learning Goal</label>
                  <span className="font-mono font-black text-brand-teal text-lg">{learningPrefs.weeklyHours} hrs</span>
                </div>
                <input
                  id="weekly-hours"
                  type="range"
                  min="5"
                  max="40"
                  step="1"
                  value={learningPrefs.weeklyHours}
                  onChange={e => setLearningPrefs(p => ({ ...p, weeklyHours: +e.target.value }))}
                  className="w-full h-2 rounded-full accent-brand-teal bg-bright-bg border border-bright-border"
                />
                <div className="flex justify-between text-xs font-mono text-slate-500">
                  <span>5 hrs</span><span>40 hrs</span>
                </div>
              </div>

              {/* Learning time */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-200">Preferred Learning Times</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Object.entries(learningPrefs.learningTimes).map(([time, active]) => (
                    <button
                      key={time}
                      onClick={() => setLearningPrefs(p => ({ ...p, learningTimes: { ...p.learningTimes, [time]: !p.learningTimes[time] } }))}
                      aria-pressed={active}
                      className={`rounded-xl border px-4 py-3 text-sm font-semibold capitalize transition-all ${
                        active
                          ? 'border-brand-teal bg-brand-teal/10 text-brand-teal'
                          : 'border-bright-border text-slate-400 hover:border-slate-600 hover:text-white'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-200">Preferred Difficulty</label>
                <div className="flex gap-3">
                  {['Beginner', 'Intermediate', 'Advanced'].map(level => (
                    <label key={level} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="difficulty"
                        value={level}
                        checked={learningPrefs.difficulty === level}
                        onChange={() => setLearningPrefs(p => ({ ...p, difficulty: level }))}
                        className="accent-brand-teal h-4 w-4"
                      />
                      <span className="text-sm text-slate-300">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-4 border-t border-bright-border pt-4">
                {[
                  { key: 'aiCoaching', label: 'AI Coaching', desc: 'Let Gemini AI proactively coach and guide your learning path' },
                  { key: 'emailDigest', label: 'Weekly Email Digest', desc: 'Receive a curated weekly summary of your progress' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-white">{label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                    </div>
                    <Toggle
                      id={`lp-${key}`}
                      checked={learningPrefs[key]}
                      onChange={v => setLearningPrefs(p => ({ ...p, [key]: v }))}
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => showToast('Learning preferences saved ✓')}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-teal to-brand-cyan px-6 py-2.5 text-sm font-bold text-black hover:opacity-90 transition-all shadow-lg shadow-brand-teal/20"
                >
                  <Save className="h-4 w-4" />
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* ── Notifications Tab ── */}
          {activeTab === 'notifications' && (
            <div className="glass-bright rounded-2xl p-6 space-y-6">
              <h2 className="text-lg font-bold text-white">Notification Settings</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-bright-border">
                      <th className="pb-3 text-left text-xs font-mono text-slate-400 uppercase">Notification</th>
                      {['Email', 'In-App', 'Push'].map(c => (
                        <th key={c} className="pb-3 text-center text-xs font-mono text-slate-400 uppercase w-24">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-bright-border">
                    {NOTIF_ROWS.map(({ key, label }) => (
                      <tr key={key}>
                        <td className="py-4 text-slate-300 font-medium">{label}</td>
                        {['email', 'inApp', 'push'].map(channel => (
                          <td key={channel} className="py-4 text-center">
                            <div className="flex justify-center">
                              <Toggle
                                id={`notif-${key}-${channel}`}
                                checked={notifs[key][channel]}
                                onChange={() => toggleNotif(key, channel)}
                              />
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => showToast('Notification preferences saved ✓')}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-teal to-brand-cyan px-6 py-2.5 text-sm font-bold text-black hover:opacity-90 transition-all"
                >
                  <Save className="h-4 w-4" />
                  Save
                </button>
              </div>
            </div>
          )}

          {/* ── Privacy Tab ── */}
          {activeTab === 'privacy' && (
            <div className="glass-bright rounded-2xl p-6 space-y-6">
              <h2 className="text-lg font-bold text-white">Privacy & Data</h2>
              <div className="space-y-5 border-b border-bright-border pb-6">
                {[
                  { key: 'githubAccess', label: 'GitHub Repository Access', desc: 'Allow Gemini AI to scan your public repos for skill analysis and project suggestions' },
                  { key: 'codeInspection', label: 'Code Inspection Mode', desc: 'Let AI analyze your code for quality feedback and mentorship recommendations' },
                  { key: 'dataSharing', label: 'Anonymous Data Sharing', desc: 'Share anonymized learning patterns to improve platform recommendations' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-white">{label}</p>
                      <p className="text-xs text-slate-400 mt-0.5 max-w-md leading-relaxed">{desc}</p>
                    </div>
                    <Toggle
                      id={`priv-${key}`}
                      checked={privacy[key]}
                      onChange={v => setPrivacy(p => ({ ...p, [key]: v }))}
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => showToast('Data export started. You will receive an email shortly.')}
                  className="flex items-center gap-2 rounded-xl border border-bright-border bg-bright-bg px-5 py-2.5 text-sm font-semibold text-slate-300 hover:text-white hover:border-slate-600 transition-all"
                >
                  <Download className="h-4 w-4" />
                  Download My Data
                </button>

                <div>
                  {!confirmDelete ? (
                    <button
                      onClick={() => setConfirmDelete(true)}
                      className="flex items-center gap-2 rounded-xl border border-brand-coral/30 bg-brand-coral/5 px-5 py-2.5 text-sm font-semibold text-brand-coral hover:bg-brand-coral/10 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Account
                    </button>
                  ) : (
                    <div className="rounded-xl border border-brand-coral/40 bg-brand-coral/5 p-4 space-y-3">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-brand-coral shrink-0 mt-0.5" />
                        <p className="text-sm text-brand-coral font-medium">Are you sure? This action is permanent and cannot be undone.</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { showToast('Account deletion request sent.'); setConfirmDelete(false); }}
                          className="rounded-lg border border-brand-coral bg-brand-coral px-4 py-1.5 text-xs font-bold text-white hover:opacity-90 transition-all"
                        >
                          Yes, Delete My Account
                        </button>
                        <button
                          onClick={() => setConfirmDelete(false)}
                          className="rounded-lg border border-bright-border px-4 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Billing Tab ── */}
          {activeTab === 'billing' && (
            <div className="glass-bright rounded-2xl p-6 space-y-6">
              <h2 className="text-lg font-bold text-white">Billing & Subscription</h2>

              {/* Current Plan */}
              <div className="rounded-2xl border border-brand-teal/30 bg-brand-teal/5 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-mono text-brand-teal uppercase tracking-wide font-bold mb-1">Current Plan</p>
                    <p className="text-xl font-black text-white">Pro Tier</p>
                    <p className="text-sm text-slate-300 font-mono mt-0.5">₹999 / month</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-teal/20 border border-brand-teal/30">
                    <Zap className="h-6 w-6 text-brand-teal" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl bg-bright-bg border border-bright-border p-3">
                    <p className="text-slate-400 font-mono">Next billing</p>
                    <p className="font-bold text-white mt-1">Sep 3, 2026</p>
                  </div>
                  <div className="rounded-xl bg-bright-bg border border-bright-border p-3">
                    <p className="text-slate-400 font-mono">Status</p>
                    <p className="font-bold text-brand-teal mt-1">Active ✓</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => showToast('Redirecting to upgrade options...')}
                    className="flex-1 rounded-xl bg-bright-card border border-brand-teal/30 py-2.5 text-xs font-bold text-brand-teal hover:bg-brand-teal/10 transition-all"
                  >
                    Upgrade to Enterprise
                  </button>
                  <button
                    onClick={() => showToast('Downgrade confirmation sent to your email.')}
                    className="flex-1 rounded-xl border border-bright-border py-2.5 text-xs font-semibold text-slate-400 hover:text-white hover:border-slate-600 transition-all"
                  >
                    Downgrade Plan
                  </button>
                </div>
              </div>

              {/* Usage */}
              <div className="space-y-4">
                <p className="text-sm font-bold text-white">This Month's Usage</p>
                {[
                  { label: 'AI Coach Messages', used: 184, max: 500, color: 'from-brand-indigo to-brand-violet' },
                  { label: 'Expert Sessions', used: 3, max: 5, color: 'from-brand-amber to-brand-coral' },
                  { label: 'Portfolio Verifications', used: 1, max: 3, color: 'from-brand-teal to-brand-cyan' },
                ].map(({ label, used, max, color }) => (
                  <div key={label} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">{label}</span>
                      <span className="font-mono text-white font-bold">{used} / {max}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-bright-bg border border-bright-border overflow-hidden">
                      <div className={`h-full rounded-full bg-gradient-to-r ${color}`} style={{ width: `${(used / max) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment method */}
              <div className="rounded-xl border border-bright-border bg-bright-bg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-12 rounded bg-gradient-to-r from-blue-600 to-blue-500 flex items-center justify-center text-[10px] font-black text-white">VISA</div>
                  <div>
                    <p className="text-sm font-bold text-white">•••• •••• •••• 4242</p>
                    <p className="text-xs text-slate-400 font-mono">Expires 08/28</p>
                  </div>
                </div>
                <button
                  onClick={() => showToast('Redirecting to Razorpay payment management...')}
                  className="text-xs text-brand-teal font-semibold hover:text-brand-cyan transition-colors"
                >
                  Update
                </button>
              </div>

              <div className="flex items-start gap-2 text-xs text-slate-400 bg-bright-bg rounded-xl border border-bright-border p-3">
                <Info className="h-3.5 w-3.5 text-slate-500 mt-0.5 shrink-0" />
                <p>All payments are processed securely via Razorpay. We never store card details on our servers.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
