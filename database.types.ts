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
      authors: {
        Row: {
          created_at: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      mangas: {
        Row: {
          cover: string
          created_at: string
          id: number
          title: string
        }
        Insert: {
          cover: string
          created_at?: string
          id?: number
          title: string
        }
        Update: {
          cover?: string
          created_at?: string
          id?: number
          title?: string
        }
        Relationships: []
      }
      mangas_authors: {
        Row: {
          author: number | null
          manga: number | null
        }
        Insert: {
          author?: number | null
          manga?: number | null
        }
        Update: {
          author?: number | null
          manga?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "mangas_authors_author_fkey"
            columns: ["author"]
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mangas_authors_manga_fkey"
            columns: ["manga"]
            referencedRelation: "mangas"
            referencedColumns: ["id"]
          }
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

