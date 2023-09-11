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
      bands: {
        Row: {
          country_id: number | null
          id: number
          name: string
          spotify_artist_id: string | null
        }
        Insert: {
          country_id?: number | null
          id?: number
          name: string
          spotify_artist_id?: string | null
        }
        Update: {
          country_id?: number | null
          id?: number
          name?: string
          spotify_artist_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bands_country_id_fkey"
            columns: ["country_id"]
            referencedRelation: "countries"
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
            foreignKeyName: "comments_concert_id_fkey"
            columns: ["concert_id"]
            referencedRelation: "concerts"
            referencedColumns: ["id"]
          }
        ]
      }
      concerts: {
        Row: {
          created_at: string | null
          date_end: string | null
          date_start: string
          id: string
          is_festival: boolean
          location_id: number
          name: string | null
        }
        Insert: {
          created_at?: string | null
          date_end?: string | null
          date_start: string
          id?: string
          is_festival?: boolean
          location_id: number
          name?: string | null
        }
        Update: {
          created_at?: string | null
          date_end?: string | null
          date_start?: string
          id?: string
          is_festival?: boolean
          location_id?: number
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "concerts_location_id_fkey"
            columns: ["location_id"]
            referencedRelation: "locations"
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
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friends_sender_id_fkey"
            columns: ["sender_id"]
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
            foreignKeyName: "j_band_genres_band_id_fkey"
            columns: ["band_id"]
            referencedRelation: "bands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "j_band_genres_genre_id_fkey"
            columns: ["genre_id"]
            referencedRelation: "genres"
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
            referencedRelation: "bands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "j_bands_seen_concert_id_fkey"
            columns: ["concert_id"]
            referencedRelation: "concerts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "j_bands_seen_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      j_concert_bands: {
        Row: {
          band_id: number
          concert_id: string
        }
        Insert: {
          band_id: number
          concert_id: string
        }
        Update: {
          band_id?: number
          concert_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "j_concert_bands_band_id_fkey"
            columns: ["band_id"]
            referencedRelation: "bands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "j_concert_bands_concert_id_fkey"
            columns: ["concert_id"]
            referencedRelation: "concerts"
            referencedColumns: ["id"]
          }
        ]
      }
      locations: {
        Row: {
          city: string
          id: number
          name: string
        }
        Insert: {
          city: string
          id?: number
          name: string
        }
        Update: {
          city?: string
          id?: number
          name?: string
        }
        Relationships: []
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
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reactions_user_id_fkey"
            columns: ["user_id"]
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
          id: number
          name: string
          spotify_artist_id: string | null
        }[]
      }
      search_locations: {
        Args: {
          search_string: string
        }
        Returns: {
          city: string
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
