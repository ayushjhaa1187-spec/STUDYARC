export interface Sprint {
  id: string;
  name: string; // Used interchangeably with title in the UI
  title: string;
  status: 'active' | 'completed' | 'dropped';
  total_days: number;
  current_day: number;
  streak: number;
  last_activity_at?: string;
}

export interface DailyTask {
  day: number;
  title: string;
  description: string;
  resources?: { label: string; url: string }[];
}

export interface DailyProgress {
  id: string;
  day: number;
  is_completed: boolean;
  completed_at?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  message: string;
  created_at: string;
}
