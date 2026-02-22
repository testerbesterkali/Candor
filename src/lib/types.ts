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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      candidates: {
        Row: {
          added_to_talent_bank: boolean | null
          alignment_score: number | null
          ats_id: string | null
          company_id: string
          created_at: string
          days_in_stage: number | null
          email: string
          embedding: string | null
          id: string
          key_mismatch: string | null
          last_status_change: string | null
          name: string
          notes: string | null
          resume_parsed: Json | null
          resume_url: string | null
          role_id: string | null
          skills: string[] | null
          status: Database["public"]["Enums"]["candidate_status"] | null
          talent_bank_reengagement_status:
            | Database["public"]["Enums"]["talent_bank_reengagement_status"]
            | null
        }
        Insert: {
          added_to_talent_bank?: boolean | null
          alignment_score?: number | null
          ats_id?: string | null
          company_id: string
          created_at?: string
          days_in_stage?: number | null
          email: string
          embedding?: string | null
          id?: string
          key_mismatch?: string | null
          last_status_change?: string | null
          name: string
          notes?: string | null
          resume_parsed?: Json | null
          resume_url?: string | null
          role_id?: string | null
          skills?: string[] | null
          status?: Database["public"]["Enums"]["candidate_status"] | null
          talent_bank_reengagement_status?:
            | Database["public"]["Enums"]["talent_bank_reengagement_status"]
            | null
        }
        Update: {
          added_to_talent_bank?: boolean | null
          alignment_score?: number | null
          ats_id?: string | null
          company_id?: string
          created_at?: string
          days_in_stage?: number | null
          email?: string
          embedding?: string | null
          id?: string
          key_mismatch?: string | null
          last_status_change?: string | null
          name?: string
          notes?: string | null
          resume_parsed?: Json | null
          resume_url?: string | null
          role_id?: string | null
          skills?: string[] | null
          status?: Database["public"]["Enums"]["candidate_status"] | null
          talent_bank_reengagement_status?:
            | Database["public"]["Enums"]["talent_bank_reengagement_status"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "candidates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidates_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      communications: {
        Row: {
          body: string | null
          candidate_id: string
          company_id: string
          confidence_breakdown: Json | null
          confidence_score: number | null
          created_at: string
          edited: boolean | null
          id: string
          original_draft: string | null
          reviewed_by: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["communication_status"] | null
          subject: string | null
          type: Database["public"]["Enums"]["communication_type"]
        }
        Insert: {
          body?: string | null
          candidate_id: string
          company_id: string
          confidence_breakdown?: Json | null
          confidence_score?: number | null
          created_at?: string
          edited?: boolean | null
          id?: string
          original_draft?: string | null
          reviewed_by?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["communication_status"] | null
          subject?: string | null
          type: Database["public"]["Enums"]["communication_type"]
        }
        Update: {
          body?: string | null
          candidate_id?: string
          company_id?: string
          confidence_breakdown?: Json | null
          confidence_score?: number | null
          created_at?: string
          edited?: boolean | null
          id?: string
          original_draft?: string | null
          reviewed_by?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["communication_status"] | null
          subject?: string | null
          type?: Database["public"]["Enums"]["communication_type"]
        }
        Relationships: [
          {
            foreignKeyName: "communications_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          ats_connected: boolean | null
          ats_type: Database["public"]["Enums"]["ats_type"] | null
          candor_score: number | null
          created_at: string
          id: string
          name: string
          notification_frequency:
            | Database["public"]["Enums"]["notification_frequency"]
            | null
          plan: Database["public"]["Enums"]["company_plan"] | null
          sender_email: string | null
          sender_name: string | null
          slack_webhook_url: string | null
          timezone: string | null
          voice_profile: Json | null
          website: string | null
        }
        Insert: {
          ats_connected?: boolean | null
          ats_type?: Database["public"]["Enums"]["ats_type"] | null
          candor_score?: number | null
          created_at?: string
          id?: string
          name: string
          notification_frequency?:
            | Database["public"]["Enums"]["notification_frequency"]
            | null
          plan?: Database["public"]["Enums"]["company_plan"] | null
          sender_email?: string | null
          sender_name?: string | null
          slack_webhook_url?: string | null
          timezone?: string | null
          voice_profile?: Json | null
          website?: string | null
        }
        Update: {
          ats_connected?: boolean | null
          ats_type?: Database["public"]["Enums"]["ats_type"] | null
          candor_score?: number | null
          created_at?: string
          id?: string
          name?: string
          notification_frequency?:
            | Database["public"]["Enums"]["notification_frequency"]
            | null
          plan?: Database["public"]["Enums"]["company_plan"] | null
          sender_email?: string | null
          sender_name?: string | null
          slack_webhook_url?: string | null
          timezone?: string | null
          voice_profile?: Json | null
          website?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company_id: string | null
          created_at: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"] | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"] | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"] | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          ats_role_id: string | null
          company_id: string
          created_at: string
          embedding: string | null
          id: string
          jd_text: string | null
          status: Database["public"]["Enums"]["role_status"] | null
          title: string
        }
        Insert: {
          ats_role_id?: string | null
          company_id: string
          created_at?: string
          embedding?: string | null
          id?: string
          jd_text?: string | null
          status?: Database["public"]["Enums"]["role_status"] | null
          title: string
        }
        Update: {
          ats_role_id?: string | null
          company_id?: string
          created_at?: string
          embedding?: string | null
          id?: string
          jd_text?: string | null
          status?: Database["public"]["Enums"]["role_status"] | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "roles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      score_snapshots: {
        Row: {
          company_id: string
          followthrough_score: number | null
          id: string
          overall_score: number | null
          quality_score: number | null
          recorded_at: string
          reengage_score: number | null
          speed_score: number | null
        }
        Insert: {
          company_id: string
          followthrough_score?: number | null
          id?: string
          overall_score?: number | null
          quality_score?: number | null
          recorded_at?: string
          reengage_score?: number | null
          speed_score?: number | null
        }
        Update: {
          company_id?: string
          followthrough_score?: number | null
          id?: string
          overall_score?: number | null
          quality_score?: number | null
          recorded_at?: string
          reengage_score?: number | null
          speed_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "score_snapshots_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      talent_bank_matches: {
        Row: {
          actioned: boolean | null
          actioned_at: string | null
          candidate_id: string
          company_id: string
          id: string
          match_score: number | null
          role_id: string
          suggested_at: string | null
        }
        Insert: {
          actioned?: boolean | null
          actioned_at?: string | null
          candidate_id: string
          company_id: string
          id?: string
          match_score?: number | null
          role_id: string
          suggested_at?: string | null
        }
        Update: {
          actioned?: boolean | null
          actioned_at?: string | null
          candidate_id?: string
          company_id?: string
          id?: string
          match_score?: number | null
          role_id?: string
          suggested_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "talent_bank_matches_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "talent_bank_matches_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "talent_bank_matches_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      ats_type:
        | "greenhouse"
        | "lever"
        | "ashby"
        | "workable"
        | "bamboohr"
        | "csv"
        | "none"
      candidate_status:
        | "applied"
        | "screening"
        | "interview"
        | "offer"
        | "rejected"
        | "archived"
      communication_status: "draft" | "queued" | "sent" | "failed" | "discarded"
      communication_type: "rejection" | "nudge" | "reengagement"
      company_plan: "starter" | "growth" | "scale"
      notification_frequency: "daily" | "weekly" | "off"
      role_status: "open" | "closed" | "paused"
      talent_bank_reengagement_status:
        | "dormant"
        | "contacted"
        | "responded"
        | "hired"
      user_role: "admin" | "reviewer" | "viewer"
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
      ats_type: [
        "greenhouse",
        "lever",
        "ashby",
        "workable",
        "bamboohr",
        "csv",
        "none",
      ],
      candidate_status: [
        "applied",
        "screening",
        "interview",
        "offer",
        "rejected",
        "archived",
      ],
      communication_status: ["draft", "queued", "sent", "failed", "discarded"],
      communication_type: ["rejection", "nudge", "reengagement"],
      company_plan: ["starter", "growth", "scale"],
      notification_frequency: ["daily", "weekly", "off"],
      role_status: ["open", "closed", "paused"],
      talent_bank_reengagement_status: [
        "dormant",
        "contacted",
        "responded",
        "hired",
      ],
      user_role: ["admin", "reviewer", "viewer"],
    },
  },
} as const
