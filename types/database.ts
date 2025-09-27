// Database types for Supabase
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: 'patient' | 'doctor' | 'admin'
          full_name: string | null
          email: string | null
        }
        Insert: {
          id: string
          role: 'patient' | 'doctor' | 'admin'
          full_name?: string | null
          email?: string | null
        }
        Update: {
          id?: string
          role?: 'patient' | 'doctor' | 'admin'
          full_name?: string | null
          email?: string | null
        }
      }
      treatments: {
        Row: {
          id: string
          name: string
          category: 'oncology' | 'pediatrics'
          description: string | null
          base_price: number | null
          currency: string
        }
        Insert: {
          id?: string
          name: string
          category: 'oncology' | 'pediatrics'
          description?: string | null
          base_price?: number | null
          currency?: string
        }
        Update: {
          id?: string
          name?: string
          category?: 'oncology' | 'pediatrics'
          description?: string | null
          base_price?: number | null
          currency?: string
        }
      }
      patients: {
        Row: {
          id: string
          profile_id: string
        }
        Insert: {
          id?: string
          profile_id: string
        }
        Update: {
          id?: string
          profile_id?: string
        }
      }
      cases: {
        Row: {
          id: string
          patient_id: string
          treatment_id: string | null
          status: 'new' | 'quoted' | 'accepted' | 'closed'
          patient_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          treatment_id?: string | null
          status?: 'new' | 'quoted' | 'accepted' | 'closed'
          patient_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          treatment_id?: string | null
          status?: 'new' | 'quoted' | 'accepted' | 'closed'
          patient_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      case_files: {
        Row: {
          id: string
          case_id: string
          owner_profile_id: string | null
          path: string
          mime_type: string | null
          size_bytes: number | null
          created_at: string
        }
        Insert: {
          id?: string
          case_id: string
          owner_profile_id?: string | null
          path: string
          mime_type?: string | null
          size_bytes?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          case_id?: string
          owner_profile_id?: string | null
          path?: string
          mime_type?: string | null
          size_bytes?: number | null
          created_at?: string
        }
      }
      quotes: {
        Row: {
          id: string
          case_id: string
          prepared_by: string | null
          currency: string
          total: number | null
          status: 'draft' | 'sent' | 'accepted'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          case_id: string
          prepared_by?: string | null
          currency?: string
          total?: number | null
          status?: 'draft' | 'sent' | 'accepted'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          case_id?: string
          prepared_by?: string | null
          currency?: string
          total?: number | null
          status?: 'draft' | 'sent' | 'accepted'
          created_at?: string
          updated_at?: string
        }
      }
      finance_notes: {
        Row: {
          id: string
          case_id: string
          quote_id: string | null
          x_amount: number
          a_fee: number | null
          y_transfer: number | null
          z_profit: number | null
          currency: string | null
          status: 'pending' | 'completed' | 'refunded'
          created_by: string | null
          created_at: string
          updated_at: string
          payment_method: string | null
          payment_reference: string | null
          payment_date: string | null
        }
        Insert: {
          case_id: string
          quote_id?: string | null
          x_amount: number
          a_fee?: number | null
          y_transfer?: number | null
          z_profit?: number | null
          currency?: string | null
          status?: 'pending' | 'completed' | 'refunded'
          created_by?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_date?: string | null
        }
        Update: {
          case_id?: string
          quote_id?: string | null
          x_amount?: number
          a_fee?: number | null
          y_transfer?: number | null
          z_profit?: number | null
          currency?: string | null
          status?: 'pending' | 'completed' | 'refunded'
          created_by?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_date?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: { uid: string }
        Returns: boolean
      }
      calculate_finance_breakdown: {
        Args: { 
          quote_amount: number
          platform_fee_percent?: number 
        }
        Returns: {
          x_amount: number
          a_fee: number
          y_transfer: number
          z_profit: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types for easier usage
export type Treatment = Database['public']['Tables']['treatments']['Row']
export type Case = Database['public']['Tables']['cases']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Patient = Database['public']['Tables']['patients']['Row']
export type CaseFile = Database['public']['Tables']['case_files']['Row']
export type Quote = Database['public']['Tables']['quotes']['Row']
export type FinanceNote = Database['public']['Tables']['finance_notes']['Row']
