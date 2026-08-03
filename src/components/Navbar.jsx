import React, { useState, useRef, useEffect } from 'react';
import {
  Search, Bell, ShoppingCart, ChevronDown, Zap, Sparkles,
  BookOpen, Users, Map, MessageSquare, BarChart2, Wifi, WifiOff,
  LogOut, Settings, User, Shield, Menu, X
} from 'lucide-react';

export default function Navbar({
  activePage,
  setActivePage,
  openDiagnostic,
  user,
  simulatedSlow,
  setSimulatedSlow,
  cartCount,
  openCart,
}) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const notifRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setIsUserMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setIsNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const NOTIFICATIONS = [
    { id: 1, text: 'Dr. Alex Chen confirmed your session for today 5:30 PM', time: '5m ago', unread: true },
    { id: 2, text: 'Your RAG Pipeline project passed AI verification ✓', time: '1h ago', unread: true },
    { id: 3, text: 'New answer on your LangChain question in Community', time: '3h ago', unread: false },
  ];

  const unreadCount = NOTIFICATIONS.filter(n => n.unread).length;

  const navLinks = [
    { label: 'Catalog', page: '/catalog', icon: BookOpen },
    { label: 'Journeys', page: '/journeys', icon: Map },
    { label: 'Experts', page: '/experts', icon: Users },
    { label: 'Community', page: '/community', icon: MessageSquare },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-bright-border bg-bright-bg/80 backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">

        {/* Left: Logo + nav links */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <button
            onClick={() => setActivePage('/')}
            className="flex items-center gap-2 shrink-0"
            aria-label="Go to home"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-teal to-brand-cyan shadow-[0_0_16px_rgba(6,214,160,0.4)]">
              <Zap className="h-4 w-4 text-black" />
            </div>
            <span className="hidden sm:block text-sm font-bold text-white font-heading">
              SkillBridge <span className="text-brand-teal">Pro</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map(({ label, page, icon: Icon }) => (
              <button
                key={page}
                onClick={() => setActivePage(page)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  activePage === page
                    ? 'bg-brand-teal/10 text-brand-teal border border-brand-teal/30'
                    : 'text-slate-400 hover:text-white hover:bg-bright-cardLight'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Center: Search */}
        <div className="hidden lg:flex flex-1 max-w-sm mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses, experts, topics..."
              className="w-full rounded-xl border border-bright-border bg-bright-card pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:border-brand-teal focus:outline-none focus:ring-1 focus:ring-brand-teal/50 transition-all"
              aria-label="Search"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">

          {/* AI Diagnostic button */}
          <button
            onClick={openDiagnostic}
            className="hidden sm:flex items-center gap-1.5 rounded-xl bg-bright-cardLight border border-brand-teal/30 px-3 py-1.5 text-xs font-semibold text-brand-teal hover:bg-brand-teal/10 transition-all"
            aria-label="Run AI diagnostic"
          >
            <Sparkles className="h-3.5 w-3.5 text-brand-amber" />
            <span>AI Coach</span>
          </button>

          {/* Network toggle (dev helper) */}
          <button
            onClick={() => setSimulatedSlow(!simulatedSlow)}
            className="hidden sm:flex items-center justify-center h-8 w-8 rounded-lg border border-bright-border bg-bright-card text-slate-400 hover:text-white hover:border-slate-600 transition-all"
            title={simulatedSlow ? 'Disable slow network simulation' : 'Simulate slow network'}
            aria-label="Toggle network speed simulation"
          >
            {simulatedSlow ? <WifiOff className="h-3.5 w-3.5 text-brand-coral" /> : <Wifi className="h-3.5 w-3.5" />}
          </button>

          {/* Cart */}
          <button
            onClick={openCart}
            className="relative flex items-center justify-center h-8 w-8 rounded-lg border border-bright-border bg-bright-card text-slate-400 hover:text-white transition-all"
            aria-label={`Cart (${cartCount} items)`}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-coral text-[9px] font-black text-white">
                {cartCount}
              </span>
            )}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(prev => !prev)}
              className="relative flex items-center justify-center h-8 w-8 rounded-lg border border-bright-border bg-bright-card text-slate-400 hover:text-white transition-all"
              aria-label={`Notifications (${unreadCount} unread)`}
              aria-expanded={isNotifOpen}
            >
              <Bell className="h-3.5 w-3.5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-indigo text-[9px] font-black text-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-bright-border bg-bright-surface shadow-2xl shadow-black/50 overflow-hidden z-50">
                <div className="flex items-center justify-between p-4 border-b border-bright-border">
                  <span className="text-sm font-bold text-white">Notifications</span>
                  <span className="text-[10px] font-mono text-brand-teal">{unreadCount} new</span>
                </div>
                <div className="divide-y divide-bright-border">
                  {NOTIFICATIONS.map(n => (
                    <div key={n.id} className={`p-3 text-xs ${n.unread ? 'bg-bright-cardLight' : ''}`}>
                      <p className={`leading-relaxed ${n.unread ? 'text-white font-medium' : 'text-slate-400'}`}>
                        {n.text}
                      </p>
                      <p className="text-slate-500 font-mono mt-1">{n.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t border-bright-border">
                  <button className="w-full text-center text-xs text-brand-teal font-semibold py-1 hover:text-brand-cyan transition-colors">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User avatar menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(prev => !prev)}
              className="flex items-center gap-2 rounded-xl border border-bright-border bg-bright-card px-2 py-1 hover:border-brand-teal/40 transition-all"
              aria-label="User menu"
              aria-expanded={isUserMenuOpen}
            >
              <img
                src={user?.avatar}
                alt={user?.name}
                className="h-6 w-6 rounded-lg object-cover"
              />
              <span className="hidden sm:block text-xs font-semibold text-white max-w-20 truncate">
                {user?.name?.split(' ')[0]}
              </span>
              <ChevronDown className={`hidden sm:block h-3 w-3 text-slate-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-bright-border bg-bright-surface shadow-2xl shadow-black/50 overflow-hidden z-50">
                {/* User info */}
                <div className="p-4 border-b border-bright-border">
                  <p className="text-sm font-bold text-white">{user?.name}</p>
                  <p className="text-xs text-brand-teal font-mono mt-0.5">{user?.title}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-[10px] font-mono bg-bright-bg border border-bright-border text-slate-400 px-2 py-0.5 rounded">
                      {user?.plan || 'Free Tier'}
                    </span>
                    {user?.role === 'admin' && (
                      <span className="text-[10px] font-mono bg-brand-coral/10 border border-brand-coral/30 text-brand-coral px-2 py-0.5 rounded">Admin</span>
                    )}
                  </div>
                </div>

                {/* Menu items */}
                <div className="p-1">
                  {[
                    { icon: User, label: 'My Portfolio', page: '/portfolio' },
                    { icon: BarChart2, label: 'Dashboard', page: '/dashboard' },
                    { icon: Settings, label: 'Settings', page: '/settings' },
                    ...(user?.role === 'admin' ? [{ icon: Shield, label: 'Admin Panel', page: '/admin' }] : []),
                  ].map(({ icon: Icon, label, page }) => (
                    <button
                      key={page}
                      onClick={() => { setActivePage(page); setIsUserMenuOpen(false); }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-slate-300 hover:bg-bright-cardLight hover:text-white transition-all"
                    >
                      <Icon className="h-3.5 w-3.5 text-slate-500" />
                      {label}
                    </button>
                  ))}
                </div>

                <div className="p-1 border-t border-bright-border">
                  <button
                    onClick={() => { setActivePage('/login'); setIsUserMenuOpen(false); }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-brand-coral hover:bg-brand-coral/10 transition-all"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden flex items-center justify-center h-8 w-8 rounded-lg border border-bright-border bg-bright-card text-slate-400 hover:text-white transition-all"
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-bright-border bg-bright-surface px-4 py-3 space-y-1">
          {navLinks.map(({ label, page, icon: Icon }) => (
            <button
              key={page}
              onClick={() => { setActivePage(page); setIsMobileMenuOpen(false); }}
              className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                activePage === page
                  ? 'bg-brand-teal/10 text-brand-teal border border-brand-teal/30'
                  : 'text-slate-400 hover:text-white hover:bg-bright-cardLight'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
          <button
            onClick={() => { openDiagnostic(); setIsMobileMenuOpen(false); }}
            className="flex w-full items-center gap-2 rounded-xl bg-brand-teal/10 border border-brand-teal/30 px-3 py-2.5 text-sm font-semibold text-brand-teal"
          >
            <Sparkles className="h-4 w-4 text-brand-amber" />
            AI Diagnostic
          </button>
        </div>
      )}
    </header>
  );
}
