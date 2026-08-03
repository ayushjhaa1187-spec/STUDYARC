import React, { useState } from 'react';
import {
  BarChart2, Users, BookOpen, Calendar, TrendingUp, TrendingDown,
  Zap, ShieldCheck, DollarSign, Activity, Bot, CheckCircle2
} from 'lucide-react';
import { ADMIN_STATS } from '../data/mockData';

const EVENT_COLORS = {
  plan: { bg: 'bg-brand-indigo/10 text-brand-indigo border-brand-indigo/30', label: 'Plan' },
  match: { bg: 'bg-brand-teal/10 text-brand-teal border-brand-teal/30', label: 'Match' },
  verify: { bg: 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/30', label: 'Verify' },
  booking: { bg: 'bg-brand-amber/10 text-brand-amber border-brand-amber/30', label: 'Book' },
  complete: { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', label: 'Complete' },
  alert: { bg: 'bg-brand-coral/10 text-brand-coral border-brand-coral/30', label: 'Alert' },
};

const MONTH_LABELS = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

export default function AdminDashboard({ setActivePage }) {
  const stats = ADMIN_STATS || {};
  const metrics = stats.metrics || {};
  const revenue = stats.revenue || {};
  const users = stats.users || {};
  const experts = stats.experts || {};
  const bookings = stats.bookings || {};
  const agentEvents = stats.agentEvents || [];

  const monthlyTrend = revenue.monthlyTrend || [180000, 210000, 240000, 290000, 310000, 360000];
  const maxRevenue = Math.max(...monthlyTrend);

  const topMetrics = [
    { label: 'Total Users', value: (metrics.totalUsers || 0).toLocaleString(), growth: metrics.growth?.users, icon: Users, color: 'text-brand-teal', bg: 'bg-brand-teal/10', border: 'border-brand-teal/20' },
    { label: 'Active Experts', value: (metrics.totalExperts || 0).toLocaleString(), growth: metrics.growth?.experts, icon: ShieldCheck, color: 'text-brand-cyan', bg: 'bg-brand-cyan/10', border: 'border-brand-cyan/20' },
    { label: 'Courses', value: (metrics.totalCourses || 0).toLocaleString(), growth: metrics.growth?.courses, icon: BookOpen, color: 'text-brand-indigo', bg: 'bg-brand-indigo/10', border: 'border-brand-indigo/20' },
    { label: 'Bookings', value: (metrics.totalBookings || 0).toLocaleString(), growth: metrics.growth?.bookings, icon: Calendar, color: 'text-brand-amber', bg: 'bg-brand-amber/10', border: 'border-brand-amber/20' },
    { label: 'MRR', value: `₹${((revenue.mrr || 360000) / 1000).toFixed(0)}K`, growth: metrics.growth?.revenue, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  ];

  return (
    <div className="space-y-6 pb-16">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-mono font-bold text-brand-coral uppercase tracking-widest mb-1">Admin Panel</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Platform Analytics</h1>
          <p className="text-sm text-slate-400 mt-1">Real-time overview of SkillBridge Pro metrics</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-bright-border bg-bright-card px-4 py-2 text-xs font-mono text-slate-300">
          <Activity className="h-3.5 w-3.5 text-brand-coral animate-pulse" />
          <span>Last 30 days</span>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {topMetrics.map(({ label, value, growth, icon: Icon, color, bg, border }) => (
          <div key={label} className={`glass-bright p-4 rounded-2xl border ${border} space-y-3`}>
            <div className="flex items-center justify-between">
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${bg}`}>
                <Icon className={`h-4.5 w-4.5 ${color}`} />
              </div>
              {growth !== undefined && (
                <div className={`flex items-center gap-0.5 text-[10px] font-bold font-mono ${growth >= 0 ? 'text-brand-teal' : 'text-brand-coral'}`}>
                  {growth >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {Math.abs(growth)}%
                </div>
              )}
            </div>
            <div>
              <p className="stat-number text-2xl text-white">{value}</p>
              <p className="text-[10px] text-slate-500 font-mono uppercase mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Bar Chart */}
        <div className="glass-bright p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-slate-400 uppercase tracking-wide">Monthly Revenue</p>
              <p className="text-xl font-black text-white mt-1">₹{((revenue.mrr || 360000) / 1000).toFixed(0)}K <span className="text-sm text-brand-teal font-mono">MRR</span></p>
            </div>
            <BarChart2 className="h-8 w-8 text-brand-teal/30" />
          </div>
          <div className="flex items-end gap-2 h-32 pt-2">
            {monthlyTrend.map((value, i) => {
              const heightPct = Math.round((value / maxRevenue) * 100);
              const isLast = i === monthlyTrend.length - 1;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-[9px] font-mono text-slate-400">₹{(value/1000).toFixed(0)}K</span>
                  <div className="w-full flex flex-col justify-end" style={{ height: '80px' }}>
                    <div
                      className={`w-full rounded-t-md transition-all duration-500 ${isLast ? 'bg-gradient-to-t from-brand-teal to-brand-cyan' : 'bg-bright-card border border-bright-border hover:bg-brand-teal/20'}`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[9px] font-mono text-slate-500">{MONTH_LABELS[i]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="glass-bright p-6 space-y-4">
          <p className="text-xs font-mono text-slate-400 uppercase tracking-wide">Revenue Breakdown</p>
          {/* CSS conic-gradient pie */}
          <div className="flex items-center gap-6">
            <div className="relative h-24 w-24 shrink-0">
              <div
                className="h-full w-full rounded-full"
                style={{
                  background: `conic-gradient(
                    #35C7B8 0% 55%,
                    #F2A93B 55% 75%,
                    #7C8CF0 75% 87%,
                    #E2705C 87% 100%
                  )`
                }}
              />
              <div className="absolute inset-3 rounded-full bg-bright-bg" />
            </div>
            <div className="space-y-2 flex-1">
              {[
                { label: 'Course Fees', pct: 55, color: 'bg-brand-teal' },
                { label: 'Expert Sessions', pct: 20, color: 'bg-brand-amber' },
                { label: 'Subscriptions', pct: 12, color: 'bg-brand-indigo' },
                { label: 'Certifications', pct: 13, color: 'bg-brand-coral' },
              ].map(({ label, pct, color }) => (
                <div key={label} className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${color}`} />
                    <span className="text-slate-300">{label}</span>
                  </div>
                  <span className="font-mono font-bold text-white">{pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3-Column Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Users */}
        <div className="glass-bright p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-brand-teal" />
            <p className="text-sm font-bold text-white">Users</p>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Learners', value: users.byRole?.learners || 11240, color: 'text-brand-teal' },
              { label: 'Mentors', value: users.byRole?.mentors || 89, color: 'text-brand-amber' },
              { label: 'Admins', value: users.byRole?.admins || 4, color: 'text-brand-indigo' },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-mono">{label}</span>
                <span className={`font-black font-mono text-sm ${color}`}>{value.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-bright-border space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">New this month</span>
              <span className="text-brand-teal font-mono font-bold">+{users.newThisMonth || 342}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Pending verification</span>
              <span className="text-brand-amber font-mono font-bold">{users.pendingVerification || 23}</span>
            </div>
          </div>
        </div>

        {/* Experts */}
        <div className="glass-bright p-5 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-brand-cyan" />
            <p className="text-sm font-bold text-white">Experts</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-mono">Approved</span>
              <span className="font-black font-mono text-brand-cyan">{experts.approved || 74}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-mono">Pending Review</span>
              <span className="font-black font-mono text-brand-amber">{experts.pending || 15}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-mono">Avg Rating</span>
              <span className="font-black font-mono text-white">★ {experts.avgRating || '4.87'}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-mono">Top Category</span>
              <span className="font-black font-mono text-brand-teal">{experts.topCategory || 'AI & ML'}</span>
            </div>
          </div>
          <div className="pt-3 border-t border-bright-border text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Total sessions</span>
              <span className="font-mono font-bold text-white">{(experts.totalSessions || 2847).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Bookings */}
        <div className="glass-bright p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-brand-amber" />
            <p className="text-sm font-bold text-white">Bookings</p>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400 font-mono">Confirmed</span>
              <span className="font-black font-mono text-brand-teal">{bookings.confirmed || 312}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-mono">Completed</span>
              <span className="font-black font-mono text-white">{bookings.completed || 2847}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-mono">Cancelled</span>
              <span className="font-black font-mono text-brand-coral">{bookings.cancelled || 89}</span>
            </div>
          </div>
          <div className="pt-3 border-t border-bright-border space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Completion Rate</span>
              <span className="text-brand-teal font-bold">{bookings.completionRate || 97}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-bright-bg overflow-hidden">
              <div className="h-full bg-gradient-to-r from-brand-teal to-brand-cyan" style={{ width: `${bookings.completionRate || 97}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Agent Events Log */}
      <div className="glass-bright rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-bright-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-indigo/10 border border-brand-indigo/30">
              <Bot className="h-4 w-4 text-brand-indigo" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Agent Events Log</p>
              <p className="text-[11px] text-slate-400 font-mono">{agentEvents.length} recent agent decisions</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 text-[10px] text-brand-indigo font-mono bg-brand-indigo/10 px-2.5 py-1 rounded-full border border-brand-indigo/20">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-indigo animate-ping" />
            Live
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-bright-border">
                {['Type', 'User', 'Event', 'Time'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {agentEvents.map((event, i) => {
                const style = EVENT_COLORS[event.type] || EVENT_COLORS.plan;
                return (
                  <tr
                    key={event.id || i}
                    className={`border-b border-bright-border transition-colors hover:bg-bright-cardLight ${i % 2 === 0 ? 'bg-transparent' : 'bg-bright-bg/50'}`}
                  >
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-mono font-bold ${style.bg}`}>
                        {style.label}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-slate-300 font-medium">{event.user || 'System'}</td>
                    <td className="px-5 py-3 text-slate-400">{event.detail}</td>
                    <td className="px-5 py-3 font-mono text-slate-500">{event.time}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
