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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      accountability_alerts: {
        Row: {
          acknowledged_by: string[] | null
          alert_type: string
          created_at: string
          id: string
          message: string
          related_id: string | null
          sent_at: string | null
          severity: string
          target_members: string[]
          title: string
          user_id: string
        }
        Insert: {
          acknowledged_by?: string[] | null
          alert_type: string
          created_at?: string
          id?: string
          message: string
          related_id?: string | null
          sent_at?: string | null
          severity?: string
          target_members?: string[]
          title: string
          user_id: string
        }
        Update: {
          acknowledged_by?: string[] | null
          alert_type?: string
          created_at?: string
          id?: string
          message?: string
          related_id?: string | null
          sent_at?: string | null
          severity?: string
          target_members?: string[]
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      accountability_reminders: {
        Row: {
          created_at: string
          created_by_member_id: string
          description: string | null
          end_date: string | null
          escalation_delay_minutes: number | null
          escalation_enabled: boolean
          escalation_members: string[] | null
          frequency: string
          id: string
          is_active: boolean
          reminder_days: number[] | null
          reminder_time: string
          reminder_type: string
          start_date: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by_member_id: string
          description?: string | null
          end_date?: string | null
          escalation_delay_minutes?: number | null
          escalation_enabled?: boolean
          escalation_members?: string[] | null
          frequency?: string
          id?: string
          is_active?: boolean
          reminder_days?: number[] | null
          reminder_time: string
          reminder_type?: string
          start_date?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by_member_id?: string
          description?: string | null
          end_date?: string | null
          escalation_delay_minutes?: number | null
          escalation_enabled?: boolean
          escalation_members?: string[] | null
          frequency?: string
          id?: string
          is_active?: boolean
          reminder_days?: number[] | null
          reminder_time?: string
          reminder_type?: string
          start_date?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      action_confirmations: {
        Row: {
          confirmation_note: string | null
          confirmation_status: string
          confirmed_at: string | null
          created_at: string
          extracted_action_id: string
          id: string
          user_id: string
          user_modifications: Json | null
        }
        Insert: {
          confirmation_note?: string | null
          confirmation_status: string
          confirmed_at?: string | null
          created_at?: string
          extracted_action_id: string
          id?: string
          user_id: string
          user_modifications?: Json | null
        }
        Update: {
          confirmation_note?: string | null
          confirmation_status?: string
          confirmed_at?: string | null
          created_at?: string
          extracted_action_id?: string
          id?: string
          user_id?: string
          user_modifications?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "action_confirmations_extracted_action_id_fkey"
            columns: ["extracted_action_id"]
            isOneToOne: false
            referencedRelation: "extracted_actions"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_events: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          page_url: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          page_url?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          page_url?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      assessment_results: {
        Row: {
          assessment_type: string
          completed_at: string | null
          completion_status: string
          created_at: string
          id: string
          payment_status: string
          raw_assessment_data: Json | null
          recommendations: Json | null
          responses: Json
          scores: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          assessment_type?: string
          completed_at?: string | null
          completion_status?: string
          created_at?: string
          id?: string
          payment_status?: string
          raw_assessment_data?: Json | null
          recommendations?: Json | null
          responses?: Json
          scores?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          assessment_type?: string
          completed_at?: string | null
          completion_status?: string
          created_at?: string
          id?: string
          payment_status?: string
          raw_assessment_data?: Json | null
          recommendations?: Json | null
          responses?: Json
          scores?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      calendar_events: {
        Row: {
          category: string | null
          created_at: string
          date: string
          description: string | null
          id: string
          is_system_generated: boolean
          requires_acceptance: boolean
          time: string
          title: string
          type: string
          user_id: string
          watchers: string[] | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          date: string
          description?: string | null
          id?: string
          is_system_generated?: boolean
          requires_acceptance?: boolean
          time: string
          title: string
          type?: string
          user_id: string
          watchers?: string[] | null
        }
        Update: {
          category?: string | null
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          is_system_generated?: boolean
          requires_acceptance?: boolean
          time?: string
          title?: string
          type?: string
          user_id?: string
          watchers?: string[] | null
        }
        Relationships: []
      }
      conversation_contexts: {
        Row: {
          communication_preferences: string | null
          conflict_resolution_style: string | null
          conversation_history: Json | null
          created_at: string
          emotional_patterns: Json | null
          energy_compatibility: number | null
          id: string
          important_topics: Json | null
          last_conversation_date: string | null
          memory_triggers: string | null
          participant_name: string
          relationship_dynamics: string | null
          relationship_type: string
          shared_commitments: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          communication_preferences?: string | null
          conflict_resolution_style?: string | null
          conversation_history?: Json | null
          created_at?: string
          emotional_patterns?: Json | null
          energy_compatibility?: number | null
          id?: string
          important_topics?: Json | null
          last_conversation_date?: string | null
          memory_triggers?: string | null
          participant_name: string
          relationship_dynamics?: string | null
          relationship_type: string
          shared_commitments?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          communication_preferences?: string | null
          conflict_resolution_style?: string | null
          conversation_history?: Json | null
          created_at?: string
          emotional_patterns?: Json | null
          energy_compatibility?: number | null
          id?: string
          important_topics?: Json | null
          last_conversation_date?: string | null
          memory_triggers?: string | null
          participant_name?: string
          relationship_dynamics?: string | null
          relationship_type?: string
          shared_commitments?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      cross_device_notifications: {
        Row: {
          created_at: string
          data: Json
          device_source: string
          expires_at: string | null
          id: string
          is_read: boolean
          notification_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json
          device_source: string
          expires_at?: string | null
          id?: string
          is_read?: boolean
          notification_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json
          device_source?: string
          expires_at?: string | null
          id?: string
          is_read?: boolean
          notification_type?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_actions: {
        Row: {
          action_type: string
          calendar_event_id: string | null
          celebration_shown: boolean | null
          completed_at: string | null
          created_at: string
          date: string
          description: string | null
          difficulty_level: number | null
          duration_minutes: number | null
          focus_area: string | null
          goal_id: string | null
          id: string
          is_daily_win: boolean
          start_time: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
          watchers: string[] | null
        }
        Insert: {
          action_type?: string
          calendar_event_id?: string | null
          celebration_shown?: boolean | null
          completed_at?: string | null
          created_at?: string
          date?: string
          description?: string | null
          difficulty_level?: number | null
          duration_minutes?: number | null
          focus_area?: string | null
          goal_id?: string | null
          id?: string
          is_daily_win?: boolean
          start_time?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
          watchers?: string[] | null
        }
        Update: {
          action_type?: string
          calendar_event_id?: string | null
          celebration_shown?: boolean | null
          completed_at?: string | null
          created_at?: string
          date?: string
          description?: string | null
          difficulty_level?: number | null
          duration_minutes?: number | null
          focus_area?: string | null
          goal_id?: string | null
          id?: string
          is_daily_win?: boolean
          start_time?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
          watchers?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_actions_calendar_event_id_fkey"
            columns: ["calendar_event_id"]
            isOneToOne: false
            referencedRelation: "calendar_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_daily_actions_goal"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_win_streaks: {
        Row: {
          created_at: string
          current_streak: number | null
          id: string
          last_win_date: string | null
          longest_streak: number | null
          total_wins: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_streak?: number | null
          id?: string
          last_win_date?: string | null
          longest_streak?: number | null
          total_wins?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_streak?: number | null
          id?: string
          last_win_date?: string | null
          longest_streak?: number | null
          total_wins?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      empowerment_statements: {
        Row: {
          category: string
          created_at: string
          engagement_score: number | null
          id: string
          mood: string | null
          season: string | null
          subcategory: string | null
          tags: string[] | null
          text: string
          theme: string | null
          tier: string
          updated_at: string
          usage_count: number | null
          user_type: string
        }
        Insert: {
          category: string
          created_at?: string
          engagement_score?: number | null
          id?: string
          mood?: string | null
          season?: string | null
          subcategory?: string | null
          tags?: string[] | null
          text: string
          theme?: string | null
          tier?: string
          updated_at?: string
          usage_count?: number | null
          user_type: string
        }
        Update: {
          category?: string
          created_at?: string
          engagement_score?: number | null
          id?: string
          mood?: string | null
          season?: string | null
          subcategory?: string | null
          tags?: string[] | null
          text?: string
          theme?: string | null
          tier?: string
          updated_at?: string
          usage_count?: number | null
          user_type?: string
        }
        Relationships: []
      }
      extracted_actions: {
        Row: {
          action_text: string
          action_type: string
          assigned_to: string | null
          assigned_watchers: string[] | null
          calendar_checked: boolean | null
          calendar_event_id: string | null
          completion_date: string | null
          confidence_score: number | null
          created_at: string
          due_context: string | null
          emotional_stakes: string | null
          how_steps: string[] | null
          id: string
          intent_behind: string | null
          meeting_recording_id: string
          micro_tasks: Json | null
          motivation_statement: string | null
          priority_level: number | null
          proposed_date: string | null
          proposed_time: string | null
          relationship_impact: string | null
          scheduled_date: string | null
          scheduled_time: string | null
          status: string
          success_criteria: string | null
          support_circle_notified: boolean | null
          timestamp_in_recording: number | null
          transcript_excerpt: string | null
          updated_at: string
          user_id: string
          user_notes: string | null
          what_outcome: string | null
        }
        Insert: {
          action_text: string
          action_type?: string
          assigned_to?: string | null
          assigned_watchers?: string[] | null
          calendar_checked?: boolean | null
          calendar_event_id?: string | null
          completion_date?: string | null
          confidence_score?: number | null
          created_at?: string
          due_context?: string | null
          emotional_stakes?: string | null
          how_steps?: string[] | null
          id?: string
          intent_behind?: string | null
          meeting_recording_id: string
          micro_tasks?: Json | null
          motivation_statement?: string | null
          priority_level?: number | null
          proposed_date?: string | null
          proposed_time?: string | null
          relationship_impact?: string | null
          scheduled_date?: string | null
          scheduled_time?: string | null
          status?: string
          success_criteria?: string | null
          support_circle_notified?: boolean | null
          timestamp_in_recording?: number | null
          transcript_excerpt?: string | null
          updated_at?: string
          user_id: string
          user_notes?: string | null
          what_outcome?: string | null
        }
        Update: {
          action_text?: string
          action_type?: string
          assigned_to?: string | null
          assigned_watchers?: string[] | null
          calendar_checked?: boolean | null
          calendar_event_id?: string | null
          completion_date?: string | null
          confidence_score?: number | null
          created_at?: string
          due_context?: string | null
          emotional_stakes?: string | null
          how_steps?: string[] | null
          id?: string
          intent_behind?: string | null
          meeting_recording_id?: string
          micro_tasks?: Json | null
          motivation_statement?: string | null
          priority_level?: number | null
          proposed_date?: string | null
          proposed_time?: string | null
          relationship_impact?: string | null
          scheduled_date?: string | null
          scheduled_time?: string | null
          status?: string
          success_criteria?: string | null
          support_circle_notified?: boolean | null
          timestamp_in_recording?: number | null
          transcript_excerpt?: string | null
          updated_at?: string
          user_id?: string
          user_notes?: string | null
          what_outcome?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "extracted_actions_meeting_recording_id_fkey"
            columns: ["meeting_recording_id"]
            isOneToOne: false
            referencedRelation: "meeting_recordings"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          progress_percentage: number | null
          status: string
          target_date: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          progress_percentage?: number | null
          status?: string
          target_date?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          progress_percentage?: number | null
          status?: string
          target_date?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      gratitude_entries: {
        Row: {
          created_at: string
          date: string
          gratitude_text: string
          id: string
          prompt_type: string
          updated_at: string
          user_id: string
          why_grateful: string | null
        }
        Insert: {
          created_at?: string
          date?: string
          gratitude_text: string
          id?: string
          prompt_type?: string
          updated_at?: string
          user_id: string
          why_grateful?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          gratitude_text?: string
          id?: string
          prompt_type?: string
          updated_at?: string
          user_id?: string
          why_grateful?: string | null
        }
        Relationships: []
      }
      meeting_recordings: {
        Row: {
          created_at: string
          emotional_context: string | null
          ended_at: string | null
          energy_level: number | null
          id: string
          is_active: boolean
          location: string | null
          meeting_context: string | null
          meeting_title: string
          meeting_type: string
          participants: Json
          processing_completed_at: string | null
          processing_error: string | null
          processing_status: string | null
          proposed_schedule: Json | null
          recording_id: string | null
          relationship_context: Json | null
          started_at: string
          transcript: string | null
          updated_at: string
          user_id: string
          watchers: string[] | null
        }
        Insert: {
          created_at?: string
          emotional_context?: string | null
          ended_at?: string | null
          energy_level?: number | null
          id?: string
          is_active?: boolean
          location?: string | null
          meeting_context?: string | null
          meeting_title: string
          meeting_type?: string
          participants?: Json
          processing_completed_at?: string | null
          processing_error?: string | null
          processing_status?: string | null
          proposed_schedule?: Json | null
          recording_id?: string | null
          relationship_context?: Json | null
          started_at?: string
          transcript?: string | null
          updated_at?: string
          user_id: string
          watchers?: string[] | null
        }
        Update: {
          created_at?: string
          emotional_context?: string | null
          ended_at?: string | null
          energy_level?: number | null
          id?: string
          is_active?: boolean
          location?: string | null
          meeting_context?: string | null
          meeting_title?: string
          meeting_type?: string
          participants?: Json
          processing_completed_at?: string | null
          processing_error?: string | null
          processing_status?: string | null
          proposed_schedule?: Json | null
          recording_id?: string | null
          relationship_context?: Json | null
          started_at?: string
          transcript?: string | null
          updated_at?: string
          user_id?: string
          watchers?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "meeting_recordings_recording_id_fkey"
            columns: ["recording_id"]
            isOneToOne: false
            referencedRelation: "voice_recordings"
            referencedColumns: ["id"]
          },
        ]
      }
      memory_bridge_comments: {
        Row: {
          comment_text: string
          commenter_member_id: string
          created_at: string
          id: string
          is_read: boolean
          meeting_recording_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comment_text: string
          commenter_member_id: string
          created_at?: string
          id?: string
          is_read?: boolean
          meeting_recording_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comment_text?: string
          commenter_member_id?: string
          created_at?: string
          id?: string
          is_read?: boolean
          meeting_recording_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memory_bridge_comments_meeting_recording_id_fkey"
            columns: ["meeting_recording_id"]
            isOneToOne: false
            referencedRelation: "meeting_recordings"
            referencedColumns: ["id"]
          },
        ]
      }
      memory_comments: {
        Row: {
          comment: string
          commenter_email: string
          commenter_name: string
          created_at: string
          id: string
          memory_id: string
          updated_at: string
        }
        Insert: {
          comment: string
          commenter_email: string
          commenter_name: string
          created_at?: string
          id?: string
          memory_id: string
          updated_at?: string
        }
        Update: {
          comment?: string
          commenter_email?: string
          commenter_name?: string
          created_at?: string
          id?: string
          memory_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "memory_comments_memory_id_fkey"
            columns: ["memory_id"]
            isOneToOne: false
            referencedRelation: "memory_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      memory_entries: {
        Row: {
          category: string | null
          content: string | null
          created_at: string
          file_path: string | null
          file_size_bytes: number | null
          id: string
          is_favorite: boolean | null
          memory_type: string
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
          visibility_level: string
        }
        Insert: {
          category?: string | null
          content?: string | null
          created_at?: string
          file_path?: string | null
          file_size_bytes?: number | null
          id?: string
          is_favorite?: boolean | null
          memory_type?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
          visibility_level?: string
        }
        Update: {
          category?: string | null
          content?: string | null
          created_at?: string
          file_path?: string | null
          file_size_bytes?: number | null
          id?: string
          is_favorite?: boolean | null
          memory_type?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
          visibility_level?: string
        }
        Relationships: []
      }
      memory_watchers: {
        Row: {
          can_comment: boolean | null
          can_view: boolean | null
          created_at: string
          id: string
          memory_id: string
          user_id: string
          watcher_email: string
        }
        Insert: {
          can_comment?: boolean | null
          can_view?: boolean | null
          created_at?: string
          id?: string
          memory_id: string
          user_id: string
          watcher_email: string
        }
        Update: {
          can_comment?: boolean | null
          can_view?: boolean | null
          created_at?: string
          id?: string
          memory_id?: string
          user_id?: string
          watcher_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "memory_watchers_memory_id_fkey"
            columns: ["memory_id"]
            isOneToOne: false
            referencedRelation: "memory_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      mfa_factors: {
        Row: {
          backup_codes: Json | null
          created_at: string
          factor_name: string | null
          factor_type: string
          id: string
          is_enabled: boolean
          is_verified: boolean
          phone_number: string | null
          secret: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          backup_codes?: Json | null
          created_at?: string
          factor_name?: string | null
          factor_type: string
          id?: string
          is_enabled?: boolean
          is_verified?: boolean
          phone_number?: string | null
          secret?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          backup_codes?: Json | null
          created_at?: string
          factor_name?: string | null
          factor_type?: string
          id?: string
          is_enabled?: boolean
          is_verified?: boolean
          phone_number?: string | null
          secret?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mfa_verification_attempts: {
        Row: {
          created_at: string
          factor_type: string
          id: string
          ip_address: unknown | null
          success: boolean
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          factor_type: string
          id?: string
          ip_address?: unknown | null
          success: boolean
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          factor_type?: string
          id?: string
          ip_address?: unknown | null
          success?: boolean
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      mood_entries: {
        Row: {
          context: string | null
          created_at: string
          date: string
          emotional_note: string | null
          emotions: string[] | null
          energy_level: number
          gratitude_note: string | null
          id: string
          mood: string
          notes: string | null
          user_id: string
        }
        Insert: {
          context?: string | null
          created_at?: string
          date?: string
          emotional_note?: string | null
          emotions?: string[] | null
          energy_level: number
          gratitude_note?: string | null
          id?: string
          mood: string
          notes?: string | null
          user_id: string
        }
        Update: {
          context?: string | null
          created_at?: string
          date?: string
          emotional_note?: string | null
          emotions?: string[] | null
          energy_level?: number
          gratitude_note?: string | null
          id?: string
          mood?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notes: {
        Row: {
          content: string | null
          created_at: string
          decision_context: string | null
          decision_outcome: string | null
          decision_tags: string[] | null
          decision_type: string | null
          id: string
          is_decision: boolean | null
          reflection_date: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          decision_context?: string | null
          decision_outcome?: string | null
          decision_tags?: string[] | null
          decision_type?: string | null
          id?: string
          is_decision?: boolean | null
          reflection_date?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          decision_context?: string | null
          decision_outcome?: string | null
          decision_tags?: string[] | null
          decision_type?: string | null
          id?: string
          is_decision?: boolean | null
          reflection_date?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          card_brand: string | null
          card_exp_month: number | null
          card_exp_year: number | null
          card_last4: string | null
          created_at: string
          id: string
          is_default: boolean | null
          stripe_payment_method_id: string
          user_id: string
        }
        Insert: {
          card_brand?: string | null
          card_exp_month?: number | null
          card_exp_year?: number | null
          card_last4?: string | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          stripe_payment_method_id: string
          user_id: string
        }
        Update: {
          card_brand?: string | null
          card_exp_month?: number | null
          card_exp_year?: number | null
          card_last4?: string | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          stripe_payment_method_id?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          custom_user_type: string | null
          email: string
          id: string
          mfa_enabled: boolean | null
          name: string
          onboarding_completed: boolean | null
          phone_number: string | null
          phone_verified: boolean | null
          require_mfa_for_sensitive_actions: boolean | null
          updated_at: string
          user_type: string | null
        }
        Insert: {
          created_at?: string
          custom_user_type?: string | null
          email: string
          id: string
          mfa_enabled?: boolean | null
          name: string
          onboarding_completed?: boolean | null
          phone_number?: string | null
          phone_verified?: boolean | null
          require_mfa_for_sensitive_actions?: boolean | null
          updated_at?: string
          user_type?: string | null
        }
        Update: {
          created_at?: string
          custom_user_type?: string | null
          email?: string
          id?: string
          mfa_enabled?: boolean | null
          name?: string
          onboarding_completed?: boolean | null
          phone_number?: string | null
          phone_verified?: boolean | null
          require_mfa_for_sensitive_actions?: boolean | null
          updated_at?: string
          user_type?: string | null
        }
        Relationships: []
      }
      recording_usage_tracking: {
        Row: {
          comment_count: number
          created_at: string
          id: string
          period_end: string
          period_start: string
          recording_count: number
          recording_duration_minutes: number
          subscription_tier: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comment_count?: number
          created_at?: string
          id?: string
          period_end: string
          period_start: string
          recording_count?: number
          recording_duration_minutes?: number
          subscription_tier?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comment_count?: number
          created_at?: string
          id?: string
          period_end?: string
          period_start?: string
          recording_count?: number
          recording_duration_minutes?: number
          subscription_tier?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reminder_responses: {
        Row: {
          created_at: string
          id: string
          reminder_id: string
          responded_at: string | null
          response_note: string | null
          response_type: string | null
          sent_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          reminder_id: string
          responded_at?: string | null
          response_note?: string | null
          response_type?: string | null
          sent_at: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          reminder_id?: string
          responded_at?: string | null
          response_note?: string | null
          response_type?: string | null
          sent_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminder_responses_reminder_id_fkey"
            columns: ["reminder_id"]
            isOneToOne: false
            referencedRelation: "accountability_reminders"
            referencedColumns: ["id"]
          },
        ]
      }
      security_events: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_type: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_end: string | null
          trial_start: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_type?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_type?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      support_circle_members: {
        Row: {
          can_receive_alerts: boolean
          can_send_reminders: boolean
          created_at: string
          id: string
          invitation_expires_at: string | null
          invitation_token: string | null
          invited_at: string | null
          joined_at: string | null
          member_email: string | null
          member_name: string
          member_phone: string | null
          notification_preferences: Json
          permissions: Json
          relationship: string
          role: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          can_receive_alerts?: boolean
          can_send_reminders?: boolean
          created_at?: string
          id?: string
          invitation_expires_at?: string | null
          invitation_token?: string | null
          invited_at?: string | null
          joined_at?: string | null
          member_email?: string | null
          member_name: string
          member_phone?: string | null
          notification_preferences?: Json
          permissions?: Json
          relationship: string
          role?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          can_receive_alerts?: boolean
          can_send_reminders?: boolean
          created_at?: string
          id?: string
          invitation_expires_at?: string | null
          invitation_token?: string | null
          invited_at?: string | null
          joined_at?: string | null
          member_email?: string | null
          member_name?: string
          member_phone?: string | null
          notification_preferences?: Json
          permissions?: Json
          relationship?: string
          role?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      support_circle_messages: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message_text: string
          message_type: string
          recipient_user_id: string
          related_action_id: string | null
          sender_member_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message_text: string
          message_type?: string
          recipient_user_id: string
          related_action_id?: string | null
          sender_member_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message_text?: string
          message_type?: string
          recipient_user_id?: string
          related_action_id?: string | null
          sender_member_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_circle_messages_sender_member_id_fkey"
            columns: ["sender_member_id"]
            isOneToOne: false
            referencedRelation: "support_circle_members"
            referencedColumns: ["id"]
          },
        ]
      }
      symptom_logs: {
        Row: {
          created_at: string
          date: string
          diastolic: number | null
          id: string
          notes: string | null
          severity: number
          steps: number | null
          symptom_type: string
          systolic: number | null
          time: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          diastolic?: number | null
          id?: string
          notes?: string | null
          severity: number
          steps?: number | null
          symptom_type: string
          systolic?: number | null
          time: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          diastolic?: number | null
          id?: string
          notes?: string | null
          severity?: number
          steps?: number | null
          symptom_type?: string
          systolic?: number | null
          time?: string
          user_id?: string
        }
        Relationships: []
      }
      transcription_jobs: {
        Row: {
          completed_at: string | null
          created_at: string
          error_message: string | null
          id: string
          job_id: string | null
          meeting_id: string
          metadata: Json | null
          provider: string
          recording_id: string
          status: string
          transcript_text: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          job_id?: string | null
          meeting_id: string
          metadata?: Json | null
          provider?: string
          recording_id: string
          status?: string
          transcript_text?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          job_id?: string | null
          meeting_id?: string
          metadata?: Json | null
          provider?: string
          recording_id?: string
          status?: string
          transcript_text?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      trial_subscriptions: {
        Row: {
          created_at: string
          id: string
          plan_type: string
          reminder_sent_day5: boolean | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_end_date: string
          trial_start_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          plan_type: string
          reminder_sent_day5?: boolean | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_end_date?: string
          trial_start_date?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          plan_type?: string
          reminder_sent_day5?: boolean | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_end_date?: string
          trial_start_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      trusted_devices: {
        Row: {
          created_at: string
          device_fingerprint: string
          device_name: string | null
          expires_at: string
          id: string
          last_used_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          device_fingerprint: string
          device_name?: string | null
          expires_at?: string
          id?: string
          last_used_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          device_fingerprint?: string
          device_name?: string | null
          expires_at?: string
          id?: string
          last_used_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_favorite_statements: {
        Row: {
          created_at: string
          id: string
          statement_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          statement_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          statement_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorite_statements_statement_id_fkey"
            columns: ["statement_id"]
            isOneToOne: false
            referencedRelation: "empowerment_statements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_onboarding_progress: {
        Row: {
          assessment_id: string | null
          created_at: string
          current_step: string
          id: string
          step_data: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          assessment_id?: string | null
          created_at?: string
          current_step?: string
          id?: string
          step_data?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          assessment_id?: string | null
          created_at?: string
          current_step?: string
          id?: string
          step_data?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_onboarding_progress_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessment_results"
            referencedColumns: ["id"]
          },
        ]
      }
      user_schedule_preferences: {
        Row: {
          created_at: string
          energy_level: number | null
          id: string
          notes: string | null
          preference_type: string
          time_slots: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          energy_level?: number | null
          id?: string
          notes?: string | null
          preference_type: string
          time_slots?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          energy_level?: number | null
          id?: string
          notes?: string | null
          preference_type?: string
          time_slots?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_statement_history: {
        Row: {
          created_at: string
          id: string
          shown_date: string
          statement_id: string
          user_energy: number | null
          user_id: string
          user_mood: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          shown_date?: string
          statement_id: string
          user_energy?: number | null
          user_id: string
          user_mood?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          shown_date?: string
          statement_id?: string
          user_energy?: number | null
          user_id?: string
          user_mood?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_statement_history_statement_id_fkey"
            columns: ["statement_id"]
            isOneToOne: false
            referencedRelation: "empowerment_statements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_statement_interactions: {
        Row: {
          created_at: string
          id: string
          interaction_data: Json | null
          interaction_type: string
          statement_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          interaction_data?: Json | null
          interaction_type: string
          statement_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          interaction_data?: Json | null
          interaction_type?: string
          statement_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_statement_interactions_statement_id_fkey"
            columns: ["statement_id"]
            isOneToOne: false
            referencedRelation: "empowerment_statements"
            referencedColumns: ["id"]
          },
        ]
      }
      victory_celebrations: {
        Row: {
          action_id: string | null
          celebration_type: string
          created_at: string
          id: string
          milestone_value: number | null
          shown_at: string | null
          user_id: string
        }
        Insert: {
          action_id?: string | null
          celebration_type: string
          created_at?: string
          id?: string
          milestone_value?: number | null
          shown_at?: string | null
          user_id: string
        }
        Update: {
          action_id?: string | null
          celebration_type?: string
          created_at?: string
          id?: string
          milestone_value?: number | null
          shown_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "victory_celebrations_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "daily_actions"
            referencedColumns: ["id"]
          },
        ]
      }
      voice_recordings: {
        Row: {
          access_level: string
          category: string
          created_at: string
          description: string | null
          duration_seconds: number | null
          expires_at: string | null
          file_path: string
          file_size_bytes: number
          id: string
          legal_retention_required: boolean | null
          metadata: Json | null
          retention_period_days: number | null
          title: string
          transcription: string | null
          transcription_confidence: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_level?: string
          category?: string
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          expires_at?: string | null
          file_path: string
          file_size_bytes: number
          id?: string
          legal_retention_required?: boolean | null
          metadata?: Json | null
          retention_period_days?: number | null
          title: string
          transcription?: string | null
          transcription_confidence?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_level?: string
          category?: string
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          expires_at?: string | null
          file_path?: string
          file_size_bytes?: number
          id?: string
          legal_retention_required?: boolean | null
          metadata?: Json | null
          retention_period_days?: number | null
          title?: string
          transcription?: string | null
          transcription_confidence?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_invitation: {
        Args: { p_token: string; p_user_email: string }
        Returns: Json
      }
      cleanup_expired_invitations: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      cleanup_expired_voice_recordings: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_trial_subscription: {
        Args: { stripe_customer_id?: string; user_uuid: string }
        Returns: string
      }
      generate_accountability_alert: {
        Args: {
          p_alert_type: string
          p_message?: string
          p_related_id?: string
          p_severity?: string
          p_title?: string
          p_user_id: string
        }
        Returns: string
      }
      generate_backup_codes: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      generate_invitation_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_subscription_status: {
        Args: { user_uuid: string }
        Returns: string
      }
      log_security_event: {
        Args: {
          p_event_data?: Json
          p_event_type: string
          p_ip_address?: unknown
          p_user_agent?: string
          p_user_id: string
        }
        Returns: string
      }
      notify_watchers_of_action_completion: {
        Args: {
          p_action_id: string
          p_action_title: string
          p_completion_status: string
          p_user_id: string
        }
        Returns: string
      }
      revoke_invitation: {
        Args: { p_member_id: string; p_user_id: string }
        Returns: boolean
      }
      user_can_access_memory: {
        Args: { memory_uuid: string }
        Returns: boolean
      }
      user_owns_memory: {
        Args: { memory_uuid: string }
        Returns: boolean
      }
      verify_backup_code: {
        Args: { p_code: string; p_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
