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
      learn_sections: {
        Row: {
          id: string
          created_at: string
          updated_at: string | null
          title: string
          description: string | null
          section_type: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string | null
          title: string
          description?: string | null
          section_type: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string | null
          title?: string
          description?: string | null
          section_type?: string
        }
      }
      learn_cards: {
        Row: {
          id: string
          created_at: string
          updated_at: string | null
          section_id: string
          title: string
          description: string | null
          action_text: string | null
          action_link: string | null
          image_url: string | null
          is_active: boolean
          display_order: number
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string | null
          section_id: string
          title: string
          description?: string | null
          action_text?: string | null
          action_link?: string | null
          image_url?: string | null
          is_active?: boolean
          display_order: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string | null
          section_id?: string
          title?: string
          description?: string | null
          action_text?: string | null
          action_link?: string | null
          image_url?: string | null
          is_active?: boolean
          display_order?: number
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
