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
      characters: {
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
      favorites: {
        Row: {
          id: number
          manga: number
          profile: string
        }
        Insert: {
          id?: number
          manga: number
          profile: string
        }
        Update: {
          id?: number
          manga?: number
          profile?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_manga_fkey"
            columns: ["manga"]
            isOneToOne: false
            referencedRelation: "mangas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_profile_fkey"
            columns: ["profile"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      groups: {
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
      languages: {
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
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mangas_authors_manga_fkey"
            columns: ["manga"]
            isOneToOne: false
            referencedRelation: "mangas"
            referencedColumns: ["id"]
          }
        ]
      }
      mangas_characters: {
        Row: {
          characterid: number
          manga: number
        }
        Insert: {
          characterid: number
          manga: number
        }
        Update: {
          characterid?: number
          manga?: number
        }
        Relationships: [
          {
            foreignKeyName: "mangas_characters_characterid_fkey"
            columns: ["characterid"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mangas_characters_manga_fkey"
            columns: ["manga"]
            isOneToOne: false
            referencedRelation: "mangas"
            referencedColumns: ["id"]
          }
        ]
      }
      mangas_groups: {
        Row: {
          groupid: number
          manga: number
        }
        Insert: {
          groupid: number
          manga: number
        }
        Update: {
          groupid?: number
          manga?: number
        }
        Relationships: [
          {
            foreignKeyName: "mangas_groups_groupid_fkey"
            columns: ["groupid"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mangas_groups_manga_fkey"
            columns: ["manga"]
            isOneToOne: false
            referencedRelation: "mangas"
            referencedColumns: ["id"]
          }
        ]
      }
      mangas_languages: {
        Row: {
          language: number
          manga: number
        }
        Insert: {
          language: number
          manga: number
        }
        Update: {
          language?: number
          manga?: number
        }
        Relationships: [
          {
            foreignKeyName: "mangas_languages_language_fkey"
            columns: ["language"]
            isOneToOne: false
            referencedRelation: "parodies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mangas_languages_manga_fkey"
            columns: ["manga"]
            isOneToOne: false
            referencedRelation: "mangas"
            referencedColumns: ["id"]
          }
        ]
      }
      mangas_parodies: {
        Row: {
          manga: number
          parody: number
        }
        Insert: {
          manga: number
          parody: number
        }
        Update: {
          manga?: number
          parody?: number
        }
        Relationships: [
          {
            foreignKeyName: "mangas_parodies_manga_fkey"
            columns: ["manga"]
            isOneToOne: false
            referencedRelation: "mangas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mangas_parodies_parody_fkey"
            columns: ["parody"]
            isOneToOne: false
            referencedRelation: "parodies"
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
            isOneToOne: false
            referencedRelation: "mangas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mangas_tags_tag_fkey"
            columns: ["tag"]
            isOneToOne: false
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
            isOneToOne: false
            referencedRelation: "mangas"
            referencedColumns: ["id"]
          }
        ]
      }
      parodies: {
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
      profiles: {
        Row: {
          email: string
          id: string
          username: string
        }
        Insert: {
          email: string
          id: string
          username: string
        }
        Update: {
          email?: string
          id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never

