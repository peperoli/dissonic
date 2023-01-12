export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      bands: {
        Row: {
          country_id: number | null
          id: number
          name: string
        }
        Insert: {
          country_id?: number | null
          id?: number
          name: string
        }
        Update: {
          country_id?: number | null
          id?: number
          name?: string
        }
      }
      comments: {
        Row: {
          concert_id: string | null
          content: Json | null
          created_at: string | null
          edited_at: string | null
          id: number
          user_id: string | null
        }
        Insert: {
          concert_id?: string | null
          content?: Json | null
          created_at?: string | null
          edited_at?: string | null
          id?: number
          user_id?: string | null
        }
        Update: {
          concert_id?: string | null
          content?: Json | null
          created_at?: string | null
          edited_at?: string | null
          id?: number
          user_id?: string | null
        }
      }
      concerts: {
        Row: {
          created_at: string | null
          date_end: string | null
          date_start: string
          id: string
          is_festival: boolean
          is_public: boolean
          location_id: number | null
          name: string | null
        }
        Insert: {
          created_at?: string | null
          date_end?: string | null
          date_start: string
          id?: string
          is_festival?: boolean
          is_public?: boolean
          location_id?: number | null
          name?: string | null
        }
        Update: {
          created_at?: string | null
          date_end?: string | null
          date_start?: string
          id?: string
          is_festival?: boolean
          is_public?: boolean
          location_id?: number | null
          name?: string | null
        }
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
      }
      locations: {
        Row: {
          city: string | null
          id: number
          name: string
        }
        Insert: {
          city?: string | null
          id?: number
          name: string
        }
        Update: {
          city?: string | null
          id?: number
          name?: string
        }
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
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
  }
}
