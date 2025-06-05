export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
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
        }
        Relationships: []
      }
      daily_actions: {
        Row: {
          action_type: string
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
        }
        Insert: {
          action_type?: string
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
        }
        Update: {
          action_type?: string
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
        }
        Relationships: [
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
          created_at: string
          date: string
          energy_level: number
          id: string
          mood: string
          notes: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          energy_level: number
          id?: string
          mood: string
          notes?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          energy_level?: number
          id?: string
          mood?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          mfa_enabled: boolean | null
          name: string
          phone_number: string | null
          phone_verified: boolean | null
          require_mfa_for_sensitive_actions: boolean | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          mfa_enabled?: boolean | null
          name: string
          phone_number?: string | null
          phone_verified?: boolean | null
          require_mfa_for_sensitive_actions?: boolean | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          mfa_enabled?: boolean | null
          name?: string
          phone_number?: string | null
          phone_verified?: boolean | null
          require_mfa_for_sensitive_actions?: boolean | null
          updated_at?: string
        }
        Relationships: []
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_backup_codes: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      verify_backup_code: {
        Args: { p_user_id: string; p_code: string }
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
