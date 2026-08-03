import React, { useState } from 'react';
import { COMMUNITY_THREADS, LEADERBOARD } from '../data/mockData';
import { MessageSquare, ThumbsUp, Search, Filter, Bot, X, CheckCircle2, Award, Zap } from 'lucide-react';

const CommunityPage = ({ openMentorModal, setActivePage }) => {
  const [activeTag, setActiveTag] = useState('All');
  const [expandedThread, setExpandedThread] = useState(null);
  const [showAskModal, setShowAskModal] = useState(false);

  const tags = ['All', 'AI Agents', 'Web Dev', 'Data Science', 'Career', 'LangChain', 'Python', 'React'];

  const filteredThreads = activeTag === 'All' 
    ? COMMUNITY_THREADS 
    : COMMUNITY_THREADS.filter(t => t.tags.includes(activeTag));

  const toggleThread = (id) => {
    setExpandedThread(expandedThread === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#0C0F14] text-gray-200 pb-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 font-display">Community Q&A</h1>
          <p className="text-gray-400">Ask, learn, and grow with 14,000+ builders and experts.</p>
        </div>

        {/* Action Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <button 
            onClick={() => setShowAskModal(true)}
            className="px-6 py-2.5 bg-brand-teal text-[#0C0F14] font-semibold rounded hover:bg-teal-400 transition-colors shadow-lg shadow-brand-teal/20"
          >
            Ask a Question
          </button>
          
          <div className="flex w-full sm:w-auto gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                type="text" 
                placeholder="Search discussions..." 
                className="w-full bg-[#161b22] border border-[#262e3c] rounded-md py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-brand-teal"
              />
            </div>
            <button className="px-3 py-2 bg-[#161b22] border border-[#262e3c] rounded-md text-gray-400 hover:text-white transition-colors flex items-center gap-2">
              <Filter size={16} /> Sort
            </button>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors border ${activeTag === tag ? 'bg-brand-teal/20 text-brand-teal border-brand-teal/30' : 'bg-[#161b22] text-gray-400 border-[#262e3c] hover:bg-gray-800'}`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Thread List */}
          <div className="flex-1 space-y-4">
            {filteredThreads.map(thread => (
              <div key={thread.id} className="glass-bright border border-[#262e3c] rounded-xl overflow-hidden transition-all hover:border-gray-500">
                <div 
                  className="p-5 cursor-pointer"
                  onClick={() => toggleThread(thread.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-white leading-tight group-hover:text-brand-teal transition-colors">
                      {thread.title}
                    </h3>
                    <div className="shrink-0 ml-4">
                      {thread.status === 'answered' && <span className="bg-brand-teal/10 text-brand-teal border border-brand-teal/20 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">Answered</span>}
                      {thread.status === 'open' && <span className="bg-brand-amber/10 text-brand-amber border border-brand-amber/20 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">Open</span>}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <img src={thread.authorAvatar} alt={thread.authorName} className="w-6 h-6 rounded-full object-cover" />
                    <span className="text-xs text-gray-300 font-medium">{thread.authorName}</span>
                    <span className="text-xs text-gray-500">&middot;</span>
                    <span className="text-xs text-gray-500">{thread.timeAgo}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {thread.tags.map(t => (
                      <span key={t} className="text-[10px] bg-gray-800 text-gray-400 px-2 py-1 rounded">{t}</span>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-400">
                    <button className="flex items-center gap-1.5 hover:text-brand-teal transition-colors" onClick={(e) => e.stopPropagation()}>
                      <ThumbsUp size={16} /> {thread.upvotes}
                    </button>
                    <div className="flex items-center gap-1.5">
                      <MessageSquare size={16} /> {thread.replies}
                    </div>
                    {thread.aiAnswer && (
                      <div className="flex items-center gap-1.5 text-brand-violet ml-auto">
                        <Bot size={16} /> AI Summary Available
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedThread === thread.id && (
                  <div className="border-t border-[#262e3c] bg-gray-900/50 p-5">
                    <div className="text-sm text-gray-300 mb-6 leading-relaxed">
                      "I'm trying to implement a RAG pipeline but getting rate limited by the OpenAI API when processing large documents. What's the best way to chunk and batch these requests effectively without losing context?"
                    </div>
                    
                    {thread.aiAnswer && (
                      <div className="bg-brand-violet/10 border border-brand-violet/20 rounded-lg p-4 mb-6 relative">
                        <div className="absolute top-4 right-4 text-brand-violet/50"><SparklesIcon /></div>
                        <h4 className="text-sm font-semibold text-brand-violet mb-2 flex items-center gap-2">
                          <Bot size={16} /> Gemini Suggested Answer
                        </h4>
                        <div className="text-sm text-gray-300 space-y-2">
                          <p>To avoid rate limits while maintaining context in a RAG pipeline:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Chunking:</strong> Use Semantic Chunking instead of fixed-size. Overlap chunks by 10-15%.</li>
                            <li><strong>Batching:</strong> Implement exponential backoff for retries (e.g., using Tenacity in Python).</li>
                            <li><strong>Concurrency:</strong> Limit concurrent requests using a semaphore (e.g., asyncio.Semaphore(5)).</li>
                          </ul>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-800">
                      <span className="text-sm text-gray-400">{thread.replies} Community Replies</span>
                      <button 
                        onClick={() => setActivePage('/experts')}
                        className="text-xs px-4 py-2 border border-brand-teal/50 text-brand-teal rounded hover:bg-brand-teal/10 transition-colors"
                      >
                        Ask an Expert Instead
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-72 space-y-6">
            <div className="glass-bright border border-[#262e3c] rounded-xl p-5">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Award size={18} className="text-brand-amber"/> Leaderboard
              </h3>
              <div className="space-y-4">
                {LEADERBOARD.slice(0,4).map((user, idx) => (
                  <div key={user.id} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${idx === 0 ? 'bg-amber-500 text-white' : idx === 1 ? 'bg-gray-300 text-gray-900' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-gray-800 text-gray-400'}`}>
                      {idx + 1}
                    </div>
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">{user.name}</p>
                      <p className="text-[10px] text-brand-teal">{user.points} XP</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-bright border border-[#262e3c] rounded-xl p-5 bg-gradient-to-br from-[#161b22] to-brand-teal/10">
              <Zap size={24} className="text-brand-teal mb-3" />
              <h3 className="font-semibold text-white mb-2">Need faster answers?</h3>
              <p className="text-xs text-gray-400 mb-4">Book a 1:1 session with an industry expert to unblock your progress.</p>
              <button 
                onClick={() => setActivePage('/experts')}
                className="w-full py-2 bg-white text-gray-900 text-sm font-semibold rounded hover:bg-gray-200 transition-colors"
              >
                Find an Expert
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ask Modal */}
      {showAskModal && (
        <>
          <div className="modal-overlay fixed inset-0 bg-black/80 backdrop-blur-sm z-40" onClick={() => setShowAskModal(false)}></div>
          <div className="modal-panel fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-[#0f131a] border border-[#262e3c] rounded-xl z-50 shadow-2xl animate-slide-up">
            <div className="flex justify-between items-center p-5 border-b border-[#262e3c]">
              <h2 className="text-lg font-semibold text-white">Ask the Community</h2>
              <button onClick={() => setShowAskModal(false)} className="text-gray-400 hover:text-white"><X size={20}/></button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                <input type="text" placeholder="e.g. How to handle context limits in LangChain?" className="w-full bg-[#161b22] border border-[#262e3c] rounded-md p-2.5 text-white text-sm focus:border-brand-teal focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea rows="5" placeholder="Provide details about your problem, what you've tried..." className="w-full bg-[#161b22] border border-[#262e3c] rounded-md p-2.5 text-white text-sm focus:border-brand-teal focus:outline-none"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Tags (comma separated)</label>
                <input type="text" placeholder="react, machine-learning, api" className="w-full bg-[#161b22] border border-[#262e3c] rounded-md p-2.5 text-white text-sm focus:border-brand-teal focus:outline-none" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button onClick={() => setShowAskModal(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Cancel</button>
                <button onClick={() => setShowAskModal(false)} className="px-6 py-2 bg-brand-teal text-[#0C0F14] text-sm font-semibold rounded hover:bg-teal-400">Post Question</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const SparklesIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>;

export default CommunityPage;
