import { create } from 'zustand';
import { z } from 'zod';

export const AIOutputSchema = z.object({
  career_map: z.string().min(20),
  recommended_sprint: z.object({
    name: z.string().min(5),
    duration_days: z.number().int().min(14).max(45),
    daily_tasks: z.array(
      z.object({
        day: z.number().int(),
        title: z.string().min(3),
        description: z.string().min(10)
      })
    )
  })
});

export type AIOutput = z.infer<typeof AIOutputSchema>;

interface DiagnosticState {
  step: 1 | 2 | 3 | 4 | 5;
  // Form Data
  goal: string | null;
  skill_level: string | null;
  hours_per_week: number | null;
  university: string;
  graduation_year: number | null;
  github_url: string;
  resume_file: File | null;
  // AI Result
  ai_result: AIOutput | null;
  // UI flags
  is_loading: boolean;
  error: string | null;
  // Actions
  setStep: (step: 1 | 2 | 3 | 4 | 5) => void;
  updateForm: (data: Partial<DiagnosticState>) => void;
  submitDiagnostic: () => Promise<void>;
  startSprint: () => Promise<void>;
}

export const useDiagnosticStore = create<DiagnosticState>((set, get) => ({
  step: 1,
  goal: null,
  skill_level: null,
  hours_per_week: null,
  university: '',
  graduation_year: null,
  github_url: '',
  resume_file: null,
  ai_result: null,
  is_loading: false,
  error: null,

  setStep: (step) => set({ step }),

  updateForm: (data) => set((state) => ({ ...state, ...data })),

  submitDiagnostic: async () => {
    set({ is_loading: true, error: null, step: 4 });
    const state = get();
    
    try {
      let resume_text = null;
      // In a real app, you would upload the file to Supabase Storage first,
      // and maybe extract text or just send the URL.
      // For now, we simulate sending required text or url if provided.
      
      const payload = {
        goal: state.goal,
        skill_level: state.skill_level,
        hours_per_week: state.hours_per_week,
        github_url: state.github_url,
        resume_text: resume_text,
      };

      const res = await fetch('/api/ai/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to generate diagnostic');
      }

      const data = await res.json();
      set({ ai_result: data, step: 5, is_loading: false });
    } catch (err: any) {
      set({ error: err.message, is_loading: false });
      // Keep it on step 4 to show error and retry
    }
  },

  startSprint: async () => {
    const state = get();
    if (!state.ai_result) return;
    
    // Call the sprint creation API endpoint
    try {
      const res = await fetch('/api/sprints/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessment: {
            goal: state.goal,
            skill_level: state.skill_level,
            hours_per_week: state.hours_per_week,
            github_url: state.github_url,
          },
          sprint: state.ai_result.recommended_sprint
        })
      });

      if (!res.ok) throw new Error('Failed to start sprint');
      
      // Successfully created sprint, caller should redirect to dashboard
    } catch (err: any) {
      set({ error: err.message });
    }
  }
}));
