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
      github: {
        Row: {
          id: number;
          inserted_at: string;
          name: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          inserted_at?: string;
          name: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          inserted_at?: string;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      jobs: {
        Row: {
          created_at: string | null;
          data: Json;
          embedding: string | null;
          id: number;
        };
        Insert: {
          created_at?: string | null;
          data: Json;
          embedding?: string | null;
          id?: number;
        };
        Update: {
          created_at?: string | null;
          data?: Json;
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
      synopsis: {
        Row: {
          created_at: string | null;
          data: string | null;
          id: number;
          user_id: number;
        };
        Insert: {
          created_at?: string | null;
          data?: string | null;
          id?: number;
          user_id: number;
        };
        Update: {
          created_at?: string | null;
          data?: string | null;
          id?: number;
          user_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "synopsis_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "github";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      ivfflathandler: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      jobs_search: {
        Args: {
          query_embedding: any;
          similarity_threshold: number;
          match_count: number;
        };
        Returns: {
          id: number;
          created_at: string;
          data: Json;
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
