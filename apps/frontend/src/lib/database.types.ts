export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          category: string
          created_at: string
          criteria: Json | null
          description: string
          icon: string | null
          id: string
          is_active: boolean | null
          max_progress: number | null
          name: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          criteria?: Json | null
          description: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          max_progress?: number | null
          name: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          criteria?: Json | null
          description?: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          max_progress?: number | null
          name?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      activity_log: {
        Row: {
          action_type: string
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_subscription_status"
            referencedColumns: ["user_id"]
          },
        ]
      }
      analytics_events: {
        Row: {
          event_type: string | null
          id: string
          metadata: Json | null
          occurred_at: string | null
          session_id: string | null
          target_id: string | null
          user_id: string | null
        }
        Insert: {
          event_type?: string | null
          id?: string
          metadata?: Json | null
          occurred_at?: string | null
          session_id?: string | null
          target_id?: string | null
          user_id?: string | null
        }
        Update: {
          event_type?: string | null
          id?: string
          metadata?: Json | null
          occurred_at?: string | null
          session_id?: string | null
          target_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      arcs: {
        Row: {
          cover_image: string | null
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          order_index: number
          publish_at: string | null
          saga_id: string
          slug: string
          state: string | null
          subtitle: string | null
          title: string
          unpublish_at: string | null
          updated_at: string | null
        }
        Insert: {
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          order_index?: number
          publish_at?: string | null
          saga_id: string
          slug: string
          state?: string | null
          subtitle?: string | null
          title: string
          unpublish_at?: string | null
          updated_at?: string | null
        }
        Update: {
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          order_index?: number
          publish_at?: string | null
          saga_id?: string
          slug?: string
          state?: string | null
          subtitle?: string | null
          title?: string
          unpublish_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "arcs_saga_id_fkey"
            columns: ["saga_id"]
            isOneToOne: false
            referencedRelation: "sagas"
            referencedColumns: ["id"]
          },
        ]
      }
      artist_collaborations: {
        Row: {
          brief: Json | null
          created_at: string | null
          due_at: string | null
          files: Json | null
          id: string
          payout_cents: number | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          brief?: Json | null
          created_at?: string | null
          due_at?: string | null
          files?: Json | null
          id?: string
          payout_cents?: number | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          brief?: Json | null
          created_at?: string | null
          due_at?: string | null
          files?: Json | null
          id?: string
          payout_cents?: number | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          action: string
          actor_user_id: string | null
          created_at: string
          id: string
        }
        Insert: {
          action: string
          actor_user_id?: string | null
          created_at?: string
          id?: string
        }
        Update: {
          action?: string
          actor_user_id?: string | null
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      authors_journey_posts: {
        Row: {
          author_id: string | null
          content: string | null
          created_at: string | null
          id: string
          published_at: string | null
          slug: string | null
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          published_at?: string | null
          slug?: string | null
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          published_at?: string | null
          slug?: string | null
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      beta_applications: {
        Row: {
          answers: Json | null
          applicant_email: string
          created_at: string | null
          id: string
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          answers?: Json | null
          applicant_email: string
          created_at?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          answers?: Json | null
          applicant_email?: string
          created_at?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          posts_count: number | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          posts_count?: number | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          posts_count?: number | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      blog_comments: {
        Row: {
          blog_post_id: string | null
          content: string
          created_at: string | null
          id: string
          is_approved: boolean | null
          is_pinned: boolean | null
          likes_count: number | null
          parent_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          blog_post_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          is_pinned?: boolean | null
          likes_count?: number | null
          parent_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          blog_post_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          is_pinned?: boolean | null
          likes_count?: number | null
          parent_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_comments_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts_with_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_comments_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "published_blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "blog_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_likes: {
        Row: {
          blog_post_id: string | null
          created_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          blog_post_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          blog_post_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_likes_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_likes_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts_with_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_likes_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "published_blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_post_tags: {
        Row: {
          blog_post_id: string
          tag_id: string
        }
        Insert: {
          blog_post_id: string
          tag_id: string
        }
        Update: {
          blog_post_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_tags_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_tags_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts_with_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_tags_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "published_blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "blog_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author: string | null
          author_id: string | null
          category: string | null
          comments_count: number | null
          content: string
          cover_url: string | null
          created_at: string | null
          excerpt: string | null
          featured_image: string | null
          featured_order: number | null
          id: string
          is_featured: boolean | null
          likes_count: number | null
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          reading_time: number | null
          shares_count: number | null
          slug: string
          social_image: string | null
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          views: number | null
          word_count: number | null
        }
        Insert: {
          author?: string | null
          author_id?: string | null
          category?: string | null
          comments_count?: number | null
          content: string
          cover_url?: string | null
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          featured_order?: number | null
          id?: string
          is_featured?: boolean | null
          likes_count?: number | null
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          reading_time?: number | null
          shares_count?: number | null
          slug: string
          social_image?: string | null
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          views?: number | null
          word_count?: number | null
        }
        Update: {
          author?: string | null
          author_id?: string | null
          category?: string | null
          comments_count?: number | null
          content?: string
          cover_url?: string | null
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          featured_order?: number | null
          id?: string
          is_featured?: boolean | null
          likes_count?: number | null
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          reading_time?: number | null
          shares_count?: number | null
          slug?: string
          social_image?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          views?: number | null
          word_count?: number | null
        }
        Relationships: []
      }
      blog_shares: {
        Row: {
          blog_post_id: string | null
          created_at: string | null
          id: string
          platform: string
          user_id: string | null
        }
        Insert: {
          blog_post_id?: string | null
          created_at?: string | null
          id?: string
          platform: string
          user_id?: string | null
        }
        Update: {
          blog_post_id?: string | null
          created_at?: string | null
          id?: string
          platform?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_shares_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_shares_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts_with_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_shares_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "published_blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_tags: {
        Row: {
          created_at: string | null
          id: string
          name: string
          posts_count: number | null
          slug: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          posts_count?: number | null
          slug: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          posts_count?: number | null
          slug?: string
        }
        Relationships: []
      }
      blog_views: {
        Row: {
          blog_post_id: string | null
          id: string
          ip_address: unknown | null
          reading_time: number | null
          scroll_percentage: number | null
          user_agent: string | null
          user_id: string | null
          viewed_at: string | null
        }
        Insert: {
          blog_post_id?: string | null
          id?: string
          ip_address?: unknown | null
          reading_time?: number | null
          scroll_percentage?: number | null
          user_agent?: string | null
          user_id?: string | null
          viewed_at?: string | null
        }
        Update: {
          blog_post_id?: string | null
          id?: string
          ip_address?: unknown | null
          reading_time?: number | null
          scroll_percentage?: number | null
          user_agent?: string | null
          user_id?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_views_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_views_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts_with_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_views_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "published_blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      chapter_revisions: {
        Row: {
          chapter_id: string
          content_json: Json | null
          content_text: string | null
          content_url: string | null
          created_at: string | null
          created_by: string | null
          id: string
          revision_notes: string | null
          title: string | null
          version_number: number
        }
        Insert: {
          chapter_id: string
          content_json?: Json | null
          content_text?: string | null
          content_url?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          revision_notes?: string | null
          title?: string | null
          version_number: number
        }
        Update: {
          chapter_id?: string
          content_json?: Json | null
          content_text?: string | null
          content_url?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          revision_notes?: string | null
          title?: string | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "chapter_revisions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chapter_revisions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_subscription_status"
            referencedColumns: ["user_id"]
          },
        ]
      }
      chapters: {
        Row: {
          banner_file_id: string | null
          chapter_number: number
          content: Json
          content_format: string
          created_at: string | null
          estimated_read_time: number | null
          free_chapter_order: number | null
          hero_file_id: string | null
          id: string
          is_free: boolean
          issue_id: string
          metadata: Json | null
          plain_content: string | null
          published_at: string | null
          slug: string
          status: Database["public"]["Enums"]["chapter_status"] | null
          subscription_tier_required: string | null
          title: string
          updated_at: string | null
          word_count: number | null
        }
        Insert: {
          banner_file_id?: string | null
          chapter_number: number
          content?: Json
          content_format?: string
          created_at?: string | null
          estimated_read_time?: number | null
          free_chapter_order?: number | null
          hero_file_id?: string | null
          id?: string
          is_free?: boolean
          issue_id: string
          metadata?: Json | null
          plain_content?: string | null
          published_at?: string | null
          slug: string
          status?: Database["public"]["Enums"]["chapter_status"] | null
          subscription_tier_required?: string | null
          title: string
          updated_at?: string | null
          word_count?: number | null
        }
        Update: {
          banner_file_id?: string | null
          chapter_number?: number
          content?: Json
          content_format?: string
          created_at?: string | null
          estimated_read_time?: number | null
          free_chapter_order?: number | null
          hero_file_id?: string | null
          id?: string
          is_free?: boolean
          issue_id?: string
          metadata?: Json | null
          plain_content?: string | null
          published_at?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["chapter_status"] | null
          subscription_tier_required?: string | null
          title?: string
          updated_at?: string | null
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "chapters_banner_file_id_fkey"
            columns: ["banner_file_id"]
            isOneToOne: false
            referencedRelation: "files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chapters_hero_file_id_fkey"
            columns: ["hero_file_id"]
            isOneToOne: false
            referencedRelation: "files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chapters_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chapters_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "content_items_with_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chapters_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "library_content_view"
            referencedColumns: ["id"]
          },
        ]
      }
      character_abilities: {
        Row: {
          category: Database["public"]["Enums"]["ability_category"]
          character_id: string
          created_at: string | null
          description: string
          id: string
          is_hidden: boolean | null
          is_signature_ability: boolean | null
          mastery_level: number
          name: string
          power_level: Database["public"]["Enums"]["power_level"]
          updated_at: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["ability_category"]
          character_id: string
          created_at?: string | null
          description: string
          id?: string
          is_hidden?: boolean | null
          is_signature_ability?: boolean | null
          mastery_level?: number
          name: string
          power_level?: Database["public"]["Enums"]["power_level"]
          updated_at?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["ability_category"]
          character_id?: string
          created_at?: string | null
          description?: string
          id?: string
          is_hidden?: boolean | null
          is_signature_ability?: boolean | null
          mastery_level?: number
          name?: string
          power_level?: Database["public"]["Enums"]["power_level"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "character_abilities_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "character_abilities_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters_with_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      character_appearances: {
        Row: {
          chapter_id: string | null
          character_id: string
          content_item_id: string | null
          created_at: string | null
          description: string | null
          first_mention_at: string | null
          id: string
          importance: Database["public"]["Enums"]["character_importance"]
          updated_at: string | null
        }
        Insert: {
          chapter_id?: string | null
          character_id: string
          content_item_id?: string | null
          created_at?: string | null
          description?: string | null
          first_mention_at?: string | null
          id?: string
          importance?: Database["public"]["Enums"]["character_importance"]
          updated_at?: string | null
        }
        Update: {
          chapter_id?: string | null
          character_id?: string
          content_item_id?: string | null
          created_at?: string | null
          description?: string | null
          first_mention_at?: string | null
          id?: string
          importance?: Database["public"]["Enums"]["character_importance"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "character_appearances_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "character_appearances_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters_with_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      character_relationships: {
        Row: {
          character_id: string
          created_at: string | null
          description: string | null
          ended_at: string | null
          id: string
          is_mutual: boolean | null
          is_spoiler_sensitive: boolean | null
          related_character_id: string
          relationship_type: Database["public"]["Enums"]["relationship_type"]
          spoiler_tags: string[] | null
          started_at: string | null
          strength: number
          updated_at: string | null
        }
        Insert: {
          character_id: string
          created_at?: string | null
          description?: string | null
          ended_at?: string | null
          id?: string
          is_mutual?: boolean | null
          is_spoiler_sensitive?: boolean | null
          related_character_id: string
          relationship_type: Database["public"]["Enums"]["relationship_type"]
          spoiler_tags?: string[] | null
          started_at?: string | null
          strength?: number
          updated_at?: string | null
        }
        Update: {
          character_id?: string
          created_at?: string | null
          description?: string | null
          ended_at?: string | null
          id?: string
          is_mutual?: boolean | null
          is_spoiler_sensitive?: boolean | null
          related_character_id?: string
          relationship_type?: Database["public"]["Enums"]["relationship_type"]
          spoiler_tags?: string[] | null
          started_at?: string | null
          strength?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "character_relationships_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "character_relationships_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters_with_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "character_relationships_related_character_id_fkey"
            columns: ["related_character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "character_relationships_related_character_id_fkey"
            columns: ["related_character_id"]
            isOneToOne: false
            referencedRelation: "characters_with_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      character_versions: {
        Row: {
          age_range: string | null
          character_id: string
          created_at: string | null
          description: string
          first_appearance_content_id: string | null
          id: string
          last_appearance_content_id: string | null
          personality_changes: string[] | null
          portrait_file_id: string | null
          power_level: Database["public"]["Enums"]["power_level"] | null
          time_period: string | null
          updated_at: string | null
          version_name: string
        }
        Insert: {
          age_range?: string | null
          character_id: string
          created_at?: string | null
          description: string
          first_appearance_content_id?: string | null
          id?: string
          last_appearance_content_id?: string | null
          personality_changes?: string[] | null
          portrait_file_id?: string | null
          power_level?: Database["public"]["Enums"]["power_level"] | null
          time_period?: string | null
          updated_at?: string | null
          version_name: string
        }
        Update: {
          age_range?: string | null
          character_id?: string
          created_at?: string | null
          description?: string
          first_appearance_content_id?: string | null
          id?: string
          last_appearance_content_id?: string | null
          personality_changes?: string[] | null
          portrait_file_id?: string | null
          power_level?: Database["public"]["Enums"]["power_level"] | null
          time_period?: string | null
          updated_at?: string | null
          version_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "character_versions_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "character_versions_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters_with_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      characters: {
        Row: {
          age: number | null
          age_description: string | null
          aliases: string[] | null
          allegiances: string[] | null
          background_summary: string | null
          build: string | null
          character_arc_summary: string | null
          character_type: Database["public"]["Enums"]["character_type"]
          color_theme: string | null
          created_at: string | null
          created_by_user_id: string | null
          description: string
          distinguishing_features: string | null
          eye_color: string | null
          fears: string[] | null
          first_appearance_content_id: string | null
          gallery_file_ids: string[] | null
          gender: string | null
          goals: string[] | null
          hair_color: string | null
          height: string | null
          id: string
          importance_score: number
          is_major_character: boolean | null
          is_pov_character: boolean | null
          is_spoiler_sensitive: boolean | null
          last_appearance_content_id: string | null
          location: string | null
          meta_description: string | null
          meta_keywords: string[] | null
          motivations: string[] | null
          name: string
          occupation: string | null
          origin: string | null
          personality_traits: string[] | null
          portrait_file_id: string | null
          portrait_url: string | null
          power_level: Database["public"]["Enums"]["power_level"]
          primary_faction: string | null
          search_vector: unknown | null
          skills: string[] | null
          slug: string
          species: string | null
          spoiler_tags: string[] | null
          status: Database["public"]["Enums"]["character_status"]
          title: string | null
          updated_at: string | null
          weaknesses: string[] | null
        }
        Insert: {
          age?: number | null
          age_description?: string | null
          aliases?: string[] | null
          allegiances?: string[] | null
          background_summary?: string | null
          build?: string | null
          character_arc_summary?: string | null
          character_type?: Database["public"]["Enums"]["character_type"]
          color_theme?: string | null
          created_at?: string | null
          created_by_user_id?: string | null
          description: string
          distinguishing_features?: string | null
          eye_color?: string | null
          fears?: string[] | null
          first_appearance_content_id?: string | null
          gallery_file_ids?: string[] | null
          gender?: string | null
          goals?: string[] | null
          hair_color?: string | null
          height?: string | null
          id?: string
          importance_score?: number
          is_major_character?: boolean | null
          is_pov_character?: boolean | null
          is_spoiler_sensitive?: boolean | null
          last_appearance_content_id?: string | null
          location?: string | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          motivations?: string[] | null
          name: string
          occupation?: string | null
          origin?: string | null
          personality_traits?: string[] | null
          portrait_file_id?: string | null
          portrait_url?: string | null
          power_level?: Database["public"]["Enums"]["power_level"]
          primary_faction?: string | null
          search_vector?: unknown | null
          skills?: string[] | null
          slug: string
          species?: string | null
          spoiler_tags?: string[] | null
          status?: Database["public"]["Enums"]["character_status"]
          title?: string | null
          updated_at?: string | null
          weaknesses?: string[] | null
        }
        Update: {
          age?: number | null
          age_description?: string | null
          aliases?: string[] | null
          allegiances?: string[] | null
          background_summary?: string | null
          build?: string | null
          character_arc_summary?: string | null
          character_type?: Database["public"]["Enums"]["character_type"]
          color_theme?: string | null
          created_at?: string | null
          created_by_user_id?: string | null
          description?: string
          distinguishing_features?: string | null
          eye_color?: string | null
          fears?: string[] | null
          first_appearance_content_id?: string | null
          gallery_file_ids?: string[] | null
          gender?: string | null
          goals?: string[] | null
          hair_color?: string | null
          height?: string | null
          id?: string
          importance_score?: number
          is_major_character?: boolean | null
          is_pov_character?: boolean | null
          is_spoiler_sensitive?: boolean | null
          last_appearance_content_id?: string | null
          location?: string | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          motivations?: string[] | null
          name?: string
          occupation?: string | null
          origin?: string | null
          personality_traits?: string[] | null
          portrait_file_id?: string | null
          portrait_url?: string | null
          power_level?: Database["public"]["Enums"]["power_level"]
          primary_faction?: string | null
          search_vector?: unknown | null
          skills?: string[] | null
          slug?: string
          species?: string | null
          spoiler_tags?: string[] | null
          status?: Database["public"]["Enums"]["character_status"]
          title?: string | null
          updated_at?: string | null
          weaknesses?: string[] | null
        }
        Relationships: []
      }
      comment_likes: {
        Row: {
          comment_id: string | null
          created_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          comment_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          comment_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "blog_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          author_email: string | null
          author_name: string | null
          content: string
          created_at: string | null
          guide_id: string | null
          id: string
          parent_comment_id: string | null
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          author_email?: string | null
          author_name?: string | null
          content: string
          created_at?: string | null
          guide_id?: string | null
          id?: string
          parent_comment_id?: string | null
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          author_email?: string | null
          author_name?: string | null
          content?: string
          created_at?: string | null
          guide_id?: string | null
          id?: string
          parent_comment_id?: string | null
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "writing_guides"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "authors_journey_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      content_items: {
        Row: {
          average_rating: number | null
          completion_percentage: number | null
          cover_file_id: string | null
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          order_index: number | null
          parent_id: string | null
          published_at: string | null
          rating_count: number | null
          slug: string
          status: Database["public"]["Enums"]["content_status"] | null
          title: string
          type: Database["public"]["Enums"]["content_item_type"]
          updated_at: string | null
        }
        Insert: {
          average_rating?: number | null
          completion_percentage?: number | null
          cover_file_id?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          order_index?: number | null
          parent_id?: string | null
          published_at?: string | null
          rating_count?: number | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"] | null
          title: string
          type: Database["public"]["Enums"]["content_item_type"]
          updated_at?: string | null
        }
        Update: {
          average_rating?: number | null
          completion_percentage?: number | null
          cover_file_id?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          order_index?: number | null
          parent_id?: string | null
          published_at?: string | null
          rating_count?: number | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"] | null
          title?: string
          type?: Database["public"]["Enums"]["content_item_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_items_cover_file_id_fkey"
            columns: ["cover_file_id"]
            isOneToOne: false
            referencedRelation: "files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "content_items_with_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "library_content_view"
            referencedColumns: ["id"]
          },
        ]
      }
      content_ratings: {
        Row: {
          content_item_id: string
          created_at: string | null
          id: string
          is_approved: boolean | null
          is_featured: boolean | null
          rating: number
          reported_count: number | null
          review_text: string | null
          review_title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content_item_id: string
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          is_featured?: boolean | null
          rating: number
          reported_count?: number | null
          review_text?: string | null
          review_title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content_item_id?: string
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          is_featured?: boolean | null
          rating?: number
          reported_count?: number | null
          review_text?: string | null
          review_title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_ratings_content_item_id_fkey"
            columns: ["content_item_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_ratings_content_item_id_fkey"
            columns: ["content_item_id"]
            isOneToOne: false
            referencedRelation: "content_items_with_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_ratings_content_item_id_fkey"
            columns: ["content_item_id"]
            isOneToOne: false
            referencedRelation: "library_content_view"
            referencedColumns: ["id"]
          },
        ]
      }
      content_works: {
        Row: {
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          estimated_release: string | null
          id: string
          is_featured: boolean | null
          is_purchasable: boolean | null
          order_in_parent: number | null
          parent_id: string | null
          product_id: string | null
          progress_percentage: number | null
          rating: number | null
          release_date: string | null
          reviews_count: number | null
          sample_content: string | null
          status: string | null
          target_word_count: number | null
          title: string
          type: string
          updated_at: string | null
          word_count: number | null
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          estimated_release?: string | null
          id?: string
          is_featured?: boolean | null
          is_purchasable?: boolean | null
          order_in_parent?: number | null
          parent_id?: string | null
          product_id?: string | null
          progress_percentage?: number | null
          rating?: number | null
          release_date?: string | null
          reviews_count?: number | null
          sample_content?: string | null
          status?: string | null
          target_word_count?: number | null
          title: string
          type: string
          updated_at?: string | null
          word_count?: number | null
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          estimated_release?: string | null
          id?: string
          is_featured?: boolean | null
          is_purchasable?: boolean | null
          order_in_parent?: number | null
          parent_id?: string | null
          product_id?: string | null
          progress_percentage?: number | null
          rating?: number | null
          release_date?: string | null
          reviews_count?: number | null
          sample_content?: string | null
          status?: string | null
          target_word_count?: number | null
          title?: string
          type?: string
          updated_at?: string | null
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "content_works_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "content_works"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          id: string
          stripe_customer_id: string | null
        }
        Insert: {
          id: string
          stripe_customer_id?: string | null
        }
        Update: {
          id?: string
          stripe_customer_id?: string | null
        }
        Relationships: []
      }
      daily_spins: {
        Row: {
          created_at: string
          last_spin_at: string | null
          spin_count: number
          spin_date: string
          user_id: string
        }
        Insert: {
          created_at?: string
          last_spin_at?: string | null
          spin_count?: number
          spin_date: string
          user_id: string
        }
        Update: {
          created_at?: string
          last_spin_at?: string | null
          spin_count?: number
          spin_date?: string
          user_id?: string
        }
        Relationships: []
      }
      downloadable_templates: {
        Row: {
          created_at: string | null
          description: string | null
          file_path: string | null
          id: string
          status: string
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          file_path?: string | null
          id?: string
          status?: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          file_path?: string | null
          id?: string
          status?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      downloads: {
        Row: {
          downloaded_at: string | null
          file_id: string | null
          id: string
          ip_address: unknown | null
          order_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          downloaded_at?: string | null
          file_id?: string | null
          id?: string
          ip_address?: unknown | null
          order_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          downloaded_at?: string | null
          file_id?: string | null
          id?: string
          ip_address?: unknown | null
          order_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "downloads_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "downloads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "downloads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_subscription_status"
            referencedColumns: ["user_id"]
          },
        ]
      }
      ebooks: {
        Row: {
          cover_url: string | null
          created_at: string | null
          description: string | null
          id: string
          price_cents: number | null
          slug: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          price_cents?: number | null
          slug: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          price_cents?: number | null
          slug?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      files: {
        Row: {
          alt_text: string | null
          bucket: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          duration: number | null
          folder: string
          height: number | null
          id: string
          metadata: Json | null
          mime_type: string
          name: string
          original_name: string
          path: string | null
          size: number
          storage_path: string
          tags: string[] | null
          thumbnail_url: string | null
          type: string
          updated_at: string | null
          url: string | null
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          bucket?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration?: number | null
          folder?: string
          height?: number | null
          id?: string
          metadata?: Json | null
          mime_type: string
          name: string
          original_name: string
          path?: string | null
          size?: number
          storage_path: string
          tags?: string[] | null
          thumbnail_url?: string | null
          type?: string
          updated_at?: string | null
          url?: string | null
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          bucket?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration?: number | null
          folder?: string
          height?: number | null
          id?: string
          metadata?: Json | null
          mime_type?: string
          name?: string
          original_name?: string
          path?: string | null
          size?: number
          storage_path?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          type?: string
          updated_at?: string | null
          url?: string | null
          width?: number | null
        }
        Relationships: []
      }
      friends: {
        Row: {
          created_at: string
          friend_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          friend_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          friend_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      homepage_content: {
        Row: {
          average_rating: number
          beta_readers: number
          books_published: number
          created_at: string | null
          cta_button_link: string
          cta_button_text: string
          hero_description: string
          hero_quote: string
          hero_subtitle: string | null
          hero_title: string
          id: string
          show_artist_collaboration: boolean
          show_latest_news: boolean
          show_latest_releases: boolean
          show_progress_metrics: boolean
          updated_at: string | null
          words_written: number
        }
        Insert: {
          average_rating?: number
          beta_readers?: number
          books_published?: number
          created_at?: string | null
          cta_button_link?: string
          cta_button_text?: string
          hero_description?: string
          hero_quote?: string
          hero_subtitle?: string | null
          hero_title?: string
          id?: string
          show_artist_collaboration?: boolean
          show_latest_news?: boolean
          show_latest_releases?: boolean
          show_progress_metrics?: boolean
          updated_at?: string | null
          words_written?: number
        }
        Update: {
          average_rating?: number
          beta_readers?: number
          books_published?: number
          created_at?: string | null
          cta_button_link?: string
          cta_button_text?: string
          hero_description?: string
          hero_quote?: string
          hero_subtitle?: string | null
          hero_title?: string
          id?: string
          show_artist_collaboration?: boolean
          show_latest_news?: boolean
          show_latest_releases?: boolean
          show_progress_metrics?: boolean
          updated_at?: string | null
          words_written?: number
        }
        Relationships: []
      }
      inventory_movements: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          movement_type: string
          product_id: string | null
          quantity: number
          quantity_after: number
          quantity_before: number
          reason: string | null
          reference_id: string | null
          reference_type: string | null
          variant_id: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          movement_type: string
          product_id?: string | null
          quantity: number
          quantity_after: number
          quantity_before: number
          reason?: string | null
          reference_id?: string | null
          reference_type?: string | null
          variant_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          movement_type?: string
          product_id?: string | null
          quantity?: number
          quantity_after?: number
          quantity_before?: number
          reason?: string | null
          reference_id?: string | null
          reference_type?: string | null
          variant_id?: string | null
        }
        Relationships: []
      }
      issues: {
        Row: {
          arc_id: string
          cover_image: string | null
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          order_index: number
          publish_at: string | null
          release_date: string | null
          slug: string
          state: string | null
          subscription_required: boolean | null
          subtitle: string | null
          title: string
          unpublish_at: string | null
          updated_at: string | null
        }
        Insert: {
          arc_id: string
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          order_index?: number
          publish_at?: string | null
          release_date?: string | null
          slug: string
          state?: string | null
          subscription_required?: boolean | null
          subtitle?: string | null
          title: string
          unpublish_at?: string | null
          updated_at?: string | null
        }
        Update: {
          arc_id?: string
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          order_index?: number
          publish_at?: string | null
          release_date?: string | null
          slug?: string
          state?: string | null
          subscription_required?: boolean | null
          subtitle?: string | null
          title?: string
          unpublish_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "issues_arc_id_fkey"
            columns: ["arc_id"]
            isOneToOne: false
            referencedRelation: "arcs"
            referencedColumns: ["id"]
          },
        ]
      }
      learn_cards: {
        Row: {
          action_text: string | null
          content: string | null
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean
          section_id: string
          sort_order: number | null
          title: string
          updated_at: string
        }
        Insert: {
          action_text?: string | null
          content?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean
          section_id: string
          sort_order?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          action_text?: string | null
          content?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean
          section_id?: string
          sort_order?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "learn_cards_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "learn_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      learn_sections: {
        Row: {
          created_at: string
          description: string | null
          id: string
          section_type: Database["public"]["Enums"]["learn_section_type"] | null
          sort_order: number | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          section_type?:
            | Database["public"]["Enums"]["learn_section_type"]
            | null
          sort_order?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          section_type?:
            | Database["public"]["Enums"]["learn_section_type"]
            | null
          sort_order?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string | null
          price_id: string | null
          product_id: string | null
          quantity: number | null
          total_amount_cents: number
          unit_amount_cents: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          price_id?: string | null
          product_id?: string | null
          quantity?: number | null
          total_amount_cents: number
          unit_amount_cents: number
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          price_id?: string | null
          product_id?: string | null
          quantity?: number | null
          total_amount_cents?: number
          unit_amount_cents?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_price_id_fkey"
            columns: ["price_id"]
            isOneToOne: false
            referencedRelation: "prices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount_cents: number
          created_at: string | null
          currency: string | null
          customer_email: string | null
          id: string
          metadata: Json | null
          price_id: string | null
          provider: string
          provider_payment_intent_id: string | null
          provider_session_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount_cents: number
          created_at?: string | null
          currency?: string | null
          customer_email?: string | null
          id?: string
          metadata?: Json | null
          price_id?: string | null
          provider: string
          provider_payment_intent_id?: string | null
          provider_session_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount_cents?: number
          created_at?: string | null
          currency?: string | null
          customer_email?: string | null
          id?: string
          metadata?: Json | null
          price_id?: string | null
          provider?: string
          provider_payment_intent_id?: string | null
          provider_session_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_price_id_fkey"
            columns: ["price_id"]
            isOneToOne: false
            referencedRelation: "prices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_subscription_status"
            referencedColumns: ["user_id"]
          },
        ]
      }
      pages: {
        Row: {
          category_id: string | null
          content: string | null
          created_at: string
          folder_id: string | null
          id: string
          is_published: boolean | null
          published_at: string | null
          seo_description: string | null
          seo_keywords: string[] | null
          seo_title: string | null
          slug: string
          status: string | null
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          category_id?: string | null
          content?: string | null
          created_at?: string
          folder_id?: string | null
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          slug: string
          status?: string | null
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          category_id?: string | null
          content?: string | null
          created_at?: string
          folder_id?: string | null
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          slug?: string
          status?: string | null
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: []
      }
      payment_history: {
        Row: {
          amount: number | null
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          status: string
          stripe_invoice_id: string | null
          subscription_id: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id: string
          status: string
          stripe_invoice_id?: string | null
          subscription_id?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          status?: string
          stripe_invoice_id?: string | null
          subscription_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      posts: {
        Row: {
          author_id: string
          content: string | null
          created_at: string
          excerpt: string | null
          id: string
          is_featured: boolean | null
          published_at: string | null
          seo_description: string | null
          seo_keywords: string[] | null
          seo_title: string | null
          slug: string
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string
          views: number | null
        }
        Insert: {
          author_id: string
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_featured?: boolean | null
          published_at?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          slug: string
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          views?: number | null
        }
        Update: {
          author_id?: string
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_featured?: boolean | null
          published_at?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          slug?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          views?: number | null
        }
        Relationships: []
      }
      prices: {
        Row: {
          active: boolean | null
          amount_cents: number
          created_at: string | null
          currency: string | null
          id: string
          interval: string | null
          interval_count: number | null
          price_id: string
          product_id: string | null
          provider: string
          trial_period_days: number | null
        }
        Insert: {
          active?: boolean | null
          amount_cents: number
          created_at?: string | null
          currency?: string | null
          id?: string
          interval?: string | null
          interval_count?: number | null
          price_id: string
          product_id?: string | null
          provider: string
          trial_period_days?: number | null
        }
        Update: {
          active?: boolean | null
          amount_cents?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          interval?: string | null
          interval_count?: number | null
          price_id?: string
          product_id?: string | null
          provider?: string
          trial_period_days?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_reviews: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          id: string
          is_approved: boolean | null
          is_verified_purchase: boolean | null
          product_id: string
          rating: number
          review_text: string | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          id?: string
          is_approved?: boolean | null
          is_verified_purchase?: boolean | null
          product_id: string
          rating: number
          review_text?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          id?: string
          is_approved?: boolean | null
          is_verified_purchase?: boolean | null
          product_id?: string
          rating?: number
          review_text?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          file_key: string | null
          id: string
          is_bundle: boolean | null
          is_subscription: boolean | null
          published_at: string | null
          slug: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          file_key?: string | null
          id?: string
          is_bundle?: boolean | null
          is_subscription?: boolean | null
          published_at?: string | null
          slug: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          file_key?: string | null
          id?: string
          is_bundle?: boolean | null
          is_subscription?: boolean | null
          published_at?: string | null
          slug?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      professional_services: {
        Row: {
          created_at: string | null
          description: string | null
          details: Json | null
          id: string
          is_available: boolean | null
          price: number | null
          service_type: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          details?: Json | null
          id?: string
          is_available?: boolean | null
          price?: number | null
          service_type: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          details?: Json | null
          id?: string
          is_available?: boolean | null
          price?: number | null
          service_type?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          beta_reader_status: string | null
          created_at: string | null
          display_name: string | null
          email: string
          full_name: string | null
          id: string
          reading_preferences: Json | null
          role: string
          stripe_customer_id: string | null
          subscription_end_date: string | null
          subscription_status: string | null
          subscription_tier: string | null
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          beta_reader_status?: string | null
          created_at?: string | null
          display_name?: string | null
          email: string
          full_name?: string | null
          id: string
          reading_preferences?: Json | null
          role?: string
          stripe_customer_id?: string | null
          subscription_end_date?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          beta_reader_status?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string
          full_name?: string | null
          id?: string
          reading_preferences?: Json | null
          role?: string
          stripe_customer_id?: string | null
          subscription_end_date?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      promotions: {
        Row: {
          active: boolean
          code: string
          created_at: string
          description: string | null
          discount_type: Database["public"]["Enums"]["discount_type"]
          discount_value: number
          end_date: string | null
          id: string
          start_date: string | null
          updated_at: string
          usage_count: number | null
          usage_limit: number | null
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          description?: string | null
          discount_type: Database["public"]["Enums"]["discount_type"]
          discount_value: number
          end_date?: string | null
          id?: string
          start_date?: string | null
          updated_at?: string
          usage_count?: number | null
          usage_limit?: number | null
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          description?: string | null
          discount_type?: Database["public"]["Enums"]["discount_type"]
          discount_value?: number
          end_date?: string | null
          id?: string
          start_date?: string | null
          updated_at?: string
          usage_count?: number | null
          usage_limit?: number | null
        }
        Relationships: []
      }
      published_books: {
        Row: {
          count: number | null
        }
        Insert: {
          count?: number | null
        }
        Update: {
          count?: number | null
        }
        Relationships: []
      }
      reading_progress: {
        Row: {
          bookmarks: Json | null
          chapter_id: string
          completed: boolean | null
          created_at: string | null
          id: string
          last_read_at: string | null
          notes: Json | null
          progress_percentage: number | null
          reading_time_minutes: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bookmarks?: Json | null
          chapter_id: string
          completed?: boolean | null
          created_at?: string | null
          id?: string
          last_read_at?: string | null
          notes?: Json | null
          progress_percentage?: number | null
          reading_time_minutes?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bookmarks?: Json | null
          chapter_id?: string
          completed?: boolean | null
          created_at?: string | null
          id?: string
          last_read_at?: string | null
          notes?: Json | null
          progress_percentage?: number | null
          reading_time_minutes?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reading_progress_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reading_progress_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters_with_files"
            referencedColumns: ["id"]
          },
        ]
      }
      release_items: {
        Row: {
          created_at: string
          description: string | null
          id: string
          link: string | null
          release_date: string | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          link?: string | null
          release_date?: string | null
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          link?: string | null
          release_date?: string | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      sagas: {
        Row: {
          cover_image: string | null
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          order_index: number
          publish_at: string | null
          slug: string
          state: string | null
          subtitle: string | null
          title: string
          unpublish_at: string | null
          updated_at: string | null
          volume_id: string
        }
        Insert: {
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          order_index?: number
          publish_at?: string | null
          slug: string
          state?: string | null
          subtitle?: string | null
          title: string
          unpublish_at?: string | null
          updated_at?: string | null
          volume_id: string
        }
        Update: {
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          order_index?: number
          publish_at?: string | null
          slug?: string
          state?: string | null
          subtitle?: string | null
          title?: string
          unpublish_at?: string | null
          updated_at?: string | null
          volume_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sagas_volume_id_fkey"
            columns: ["volume_id"]
            isOneToOne: false
            referencedRelation: "volumes"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          metadata: Json | null
          plan_id: string | null
          status: string
          trial_end: string | null
          trial_start: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id: string
          metadata?: Json | null
          plan_id?: string | null
          status: string
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          metadata?: Json | null
          plan_id?: string | null
          status?: string
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      timeline_categories: {
        Row: {
          color: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          color?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          color?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      timeline_eras: {
        Row: {
          background_color: string | null
          description: string | null
          end_date: string | null
          id: string
          is_active: boolean | null
          name: string
          order_index: number | null
          start_date: string | null
        }
        Insert: {
          background_color?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          order_index?: number | null
          start_date?: string | null
        }
        Update: {
          background_color?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          order_index?: number | null
          start_date?: string | null
        }
        Relationships: []
      }
      timeline_events: {
        Row: {
          background_image: string | null
          category: string | null
          created_at: string | null
          created_by: string | null
          date: string
          depth: number | null
          description: string | null
          details: string | null
          era: string
          id: string
          is_published: boolean | null
          order_index: number | null
          parent_event_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          background_image?: string | null
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          date: string
          depth?: number | null
          description?: string | null
          details?: string | null
          era: string
          id?: string
          is_published?: boolean | null
          order_index?: number | null
          parent_event_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          background_image?: string | null
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          date?: string
          depth?: number | null
          description?: string | null
          details?: string | null
          era?: string
          id?: string
          is_published?: boolean | null
          order_index?: number | null
          parent_event_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "timeline_events_parent_event_id_fkey"
            columns: ["parent_event_id"]
            isOneToOne: false
            referencedRelation: "timeline_events"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_nested_events: {
        Row: {
          created_at: string | null
          date: string
          description: string
          id: string
          order: number
          timeline_event_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          description: string
          id?: string
          order?: number
          timeline_event_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          description?: string
          id?: string
          order?: number
          timeline_event_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          created_at: string
          earned_at: string | null
          id: string
          is_unlocked: boolean
          progress: number
          updated_at: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          created_at?: string
          earned_at?: string | null
          id?: string
          is_unlocked?: boolean
          progress?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          created_at?: string
          earned_at?: string | null
          id?: string
          is_unlocked?: boolean
          progress?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_subscription_status"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_activities: {
        Row: {
          activity_type: string
          cover_image_url: string | null
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          ip_address: unknown | null
          item_title: string | null
          metadata: Json | null
          progress: number | null
          status: string | null
          timestamp: string
          total_progress: number | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          activity_type: string
          cover_image_url?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: unknown | null
          item_title?: string | null
          metadata?: Json | null
          progress?: number | null
          status?: string | null
          timestamp?: string
          total_progress?: number | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          activity_type?: string
          cover_image_url?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: unknown | null
          item_title?: string | null
          metadata?: Json | null
          progress?: number | null
          status?: string | null
          timestamp?: string
          total_progress?: number | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_activity: {
        Row: {
          activity_type: string
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          related_entity_id: string | null
          related_entity_type: string | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activity_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_activity_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_subscription_status"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_library: {
        Row: {
          added_at: string | null
          content_item_id: string
          created_at: string | null
          id: string
          is_favorite: boolean | null
          last_accessed_at: string | null
          personal_notes: string | null
          personal_rating: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          added_at?: string | null
          content_item_id: string
          created_at?: string | null
          id?: string
          is_favorite?: boolean | null
          last_accessed_at?: string | null
          personal_notes?: string | null
          personal_rating?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          added_at?: string | null
          content_item_id?: string
          created_at?: string | null
          id?: string
          is_favorite?: boolean | null
          last_accessed_at?: string | null
          personal_notes?: string | null
          personal_rating?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_library_content_item_id_fkey"
            columns: ["content_item_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_library_content_item_id_fkey"
            columns: ["content_item_id"]
            isOneToOne: false
            referencedRelation: "content_items_with_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_library_content_item_id_fkey"
            columns: ["content_item_id"]
            isOneToOne: false
            referencedRelation: "library_content_view"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string
          currency: string
          id: string
          language: string
          notification_preferences: Json | null
          privacy_preferences: Json | null
          reading_preferences: Json | null
          timezone: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          currency?: string
          id?: string
          language?: string
          notification_preferences?: Json | null
          privacy_preferences?: Json | null
          reading_preferences?: Json | null
          timezone?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          currency?: string
          id?: string
          language?: string
          notification_preferences?: Json | null
          privacy_preferences?: Json | null
          reading_preferences?: Json | null
          timezone?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_subscription_status"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_stats: {
        Row: {
          achievements: number | null
          books_read: number | null
          created_at: string | null
          currently_reading: string | null
          reading_hours: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          achievements?: number | null
          books_read?: number | null
          created_at?: string | null
          currently_reading?: string | null
          reading_hours?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          achievements?: number | null
          books_read?: number | null
          created_at?: string | null
          currently_reading?: string | null
          reading_hours?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      video_tutorials: {
        Row: {
          created_at: string | null
          description: string | null
          duration_seconds: number | null
          id: string
          status: string
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_seconds?: number | null
          id?: string
          status?: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_seconds?: number | null
          id?: string
          status?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      volumes: {
        Row: {
          book_id: string
          cover_image: string | null
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          order_index: number
          publish_at: string | null
          slug: string
          state: string | null
          subtitle: string | null
          title: string
          unpublish_at: string | null
          updated_at: string | null
        }
        Insert: {
          book_id: string
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          order_index?: number
          publish_at?: string | null
          slug: string
          state?: string | null
          subtitle?: string | null
          title: string
          unpublish_at?: string | null
          updated_at?: string | null
        }
        Update: {
          book_id?: string
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          order_index?: number
          publish_at?: string | null
          slug?: string
          state?: string | null
          subtitle?: string | null
          title?: string
          unpublish_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          created_at: string | null
          error_message: string | null
          event_id: string
          event_type: string
          id: string
          payload: Json
          processed: boolean | null
          processed_at: string | null
          provider: string
          received_at: string | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          event_id: string
          event_type: string
          id?: string
          payload: Json
          processed?: boolean | null
          processed_at?: string | null
          provider: string
          received_at?: string | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          event_id?: string
          event_type?: string
          id?: string
          payload?: Json
          processed?: boolean | null
          processed_at?: string | null
          provider?: string
          received_at?: string | null
        }
        Relationships: []
      }
      wiki_categories: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
          parent_id: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          parent_id?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wiki_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "wiki_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      wiki_content_blocks: {
        Row: {
          content: Json
          created_at: string
          created_by: string | null
          id: string
          page_id: string
          position: number
          type: Database["public"]["Enums"]["content_block_type"]
          updated_at: string
        }
        Insert: {
          content?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          page_id: string
          position: number
          type: Database["public"]["Enums"]["content_block_type"]
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          page_id?: string
          position?: number
          type?: Database["public"]["Enums"]["content_block_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wiki_content_blocks_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "wiki_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wiki_content_blocks_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "wiki_latest_revisions_view"
            referencedColumns: ["wiki_item_id"]
          },
          {
            foreignKeyName: "wiki_content_blocks_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "wiki_search_view"
            referencedColumns: ["wiki_item_id"]
          },
        ]
      }
      wiki_entries: {
        Row: {
          content: Json | null
          created_at: string | null
          id: string
          slug: string
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          id?: string
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          id?: string
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      wiki_items: {
        Row: {
          category_id: string | null
          content: string | null
          created_at: string
          created_by: string | null
          depth: number | null
          excerpt: string | null
          full_path: string | null
          id: string
          is_published: boolean | null
          name: string
          parent_id: string | null
          properties: Json | null
          slug: string
          status: string | null
          tags: string[] | null
          type: string
          updated_at: string
          view_count: number | null
          visibility: string | null
        }
        Insert: {
          category_id?: string | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          depth?: number | null
          excerpt?: string | null
          full_path?: string | null
          id?: string
          is_published?: boolean | null
          name: string
          parent_id?: string | null
          properties?: Json | null
          slug: string
          status?: string | null
          tags?: string[] | null
          type: string
          updated_at?: string
          view_count?: number | null
          visibility?: string | null
        }
        Update: {
          category_id?: string | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          depth?: number | null
          excerpt?: string | null
          full_path?: string | null
          id?: string
          is_published?: boolean | null
          name?: string
          parent_id?: string | null
          properties?: Json | null
          slug?: string
          status?: string | null
          tags?: string[] | null
          type?: string
          updated_at?: string
          view_count?: number | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wiki_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "wiki_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wiki_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "wiki_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wiki_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "wiki_latest_revisions_view"
            referencedColumns: ["wiki_item_id"]
          },
          {
            foreignKeyName: "wiki_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "wiki_search_view"
            referencedColumns: ["wiki_item_id"]
          },
        ]
      }
      wiki_media: {
        Row: {
          alt_text: string | null
          caption: string | null
          created_at: string
          created_by: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          is_featured: boolean
          wiki_item_id: string | null
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          created_by: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          is_featured?: boolean
          wiki_item_id?: string | null
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          created_by?: string
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          is_featured?: boolean
          wiki_item_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wiki_media_wiki_item_id_fkey"
            columns: ["wiki_item_id"]
            isOneToOne: false
            referencedRelation: "wiki_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wiki_media_wiki_item_id_fkey"
            columns: ["wiki_item_id"]
            isOneToOne: false
            referencedRelation: "wiki_latest_revisions_view"
            referencedColumns: ["wiki_item_id"]
          },
          {
            foreignKeyName: "wiki_media_wiki_item_id_fkey"
            columns: ["wiki_item_id"]
            isOneToOne: false
            referencedRelation: "wiki_search_view"
            referencedColumns: ["wiki_item_id"]
          },
        ]
      }
      wiki_pages: {
        Row: {
          category_id: string | null
          content: string | null
          created_at: string | null
          created_by: string | null
          excerpt: string | null
          folder_id: string | null
          id: string
          is_published: boolean | null
          slug: string
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          category_id?: string | null
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          excerpt?: string | null
          folder_id?: string | null
          id?: string
          is_published?: boolean | null
          slug: string
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          category_id?: string | null
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          excerpt?: string | null
          folder_id?: string | null
          id?: string
          is_published?: boolean | null
          slug?: string
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      wiki_revisions: {
        Row: {
          change_summary: string | null
          content: Json
          created_at: string
          created_by: string
          excerpt: string | null
          id: string
          page_id: string
          title: string
        }
        Insert: {
          change_summary?: string | null
          content: Json
          created_at?: string
          created_by: string
          excerpt?: string | null
          id?: string
          page_id: string
          title: string
        }
        Update: {
          change_summary?: string | null
          content?: Json
          created_at?: string
          created_by?: string
          excerpt?: string | null
          id?: string
          page_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "wiki_revisions_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "wiki_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wiki_revisions_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "wiki_latest_revisions_view"
            referencedColumns: ["wiki_item_id"]
          },
          {
            foreignKeyName: "wiki_revisions_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "wiki_search_view"
            referencedColumns: ["wiki_item_id"]
          },
        ]
      }
      writing_guides: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          published_at: string | null
          slug: string | null
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          published_at?: string | null
          slug?: string | null
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          published_at?: string | null
          slug?: string | null
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      blog_posts_with_stats: {
        Row: {
          author: string | null
          category: string | null
          category_color: string | null
          category_name: string | null
          comments_count: number | null
          content: string | null
          created_at: string | null
          display_author: string | null
          excerpt: string | null
          featured_image: string | null
          featured_order: number | null
          id: string | null
          is_featured: boolean | null
          likes_count: number | null
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          reading_time: number | null
          shares_count: number | null
          slug: string | null
          social_image: string | null
          status: string | null
          tag_names: string[] | null
          tag_slugs: string[] | null
          tags: string[] | null
          title: string | null
          updated_at: string | null
          views: number | null
          word_count: number | null
        }
        Relationships: []
      }
      chapters_with_files: {
        Row: {
          banner_file_alt_text: string | null
          banner_file_height: number | null
          banner_file_id: string | null
          banner_file_name: string | null
          banner_file_url: string | null
          banner_file_width: number | null
          chapter_number: number | null
          content: Json | null
          content_format: string | null
          created_at: string | null
          estimated_read_time: number | null
          free_chapter_order: number | null
          hero_file_alt_text: string | null
          hero_file_height: number | null
          hero_file_id: string | null
          hero_file_name: string | null
          hero_file_url: string | null
          hero_file_width: number | null
          id: string | null
          is_free: boolean | null
          issue_id: string | null
          metadata: Json | null
          plain_content: string | null
          published_at: string | null
          slug: string | null
          status: Database["public"]["Enums"]["chapter_status"] | null
          subscription_tier_required: string | null
          title: string | null
          updated_at: string | null
          word_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "chapters_banner_file_id_fkey"
            columns: ["banner_file_id"]
            isOneToOne: false
            referencedRelation: "files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chapters_hero_file_id_fkey"
            columns: ["hero_file_id"]
            isOneToOne: false
            referencedRelation: "files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chapters_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chapters_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "content_items_with_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chapters_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "library_content_view"
            referencedColumns: ["id"]
          },
        ]
      }
      characters_with_stats: {
        Row: {
          abilities_count: number | null
          age: number | null
          age_description: string | null
          aliases: string[] | null
          allegiances: string[] | null
          appearances_count: number | null
          background_summary: string | null
          build: string | null
          character_arc_summary: string | null
          character_type: Database["public"]["Enums"]["character_type"] | null
          color_theme: string | null
          created_at: string | null
          created_by_user_id: string | null
          description: string | null
          distinguishing_features: string | null
          eye_color: string | null
          fears: string[] | null
          first_appearance_content_id: string | null
          gallery_file_ids: string[] | null
          gender: string | null
          goals: string[] | null
          hair_color: string | null
          height: string | null
          id: string | null
          importance_score: number | null
          is_major_character: boolean | null
          is_pov_character: boolean | null
          is_spoiler_sensitive: boolean | null
          last_appearance_content_id: string | null
          location: string | null
          meta_description: string | null
          meta_keywords: string[] | null
          motivations: string[] | null
          name: string | null
          occupation: string | null
          origin: string | null
          personality_traits: string[] | null
          portrait_file_id: string | null
          portrait_url: string | null
          power_level: Database["public"]["Enums"]["power_level"] | null
          primary_faction: string | null
          relationships_count: number | null
          search_vector: unknown | null
          skills: string[] | null
          slug: string | null
          species: string | null
          spoiler_tags: string[] | null
          status: Database["public"]["Enums"]["character_status"] | null
          title: string | null
          updated_at: string | null
          weaknesses: string[] | null
        }
        Relationships: []
      }
      content_items_with_files: {
        Row: {
          average_rating: number | null
          completion_percentage: number | null
          cover_file_alt_text: string | null
          cover_file_height: number | null
          cover_file_id: string | null
          cover_file_name: string | null
          cover_file_url: string | null
          cover_file_width: number | null
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          id: string | null
          metadata: Json | null
          order_index: number | null
          parent_id: string | null
          published_at: string | null
          rating_count: number | null
          slug: string | null
          status: Database["public"]["Enums"]["content_status"] | null
          title: string | null
          type: Database["public"]["Enums"]["content_item_type"] | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_items_cover_file_id_fkey"
            columns: ["cover_file_id"]
            isOneToOne: false
            referencedRelation: "files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "content_items_with_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "library_content_view"
            referencedColumns: ["id"]
          },
        ]
      }
      library_content_view: {
        Row: {
          average_rating: number | null
          children_count: number | null
          completion_percentage: number | null
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          estimated_read_time: number | null
          has_parent: boolean | null
          id: string | null
          metadata: Json | null
          order_index: number | null
          parent_id: string | null
          published_at: string | null
          rating_count: number | null
          slug: string | null
          status: Database["public"]["Enums"]["content_status"] | null
          title: string | null
          total_chapters: number | null
          type: Database["public"]["Enums"]["content_item_type"] | null
          updated_at: string | null
        }
        Insert: {
          average_rating?: number | null
          children_count?: never
          completion_percentage?: number | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          estimated_read_time?: never
          has_parent?: never
          id?: string | null
          metadata?: Json | null
          order_index?: number | null
          parent_id?: string | null
          published_at?: string | null
          rating_count?: number | null
          slug?: string | null
          status?: Database["public"]["Enums"]["content_status"] | null
          title?: string | null
          total_chapters?: never
          type?: Database["public"]["Enums"]["content_item_type"] | null
          updated_at?: string | null
        }
        Update: {
          average_rating?: number | null
          children_count?: never
          completion_percentage?: number | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          estimated_read_time?: never
          has_parent?: never
          id?: string | null
          metadata?: Json | null
          order_index?: number | null
          parent_id?: string | null
          published_at?: string | null
          rating_count?: number | null
          slug?: string | null
          status?: Database["public"]["Enums"]["content_status"] | null
          title?: string | null
          total_chapters?: never
          type?: Database["public"]["Enums"]["content_item_type"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "content_items_with_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "library_content_view"
            referencedColumns: ["id"]
          },
        ]
      }
      published_blog_posts: {
        Row: {
          author: string | null
          comments_count: number | null
          content: string | null
          created_at: string | null
          display_author: string | null
          excerpt: string | null
          featured_image: string | null
          id: string | null
          is_featured: boolean | null
          likes_count: number | null
          published_at: string | null
          reading_time: number | null
          slug: string | null
          status: string | null
          tags: string[] | null
          title: string | null
          updated_at: string | null
          views: number | null
        }
        Insert: {
          author?: string | null
          comments_count?: number | null
          content?: string | null
          created_at?: string | null
          display_author?: never
          excerpt?: string | null
          featured_image?: string | null
          id?: string | null
          is_featured?: boolean | null
          likes_count?: number | null
          published_at?: string | null
          reading_time?: number | null
          slug?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          author?: string | null
          comments_count?: number | null
          content?: string | null
          created_at?: string | null
          display_author?: never
          excerpt?: string | null
          featured_image?: string | null
          id?: string | null
          is_featured?: boolean | null
          likes_count?: number | null
          published_at?: string | null
          reading_time?: number | null
          slug?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
          views?: number | null
        }
        Relationships: []
      }
      user_subscription_status: {
        Row: {
          cancel_at_period_end: boolean | null
          current_period_end: string | null
          current_period_start: string | null
          email: string | null
          has_premium_access: boolean | null
          is_subscribed: boolean | null
          metadata: Json | null
          plan_id: string | null
          stripe_customer_id: string | null
          subscription_end_date: string | null
          subscription_id: string | null
          subscription_status: string | null
          subscription_tier: string | null
          subscription_valid: boolean | null
          trial_end: string | null
          user_id: string | null
        }
        Relationships: []
      }
      wiki_latest_revisions_view: {
        Row: {
          content_block_count: number | null
          content_preview: string | null
          parent_id: string | null
          revised_at: string | null
          revised_by: string | null
          revision_id: string | null
          revision_summary: string | null
          revision_title: string | null
          slug: string | null
          status: string | null
          title: string | null
          wiki_item_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wiki_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "wiki_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wiki_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "wiki_latest_revisions_view"
            referencedColumns: ["wiki_item_id"]
          },
          {
            foreignKeyName: "wiki_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "wiki_search_view"
            referencedColumns: ["wiki_item_id"]
          },
        ]
      }
      wiki_page_tree_view: {
        Row: {
          breadcrumb: string | null
          created_at: string | null
          created_by: string | null
          full_slug: string | null
          full_title: string | null
          id: string | null
          level: number | null
          parent_id: string | null
          path: string[] | null
          slug: string | null
          slug_path: string[] | null
          status: string | null
          title: string | null
          updated_at: string | null
          url_path: string | null
        }
        Relationships: []
      }
      wiki_search_view: {
        Row: {
          created_at: string | null
          revised_at: string | null
          revised_by: string | null
          revision_id: string | null
          search_vector: unknown | null
          slug: string | null
          status: string | null
          title: string | null
          updated_at: string | null
          wiki_item_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      _ltree_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      _ltree_gist_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      calculate_content_progress: {
        Args: { content_item_id: string; user_id: string }
        Returns: {
          completed_chapters: number
          overall_progress: number
          started_chapters: number
          total_chapters: number
        }[]
      }
      calculate_homepage_metrics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      can_user_manage_content: {
        Args: { user_id?: string }
        Returns: boolean
      }
      check_chapter_system: {
        Args: Record<PropertyKey, never>
        Returns: {
          component: string
          details: string
          status: string
        }[]
      }
      cleanup_expired_sessions: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      cleanup_old_user_activity: {
        Args: { days_to_keep?: number }
        Returns: number
      }
      cleanup_unused_files: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      create_order: {
        Args: {
          p_billing_address: Json
          p_customer_email: string
          p_customer_note?: string
          p_items: Json[]
          p_payment_method?: string
          p_shipping_address: Json
          p_shipping_amount?: number
          p_user_id: string
        }
        Returns: string
      }
      create_product_with_variants: {
        Args: { p_product_data: Json; p_variants_data?: Json }
        Returns: Json
      }
      create_user_session: {
        Args: {
          p_device_fingerprint?: string
          p_expires_at?: string
          p_ip_address?: unknown
          p_metadata?: Json
          p_refresh_token?: string
          p_session_token: string
          p_user_agent?: string
          p_user_id: string
        }
        Returns: string
      }
      create_wiki_page: {
        Args: {
          p_category_id: string
          p_content: Json
          p_excerpt: string
          p_seo_description?: string
          p_seo_keywords?: string[]
          p_seo_title?: string
          p_slug: string
          p_title: string
          p_user_id: string
        }
        Returns: string
      }
      detect_suspicious_sessions: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      generate_order_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_slug: {
        Args: { input_text: string }
        Returns: string
      }
      get_accessible_chapters_for_issue: {
        Args: { p_issue_id: string; p_user_id?: string }
        Returns: {
          chapter_number: number
          estimated_read_time: number
          has_access: boolean
          id: string
          is_free: boolean
          published_at: string
          slug: string
          status: Database["public"]["Enums"]["chapter_status"]
          subscription_tier_required: string
          title: string
          word_count: number
        }[]
      }
      get_admin_profiles: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          email: string
          id: string
          subscription_status: string
        }[]
      }
      get_chapter_navigation: {
        Args: {
          p_current_chapter_number: number
          p_issue_id: string
          p_user_id?: string
        }
        Returns: {
          next_chapter_id: string
          next_chapter_number: number
          next_chapter_slug: string
          next_chapter_title: string
          next_has_access: boolean
          prev_chapter_id: string
          prev_chapter_number: number
          prev_chapter_slug: string
          prev_chapter_title: string
          prev_has_access: boolean
        }[]
      }
      get_chapter_with_access: {
        Args: {
          p_chapter_identifier: string
          p_issue_slug: string
          p_user_id?: string
        }
        Returns: {
          access_denied_reason: string
          chapter_number: number
          content: Json
          estimated_read_time: number
          has_access: boolean
          id: string
          is_free: boolean
          issue_id: string
          metadata: Json
          plain_content: string
          published_at: string
          slug: string
          status: Database["public"]["Enums"]["chapter_status"]
          subscription_tier_required: string
          title: string
          word_count: number
        }[]
      }
      get_character_details: {
        Args: { character_slug: string }
        Returns: {
          abilities_data: Json
          appearances_data: Json
          character_data: Json
          relationships_data: Json
        }[]
      }
      get_child_folders: {
        Args: { parent_id: string }
        Returns: {
          id: string
          level: number
          name: string
          slug: string
        }[]
      }
      get_content_hierarchy_path: {
        Args: { content_item_id: string }
        Returns: {
          id: string
          level: number
          slug: string
          title: string
          type: string
        }[]
      }
      get_content_item_chapters: {
        Args: { content_item_id: string }
        Returns: {
          chapter_number: number
          estimated_read_time: number
          id: string
          issue_id: string
          published_at: string
          slug: string
          status: string
          title: string
          word_count: number
        }[]
      }
      get_content_path: {
        Args: { content_id: string; content_type: string }
        Returns: string
      }
      get_customer_order_history: {
        Args: { p_limit?: number; p_offset?: number; p_user_id: string }
        Returns: {
          created_at: string
          currency: string
          id: string
          item_count: number
          order_number: string
          status: Database["public"]["Enums"]["order_status"]
          total_amount: number
          updated_at: string
        }[]
      }
      get_file_url: {
        Args: { file_row: Database["public"]["Tables"]["files"]["Row"] }
        Returns: string
      }
      get_file_with_url: {
        Args: { file_id: string }
        Returns: {
          alt_text: string
          folder: string
          height: number
          id: string
          name: string
          url: string
          width: number
        }[]
      }
      get_folder_path: {
        Args: { folder_id: string }
        Returns: {
          id: string
          level: number
          name: string
          slug: string
        }[]
      }
      get_library_content_hierarchy: {
        Args: { filter_parent_id?: string }
        Returns: {
          average_rating: number
          children_count: number
          completion_percentage: number
          cover_image_url: string
          created_at: string
          description: string
          estimated_read_time: number
          id: string
          metadata: Json
          order_index: number
          parent_id: string
          published_at: string
          rating_count: number
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          title: string
          total_chapters: number
          type: Database["public"]["Enums"]["content_item_type"]
          updated_at: string
        }[]
      }
      get_member_count: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_next_chapter: {
        Args: { content_item_id: string; user_id: string }
        Returns: {
          chapter_number: number
          id: string
          slug: string
          title: string
        }[]
      }
      get_or_create_cart: {
        Args: { p_session_id?: string; p_user_id?: string }
        Returns: string
      }
      get_order_details: {
        Args: { p_order_id: string }
        Returns: Json
      }
      get_order_totals: {
        Args: {
          p_end_date?: string
          p_start_date?: string
          p_status?: Database["public"]["Enums"]["order_status"]
        }
        Returns: {
          net_sales: number
          order_count: number
          total_discounts: number
          total_sales: number
          total_shipping: number
          total_tax: number
        }[]
      }
      get_product_price_range: {
        Args: { p_product_id: string }
        Returns: Json
      }
      get_public_media_url: {
        Args: { file_row: Record<string, unknown> }
        Returns: string
      }
      get_public_tables: {
        Args: Record<PropertyKey, never>
        Returns: {
          table_name: string
        }[]
      }
      get_user_active_sessions: {
        Args: { p_user_id: string }
        Returns: {
          created_at: string
          ip_address: unknown
          is_current: boolean
          last_active: string
          location: string
          session_id: string
          user_agent: string
        }[]
      }
      get_user_active_subscription: {
        Args: { user_uuid: string }
        Returns: {
          current_period_end: string
          plan_name: string
          privileges: Json
          status: string
          subscription_id: string
        }[]
      }
      get_user_chapter_progress: {
        Args: { chapter_uuid: string }
        Returns: {
          bookmarks: Json
          completed: boolean
          last_read_at: string
          notes: Json
          progress_percentage: number
          reading_time_minutes: number
        }[]
      }
      get_user_library_with_progress: {
        Args: {
          content_type_filter?: string
          library_filter?: string
          page_offset?: number
          page_size?: number
          sort_by?: string
          sort_direction?: string
          user_id: string
        }
        Returns: {
          added_at: string
          average_rating: number
          completed_chapters: number
          completion_percentage: number
          content_description: string
          content_item_id: string
          content_slug: string
          content_title: string
          cover_image_url: string
          is_favorite: boolean
          item_type: string
          library_id: string
          metadata: Json
          overall_progress: number
          personal_rating: number
          rating_count: number
          total_chapters: number
        }[]
      }
      get_user_reading_statistics: {
        Args: { user_id: string }
        Returns: {
          avg_personal_rating: number
          chapters_completed: number
          chapters_started: number
          current_streak_days: number
          favorite_genre: string
          total_items_in_library: number
          total_reading_time: number
        }[]
      }
      get_user_recent_activity: {
        Args: { days_back?: number; limit_count?: number; user_id: string }
        Returns: {
          activity_date: string
          activity_type: string
          chapter_title: string
          content_item_slug: string
          content_item_title: string
          details: Json
        }[]
      }
      get_user_role: {
        Args: { p_user_id?: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      get_user_statistics: {
        Args: { p_user_id: string }
        Returns: Json
      }
      get_variant_pricing: {
        Args: { p_include_tax?: boolean; p_variant_id: string }
        Returns: {
          compare_at_amount: number
          discount_amount: number
          discount_percent: number
          on_sale: boolean
          price_amount: number
          price_currency: string
          tax_amount: number
          total_amount: number
          variant_id: string
        }[]
      }
      has_active_subscription: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      hash_ltree: {
        Args: { "": unknown }
        Returns: number
      }
      increment_reading_time: {
        Args: { chapter_id: string; minutes?: number; user_id: string }
        Returns: number
      }
      increment_wiki_page_views: {
        Args: { page_id: string }
        Returns: undefined
      }
      is_admin: {
        Args: { p_user_id?: string }
        Returns: boolean
      }
      is_user_admin: {
        Args: { p_user_id?: string }
        Returns: boolean
      }
      is_variant_in_stock: {
        Args: { p_quantity?: number; p_variant_id: string }
        Returns: boolean
      }
      lca: {
        Args: { "": unknown[] }
        Returns: unknown
      }
      log_user_activity: {
        Args: {
          p_activity_type: string
          p_description?: string
          p_metadata?: Json
          p_related_entity_id?: string
          p_related_entity_type?: string
          p_user_id: string
        }
        Returns: string
      }
      lquery_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      lquery_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      lquery_recv: {
        Args: { "": unknown }
        Returns: unknown
      }
      lquery_send: {
        Args: { "": unknown }
        Returns: string
      }
      ltree_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      ltree_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      ltree_gist_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      ltree_gist_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      ltree_gist_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      ltree_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      ltree_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      ltree_recv: {
        Args: { "": unknown }
        Returns: unknown
      }
      ltree_send: {
        Args: { "": unknown }
        Returns: string
      }
      ltree2text: {
        Args: { "": unknown }
        Returns: string
      }
      ltxtq_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      ltxtq_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      ltxtq_recv: {
        Args: { "": unknown }
        Returns: unknown
      }
      ltxtq_send: {
        Args: { "": unknown }
        Returns: string
      }
      nlevel: {
        Args: { "": unknown }
        Returns: number
      }
      recalculate_order_totals: {
        Args: { p_order_id: string }
        Returns: undefined
      }
      restore_inventory_for_order: {
        Args: { p_order_id: string }
        Returns: undefined
      }
      revoke_other_user_sessions: {
        Args: { p_current_session_id?: string; p_user_id: string }
        Returns: number
      }
      revoke_user_session: {
        Args: { p_session_id: string }
        Returns: boolean
      }
      search_characters: {
        Args: {
          character_statuses?: Database["public"]["Enums"]["character_status"][]
          character_types?: Database["public"]["Enums"]["character_type"][]
          is_major_only?: boolean
          is_pov_only?: boolean
          limit_count?: number
          max_importance?: number
          min_importance?: number
          offset_count?: number
          power_levels?: Database["public"]["Enums"]["power_level"][]
          search_query?: string
        }
        Returns: {
          appearance_count: number
          character_type: Database["public"]["Enums"]["character_type"]
          description: string
          id: string
          importance_score: number
          is_major_character: boolean
          is_pov_character: boolean
          name: string
          portrait_url: string
          power_level: Database["public"]["Enums"]["power_level"]
          relationship_count: number
          slug: string
          status: Database["public"]["Enums"]["character_status"]
          title: string
        }[]
      }
      search_content_items: {
        Args: {
          completion_status?: string
          content_type_filter?: string
          min_rating?: number
          page_offset?: number
          page_size?: number
          search_query?: string
          sort_by?: string
          sort_direction?: string
        }
        Returns: {
          average_rating: number
          completion_percentage: number
          cover_image_url: string
          description: string
          id: string
          metadata: Json
          published_at: string
          rating_count: number
          slug: string
          status: string
          title: string
          total_count: number
          type: string
        }[]
      }
      setup_default_roles: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      test_chapter_creation: {
        Args: Record<PropertyKey, never>
        Returns: {
          message: string
          success: boolean
        }[]
      }
      text2ltree: {
        Args: { "": string }
        Returns: unknown
      }
      update_inventory: {
        Args: {
          p_operation?: string
          p_quantity_change: number
          p_variant_id: string
        }
        Returns: number
      }
      update_order_status: {
        Args: {
          p_note?: string
          p_order_id: string
          p_status: Database["public"]["Enums"]["order_status"]
        }
        Returns: undefined
      }
      upsert_reading_progress: {
        Args: {
          chapter_uuid: string
          progress_percent: number
          reading_minutes?: number
          user_bookmarks?: Json
          user_notes?: Json
        }
        Returns: string
      }
      user_has_chapter_access: {
        Args: { chapter_uuid: string; user_uuid: string }
        Returns: boolean
      }
      user_has_content_access: {
        Args: {
          content_id_param: string
          content_type: string
          user_id_param: string
        }
        Returns: boolean
      }
      user_has_privilege: {
        Args: { privilege_name: string; user_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      ability_category:
        | "magical"
        | "physical"
        | "mental"
        | "social"
        | "technological"
        | "divine"
      activity_type:
        | "chapter_read"
        | "book_completed"
        | "review_posted"
        | "comment_posted"
        | "wiki_edited"
        | "profile_updated"
        | "subscription_started"
        | "achievement_earned"
      beta_application_status: "pending" | "approved" | "denied"
      beta_reader_status: "not_applied" | "pending" | "approved" | "rejected"
      chapter_status: "draft" | "published" | "scheduled" | "archived"
      character_importance: "major" | "minor" | "cameo"
      character_status:
        | "alive"
        | "deceased"
        | "missing"
        | "unknown"
        | "immortal"
      character_type:
        | "protagonist"
        | "antagonist"
        | "supporting"
        | "minor"
        | "cameo"
        | "narrator"
        | "mentor"
        | "villain"
        | "anti-hero"
      collection_method: "charge_automatically" | "send_invoice"
      content_block_type:
        | "heading_1"
        | "heading_2"
        | "heading_3"
        | "paragraph"
        | "bullet_list"
        | "ordered_list"
        | "image"
        | "table"
        | "quote"
        | "code"
        | "divider"
      content_item_type: "book" | "volume" | "saga" | "arc" | "issue"
      content_status: "draft" | "published" | "scheduled" | "archived"
      discount_type: "percentage" | "fixed_amount" | "free_shipping"
      fulfillment_status:
        | "unfulfilled"
        | "fulfilled"
        | "partial"
        | "shipped"
        | "delivered"
        | "returned"
        | "cancelled"
      invoice_status: "draft" | "open" | "paid" | "void" | "uncollectible"
      learn_section_type:
        | "authors_journey"
        | "educational_resources"
        | "professional_services"
      order_status:
        | "draft"
        | "pending"
        | "processing"
        | "on_hold"
        | "completed"
        | "cancelled"
        | "refunded"
        | "failed"
      payment_method:
        | "credit_card"
        | "paypal"
        | "bank_transfer"
        | "crypto"
        | "apple_pay"
        | "google_pay"
        | "stripe"
        | "other"
      payment_status:
        | "paid"
        | "unpaid"
        | "no_payment_required"
        | "failed"
        | "processing"
        | "requires_payment_method"
        | "requires_confirmation"
        | "requires_action"
        | "canceled"
      power_level:
        | "mortal"
        | "enhanced"
        | "supernatural"
        | "divine"
        | "cosmic"
        | "omnipotent"
      product_type:
        | "single_issue"
        | "bundle"
        | "chapter_pass"
        | "arc_pass"
        | "subscription"
        | "arc_bundle"
        | "saga_bundle"
        | "volume_bundle"
        | "book_bundle"
        | "subscription_tier"
      profile_visibility: "public" | "private" | "friends_only"
      refund_status:
        | "pending"
        | "processing"
        | "succeeded"
        | "failed"
        | "cancelled"
      relationship_type:
        | "family"
        | "friend"
        | "ally"
        | "enemy"
        | "rival"
        | "mentor"
        | "student"
        | "love_interest"
        | "neutral"
        | "complex"
      subscription_discount_duration: "forever" | "once" | "repeating"
      subscription_status:
        | "incomplete"
        | "incomplete_expired"
        | "trialing"
        | "active"
        | "past_due"
        | "canceled"
        | "unpaid"
        | "paused"
      user_role:
        | "admin"
        | "support"
        | "accountant"
        | "user"
        | "super_admin"
        | "beta_reader"
        | "EDITOR"
        | "MANAGER"
      wiki_content_type:
        | "heading_1"
        | "heading_2"
        | "heading_3"
        | "paragraph"
        | "bullet_list"
        | "ordered_list"
        | "image"
        | "video"
        | "audio"
        | "table"
        | "quote"
        | "code"
        | "divider"
        | "file_attachment"
      work_status: "planning" | "writing" | "editing" | "published" | "on_hold"
      work_type: "book" | "volume" | "saga" | "arc" | "issue"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      ability_category: [
        "magical",
        "physical",
        "mental",
        "social",
        "technological",
        "divine",
      ],
      activity_type: [
        "chapter_read",
        "book_completed",
        "review_posted",
        "comment_posted",
        "wiki_edited",
        "profile_updated",
        "subscription_started",
        "achievement_earned",
      ],
      beta_application_status: ["pending", "approved", "denied"],
      beta_reader_status: ["not_applied", "pending", "approved", "rejected"],
      chapter_status: ["draft", "published", "scheduled", "archived"],
      character_importance: ["major", "minor", "cameo"],
      character_status: ["alive", "deceased", "missing", "unknown", "immortal"],
      character_type: [
        "protagonist",
        "antagonist",
        "supporting",
        "minor",
        "cameo",
        "narrator",
        "mentor",
        "villain",
        "anti-hero",
      ],
      collection_method: ["charge_automatically", "send_invoice"],
      content_block_type: [
        "heading_1",
        "heading_2",
        "heading_3",
        "paragraph",
        "bullet_list",
        "ordered_list",
        "image",
        "table",
        "quote",
        "code",
        "divider",
      ],
      content_item_type: ["book", "volume", "saga", "arc", "issue"],
      content_status: ["draft", "published", "scheduled", "archived"],
      discount_type: ["percentage", "fixed_amount", "free_shipping"],
      fulfillment_status: [
        "unfulfilled",
        "fulfilled",
        "partial",
        "shipped",
        "delivered",
        "returned",
        "cancelled",
      ],
      invoice_status: ["draft", "open", "paid", "void", "uncollectible"],
      learn_section_type: [
        "authors_journey",
        "educational_resources",
        "professional_services",
      ],
      order_status: [
        "draft",
        "pending",
        "processing",
        "on_hold",
        "completed",
        "cancelled",
        "refunded",
        "failed",
      ],
      payment_method: [
        "credit_card",
        "paypal",
        "bank_transfer",
        "crypto",
        "apple_pay",
        "google_pay",
        "stripe",
        "other",
      ],
      payment_status: [
        "paid",
        "unpaid",
        "no_payment_required",
        "failed",
        "processing",
        "requires_payment_method",
        "requires_confirmation",
        "requires_action",
        "canceled",
      ],
      power_level: [
        "mortal",
        "enhanced",
        "supernatural",
        "divine",
        "cosmic",
        "omnipotent",
      ],
      product_type: [
        "single_issue",
        "bundle",
        "chapter_pass",
        "arc_pass",
        "subscription",
        "arc_bundle",
        "saga_bundle",
        "volume_bundle",
        "book_bundle",
        "subscription_tier",
      ],
      profile_visibility: ["public", "private", "friends_only"],
      refund_status: [
        "pending",
        "processing",
        "succeeded",
        "failed",
        "cancelled",
      ],
      relationship_type: [
        "family",
        "friend",
        "ally",
        "enemy",
        "rival",
        "mentor",
        "student",
        "love_interest",
        "neutral",
        "complex",
      ],
      subscription_discount_duration: ["forever", "once", "repeating"],
      subscription_status: [
        "incomplete",
        "incomplete_expired",
        "trialing",
        "active",
        "past_due",
        "canceled",
        "unpaid",
        "paused",
      ],
      user_role: [
        "admin",
        "support",
        "accountant",
        "user",
        "super_admin",
        "beta_reader",
        "EDITOR",
        "MANAGER",
      ],
      wiki_content_type: [
        "heading_1",
        "heading_2",
        "heading_3",
        "paragraph",
        "bullet_list",
        "ordered_list",
        "image",
        "video",
        "audio",
        "table",
        "quote",
        "code",
        "divider",
        "file_attachment",
      ],
      work_status: ["planning", "writing", "editing", "published", "on_hold"],
      work_type: ["book", "volume", "saga", "arc", "issue"],
    },
  },
} as const
