export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      sprints: {
        Row: {
          id: string
          user_id: string
          title: string
          status: 'active' | 'completed' | 'dropped'
          started_at: string
          completed_at: string | null
          last_activity_at: string | null
          total_days: number
          current_day: number
          streak: number
        }
        Insert: Omit<Database['public']['Tables']['sprints']['Row'], 'id' | 'started_at' | 'current_day' | 'streak'>
        Update: Partial<Database['public']['Tables']['sprints']['Insert']>
      }
      daily_progress: {
        Row: {
          id: string
          user_id: string
          sprint_id: string
          day: number
          is_completed: boolean
          completed_at: string | null
          notes: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['daily_progress']['Row'], 'id' | 'created_at' | 'is_completed'>
        Update: Partial<Database['public']['Tables']['daily_progress']['Insert']>
      }
      chat_history: {
        Row: {
          id: string
          user_id: string
          sprint_id: string
          role: 'user' | 'assistant'
          message: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['chat_history']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['chat_history']['Insert']>
      }
      user_activities: {
        Row: {
          id: string
          user_id: string
          event_type: string
          metadata: Json | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['user_activities']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['user_activities']['Insert']>
      }
      tasks: {
        Row: {
          id: string
          sprint_id: string
          title: string
          description: string | null
          day: number
          is_completed: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
