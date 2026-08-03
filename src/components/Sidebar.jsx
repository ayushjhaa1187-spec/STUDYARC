import React from 'react';
import {
  LayoutDashboard, BookOpen, Map, Users, Briefcase, FolderOpen,
  MessageSquare, Settings, ChevronLeft, ChevronRight, Zap,
  BarChart2, Target, Sparkles, Layers, Shield, Bot
} from 'lucide-react';

export default function Sidebar({
  activePage,
  setActivePage,
  isCollapsed,
  setIsCollapsed,
  openDiagnostic,
  userRole = 'learner',
}) {
  const learnerNav = [
    { section: 'Learn', items: [
      { icon: LayoutDashboard, label: 'Dashboard', page: '/dashboard' },
      { icon: BookOpen, label: 'Catalog', page: '/catalog' },
      { icon: Map, label: 'Journeys', page: '/journeys' },
      { icon: Layers, label: 'My Courses', page: '/courses' },
      { icon: Target, label: 'Sprint Workspace', page: '/challenges' },
    ]},
    { section: 'Connect', items: [
      { icon: Users, label: 'Experts', page: '/experts' },
      { icon: MessageSquare, label: 'Community', page: '/community' },
    ]},
    { section: 'Profile', items: [
      { icon: FolderOpen, label: 'Portfolio', page: '/portfolio' },
      { icon: Settings, label: 'Settings', page: '/settings' },
    ]},
  ];

  const mentorNav = [
    { section: 'Mentor', items: [
      { icon: LayoutDashboard, label: 'Dashboard', page: '/dashboard' },
      { icon: Users, label: 'My Sessions', page: '/experts' },
      { icon: FolderOpen, label: 'Portfolio', page: '/portfolio' },
      { icon: MessageSquare, label: 'Community', page: '/community' },
      { icon: Settings, label: 'Settings', page: '/settings' },
    ]},
  ];

  const adminNav = [
    { section: 'Admin', items: [
      { icon: BarChart2, label: 'Admin Panel', page: '/admin' },
      { icon: LayoutDashboard, label: 'Dashboard', page: '/dashboard' },
      { icon: Users, label: 'Experts', page: '/experts' },
      { icon: BookOpen, label: 'Catalog', page: '/catalog' },
      { icon: MessageSquare, label: 'Community', page: '/community' },
      { icon: Settings, label: 'Settings', page: '/settings' },
    ]},
  ];

  const navGroups = userRole === 'admin' ? adminNav : userRole === 'mentor' ? mentorNav : learnerNav;

  return (
    <aside
      className={`fixed top-14 left-0 h-[calc(100vh-3.5rem)] z-20 flex flex-col border-r border-bright-border bg-bright-bg transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      } hidden md:flex`}
      aria-label="Sidebar navigation"
    >
      {/* Collapse toggle */}
      <button
        onClick={() => setIsCollapsed(prev => !prev)}
        className="absolute -right-3 top-6 flex h-6 w-6 items-center justify-center rounded-full border border-bright-border bg-bright-surface text-slate-400 hover:text-white hover:border-brand-teal/50 transition-all z-10 shadow-md"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>

      {/* Nav content (scrollable) */}
      <div className="flex-1 overflow-y-auto scrollbar-none py-4 px-2 space-y-1">
        {navGroups.map(({ section, items }) => (
          <div key={section} className="space-y-0.5">
            {/* Section label */}
            {!isCollapsed && (
              <p className="px-3 pt-3 pb-1 text-[9px] font-black uppercase tracking-widest text-slate-600 font-mono">
                {section}
              </p>
            )}
            {isCollapsed && <div className="my-2 mx-auto w-6 border-t border-bright-border" />}

            {items.map(({ icon: Icon, label, page }) => {
              const isActive = activePage === page ||
                (page === '/catalog' && activePage === '/course') ||
                (page === '/catalog' && activePage === '/learn') ||
                (page === '/experts' && activePage === '/expert-profile') ||
                (page === '/experts' && activePage === '/booking');

              return (
                <button
                  key={page}
                  onClick={() => setActivePage(page)}
                  title={isCollapsed ? label : undefined}
                  aria-label={label}
                  aria-current={isActive ? 'page' : undefined}
                  className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-teal/10 text-brand-teal border border-brand-teal/30 shadow-[0_0_12px_rgba(6,214,160,0.08)]'
                      : 'text-slate-400 hover:text-white hover:bg-bright-cardLight'
                  } ${isCollapsed ? 'justify-center px-0' : ''}`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-brand-teal' : 'text-slate-500 group-hover:text-slate-300'}`} />
                  {!isCollapsed && <span className="truncate">{label}</span>}
                  {isActive && !isCollapsed && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-teal" />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom: AI Diagnostic CTA */}
      <div className={`p-3 border-t border-bright-border ${isCollapsed ? '' : ''}`}>
        <button
          onClick={openDiagnostic}
          className={`group flex w-full items-center gap-2 rounded-xl bg-gradient-to-r from-brand-teal/10 to-brand-indigo/10 border border-brand-teal/20 p-3 text-xs font-semibold text-brand-teal hover:from-brand-teal/20 hover:to-brand-indigo/20 hover:border-brand-teal/40 transition-all ${
            isCollapsed ? 'justify-center' : ''
          }`}
          aria-label="Run AI career diagnostic"
          title={isCollapsed ? 'AI Career Diagnostic' : undefined}
        >
          <Bot className="h-4 w-4 text-brand-teal shrink-0 group-hover:animate-pulse" />
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="font-bold text-white text-[11px] leading-tight">AI Diagnostic</p>
              <p className="text-[10px] text-slate-400 font-normal">Re-analyze your career gaps</p>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
