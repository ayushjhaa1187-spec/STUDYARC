import React from 'react';
import { 
  Users, 
  DollarSign, 
  CalendarCheck, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle,
  Activity
} from 'lucide-react';

export default function AdminDashboard() {
  const metrics = [
    { title: 'Total Revenue', value: '₹42,500', trend: '+12.5%', icon: DollarSign, color: 'text-brand-teal' },
    { title: 'Active Experts', value: '24', trend: '+4', icon: ShieldCheck, color: 'text-brand-cyan' },
    { title: 'Sessions Booked', value: '156', trend: '+28%', icon: CalendarCheck, color: 'text-brand-amber' },
    { title: 'Platform Users', value: '1,204', trend: '+15%', icon: Users, color: 'text-brand-indigo' }
  ];

  const pendingPayouts = [
    { id: '1', expert: 'Dr. Sarah Chen', amount: '₹12,000', status: 'Pending Processing', date: 'Aug 2, 2026' },
    { id: '2', expert: 'Rajesh Kumar', amount: '₹8,500', status: 'Pending Processing', date: 'Aug 1, 2026' },
    { id: '3', expert: 'Elena Rodriguez', amount: '₹4,200', status: 'Cleared', date: 'Jul 30, 2026' },
  ];

  const expertApprovals = [
    { id: '1', name: 'James Wilson', role: 'Staff Engineer', company: 'Netflix', status: 'Pending Review' },
    { id: '2', name: 'Priya Patel', role: 'Data Scientist', company: 'Airbnb', status: 'Pending Review' },
  ];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-brand-teal uppercase font-bold tracking-widest">
          <Activity className="h-4 w-4" />
          <span>Platform Administration</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">Admin Dashboard</h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Monitor marketplace liquidity, expert approvals, and financial payouts.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div key={idx} className="glass-bright p-6 rounded-2xl border border-bright-border hover:border-brand-teal/40 transition-colors">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl bg-bright-bg border border-bright-border ${metric.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="flex items-center text-xs font-bold text-brand-teal bg-brand-teal/10 px-2.5 py-1 rounded-lg border border-brand-teal/20">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {metric.trend}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-black text-white">{metric.value}</h3>
                <p className="text-xs text-slate-400 font-mono mt-1 uppercase tracking-wider">{metric.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Expert Approvals Queue */}
        <div className="glass-bright p-6 rounded-2xl border border-bright-border">
          <div className="flex items-center justify-between mb-6 border-b border-bright-border pb-4">
            <h3 className="text-lg font-bold text-white">Expert Onboarding Queue</h3>
            <span className="text-xs font-mono text-brand-amber bg-brand-amber/10 px-2 py-1 rounded border border-brand-amber/20">
              {expertApprovals.length} Pending
            </span>
          </div>
          
          <div className="space-y-4">
            {expertApprovals.map(expert => (
              <div key={expert.id} className="flex items-center justify-between bg-bright-bg p-4 rounded-xl border border-bright-border">
                <div>
                  <h4 className="font-bold text-sm text-white">{expert.name}</h4>
                  <p className="text-xs text-brand-cyan font-mono mt-0.5">{expert.role} @ {expert.company}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/30 hover:bg-emerald-500/20 transition">
                    <CheckCircle2 className="h-4 w-4" />
                  </button>
                  <button className="h-8 w-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/30 hover:bg-rose-500/20 transition">
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payouts Management */}
        <div className="glass-bright p-6 rounded-2xl border border-bright-border">
          <div className="flex items-center justify-between mb-6 border-b border-bright-border pb-4">
            <h3 className="text-lg font-bold text-white">Recent Payouts</h3>
            <button className="text-xs font-bold text-brand-teal hover:text-white transition">View All</button>
          </div>
          
          <div className="space-y-4">
            {pendingPayouts.map(payout => (
              <div key={payout.id} className="flex items-center justify-between bg-bright-bg p-4 rounded-xl border border-bright-border">
                <div>
                  <h4 className="font-bold text-sm text-white">{payout.expert}</h4>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{payout.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-white text-sm">{payout.amount}</p>
                  <span className={`text-[10px] font-bold font-mono uppercase tracking-wider ${
                    payout.status === 'Cleared' ? 'text-brand-teal' : 'text-brand-amber'
                  }`}>
                    {payout.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
