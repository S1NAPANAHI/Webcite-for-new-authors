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
        Relationships: [
          {
            foreignKeyName: "analytics_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
        }
        Insert: {
          answers?: Json | null
          applicant_email: string
          created_at?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          answers?: Json | null
          applicant_email?: string
          created_at?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string | null
          content: Json | null
          cover_url: string | null
          created_at: string | null
          excerpt: string | null
          id: string
          published_at: string | null
          slug: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content?: Json | null
          cover_url?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          published_at?: string | null
          slug: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: Json | null
          cover_url?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          published_at?: string | null
          slug?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      books: {
        Row: {
          cover_image: string | null
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          og_image: string | null
          publish_at: string | null
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
          og_image?: string | null
          publish_at?: string | null
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
          og_image?: string | null
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
            foreignKeyName: "chapter_revisions_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chapter_revisions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chapters: {
        Row: {
          content_format: string | null
          content_json: Json | null
          content_text: string | null
          content_url: string | null
          created_at: string | null
          estimated_reading_time: number | null
          id: string
          issue_id: string
          metadata: Json | null
          order_index: number
          publish_at: string | null
          release_date: string | null
          slug: string
          state: string | null
          subscription_required: boolean | null
          subtitle: string | null
          synopsis: string | null
          title: string
          unpublish_at: string | null
          updated_at: string | null
          word_count: number | null
        }
        Insert: {
          content_format?: string | null
          content_json?: Json | null
          content_text?: string | null
          content_url?: string | null
          created_at?: string | null
          estimated_reading_time?: number | null
          id?: string
          issue_id: string
          metadata?: Json | null
          order_index?: number
          publish_at?: string | null
          release_date?: string | null
          slug: string
          state?: string | null
          subscription_required?: boolean | null
          subtitle?: string | null
          synopsis?: string | null
          title: string
          unpublish_at?: string | null
          updated_at?: string | null
          word_count?: number | null
        }
        Update: {
          content_format?: string | null
          content_json?: Json | null
          content_text?: string | null
          content_url?: string | null
          created_at?: string | null
          estimated_reading_time?: number | null
          id?: string
          issue_id?: string
          metadata?: Json | null
          order_index?: number
          publish_at?: string | null
          release_date?: string | null
          slug?: string
          state?: string | null
          subscription_required?: boolean | null
          subtitle?: string | null
          synopsis?: string | null
          title?: string
          unpublish_at?: string | null
          updated_at?: string | null
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "chapters_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
        ]
      }
      characters: {
        Row: {
          avatar_url: string | null
          bio: Json | null
          created_at: string | null
          id: string
          name: string
          slug: string
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: Json | null
          created_at?: string | null
          id?: string
          name: string
          slug: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: Json | null
          created_at?: string | null
          id?: string
          name?: string
          slug?: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
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
          content: string | null
          created_at: string
          id: string
          order_position: number | null
          section: string | null
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          order_position?: number | null
          section?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          order_position?: number | null
          section?: string | null
          title?: string
          updated_at?: string
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
          created_at: string | null
          email: string | null
          id: string
          privileges: string[] | null
          reading_preferences: Json | null
          subscription_status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          privileges?: string[] | null
          reading_preferences?: Json | null
          subscription_status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          privileges?: string[] | null
          reading_preferences?: Json | null
          subscription_status?: string | null
          updated_at?: string | null
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
      reading_progress: {
        Row: {
          chapter_id: string
          completed: boolean | null
          id: string
          last_read_at: string | null
          last_read_position: number | null
          progress_percentage: number | null
          user_id: string
        }
        Insert: {
          chapter_id: string
          completed?: boolean | null
          id?: string
          last_read_at?: string | null
          last_read_position?: number | null
          progress_percentage?: number | null
          user_id: string
        }
        Update: {
          chapter_id?: string
          completed?: boolean | null
          id?: string
          last_read_at?: string | null
          last_read_position?: number | null
          progress_percentage?: number | null
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
            foreignKeyName: "reading_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
          created_at: string | null
          end_date: string | null
          id: string
          metadata: Json | null
          plan_type: string
          start_date: string
          status: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          metadata?: Json | null
          plan_type: string
          start_date?: string
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          metadata?: Json | null
          plan_type?: string
          start_date?: string
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_events: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          links: Json | null
          occurred_at: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          links?: Json | null
          occurred_at?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          links?: Json | null
          occurred_at?: string | null
          title?: string
        }
        Relationships: []
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
      user_library: {
        Row: {
          added_at: string | null
          id: string
          user_id: string
          work_id: string
          work_type: string
        }
        Insert: {
          added_at?: string | null
          id?: string
          user_id: string
          work_id: string
          work_type: string
        }
        Update: {
          added_at?: string | null
          id?: string
          user_id?: string
          work_id?: string
          work_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_library_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          expires_at: string | null
          granted_by: string | null
          metadata: Json | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          granted_by?: string | null
          metadata?: Json | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          granted_by?: string | null
          metadata?: Json | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          billing_address: Json | null
          id: string
          payment_method: Json | null
        }
        Insert: {
          billing_address?: Json | null
          id: string
          payment_method?: Json | null
        }
        Update: {
          billing_address?: Json | null
          id?: string
          payment_method?: Json | null
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
        Relationships: [
          {
            foreignKeyName: "volumes_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_events: {
        Row: {
          error_message: string | null
          event_type: string
          id: string
          payload: Json
          processed: boolean | null
          processed_at: string | null
          provider: string
          received_at: string | null
        }
        Insert: {
          error_message?: string | null
          event_type: string
          id: string
          payload: Json
          processed?: boolean | null
          processed_at?: string | null
          provider: string
          received_at?: string | null
        }
        Update: {
          error_message?: string | null
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
      generate_order_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_slug: {
        Args: { input_text: string }
        Returns: string
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
      get_folder_path: {
        Args: { folder_id: string }
        Returns: {
          id: string
          level: number
          name: string
          slug: string
        }[]
      }
      get_member_count: {
        Args: Record<PropertyKey, never>
        Returns: number
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
      get_public_tables: {
        Args: Record<PropertyKey, never>
        Returns: {
          table_name: string
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
      get_user_role: {
        Args: { p_user_id?: string }
        Returns: Database["public"]["Enums"]["user_role"]
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
      setup_default_roles: {
        Args: { p_user_id: string }
        Returns: undefined
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
      content_status:
        | "planning"
        | "writing"
        | "editing"
        | "published"
        | "on_hold"
        | "archived"
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
      content_status: [
        "planning",
        "writing",
        "editing",
        "published",
        "on_hold",
        "archived",
      ],
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
