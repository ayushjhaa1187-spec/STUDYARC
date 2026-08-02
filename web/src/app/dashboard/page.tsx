'use client';
import { useEffect } from 'react';
import { useSprintStore } from '@/stores/sprintStore';
import { DailyTaskCard } from '@/components/dashboard/DailyTaskCard';
import { AICoachChat } from '@/components/dashboard/AICoachChat';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { fetchSprint, sprint, isLoading, error, setSprintData } = useSprintStore();
  const router = useRouter();

  useEffect(() => {
    fetchSprint();
  }, [fetchSprint]);

  useEffect(() => {
    if (error === 'No active sprint found.') {
      router.push('/onboarding/diagnostic');
    }
  }, [error, router]);

  useEffect(() => {
    if (!sprint) return;

    const supabase = createClient();
    
    // Subscribe to real-time sprint updates
    const channel = supabase
      .channel('sprint-updates')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'sprints', filter: `id=eq.${sprint.id}` },
        (payload) => { 
          // Re-sync store state when another tab updates it
          setSprintData({
            currentDay: payload.new.current_day,
            streak: payload.new.streak,
          });
        }
      )
      .subscribe();

    return () => { 
      supabase.removeChannel(channel); 
    };
  }, [sprint, setSprintData]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center p-12">
         <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error && error !== 'No active sprint found.') {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 text-center">
        <h3 className="font-bold mb-2">Error Loading Dashboard</h3>
        <p>{error}</p>
        <button onClick={() => fetchSprint()} className="mt-4 px-4 py-2 bg-red-100 rounded hover:bg-red-200 transition-colors text-sm font-medium">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 items-start pb-8">
      <div className="flex flex-col gap-6">
        <DailyTaskCard />
      </div>
      
      <div className="sticky top-6">
        <AICoachChat />
      </div>
    </div>
  );
}
