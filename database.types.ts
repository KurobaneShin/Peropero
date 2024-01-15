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
          author: number
          manga: number
        }
        Insert: {
          author: number
          manga: number
        }
        Update: {
          author?: number
          manga?: number
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
      mangas_tags: {
        Row: {
          manga: number
          tag: number
        }
        Insert: {
          manga: number
          tag: number
        }
        Update: {
          manga?: number
          tag?: number
        }
        Relationships: [
          {
            foreignKeyName: "mangas_tags_manga_fkey"
            columns: ["manga"]
            referencedRelation: "mangas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mangas_tags_tag_fkey"
            columns: ["tag"]
            referencedRelation: "tags"
            referencedColumns: ["id"]
          }
        ]
      }
      pages: {
        Row: {
          created_at: string
          id: string
          image: string
          manga: number
          page: number
        }
        Insert: {
          created_at?: string
          id?: string
          image: string
          manga: number
          page: number
        }
        Update: {
          created_at?: string
          id?: string
          image?: string
          manga?: number
          page?: number
        }
        Relationships: [
          {
            foreignKeyName: "pages_manga_fkey"
            columns: ["manga"]
            referencedRelation: "mangas"
            referencedColumns: ["id"]
          }
        ]
      }
      tags: {
        Row: {
          created_at: string
          id: number
          title: string
        }
        Insert: {
          created_at?: string
          id?: number
          title: string
        }
        Update: {
          created_at?: string
          id?: number
          title?: string
        }
        Relationships: []
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

