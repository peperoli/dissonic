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
      bands: {
        Row: {
          country_id: number | null
          created_at: string | null
          creator_id: string | null
          id: number
          name: string
          spotify_artist_id: string | null
          youtube_url: string | null
        }
        Insert: {
          country_id?: number | null
          created_at?: string | null
          creator_id?: string | null
          id?: number
          name: string
          spotify_artist_id?: string | null
          youtube_url?: string | null
        }
        Update: {
          country_id?: number | null
          created_at?: string | null
          creator_id?: string | null
          id?: number
          name?: string
          spotify_artist_id?: string | null
          youtube_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bands_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_bands_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      comments: {
        Row: {
          concert_id: string
          content: Json | null
          created_at: string | null
          edited_at: string | null
          id: number
          user_id: string
        }
        Insert: {
          concert_id: string
          content?: Json | null
          created_at?: string | null
          edited_at?: string | null
          id?: number
          user_id: string
        }
        Update: {
          concert_id?: string
          content?: Json | null
          created_at?: string | null
          edited_at?: string | null
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_comments_concert_id_fkey"
            columns: ["concert_id"]
            isOneToOne: false
            referencedRelation: "concerts"
            referencedColumns: ["id"]
          }
        ]
      }
      concerts: {
        Row: {
          created_at: string | null
          creator_id: string | null
          date_end: string | null
          date_start: string
          festival_root_id: number | null
          id: string
          is_festival: boolean
          location_id: number
          name: string | null
        }
        Insert: {
          created_at?: string | null
          creator_id?: string | null
          date_end?: string | null
          date_start: string
          festival_root_id?: number | null
          id?: string
          is_festival?: boolean
          location_id: number
          name?: string | null
        }
        Update: {
          created_at?: string | null
          creator_id?: string | null
          date_end?: string | null
          date_start?: string
          festival_root_id?: number | null
          id?: string
          is_festival?: boolean
          location_id?: number
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "concerts_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_concerts_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_concerts_festival_root_id_fkey"
            columns: ["festival_root_id"]
            isOneToOne: false
            referencedRelation: "festival_roots"
            referencedColumns: ["id"]
          }
        ]
      }
      contributions: {
        Row: {
          action: string
          id: string
          item: string
          state_new: Json | null
          state_old: Json | null
          timestamp: string | null
        }
        Insert: {
          action: string
          id?: string
          item: string
          state_new?: Json | null
          state_old?: Json | null
          timestamp?: string | null
        }
        Update: {
          action?: string
          id?: string
          item?: string
          state_new?: Json | null
          state_old?: Json | null
          timestamp?: string | null
        }
        Relationships: []
      }
      countries: {
        Row: {
          continent: Database["public"]["Enums"]["continents"] | null
          id: number
          iso2: string
          iso3: string | null
          local_name: string | null
          name: string | null
        }
        Insert: {
          continent?: Database["public"]["Enums"]["continents"] | null
          id?: number
          iso2: string
          iso3?: string | null
          local_name?: string | null
          name?: string | null
        }
        Update: {
          continent?: Database["public"]["Enums"]["continents"] | null
          id?: number
          iso2?: string
          iso3?: string | null
          local_name?: string | null
          name?: string | null
        }
        Relationships: []
      }
      festival_roots: {
        Row: {
          created_at: string
          creator_id: string
          default_location_id: number | null
          id: number
          name: string
          website: string | null
        }
        Insert: {
          created_at?: string
          creator_id?: string
          default_location_id?: number | null
          id?: number
          name: string
          website?: string | null
        }
        Update: {
          created_at?: string
          creator_id?: string
          default_location_id?: number | null
          id?: number
          name?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_festival_roots_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_festival_roots_default_location_id_fkey"
            columns: ["default_location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          }
        ]
      }
      friends: {
        Row: {
          accepted_at: string | null
          created_at: string | null
          pending: boolean
          receiver_id: string
          sender_id: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string | null
          pending?: boolean
          receiver_id: string
          sender_id: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string | null
          pending?: boolean
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "friends_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friends_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      genres: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      j_band_genres: {
        Row: {
          band_id: number
          genre_id: number
        }
        Insert: {
          band_id: number
          genre_id: number
        }
        Update: {
          band_id?: number
          genre_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "j_band_genres_genre_id_fkey"
            columns: ["genre_id"]
            isOneToOne: false
            referencedRelation: "genres"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_j_band_genres_band_id_fkey"
            columns: ["band_id"]
            isOneToOne: false
            referencedRelation: "bands"
            referencedColumns: ["id"]
          }
        ]
      }
      j_bands_seen: {
        Row: {
          band_id: number
          concert_id: string
          user_id: string
        }
        Insert: {
          band_id: number
          concert_id: string
          user_id: string
        }
        Update: {
          band_id?: number
          concert_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "j_bands_seen_band_id_fkey"
            columns: ["band_id"]
            isOneToOne: false
            referencedRelation: "bands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "j_bands_seen_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_j_bands_seen_concert_id_fkey"
            columns: ["concert_id"]
            isOneToOne: false
            referencedRelation: "concerts"
            referencedColumns: ["id"]
          }
        ]
      }
      j_concert_bands: {
        Row: {
          band_id: number
          concert_id: string
          item_index: number | null
        }
        Insert: {
          band_id: number
          concert_id: string
          item_index?: number | null
        }
        Update: {
          band_id?: number
          concert_id?: string
          item_index?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "j_concert_bands_band_id_fkey"
            columns: ["band_id"]
            isOneToOne: false
            referencedRelation: "bands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_j_concert_bands_concert_id_fkey"
            columns: ["concert_id"]
            isOneToOne: false
            referencedRelation: "concerts"
            referencedColumns: ["id"]
          }
        ]
      }
      locations: {
        Row: {
          city: string
          created_at: string | null
          creator_id: string | null
          id: number
          name: string
        }
        Insert: {
          city: string
          created_at?: string | null
          creator_id?: string | null
          id?: number
          name: string
        }
        Update: {
          city?: string
          created_at?: string | null
          creator_id?: string | null
          id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_locations_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_path: string | null
          created_at: string | null
          id: string
          username: string
        }
        Insert: {
          avatar_path?: string | null
          created_at?: string | null
          id: string
          username: string
        }
        Update: {
          avatar_path?: string | null
          created_at?: string | null
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
      reactions: {
        Row: {
          comment_id: number
          created_at: string | null
          type: string
          user_id: string
        }
        Insert: {
          comment_id?: number
          created_at?: string | null
          type: string
          user_id: string
        }
        Update: {
          comment_id?: number
          created_at?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reactions_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      gtrgm_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_options: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      gtrgm_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      search_bands: {
        Args: {
          search_string: string
        }
        Returns: {
          country_id: number | null
          created_at: string | null
          creator_id: string | null
          id: number
          name: string
          spotify_artist_id: string | null
          youtube_url: string | null
        }[]
      }
      search_locations: {
        Args: {
          search_string: string
        }
        Returns: {
          city: string
          created_at: string | null
          creator_id: string | null
          id: number
          name: string
        }[]
      }
      set_limit: {
        Args: {
          "": number
        }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: {
          "": string
        }
        Returns: unknown
      }
    }
    Enums: {
      continents:
        | "Africa"
        | "Antarctica"
        | "Asia"
        | "Europe"
        | "Oceania"
        | "North America"
        | "South America"
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
