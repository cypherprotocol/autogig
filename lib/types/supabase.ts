import { JobData } from "@/lib/types";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      chats: {
        Row: {
          applicant: string;
          chat_id: string;
          compensation: string | null;
          created_at: string | null;
          gig: number;
          id: number;
          is_approved: boolean | null;
          title: string;
          user: string;
        };
        Insert: {
          applicant: string;
          chat_id: string;
          compensation?: string | null;
          created_at?: string | null;
          gig: number;
          id?: number;
          is_approved?: boolean | null;
          title: string;
          user: string;
        };
        Update: {
          applicant?: string;
          chat_id?: string;
          compensation?: string | null;
          created_at?: string | null;
          gig?: number;
          id?: number;
          is_approved?: boolean | null;
          title?: string;
          user?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chats_applicant_fkey";
            columns: ["applicant"];
            referencedRelation: "users";
            referencedColumns: ["clerk_id"];
          },
          {
            foreignKeyName: "chats_gig_fkey";
            columns: ["gig"];
            referencedRelation: "gigs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chats_user_fkey";
            columns: ["user"];
            referencedRelation: "users";
            referencedColumns: ["clerk_id"];
          }
        ];
      };
      gigs: {
        Row: {
          company_logo: string | null;
          company_name: string | null;
          compensation: string | null;
          contact: string | null;
          created_at: string | null;
          creator: string;
          description: string | null;
          embedding: string | null;
          id: number;
          skills: string[] | null;
          title: string | null;
          url: string | null;
        };
        Insert: {
          company_logo?: string | null;
          company_name?: string | null;
          compensation?: string | null;
          contact?: string | null;
          created_at?: string | null;
          creator: string;
          description?: string | null;
          embedding?: string | null;
          id?: number;
          skills?: string[] | null;
          title?: string | null;
          url?: string | null;
        };
        Update: {
          company_logo?: string | null;
          company_name?: string | null;
          compensation?: string | null;
          contact?: string | null;
          created_at?: string | null;
          creator?: string;
          description?: string | null;
          embedding?: string | null;
          id?: number;
          skills?: string[] | null;
          title?: string | null;
          url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "gigs_creator_fkey";
            columns: ["creator"];
            referencedRelation: "users";
            referencedColumns: ["clerk_id"];
          }
        ];
      };
      github: {
        Row: {
          id: number;
          inserted_at: string;
          name: string | null;
          updated_at: string;
        };
        Insert: {
          id?: number;
          inserted_at?: string;
          name?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: number;
          inserted_at?: string;
          name?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      jobs: {
        Row: {
          created_at: string | null;
          data: JobData;
          embedding: string | null;
          id: number;
        };
        Insert: {
          created_at?: string | null;
          data: JobData;
          embedding?: string | null;
          id?: number;
        };
        Update: {
          created_at?: string | null;
          data?: JobData;
          embedding?: string | null;
          id?: number;
        };
        Relationships: [];
      };
      repository: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: number;
          language_data: Json | null;
          name: string | null;
          user_id: number | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: number;
          language_data?: Json | null;
          name?: string | null;
          user_id?: number | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: number;
          language_data?: Json | null;
          name?: string | null;
          user_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "repository_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "github";
            referencedColumns: ["id"];
          }
        ];
      };
      users: {
        Row: {
          clerk_id: string;
          created_at: string | null;
          id: number;
          num_runs: number;
        };
        Insert: {
          clerk_id: string;
          created_at?: string | null;
          id?: number;
          num_runs?: number;
        };
        Update: {
          clerk_id?: string;
          created_at?: string | null;
          id?: number;
          num_runs?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      gigs_search: {
        Args: {
          query_embedding: number[];
          similarity_threshold: number;
          match_count: number;
        };
        Returns: {
          id: number;
          title: string;
          description: string;
          url: string;
          skills: string[];
          compensation: string;
          creator: string;
          company_name: string;
          company_logo: string;
          contact: string;
          similarity: number;
        }[];
      };
      ivfflathandler: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      jobs_search: {
        Args: {
          query_embedding: number[];
          similarity_threshold: number;
          match_count: number;
        };
        Returns: {
          id: number;
          data: JobData;
          similarity: number;
        }[];
      };
      vector_avg: {
        Args: {
          "": number[];
        };
        Returns: string;
      };
      vector_dims: {
        Args: {
          "": string;
        };
        Returns: number;
      };
      vector_norm: {
        Args: {
          "": string;
        };
        Returns: number;
      };
      vector_out: {
        Args: {
          "": string;
        };
        Returns: unknown;
      };
      vector_send: {
        Args: {
          "": string;
        };
        Returns: string;
      };
      vector_typmod_in: {
        Args: {
          "": unknown[];
        };
        Returns: number;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
