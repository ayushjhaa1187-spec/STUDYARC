'use client';
import { useSprintStore } from '@/stores/sprintStore';
import { CheckCircle2, Circle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ProgressSidebar() {
  const { sprint, progress, currentDay, isLoading } = useSprintStore();

  if (isLoading || !sprint) {
    return (
      <aside className="w-full md:w-64 border-r bg-gray-50/50 p-6 flex flex-col gap-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-10 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </aside>
    );
  }

  const days = Array.from({ length: sprint.total_days }, (_, i) => i + 1);

  return (
    <aside className="w-full md:w-64 border-r bg-gray-50/50 p-6 overflow-y-auto max-h-[400px] md:max-h-[calc(100vh-73px)] scrollbar-thin">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Sprint Timeline</h3>
      <div className="flex flex-col relative">
        {/* Timeline line connecting items */}
        <div className="absolute left-3.5 top-3 bottom-3 w-px bg-gray-200 -z-10" />
        
        {days.map((day) => {
          const isCompleted = progress.some(p => p.day === day && p.is_completed);
          const isCurrent = day === currentDay;
          const isFuture = day > currentDay;

          return (
            <div 
              key={day} 
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg mb-1 transition-colors relative z-0",
                isCurrent ? "bg-white shadow-sm border border-blue-100" : "hover:bg-gray-100/50",
                isFuture && "opacity-60"
              )}
            >
              <div className="flex-shrink-0 bg-white">
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500 fill-green-50" />
                ) : isCurrent ? (
                  <div className="w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center relative">
                     <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  </div>
                ) : (
                  <Circle className="w-6 h-6 text-gray-300" />
                )}
              </div>
              
              <div className="flex flex-col">
                <span className={cn(
                  "text-sm font-medium",
                  isCurrent ? "text-blue-700" : isCompleted ? "text-gray-900" : "text-gray-500"
                )}>
                  Day {day}
                </span>
                {/* Normally we'd show task title here, but for now just simple day text if tasks aren't loaded in full */}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
