// Auto-generated types for Supabase
import { WikiPage } from './wiki';

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
      profiles: {
        Row: {
          id: string;
          updated_at?: string | null;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          website?: string | null;
        };
        Insert: {
          id: string;
          updated_at?: string | null;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          website?: string | null;
        };
        Update: {
          id?: string;
          updated_at?: string | null;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          website?: string | null;
        };
      };
      wiki_pages: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          title: string;
          content: Json;
          slug: string;
          is_published: boolean;
          user_id: string;
          folder_id?: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title: string;
          content: Json;
          slug: string;
          is_published?: boolean;
          user_id: string;
          folder_id?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title?: string;
          content?: Json;
          slug?: string;
          is_published?: boolean;
          user_id?: string;
          folder_id?: string | null;
        };
      };
      wiki_folders: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          name: string;
          slug: string;
          parent_id?: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name: string;
          slug: string;
          parent_id?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name?: string;
          slug?: string;
          parent_id?: string | null;
        };
      };
      products: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          name: string;
          description?: string | null;
          price: number;
          image_url?: string | null;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name: string;
          description?: string | null;
          price: number;
          image_url?: string | null;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name?: string;
          description?: string | null;
          price?: number;
          image_url?: string | null;
          is_active?: boolean;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          status: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid';
          price_id: string;
          quantity?: number;
          cancel_at_period_end?: boolean;
          created_at: string;
          updated_at: string;
          current_period_end: string;
          current_period_start: string;
          ended_at?: string | null;
          cancel_at?: string | null;
          canceled_at?: string | null;
          trial_start?: string | null;
          trial_end?: string | null;
        };
        Insert: {
          id: string;
          user_id: string;
          status: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid';
          price_id: string;
          quantity?: number;
          cancel_at_period_end?: boolean;
          created_at?: string;
          updated_at?: string;
          current_period_end: string;
          current_period_start: string;
          ended_at?: string | null;
          cancel_at?: string | null;
          canceled_at?: string | null;
          trial_start?: string | null;
          trial_end?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          status?: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid';
          price_id?: string;
          quantity?: number;
          cancel_at_period_end?: boolean;
          created_at?: string;
          updated_at?: string;
          current_period_end?: string;
          current_period_start?: string;
          ended_at?: string | null;
          cancel_at?: string | null;
          canceled_at?: string | null;
          trial_start?: string | null;
          trial_end?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Export types for easier access
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

export type Profile = Tables<'profiles'>;
export type WikiFolder = Tables<'wiki_folders'>;
export type Product = Tables<'products'>;
export type Subscription = Tables<'subscriptions'>;

export type WikiNavItem = {
  id: string;
  title: string;
  slug: string;
  type: 'page' | 'folder';
  children?: WikiNavItem[];
  parent_id?: string | null;
};

export type WikiSection = {
  id: string;
  type: string;
  content: Json;
  order: number;
  wiki_page_id: string;
  created_at: string;
  updated_at: string;
};

export type UserProfile = Profile & {
  username: string;
  full_name: string;
  avatar_url: string;
};