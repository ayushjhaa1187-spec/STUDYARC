import React, { useState, useMemo } from 'react';
import { Search, Filter, Star, Clock, BookOpen, ChevronDown, CheckCircle2, Play, Users } from 'lucide-react';
import { COURSES } from '../data/mockData';

export default function CatalogPage({ setActivePage }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('All');
  const [sortBy, setSortBy] = useState('Featured');

  const categories = ['All', 'AI & ML', 'Web Dev', 'Data', 'Product', 'DevOps', 'Design'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const types = ['All', 'Course', 'Specialization', 'Certificate'];
  const prices = ['All', 'Free', 'Paid'];

  const filteredCourses = useMemo(() => {
    return COURSES.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            course.instructor.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'All' || course.difficulty === selectedDifficulty;
      const matchesType = selectedType === 'All' || course.type === selectedType;
      
      let matchesPrice = true;
      if (selectedPrice === 'Free') matchesPrice = course.price === 'Free';
      if (selectedPrice === 'Paid') matchesPrice = course.price !== 'Free';

      return matchesSearch && matchesCategory && matchesDifficulty && matchesType && matchesPrice;
    }).sort((a, b) => {
      if (sortBy === 'Highest Rated') return b.rating - a.rating;
      if (sortBy === 'Most Enrolled') return b.learnersCount - a.learnersCount;
      // Default / Featured / Newest can just use current order or any mock logic
      return 0; 
    });
  }, [searchTerm, selectedCategory, selectedDifficulty, selectedType, selectedPrice, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedDifficulty('All');
    setSelectedType('All');
    setSelectedPrice('All');
  };

  return (
    <div className="min-h-screen bg-[#0C0F14] text-white">
      {/* Header */}
      <div className="bg-[#12161E] border-b border-bright-border py-8 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-sm text-gray-400 mb-4 flex items-center gap-2">
            <span className="hover:text-white cursor-pointer" onClick={() => setActivePage('/')}>Home</span>
            <ChevronDown className="w-3 h-3 -rotate-90" />
            <span className="text-white">Catalog</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-display mb-2">Course Catalog</h1>
          <p className="text-gray-400 max-w-2xl">Discover structured learning paths, guided projects, and career certificates to build your expertise.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar - Filters */}
        <div className="w-full lg:w-[280px] shrink-0 space-y-8">
          {/* Search */}
          <div>
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search courses..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#1A1F26] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-brand-teal transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg flex items-center gap-2"><Filter className="w-4 h-4"/> Filters</h3>
            <button onClick={clearFilters} className="text-sm text-brand-teal hover:text-white transition-colors">Clear all</button>
          </div>

          {/* Category Filter */}
          <div>
            <h4 className="font-semibold text-gray-300 mb-3">Category</h4>
            <div className="flex flex-col gap-2">
              {categories.map(cat => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${selectedCategory === cat ? 'bg-brand-teal border-brand-teal' : 'border-gray-600 group-hover:border-gray-400 bg-transparent'}`}>
                    {selectedCategory === cat && <CheckCircle2 className="w-3 h-3 text-black" />}
                  </div>
                  <span className={`${selectedCategory === cat ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div>
            <h4 className="font-semibold text-gray-300 mb-3">Difficulty</h4>
            <div className="flex flex-col gap-2">
              {difficulties.map(diff => (
                <label key={diff} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${selectedDifficulty === diff ? 'bg-brand-teal border-brand-teal' : 'border-gray-600 group-hover:border-gray-400 bg-transparent'}`}>
                    {selectedDifficulty === diff && <CheckCircle2 className="w-3 h-3 text-black" />}
                  </div>
                  <span className={`${selectedDifficulty === diff ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>{diff}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <h4 className="font-semibold text-gray-300 mb-3">Learning Type</h4>
            <div className="flex flex-col gap-2">
              {types.map(type => (
                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${selectedType === type ? 'bg-brand-teal border-brand-teal' : 'border-gray-600 group-hover:border-gray-400 bg-transparent'}`}>
                    {selectedType === type && <CheckCircle2 className="w-3 h-3 text-black" />}
                  </div>
                  <span className={`${selectedType === type ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div>
            <h4 className="font-semibold text-gray-300 mb-3">Price</h4>
            <div className="flex flex-col gap-2">
              {prices.map(price => (
                <label key={price} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${selectedPrice === price ? 'bg-brand-teal border-brand-teal' : 'border-gray-600 group-hover:border-gray-400 bg-transparent'}`}>
                    {selectedPrice === price && <CheckCircle2 className="w-3 h-3 text-black" />}
                  </div>
                  <span className={`${selectedPrice === price ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>{price}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content - Grid */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-gray-400">Showing <span className="text-white font-bold">{filteredCourses.length}</span> courses</h2>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Sort by:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#1A1F26] border border-white/10 rounded-lg py-2 pl-3 pr-8 text-white focus:outline-none focus:border-brand-teal appearance-none cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
              >
                <option>Featured</option>
                <option>Highest Rated</option>
                <option>Most Enrolled</option>
                <option>Newest</option>
              </select>
            </div>
          </div>

          {filteredCourses.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5">
              <Search className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No courses found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your filters or search term.</p>
              <button onClick={clearFilters} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">Clear Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCourses.map(course => (
                <div key={course.id} className="course-card glass-bright border border-bright-border rounded-2xl overflow-hidden hover:border-brand-teal/50 hover:shadow-[0_0_20px_rgba(53,199,184,0.1)] transition-all duration-300 flex flex-col group cursor-pointer" onClick={() => setActivePage('/course', { courseId: course.id })}>
                  <div className="h-40 overflow-hidden relative">
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className={`category-pill category-pill-${course.category.toLowerCase().replace(/\s+/g, '-').replace('&', '')}`}>
                        {course.category}
                      </span>
                      <span className="bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] uppercase font-bold px-2 py-1 rounded">
                        {course.type}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-brand-teal transition-colors">{course.title}</h3>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <img src={course.instructor.avatar} alt={course.instructor.name} className="w-6 h-6 rounded-full" />
                      <span className="text-sm text-gray-400">{course.instructor.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm mb-4">
                      <div className="flex items-center gap-1 text-amber-400 font-medium">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{course.rating}</span>
                        <span className="text-gray-500">({course.reviews})</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>{(course.learnersCount/1000).toFixed(1)}k</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-6 bg-white/5 p-2 rounded-lg">
                      <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> {course.duration}</div>
                      <div className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {course.modulesCount} modules</div>
                    </div>
                    
                    <div className="mt-auto flex items-center justify-between">
                      {course.price === 'Free' ? (
                        <span className="text-green-400 font-bold bg-green-400/10 px-3 py-1 rounded-full text-sm">Free</span>
                      ) : (
                        <span className="font-bold text-lg">{course.price}</span>
                      )}
                      
                      <button 
                        onClick={(e) => { e.stopPropagation(); setActivePage('/course', { courseId: course.id }); }}
                        className="px-4 py-2 bg-white/5 hover:bg-brand-teal hover:text-black rounded-lg text-sm font-medium transition-all border border-white/10 hover:border-transparent"
                      >
                        {course.price === 'Free' ? 'Start Free' : 'View Course'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
