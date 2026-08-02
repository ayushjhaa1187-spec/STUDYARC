import React, { useState } from 'react';
import { Users, Star, Filter, Calendar, CreditCard, CheckCircle2, Search, ArrowRight, Zap } from 'lucide-react';
import { MENTORS } from '../data/mockData';

export default function MentorsPage({ openMentorModal }) {
  const [selectedRole, setSelectedRole] = useState('All');
  const [sortBy, setSortBy] = useState('rating');
  const [searchQuery, setSearchQuery] = useState('');

  const roles = ['All', 'AI & ML', 'Full-Stack', 'Data Science', 'Product'];

  const filteredMentors = MENTORS.filter((m) => {
    const matchesRole = selectedRole === 'All' || m.expertise.some(e => e.toLowerCase().includes(selectedRole.toLowerCase().split(' ')[0]));
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'price') return a.price - b.price;
    return 0;
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-brand-teal uppercase font-bold tracking-widest">
          <Users className="h-4 w-4" />
          <span>Professional Services Access</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">Mentor Marketplace</h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Get direct, 1-on-1 feedback on your code, architecture, resume, or system design from ex-FAANG tech leads and principal engineers.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-2xl glass-bright card-glow-emerald p-4 relative z-10">
        
        {/* Role Filters */}
        <div className="flex space-x-2 overflow-x-auto w-full md:w-auto scrollbar-none">
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition-all duration-300 ${
                selectedRole === role
                  ? 'bg-bright-gradient border border-brand-cyan text-white shadow-lg shadow-brand-cyan/20 glow-bright-cyan'
                  : 'bg-bright-bg text-slate-400 hover:bg-bright-cardLight hover:text-white border border-bright-border'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Search & Sort Dropdown */}
        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mentor or company..."
              className="w-full rounded-xl border border-bright-border bg-bright-bg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-brand-teal focus:outline-none focus:ring-1 focus:ring-brand-teal transition-all"
            />
          </div>

          <div className="relative w-full sm:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-auto rounded-xl border border-bright-border bg-bright-bg px-4 py-2 text-xs text-slate-300 font-bold focus:border-brand-teal focus:outline-none appearance-none cursor-pointer"
            >
              <option value="rating">Highest Rating</option>
              <option value="price">Price (Low to High)</option>
            </select>
          </div>
        </div>

      </div>

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMentors.map((mentor, idx) => {
          const glowClasses = ['hover:card-glow-cyan', 'hover:card-glow-indigo', 'hover:card-glow-amber', 'hover:card-glow-rose', 'hover:card-glow-emerald'];
          const glowClass = glowClasses[idx % glowClasses.length];

          return (
            <div
              key={mentor.id}
              className={`group flex flex-col justify-between glass-bright p-6 transition-all duration-300 ${glowClass} relative overflow-hidden`}
            >
              <div className="space-y-4 relative z-10">
                
                {/* Avatar + Title Header */}
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <img
                      src={mentor.avatar}
                      alt={mentor.name}
                      className="h-16 w-16 rounded-2xl object-cover border-2 border-brand-teal/40 group-hover:border-brand-cyan transition-colors z-10 relative"
                    />
                    <div className="absolute inset-0 bg-brand-cyan/20 blur-xl rounded-full -z-10 group-hover:bg-brand-cyan/40 transition-colors"></div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white group-hover:text-brand-cyan transition-colors">
                        {mentor.name}
                      </h3>
                      <span className="flex items-center space-x-1.5 rounded-lg bg-brand-amber/10 px-2.5 py-1 text-xs font-black text-brand-amber border border-brand-amber/20">
                        <Star className="h-3.5 w-3.5 fill-brand-amber text-brand-amber" />
                        <span>{mentor.rating} ({mentor.reviewCount})</span>
                      </span>
                    </div>
                    <p className="text-sm font-bold text-brand-teal mt-0.5">{mentor.role}</p>
                    <p className="text-[11px] font-mono text-slate-400 mt-0.5">{mentor.company}</p>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs text-slate-300 leading-relaxed bg-bright-bg/50 p-3 rounded-xl border border-bright-border">
                  {mentor.bio}
                </p>

                {/* Skill Tags */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {mentor.expertise.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-bright-bg px-2.5 py-1 text-[10px] font-mono font-bold text-slate-300 border border-bright-border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Availability Slot */}
                <div className="flex items-center justify-between rounded-xl bg-bright-bg p-3 text-xs border border-bright-border font-mono">
                  <span className="text-slate-400 font-bold uppercase tracking-widest">Next Slot</span>
                  <span className="text-brand-cyan font-black flex items-center"><Zap className="h-3.5 w-3.5 mr-1" />{mentor.nextSlot}</span>
                </div>

              </div>

              {/* Price & Action */}
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-bright-border relative z-10">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">Session Price</span>
                  <div className="flex items-baseline space-x-1 mt-0.5">
                    <span className="text-2xl font-black text-white">₹{mentor.price}</span>
                    <span className="text-[10px] text-slate-400">/ 30 min</span>
                  </div>
                </div>

                <div className="flex space-x-3 w-full sm:w-auto">
                  <button
                    onClick={() => openMentorModal(mentor)}
                    className="flex-1 sm:flex-none rounded-xl border border-bright-border bg-bright-bg px-4 py-2.5 text-xs font-bold text-slate-300 hover:border-brand-teal/40 hover:text-white transition-colors"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => openMentorModal(mentor)}
                    className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 rounded-xl bg-bright-gradient border border-brand-cyan px-5 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-brand-cyan/20 glow-bright-cyan hover:scale-105 transition-transform"
                  >
                    <Calendar className="h-4 w-4 text-brand-amber" />
                    <span>Book Session</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
