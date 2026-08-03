import React, { useState } from 'react';
import { Search, PlayCircle, Sparkles, Plus, Star, ShieldCheck, ChevronRight } from 'lucide-react';

export default function CoursesPage({ cart, setCart }) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    try {
      const res = await fetch('http://localhost:3001/api/course-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      // Fallback in case of error
      setResults([
        {
          title: "Complete Python Mastery",
          description: "Learn Python from scratch to advanced level.",
          youtubeUrl: "https://www.youtube.com/watch?v=kqtD5dpn9C8",
          difficulty: "Beginner"
        }
      ]);
    } finally {
      setIsSearching(false);
    }
  };

  const getEmbedUrl = (url) => {
    if (!url) return '';
    try {
      const videoId = url.split('v=')[1]?.split('&')[0] || url.split('youtu.be/')[1];
      return `https://www.youtube.com/embed/${videoId}`;
    } catch {
      return '';
    }
  };

  const handleAddToCart = (course, plan, price) => {
    setCart(prev => [
      ...prev,
      {
        id: `course_${Date.now()}`,
        type: 'Course Access',
        title: course.title,
        plan,
        price
      }
    ]);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header & AI Search */}
      <div className="space-y-4">
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-brand-teal uppercase font-bold tracking-widest">
          <PlayCircle className="h-4 w-4" />
          <span>AI Course Matching</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">Find Your Next Playlist</h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Tell Gemini what you want to learn, and we'll match you with the best curated YouTube courses. Add a pass to unlock structured paths and verified certificates.
        </p>

        <form onSubmit={handleSearch} className="relative max-w-2xl mt-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Sparkles className={`h-5 w-5 ${isSearching ? 'text-brand-amber animate-pulse' : 'text-slate-400'}`} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="E.g., I want to learn Next.js and Tailwind..."
            className="w-full pl-12 pr-32 rounded-2xl border border-brand-teal/30 bg-[#0f172a]/60 px-4 py-4 text-sm text-white placeholder-slate-400 focus:border-brand-teal focus:outline-none focus:ring-1 focus:ring-brand-teal transition shadow-[0_0_15px_rgba(53,199,184,0.1)]"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="absolute right-2 top-2 bottom-2 px-6 rounded-xl bg-gradient-to-r from-brand-teal to-brand-cyan text-slate-950 font-bold hover:opacity-95 transition disabled:opacity-50"
          >
            {isSearching ? 'Matching...' : 'Match Me'}
          </button>
        </form>
      </div>

      {/* Results Section */}
      {hasSearched && (
        <div className="pt-8 border-t border-slate-800">
          <h3 className="text-xl font-bold text-white mb-6">Top Matches for "{query}"</h3>
          
          <div className="space-y-8">
            {results.map((course, idx) => (
              <div key={idx} className="flex flex-col lg:flex-row gap-6 glass-bright p-6 rounded-3xl border border-slate-800 hover:border-brand-teal/30 transition">
                
                {/* Video Preview */}
                <div className="w-full lg:w-2/5 aspect-video bg-black rounded-2xl overflow-hidden border border-slate-700">
                  {getEmbedUrl(course.youtubeUrl) ? (
                    <iframe
                      width="100%"
                      height="100%"
                      src={getEmbedUrl(course.youtubeUrl)}
                      title={course.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-500">
                      <PlayCircle className="h-12 w-12 opacity-50" />
                    </div>
                  )}
                </div>

                {/* Details & Pricing */}
                <div className="w-full lg:w-3/5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-lg bg-slate-800 px-3 py-1 text-[10px] font-mono font-bold text-slate-300 border border-slate-700">
                        {course.difficulty}
                      </span>
                    </div>
                    <h2 className="text-2xl font-black text-white mt-3">{course.title}</h2>
                    <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  {/* Pricing Tiers */}
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Pro Tier */}
                    <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-4 relative overflow-hidden group hover:border-brand-cyan/50 transition">
                      <div className="absolute top-0 right-0 p-3 opacity-10">
                        <Star className="h-12 w-12 text-brand-cyan" />
                      </div>
                      <h4 className="text-sm font-bold text-brand-cyan">Pro Pass</h4>
                      <p className="text-[10px] text-slate-400 mt-1">Full playlist access + community</p>
                      <div className="mt-3 flex items-end space-x-1">
                        <span className="text-2xl font-black text-white">₹199</span>
                        <span className="text-xs text-slate-400 mb-1">/ mo</span>
                      </div>
                      <button
                        onClick={() => handleAddToCart(course, 'Pro Pass', 199)}
                        className="mt-4 w-full flex items-center justify-center space-x-2 rounded-lg bg-brand-cyan/10 text-brand-cyan px-4 py-2 text-xs font-bold border border-brand-cyan/30 hover:bg-brand-cyan hover:text-slate-950 transition"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Add Pro</span>
                      </button>
                    </div>

                    {/* Gold Tier */}
                    <div className="rounded-2xl border border-brand-amber/50 bg-gradient-to-br from-brand-amber/10 to-transparent p-4 relative overflow-hidden group hover:border-brand-amber transition">
                      <div className="absolute top-0 right-0 p-3 opacity-10">
                        <ShieldCheck className="h-12 w-12 text-brand-amber" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-bold text-brand-amber">Gold Pass</h4>
                        <span className="bg-brand-amber text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded uppercase">Best Value</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">Pro + AI Coaching & Certification</p>
                      <div className="mt-3 flex items-end space-x-1">
                        <span className="text-2xl font-black text-white">₹319</span>
                        <span className="text-xs text-slate-400 mb-1">/ mo</span>
                      </div>
                      <button
                        onClick={() => handleAddToCart(course, 'Gold Pass', 319)}
                        className="mt-4 w-full flex items-center justify-center space-x-2 rounded-lg bg-brand-amber text-slate-950 px-4 py-2 text-xs font-bold hover:opacity-90 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Add Gold</span>
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
