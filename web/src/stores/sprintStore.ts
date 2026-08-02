import { create } from 'zustand'
import { Sprint, DailyTask, DailyProgress, ChatMessage } from '@/types/sprint'

interface SprintState {
  sprint: Sprint | null;
  dailyTasks: DailyTask[];
  progress: DailyProgress[];
  chatHistory: ChatMessage[];
  currentDay: number;
  streak: number;
  
  isLoading: boolean;
  isChatLoading: boolean;
  error: string | null;

  setSprintData: (data: Partial<SprintState>) => void;
  fetchSprint: () => Promise<void>;
  markDayComplete: (day: number) => Promise<void>;
  sendChatMessage: (message: string, sprintId: string) => Promise<void>;
  resetStore: () => void;
}

export const useSprintStore = create<SprintState>((set, get) => ({
  sprint: null,
  dailyTasks: [],
  progress: [],
  chatHistory: [],
  currentDay: 1,
  streak: 0,
  isLoading: true,
  isChatLoading: false,
  error: null,

  setSprintData: (data) => set((state) => ({ ...state, ...data })),

  fetchSprint: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch('/api/sprints/current');
      if (!res.ok) {
        if (res.status === 404) {
          set({ error: 'No active sprint found.', isLoading: false });
          return;
        }
        throw new Error('Failed to fetch sprint data');
      }
      
      const data = await res.json();
      set({
        sprint: data.sprint,
        dailyTasks: data.daily_tasks,
        progress: data.progress,
        currentDay: data.sprint.current_day,
        streak: data.sprint.streak,
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  markDayComplete: async (day) => {
    // Optimistic update
    const prevProgress = get().progress;
    const prevDay = get().currentDay;
    const prevStreak = get().streak;
    
    set((state) => ({
      progress: [...state.progress, { id: 'temp-id', day, is_completed: true, completed_at: new Date().toISOString() }],
      currentDay: state.currentDay + 1,
      streak: state.streak + 1 // optimistic streak increment
    }));

    try {
      const res = await fetch('/api/sprints/task/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day }),
      });
      
      if (!res.ok) throw new Error('Failed to mark day as complete');
      
      const data = await res.json();
      // Sync with server state
      set({
        currentDay: data.new_day,
        streak: data.streak,
      });
      // A refetch could also be triggered here if needed, but we rely on realtime or optimistic for now.
    } catch (err: any) {
      // Revert optimistic update
      set({
        progress: prevProgress,
        currentDay: prevDay,
        streak: prevStreak,
        error: err.message,
      });
    }
  },

  sendChatMessage: async (message, sprintId) => {
    const tempId = `temp-${Date.now()}`;
    // Optimistic update user message
    set((state) => ({
      chatHistory: [...state.chatHistory, { id: tempId, role: 'user', message, created_at: new Date().toISOString() }],
      isChatLoading: true,
    }));

    try {
      const res = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, sprint_id: sprintId }),
      });
      
      if (!res.ok) throw new Error('Failed to send message');
      
      const data = await res.json();
      
      // We expect the backend to return the assistant's message or we can refetch chat history
      set((state) => ({
        chatHistory: [
          ...state.chatHistory,
          { id: `asst-${Date.now()}`, role: 'assistant', message: data.response, created_at: new Date().toISOString() }
        ],
        isChatLoading: false,
      }));
    } catch (err: any) {
      set((state) => ({
        // Optionally remove the user message if it failed, or show error
        error: err.message,
        isChatLoading: false,
      }));
    }
  },

  resetStore: () => set({
    sprint: null,
    dailyTasks: [],
    progress: [],
    chatHistory: [],
    currentDay: 1,
    streak: 0,
    isLoading: false,
    error: null,
  })
}));
