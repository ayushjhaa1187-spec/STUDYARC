import React from 'react';
import { 
  LayoutDashboard, 
  Compass, 
  CheckSquare, 
  Users, 
  Briefcase, 
  MessageSquareCode, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Sparkles,
  LogIn
} from 'lucide-react';

export default function Sidebar({ activePage, setActivePage, isCollapsed, setIsCollapsed, openDiagnostic }) {
  const navItems = [
    { id: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: '/journeys', label: 'Journeys', icon: Compass },
    { id: '/courses', label: 'Courses', icon: Zap },
    { id: '/challenges', label: 'Challenges', icon: CheckSquare },
    { id: '/mentors', label: 'Mentors', icon: Users },
    { id: '/portfolio', label: 'Portfolio', icon: Briefcase },
    { id: '/community', label: 'Community', icon: MessageSquareCode },
    { id: '/settings', label: 'Settings', icon: Settings },
    { id: '/admin', label: 'Admin Panel', icon: ShieldCheck },
    { id: '/login', label: 'Sign In / Account', icon: LogIn },
  ];

  return (
    <aside
      className={`fixed top-16 left-0 z-30 h-[calc(100vh-4rem)] border-r border-slate-700/80 bg-[#1e293b]/95 backdrop-blur-xl transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex h-full flex-col justify-between p-3">
        {/* Nav list */}
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`group flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/25 to-teal-500/15 text-emerald-300 border border-emerald-400/50 shadow-md shadow-emerald-500/15'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                {!isCollapsed && <span className="ml-3 truncate">{item.label}</span>}
                {isActive && !isCollapsed && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-emerald-400 shadow-glow"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Callout / Collapse button */}
        <div className="space-y-3">
          {!isCollapsed && (
            <div className="rounded-xl border border-emerald-400/40 bg-gradient-to-b from-slate-900 to-emerald-950/40 p-3.5 shadow-md">
              <div className="flex items-center space-x-2 text-emerald-300 text-xs font-bold">
                <Sparkles className="h-4 w-4" />
                <span>AI Execution Engine</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-300 leading-snug">
                Dynamically update your career score based on verified project proof.
              </p>
              <button
                onClick={openDiagnostic}
                className="mt-2.5 w-full rounded-lg bg-emerald-400 text-black py-1.5 text-xs font-extrabold hover:bg-emerald-300 transition shadow-sm"
              >
                Run AI Diagnostic
              </button>
            </div>
          )}

          {/* Toggle button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex w-full items-center justify-center rounded-xl border border-slate-700 bg-slate-900/90 py-2 text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </aside>
  );
}
