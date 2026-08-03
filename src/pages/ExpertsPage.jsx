import React, { useState, useMemo } from 'react';
import { 
  Bot, Search, Filter, Star, Clock, Calendar, 
  ChevronRight, Sparkles, MessageSquare, Briefcase, Award 
} from 'lucide-react';
import { EXPERTS } from '../data/mockData';

export default function ExpertsPage({ setActivePage, openMentorModal }) {
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState('All');
  const [priceFilter, setPriceFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [languageFilter, setLanguageFilter] = useState('All');
  const [sortOption, setSortOption] = useState('Recommended');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'AI & ML', 'Web Dev', 'Data Science', 'Product', 'DevOps', 'Design', 'Mobile'];
  const availabilities = ['All', 'Today', 'Tomorrow', 'This Weekend'];
  const prices = ['All', 'Under ₹500', '₹500-₹700', '₹700+'];
  const ratings = ['All', '4.9+', '4.8+'];
  const languages = ['All', 'English', 'Hindi'];
  const sortOptions = ['Recommended', 'Highest Rated', 'Price: Low to High', 'Most Sessions'];

  const filteredAndSortedExperts = useMemo(() => {
    let result = EXPERTS;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(e => 
        e.name.toLowerCase().includes(q) || 
        e.role.toLowerCase().includes(q) || 
        e.company.toLowerCase().includes(q)
      );
    }

    if (categoryFilter !== 'All') {
      // Mock category filtering based on tags
      const tagMapping = {
        'AI & ML': ['AI', 'Machine Learning', 'LLMs', 'OpenAI'],
        'Web Dev': ['React', 'Frontend', 'Next.js', 'Node.js'],
        'Data Science': ['Python', 'Data', 'Analytics'],
        'Product': ['Product Management', 'Strategy'],
        'DevOps': ['AWS', 'Docker', 'Kubernetes'],
        'Design': ['UX', 'UI', 'Figma'],
        'Mobile': ['React Native', 'Flutter', 'iOS', 'Android']
      };
      const allowedTags = tagMapping[categoryFilter] || [];
      result = result.filter(e => 
        e.expertise.some(tag => allowedTags.some(allowed => tag.toLowerCase().includes(allowed.toLowerCase())))
      );
    }

    if (availabilityFilter !== 'All') {
      const targetDate = availabilityFilter.toLowerCase();
      result = result.filter(e => 
        e.availabilitySlots.some(slot => slot.date.toLowerCase().includes(targetDate) || targetDate === 'this weekend') // Simplified check
      );
    }

    if (priceFilter !== 'All') {
      result = result.filter(e => {
        const basePrice = e.services[0]?.price || 0;
        if (priceFilter === 'Under ₹500') return basePrice < 500;
        if (priceFilter === '₹500-₹700') return basePrice >= 500 && basePrice <= 700;
        if (priceFilter === '₹700+') return basePrice > 700;
        return true;
      });
    }

    if (ratingFilter !== 'All') {
      if (ratingFilter === '4.9+') result = result.filter(e => e.rating >= 4.9);
      if (ratingFilter === '4.8+') result = result.filter(e => e.rating >= 4.8);
    }

    if (languageFilter !== 'All') {
      result = result.filter(e => e.languages.includes(languageFilter));
    }

    // Sort
    result = [...result].sort((a, b) => {
      if (sortOption === 'Highest Rated') return b.rating - a.rating;
      if (sortOption === 'Most Sessions') return b.sessions - a.sessions;
      if (sortOption === 'Price: Low to High') {
        const priceA = a.services[0]?.price || 0;
        const priceB = b.services[0]?.price || 0;
        return priceA - priceB;
      }
      return b.isAIRecommended === a.isAIRecommended ? 0 : b.isAIRecommended ? 1 : -1;
    });

    return result;
  }, [searchQuery, categoryFilter, availabilityFilter, priceFilter, ratingFilter, languageFilter, sortOption]);

  const scrollToAiMatches = () => {
    const el = document.getElementById('expert-grid');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const clearFilters = () => {
    setCategoryFilter('All');
    setAvailabilityFilter('All');
    setPriceFilter('All');
    setRatingFilter('All');
    setLanguageFilter('All');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-[#0C0F14] text-white p-4 md:p-8">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-space font-bold mb-2 flex items-center gap-3">
              Expert Marketplace
              <span className="text-xs px-2 py-1 bg-[rgba(38,46,60,0.9)] text-gray-300 rounded-full border border-[rgba(255,255,255,0.1)]">
                {filteredAndSortedExperts.length} Experts
              </span>
            </h1>
            <p className="text-gray-400 font-inter">Book 1-on-1 sessions with top industry professionals.</p>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search experts by name, role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[rgba(22,27,36,0.7)] border border-[rgba(38,46,60,0.9)] rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-[#35C7B8] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* AI Recommendation Banner */}
      <div className="max-w-7xl mx-auto mb-8 glass-bright rounded-2xl p-6 border border-[#35C7B8]/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#35C7B8]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#35C7B8] to-[#06d6a0] p-[1px]">
              <div className="w-full h-full bg-[#0C0F14] rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-[#35C7B8]" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-space font-semibold text-white mb-1 flex items-center gap-2">
                AI Matchmaker Active <Sparkles className="w-4 h-4 text-[#F2A93B]" />
              </h3>
              <p className="text-gray-400 text-sm">Our AI matched 3 experts to your current learning profile.</p>
            </div>
          </div>
          <button 
            onClick={scrollToAiMatches}
            className="w-full md:w-auto px-6 py-2.5 bg-[#35C7B8]/10 hover:bg-[#35C7B8]/20 text-[#35C7B8] font-medium rounded-xl transition-colors border border-[#35C7B8]/30 flex items-center justify-center gap-2"
          >
            View Matches <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters Row */}
      <div className="max-w-7xl mx-auto mb-8 sticky top-0 z-20 bg-[#0C0F14]/80 backdrop-blur-md py-4 border-b border-[rgba(38,46,60,0.9)]">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 mb-4">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                categoryFilter === cat 
                  ? 'bg-white text-black' 
                  : 'bg-[rgba(22,27,36,0.7)] text-gray-400 hover:text-white border border-[rgba(38,46,60,0.9)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 mr-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-400">Filters:</span>
          </div>
          
          <select 
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="bg-[rgba(22,27,36,0.7)] border border-[rgba(38,46,60,0.9)] text-sm rounded-lg px-3 py-1.5 text-gray-300 focus:outline-none"
          >
            <option disabled value="All">Availability</option>
            {availabilities.map(a => <option key={a} value={a}>{a}</option>)}
          </select>

          <select 
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="bg-[rgba(22,27,36,0.7)] border border-[rgba(38,46,60,0.9)] text-sm rounded-lg px-3 py-1.5 text-gray-300 focus:outline-none"
          >
            <option disabled value="All">Price Range</option>
            {prices.map(p => <option key={p} value={p}>{p}</option>)}
          </select>

          <select 
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="bg-[rgba(22,27,36,0.7)] border border-[rgba(38,46,60,0.9)] text-sm rounded-lg px-3 py-1.5 text-gray-300 focus:outline-none"
          >
            <option disabled value="All">Rating</option>
            {ratings.map(r => <option key={r} value={r}>{r}</option>)}
          </select>

          <select 
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="bg-[rgba(22,27,36,0.7)] border border-[rgba(38,46,60,0.9)] text-sm rounded-lg px-3 py-1.5 text-gray-300 focus:outline-none"
          >
            <option disabled value="All">Language</option>
            {languages.map(l => <option key={l} value={l}>{l}</option>)}
          </select>

          <div className="ml-auto">
            <select 
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-[rgba(22,27,36,0.7)] border border-[#35C7B8]/30 text-sm rounded-lg px-3 py-1.5 text-[#35C7B8] focus:outline-none font-medium"
            >
              {sortOptions.map(s => <option key={s} value={s}>Sort: {s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Expert Grid */}
      <div id="expert-grid" className="max-w-7xl mx-auto">
        {filteredAndSortedExperts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedExperts.map((expert) => (
              <div key={expert.id} className="expert-card glass-bright rounded-2xl p-5 border border-[rgba(38,46,60,0.9)] hover:border-[#35C7B8]/50 transition-all duration-300 group hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(53,199,184,0.1)] flex flex-col h-full relative overflow-hidden">
                
                {expert.isAIRecommended && (
                  <div className="ai-badge absolute top-4 right-4 bg-gradient-to-r from-[#8b5cf6]/20 to-[#35C7B8]/20 border border-[#8b5cf6]/30 text-xs px-2.5 py-1 rounded-full text-[#35C7B8] font-medium flex items-center gap-1 backdrop-blur-md">
                    <Sparkles className="w-3 h-3" /> AI Recommended
                  </div>
                )}

                <div className="flex gap-4 mb-4 mt-2">
                  <div className="relative">
                    <img src={expert.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(expert.name)}&background=262e3c&color=fff`} alt={expert.name} className="w-16 h-16 rounded-2xl object-cover" />
                    {availabilityFilter === 'Today' && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0C0F14]"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-space font-bold text-white group-hover:text-[#35C7B8] transition-colors">{expert.name}</h3>
                    <p className="text-sm text-gray-400 font-inter">{expert.role}</p>
                    <p className="text-xs text-gray-500 font-inter flex items-center gap-1 mt-0.5">
                      <Briefcase className="w-3 h-3" /> {expert.company}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {expert.expertise.slice(0, 3).map((tag, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-[rgba(38,46,60,0.5)] border border-[rgba(255,255,255,0.05)] text-gray-300 rounded-md">
                      {tag}
                    </span>
                  ))}
                  {expert.expertise.length > 3 && (
                    <span className="text-xs px-2 py-1 bg-[rgba(38,46,60,0.5)] border border-[rgba(255,255,255,0.05)] text-gray-400 rounded-md">
                      +{expert.expertise.length - 3}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold">{expert.rating}</span>
                    <span className="text-gray-500 font-normal">({expert.reviews})</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-gray-600"></div>
                  <div className="text-gray-400 flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    {expert.sessions} sessions
                  </div>
                </div>

                <div className="flex gap-2 mb-4">
                  {expert.languages.map((lang, i) => (
                    <span key={i} className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 bg-gray-800 text-gray-400 rounded">
                      {lang}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-4 border-t border-[rgba(38,46,60,0.9)] flex flex-col gap-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1.5 text-[#35C7B8]">
                      <Calendar className="w-4 h-4" />
                      <span>Next: {expert.availabilitySlots?.[0]?.date || 'Tomorrow'}</span>
                    </div>
                    <div className="font-space font-bold">
                      ₹{expert.services?.[0]?.price || '500'} <span className="text-xs text-gray-500 font-normal">/ session</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => setActivePage('/expert-profile', { expertId: expert.id })}
                      className="py-2 px-3 border border-[rgba(38,46,60,0.9)] hover:bg-[rgba(38,46,60,0.9)] text-white text-sm font-medium rounded-xl transition-colors"
                    >
                      View Profile
                    </button>
                    <button 
                      onClick={() => setActivePage('/booking', { expertId: expert.id, serviceId: expert.services?.[0]?.id })}
                      className="py-2 px-3 bg-[#35C7B8] hover:bg-[#2bb0a2] text-black text-sm font-bold rounded-xl transition-colors shadow-[0_0_15px_rgba(53,199,184,0.3)]"
                    >
                      Book Session
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[rgba(22,27,36,0.3)] rounded-2xl border border-[rgba(38,46,60,0.9)] border-dashed">
            <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-space font-bold text-white mb-2">No experts found</h3>
            <p className="text-gray-400 mb-6">We couldn't find any experts matching your current filters.</p>
            <button 
              onClick={clearFilters}
              className="px-6 py-2.5 bg-white text-black font-medium rounded-xl hover:bg-gray-200 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
