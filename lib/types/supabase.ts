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
      documents: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      github: {
        Row: {
          id: number
          inserted_at: string
          name: string | null
          updated_at: string
        }
        Insert: {
          id?: number
          inserted_at?: string
          name?: string | null
          updated_at?: string
        }
        Update: {
          id?: number
          inserted_at?: string
          name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          file_name: string
          id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          file_name: string
          id?: number
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          file_name?: string
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["clerk_id"]
          }
        ]
      }
      repository: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          language_data: Json | null
          name: string | null
          user_id: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          language_data?: Json | null
          name?: string | null
          user_id?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          language_data?: Json | null
          name?: string | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "repository_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "github"
            referencedColumns: ["id"]
          }
        ]
      }
      tasks: {
        Row: {
          created_at: string
          id: number
          label: string
          priority: string
          profile: number
          status: string
          title: string
          user: string
        }
        Insert: {
          created_at?: string
          id?: number
          label?: string
          priority?: string
          profile: number
          status?: string
          title: string
          user: string
        }
        Update: {
          created_at?: string
          id?: number
          label?: string
          priority?: string
          profile?: number
          status?: string
          title?: string
          user?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_profile_fkey"
            columns: ["profile"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_user_fkey"
            columns: ["user"]
            referencedRelation: "users"
            referencedColumns: ["clerk_id"]
          }
        ]
      }
      users: {
        Row: {
          clerk_id: string
          created_at: string | null
          id: number
          num_runs: number
        }
        Insert: {
          clerk_id: string
          created_at?: string | null
          id?: number
          num_runs?: number
        }
        Update: {
          clerk_id?: string
          created_at?: string | null
          id?: number
          num_runs?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      gigs_search: {
        Args: {
          query_embedding: string
          similarity_threshold: number
          match_count: number
        }
        Returns: {
          id: number
          title: string
          description: string
          url: string
          skills: string[]
          compensation: string
          creator: string
          company_name: string
          company_logo: string
          contact: string
          similarity: number
        }[]
      }
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      jobs_search: {
        Args: {
          query_embedding: string
          similarity_threshold: number
          match_count: number
        }
        Returns: {
          id: number
          data: Json
          similarity: number
        }[]
      }
      match_documents: {
        Args: {
          query_embedding: string
          match_count?: number
          filter?: Json
        }
        Returns: {
          id: number
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: string
      }
      vector_dims: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_norm: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": string
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
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
