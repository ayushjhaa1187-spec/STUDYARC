import React, { useState, useEffect } from 'react';
import { Play, FileText, CheckSquare, CheckCircle2, Bot, Send, Sparkles, X, ChevronRight, Video, ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { COURSES, EXPERTS } from '../data/mockData';

const LearnWorkspacePage = ({ courseId, setActivePage, openMentorModal }) => {
  const course = COURSES.find(c => c.id === courseId) || COURSES[2] || COURSES[0];
  const [activeLesson, setActiveLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [expandedModules, setExpandedModules] = useState(new Set([course?.modules?.[0]?.id]));
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', text: 'Hi! I can help you with this lesson. What do you need?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [showMobileRightPanel, setShowMobileRightPanel] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (course?.modules?.length > 0 && course.modules[0].lessons?.length > 0) {
      setActiveLesson(course.modules[0].lessons[0]);
    }
  }, [course]);

  const toggleModule = (moduleId) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const handleComplete = () => {
    if (!activeLesson) return;
    const newCompleted = new Set(completedLessons);
    if (newCompleted.has(activeLesson.id)) {
      newCompleted.delete(activeLesson.id);
    } else {
      newCompleted.add(activeLesson.id);
      showToast('Lesson completed! ✓');
    }
    setCompletedLessons(newCompleted);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const nextLesson = () => {
    if (!activeLesson || !course) return;
    let foundCurrent = false;
    for (const mod of course.modules) {
      for (const les of mod.lessons) {
        if (foundCurrent) {
          setActiveLesson(les);
          setExpandedModules(new Set([...expandedModules, mod.id]));
          return;
        }
        if (les.id === activeLesson.id) {
          foundCurrent = true;
        }
      }
    }
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages([...chatMessages, { role: 'user', text: chatInput }]);
    setChatInput('');
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setChatMessages(prev => [...prev, { role: 'ai', text: 'That is a great question! Based on this lesson, here is an explanation that should help clear things up.' }]);
    }, 1500);
  };

  if (!course) return <div className="p-8 text-white">Course not found.</div>;

  const totalLessons = course.modules?.reduce((acc, mod) => acc + mod.lessons.length, 0) || 0;
  const progressPercent = totalLessons === 0 ? 0 : Math.round((completedLessons.size / totalLessons) * 100);

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-[#0C0F14] text-gray-200 overflow-hidden font-sans">
      
      {/* Left Sidebar */}
      <div className="w-64 border-r border-[#262e3c] flex flex-col glass-bright hidden md:flex h-full">
        <div className="p-4 border-b border-[#262e3c]">
          <h2 className="font-semibold text-sm truncate text-white mb-2">{course.title}</h2>
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Progress</span>
            <span>{progressPercent}% complete</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1.5">
            <div className="bg-brand-teal h-1.5 rounded-full" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
          {course.modules?.map((mod, mIdx) => (
            <div key={mod.id} className="border-b border-[#262e3c]">
              <div 
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-800/50"
                onClick={() => toggleModule(mod.id)}
              >
                <h3 className="font-medium text-sm text-gray-300">Module {mIdx + 1}: {mod.title}</h3>
                {expandedModules.has(mod.id) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
              
              {expandedModules.has(mod.id) && (
                <div className="bg-gray-900/30 py-1">
                  {mod.lessons?.map(les => {
                    const isCompleted = completedLessons.has(les.id);
                    const isActive = activeLesson?.id === les.id;
                    return (
                      <div 
                        key={les.id}
                        className={`flex items-start gap-2 p-3 pl-4 cursor-pointer text-sm transition-colors ${isActive ? 'bg-brand-teal/10 border-l-2 border-brand-teal text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/30 border-l-2 border-transparent'}`}
                        onClick={() => setActiveLesson(les)}
                      >
                        <div className="mt-0.5" onClick={(e) => { e.stopPropagation(); setActiveLesson(les); /* Handle complete via main btn usually */ }}>
                          {isCompleted ? <CheckCircle2 size={16} className="text-brand-teal" /> : <div className="w-4 h-4 rounded-full border border-gray-500" />}
                        </div>
                        <div className="flex-1">
                          <p className={`leading-tight ${isActive ? 'font-medium' : ''}`}>{les.title}</p>
                          <div className="flex items-center gap-1 mt-1 text-xs opacity-70">
                            {les.type === 'video' ? <Video size={12} /> : les.type === 'quiz' ? <CheckSquare size={12} /> : <FileText size={12} />}
                            <span>{les.duration}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Center Content */}
      <div className="flex-1 flex flex-col relative h-full overflow-y-auto scrollbar-thin">
        {toastMessage && (
          <div className="absolute top-4 right-4 bg-brand-teal text-white px-4 py-2 rounded shadow-lg z-50 flex items-center gap-2 animate-slide-up">
            <CheckCircle2 size={16} />
            {toastMessage}
          </div>
        )}
        
        {/* Mobile Header / Sidebar Toggle */}
        <div className="md:hidden p-4 border-b border-[#262e3c] flex justify-between items-center bg-gray-900">
          <h2 className="font-semibold text-sm truncate text-white">{course.title}</h2>
          <button className="p-2 text-gray-400" onClick={() => setShowMobileRightPanel(!showMobileRightPanel)}>
            <Bot size={20} />
          </button>
        </div>

        {activeLesson ? (
          <div className="flex-1 flex flex-col">
            <div className="w-full bg-gray-800 h-1">
               <div className="bg-brand-teal h-1" style={{ width: `${progressPercent}%` }}></div>
            </div>
            
            {/* Video Placeholder */}
            <div className="w-full aspect-video bg-black flex flex-col items-center justify-center relative border-b border-[#262e3c]">
              <div className="w-16 h-16 rounded-full bg-brand-teal/20 flex items-center justify-center cursor-pointer hover:bg-brand-teal/30 transition-colors">
                <Play className="text-brand-teal ml-1" size={32} />
              </div>
              <p className="mt-4 text-gray-400 text-sm font-medium">Video Lesson: {activeLesson.title}</p>
            </div>

            {/* Lesson Content */}
            <div className="p-8 max-w-4xl mx-auto w-full flex-1">
              <h1 className="text-3xl font-bold text-white mb-6 font-display">{activeLesson.title}</h1>
              
              <div className="space-y-4 text-gray-300 leading-relaxed mb-8">
                <p>Welcome to this crucial lesson in our journey. Understanding the core concepts here will unlock your ability to build more robust and scalable solutions in real-world scenarios. We'll start by breaking down the theoretical foundations before moving on to practical implementation.</p>
                <p>When working with modern AI frameworks, the architecture you choose can significantly impact performance. We often see patterns where micro-optimizations early on lead to massive gains as data scales. Let's look at how this applies to our current focus area.</p>
                <p>Below is an example of how you might structure this in a production environment. Notice the separation of concerns and how we handle asynchronous operations gracefully.</p>
              </div>

              <div className="bg-[#1a1e27] rounded-md p-4 mb-8 border border-[#262e3c] font-mono text-sm overflow-x-auto">
                <pre className="text-gray-300">
                  <code className="text-brand-cyan">import</code> {'{ useState, useEffect }'} <code className="text-brand-cyan">from</code> <code className="text-brand-amber">'react'</code>;<br/><br/>
                  <code className="text-brand-cyan">const</code> <code className="text-brand-indigo">DataProcessor</code> = () <code className="text-brand-cyan">=&gt;</code> {'{'}<br/>
                  {'  '}<code className="text-brand-cyan">const</code> [data, setData] = useState(<code className="text-brand-amber">null</code>);<br/><br/>
                  {'  '}useEffect(() <code className="text-brand-cyan">=&gt;</code> {'{'}<br/>
                  {'    '}<code className="text-brand-cyan">const</code> fetchData = <code className="text-brand-cyan">async</code> () <code className="text-brand-cyan">=&gt;</code> {'{'}<br/>
                  {'      '}<code className="text-brand-cyan">const</code> response = <code className="text-brand-cyan">await</code> fetch(<code className="text-brand-amber">'/api/process'</code>);<br/>
                  {'      '}<code className="text-brand-cyan">const</code> result = <code className="text-brand-cyan">await</code> response.json();<br/>
                  {'      '}setData(result);<br/>
                  {'    '}{'}'};<br/>
                  {'    '}fetchData();<br/>
                  {'  '}{'}, []);'}<br/><br/>
                  {'  '}<code className="text-brand-cyan">return</code> &lt;<code className="text-brand-indigo">div</code>&gt;{'{data ? data.status : '} <code className="text-brand-amber">'Loading...'</code>{'}'}&lt;/<code className="text-brand-indigo">div</code>&gt;;<br/>
                  {'}'};
                </pre>
              </div>

              <div className="flex items-center gap-4 mt-8 pt-6 border-t border-[#262e3c]">
                <button 
                  onClick={handleComplete}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded font-medium transition-colors ${completedLessons.has(activeLesson.id) ? 'bg-gray-800 text-brand-teal border border-brand-teal' : 'bg-brand-teal text-[#0C0F14] hover:bg-teal-400'}`}
                >
                  <CheckCircle2 size={18} />
                  {completedLessons.has(activeLesson.id) ? 'Completed' : 'Mark as Complete'}
                </button>
                
                <button 
                  onClick={nextLesson}
                  className="flex items-center gap-2 px-6 py-2.5 rounded font-medium bg-gray-800 text-white hover:bg-gray-700 transition-colors ml-auto"
                >
                  Next Lesson
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">Select a lesson to begin.</div>
        )}
      </div>

      {/* Right Panel - AI Coach & Experts */}
      <div className={`w-80 border-l border-[#262e3c] flex flex-col bg-[#0f131a] ${showMobileRightPanel ? 'absolute inset-0 z-40' : 'hidden lg:flex'} h-full`}>
        {showMobileRightPanel && (
          <div className="p-4 border-b border-[#262e3c] flex justify-between items-center bg-gray-900 lg:hidden">
            <span className="font-semibold text-white">AI Coach & Help</span>
            <button onClick={() => setShowMobileRightPanel(false)}><X size={20} className="text-gray-400" /></button>
          </div>
        )}
        
        {/* AI Coach */}
        <div className="flex-1 flex flex-col border-b border-[#262e3c]">
          <div className="p-4 border-b border-[#262e3c] flex items-center gap-3 glass-bright">
            <div className="relative">
              <div className="w-8 h-8 rounded bg-brand-violet/20 flex items-center justify-center text-brand-violet">
                <Bot size={18} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-[#0f131a] rounded-full"></div>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-white leading-none">Gemini Coach</h3>
              <span className="text-xs text-brand-violet">Online</span>
            </div>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 scrollbar-thin">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-lg p-3 text-sm ${msg.role === 'user' ? 'bg-gray-800 text-white chat-bubble-user' : 'bg-brand-violet/10 text-gray-200 border border-brand-violet/20 chat-bubble-ai'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-brand-violet/10 border border-brand-violet/20 rounded-lg p-3 text-sm flex gap-1 items-center">
                  <div className="typing-dot w-1.5 h-1.5 bg-brand-violet rounded-full animate-bounce"></div>
                  <div className="typing-dot w-1.5 h-1.5 bg-brand-violet rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <div className="typing-dot w-1.5 h-1.5 bg-brand-violet rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-3">
            <div className="flex flex-wrap gap-2 mb-3">
              <button onClick={() => setChatInput('Explain this concept')} className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-2 py-1 rounded-full transition-colors border border-gray-700">Explain concept</button>
              <button onClick={() => setChatInput('Debug my code')} className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-2 py-1 rounded-full transition-colors border border-gray-700">Debug code</button>
            </div>
            <div className="relative">
              <input 
                type="text" 
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask Gemini..." 
                className="w-full bg-gray-900 border border-[#262e3c] rounded-md py-2 pl-3 pr-10 text-sm text-white focus:outline-none focus:border-brand-violet focus:ring-1 focus:ring-brand-violet"
              />
              <button 
                onClick={handleSendMessage}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-violet transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Ask an Expert */}
        <div className="h-64 p-4 flex flex-col bg-[#0a0d11]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-sm text-white flex items-center gap-2">
              <Sparkles size={14} className="text-brand-amber" />
              Need Expert Help?
            </h3>
            <button onClick={() => setActivePage('/experts')} className="text-xs text-brand-teal hover:underline">Browse All</button>
          </div>
          
          <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
            {EXPERTS.slice(0, 2).map(exp => (
              <div key={exp.id} className="bg-gray-800/50 border border-[#262e3c] rounded-lg p-3 flex gap-3 items-center expert-card transition-colors hover:border-gray-600">
                <img src={exp.avatar} alt={exp.name} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-white truncate">{exp.name}</h4>
                  <p className="text-xs text-brand-amber font-mono">₹{exp.hourlyRate}/hr</p>
                </div>
                <button 
                  onClick={() => setActivePage('/booking', { expertId: exp.id })}
                  className="px-3 py-1 bg-brand-teal/10 text-brand-teal hover:bg-brand-teal hover:text-[#0C0F14] text-xs font-medium rounded transition-colors"
                >
                  Book
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Mobile FAB */}
      <button 
        className="lg:hidden absolute bottom-6 right-6 w-14 h-14 bg-brand-violet rounded-full flex items-center justify-center text-white shadow-lg shadow-brand-violet/20"
        onClick={() => setShowMobileRightPanel(true)}
      >
        <Bot size={24} />
      </button>
    </div>
  );
};

export default LearnWorkspacePage;
