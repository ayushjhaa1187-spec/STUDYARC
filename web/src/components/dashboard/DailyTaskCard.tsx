'use client';
import { useSprintStore } from '@/stores/sprintStore';
import { useState } from 'react';
import { Check, ArrowRight, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export function DailyTaskCard() {
  const { sprint, dailyTasks, currentDay, markDayComplete, isLoading, progress } = useSprintStore();
  const [isCompleting, setIsCompleting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  if (isLoading || !sprint) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
        <div className="h-24 bg-gray-200 rounded mb-6 animate-pulse"></div>
        <div className="h-12 bg-gray-200 rounded w-48 animate-pulse"></div>
      </div>
    );
  }

  if (sprint.status === 'completed') {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Sprint Completed! 🎉</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Incredible work! You've completed all {sprint.total_days} days of this sprint. Check your portfolio to see your progress.
        </p>
        <button className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
          View Portfolio
        </button>
      </div>
    );
  }

  const task = dailyTasks.find(t => t.day === currentDay);
  const isCompleted = progress.some(p => p.day === currentDay && p.is_completed);

  const handleComplete = async () => {
    setIsCompleting(true);
    await markDayComplete(currentDay);
    setIsCompleting(false);
    
    // Show confetti/success state temporarily before advancing
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  if (!task) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-8 text-center text-gray-500">
        Task for Day {currentDay} not found.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden relative">
      {/* Decorative top border */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-indigo-500" />
      
      <div className="p-8">
        <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-sm font-semibold text-blue-800 mb-4">
          Today's Task
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{task.title}</h2>
        
        <div className="prose prose-blue max-w-none mb-8 text-gray-600">
          <ReactMarkdown>{task.description}</ReactMarkdown>
        </div>
        
        {task.resources && task.resources.length > 0 && (
          <div className="mb-8">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Resources</h4>
            <div className="flex flex-wrap gap-2">
              {task.resources.map((res, i) => (
                <a 
                  key={i} 
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  {res.label}
                </a>
              ))}
            </div>
          </div>
        )}
        
        <button
          onClick={handleComplete}
          disabled={isCompleted || isCompleting}
          className={`
            w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg font-bold text-white transition-all
            ${isCompleted ? 'bg-green-500 cursor-default' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md active:transform active:scale-95'}
            ${isCompleting ? 'opacity-80 cursor-wait' : ''}
          `}
        >
          {isCompleting ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : isCompleted ? (
            <><Check className="w-5 h-5" /> Completed</>
          ) : (
            <><Check className="w-5 h-5" /> Mark as Complete</>
          )}
        </button>
      </div>
      
      {/* Optional: Add confetti rendering logic here if desired */}
    </div>
  );
}
