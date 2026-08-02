'use client';
import { useSprintStore } from '@/stores/sprintStore';
import { Flame, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  const { sprint, currentDay, streak, isLoading } = useSprintStore();

  if (isLoading || !sprint) {
    return (
      <header className="border-b bg-white p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="flex gap-4">
          <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
      </header>
    );
  }

  const progressPercentage = Math.round((currentDay / sprint.total_days) * 100);

  return (
    <header className="border-b bg-white p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-3">
        <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">{sprint.title}</h1>
      </div>
      
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-1.5 font-medium">
          <Flame className={`w-5 h-5 ${streak > 0 ? 'text-orange-500 fill-orange-500' : 'text-gray-400'}`} />
          <span className={streak > 0 ? 'text-orange-600' : 'text-gray-500'}>
            {streak} {streak === 1 ? 'day' : 'days'}
          </span>
        </div>
        
        <div className="flex items-center gap-3 w-48">
          <span className="text-gray-600 font-medium whitespace-nowrap">Day {currentDay} of {sprint.total_days}</span>
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </header>
  );
}
