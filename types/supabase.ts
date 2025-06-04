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
          alt_names: string | null
          country_id: number | null
          created_at: string | null
          creator_id: string | null
          id: number
          is_archived: boolean
          name: string
          spotify_artist_id: string | null
          spotify_artist_images: Json | null
          youtube_url: string | null
        }
        Insert: {
          alt_names?: string | null
          country_id?: number | null
          created_at?: string | null
          creator_id?: string | null
          id?: number
          is_archived?: boolean
          name: string
          spotify_artist_id?: string | null
          spotify_artist_images?: Json | null
          youtube_url?: string | null
        }
        Update: {
          alt_names?: string | null
          country_id?: number | null
          created_at?: string | null
          creator_id?: string | null
          id?: number
          is_archived?: boolean
          name?: string
          spotify_artist_id?: string | null
          spotify_artist_images?: Json | null
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
            foreignKeyName: "bands_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profile_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bands_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          concert_id: number
          content: string | null
          created_at: string
          edited_at: string | null
          id: number
          parent_id: number | null
          user_id: string
        }
        Insert: {
          concert_id: number
          content?: string | null
          created_at?: string
          edited_at?: string | null
          id?: number
          parent_id?: number | null
          user_id: string
        }
        Update: {
          concert_id?: number
          content?: string | null
          created_at?: string
          edited_at?: string | null
          id?: number
          parent_id?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_concert_id_fkey"
            columns: ["concert_id"]
            isOneToOne: false
            referencedRelation: "concerts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_concert_id_fkey"
            columns: ["concert_id"]
            isOneToOne: false
            referencedRelation: "concerts_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_reply_to_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      concerts: {
        Row: {
          created_at: string
          creator_id: string | null
          date_end: string | null
          date_start: string
          doors_time: string | null
          festival_root_id: number | null
          id: number
          is_archived: boolean
          is_festival: boolean
          location_id: number
          name: string | null
          resource_status: Database["public"]["Enums"]["resource_status"] | null
          show_time: string | null
          source_link: string | null
        }
        Insert: {
          created_at?: string
          creator_id?: string | null
          date_end?: string | null
          date_start: string
          doors_time?: string | null
          festival_root_id?: number | null
          id?: number
          is_archived?: boolean
          is_festival?: boolean
          location_id: number
          name?: string | null
          resource_status?:
            | Database["public"]["Enums"]["resource_status"]
            | null
          show_time?: string | null
          source_link?: string | null
        }
        Update: {
          created_at?: string
          creator_id?: string | null
          date_end?: string | null
          date_start?: string
          doors_time?: string | null
          festival_root_id?: number | null
          id?: number
          is_archived?: boolean
          is_festival?: boolean
          location_id?: number
          name?: string | null
          resource_status?:
            | Database["public"]["Enums"]["resource_status"]
            | null
          show_time?: string | null
          source_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "concerts_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profile_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "concerts_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "concerts_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_concerts_festival_root_id_fkey"
            columns: ["festival_root_id"]
            isOneToOne: false
            referencedRelation: "festival_roots"
            referencedColumns: ["id"]
          },
        ]
      }
      contributions: {
        Row: {
          id: number
          operation: string
          resource_id: number | null
          resource_type: string
          state_new: Json | null
          state_old: Json | null
          timestamp: string
          user_id: string
        }
        Insert: {
          id?: number
          operation: string
          resource_id?: number | null
          resource_type: string
          state_new?: Json | null
          state_old?: Json | null
          timestamp?: string
          user_id: string
        }
        Update: {
          id?: number
          operation?: string
          resource_id?: number | null
          resource_type?: string
          state_new?: Json | null
          state_old?: Json | null
          timestamp?: string
          user_id?: string
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
          name_de: string
          name_en: string | null
        }
        Insert: {
          continent?: Database["public"]["Enums"]["continents"] | null
          id?: number
          iso2: string
          iso3?: string | null
          local_name?: string | null
          name_de: string
          name_en?: string | null
        }
        Update: {
          continent?: Database["public"]["Enums"]["continents"] | null
          id?: number
          iso2?: string
          iso3?: string | null
          local_name?: string | null
          name_de?: string
          name_en?: string | null
        }
        Relationships: []
      }
      festival_roots: {
        Row: {
          created_at: string
          creator_id: string
          default_location_id: number | null
          id: number
          is_archived: boolean
          name: string
          website: string | null
        }
        Insert: {
          created_at?: string
          creator_id?: string
          default_location_id?: number | null
          id?: number
          is_archived?: boolean
          name: string
          website?: string | null
        }
        Update: {
          created_at?: string
          creator_id?: string
          default_location_id?: number | null
          id?: number
          is_archived?: boolean
          name?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "festival_roots_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profile_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "festival_roots_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "festival_roots_default_location_id_fkey"
            columns: ["default_location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      friends: {
        Row: {
          accepted_at: string | null
          created_at: string
          pending: boolean
          receiver_id: string
          sender_id: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          pending?: boolean
          receiver_id: string
          sender_id: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          pending?: boolean
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "friends_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profile_stats"
            referencedColumns: ["id"]
          },
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
            referencedRelation: "profile_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friends_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
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
          },
        ]
      }
      j_bands_seen: {
        Row: {
          band_id: number
          concert_id: number
          created_at: string | null
          user_id: string
        }
        Insert: {
          band_id: number
          concert_id: number
          created_at?: string | null
          user_id: string
        }
        Update: {
          band_id?: number
          concert_id?: number
          created_at?: string | null
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
            foreignKeyName: "j_bands_seen_concert_id_fkey"
            columns: ["concert_id"]
            isOneToOne: false
            referencedRelation: "concerts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "j_bands_seen_concert_id_fkey"
            columns: ["concert_id"]
            isOneToOne: false
            referencedRelation: "concerts_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_j_bands_seen_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_j_bands_seen_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      j_concert_bands: {
        Row: {
          band_id: number
          concert_id: number
          item_index: number | null
        }
        Insert: {
          band_id: number
          concert_id: number
          item_index?: number | null
        }
        Update: {
          band_id?: number
          concert_id?: number
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
            foreignKeyName: "j_concert_bands_concert_id_fkey"
            columns: ["concert_id"]
            isOneToOne: false
            referencedRelation: "concerts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "j_concert_bands_concert_id_fkey"
            columns: ["concert_id"]
            isOneToOne: false
            referencedRelation: "concerts_full"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          alt_names: string | null
          city: string
          country_id: number | null
          created_at: string | null
          creator_id: string | null
          id: number
          image: string | null
          is_archived: boolean
          name: string
          updated_at: string | null
          website: string | null
          zip_code: string | null
        }
        Insert: {
          alt_names?: string | null
          city: string
          country_id?: number | null
          created_at?: string | null
          creator_id?: string | null
          id?: number
          image?: string | null
          is_archived?: boolean
          name: string
          updated_at?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          alt_names?: string | null
          city?: string
          country_id?: number | null
          created_at?: string | null
          creator_id?: string | null
          id?: number
          image?: string | null
          is_archived?: boolean
          name?: string
          updated_at?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "locations_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profile_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "locations_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_locations_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      memories: {
        Row: {
          band_id: number | null
          concert_id: number
          created_at: string
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id: number
          user_id: string
        }
        Insert: {
          band_id?: number | null
          concert_id: number
          created_at?: string
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id?: number
          user_id?: string
        }
        Update: {
          band_id?: number | null
          concert_id?: number
          created_at?: string
          file_name?: string
          file_size?: number
          file_type?: string
          file_url?: string
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memories_band_id_fkey"
            columns: ["band_id"]
            isOneToOne: false
            referencedRelation: "bands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memories_concert_id_fkey"
            columns: ["concert_id"]
            isOneToOne: false
            referencedRelation: "concerts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memories_concert_id_fkey"
            columns: ["concert_id"]
            isOneToOne: false
            referencedRelation: "concerts_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_path: string | null
          created_at: string | null
          id: string
          last_searched: Json[] | null
          role: Database["public"]["Enums"]["app_role"] | null
          updated_at: string | null
          username: string
        }
        Insert: {
          avatar_path?: string | null
          created_at?: string | null
          id: string
          last_searched?: Json[] | null
          role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string | null
          username: string
        }
        Update: {
          avatar_path?: string | null
          created_at?: string | null
          id?: string
          last_searched?: Json[] | null
          role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      reactions: {
        Row: {
          comment_id: number
          created_at: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          comment_id?: number
          created_at?: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          comment_id?: number
          created_at?: string
          type?: string
          updated_at?: string | null
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
            referencedRelation: "profile_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      activities: {
        Row: {
          band: Database["public"]["Tables"]["bands"]["Row"] | null
          concert: Database["public"]["Tables"]["concerts"]["Row"] | null
          content: string | null
          created_at: string | null
          receiver: Database["public"]["Tables"]["profiles"]["Row"] | null
          type: string | null
          user: Database["public"]["Tables"]["profiles"]["Row"] | null
          user_id: string[] | null
        }
        Relationships: []
      }
      concerts_full: {
        Row: {
          bands: Database["public"]["Tables"]["bands"]["Row"][] | null
          bands_count: number | null
          bands_seen:
            | Database["public"]["Tables"]["j_bands_seen"]["Row"][]
            | null
          concert_bands:
            | Database["public"]["Tables"]["j_concert_bands"]["Row"][]
            | null
          created_at: string | null
          creator_id: string | null
          date_end: string | null
          date_start: string | null
          festival_root:
            | Database["public"]["Tables"]["festival_roots"]["Row"]
            | null
          festival_root_id: number | null
          id: number | null
          is_archived: boolean | null
          is_festival: boolean | null
          location: Database["public"]["Tables"]["locations"]["Row"] | null
          location_id: number | null
          name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "concerts_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profile_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "concerts_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "concerts_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_concerts_festival_root_id_fkey"
            columns: ["festival_root_id"]
            isOneToOne: false
            referencedRelation: "festival_roots"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_stats: {
        Row: {
          avatar_path: string | null
          band_count: number | null
          concert_count: number | null
          created_at: string | null
          id: string | null
          role: Database["public"]["Enums"]["app_role"] | null
          updated_at: string | null
          username: string | null
        }
        Relationships: []
      }
      search_records: {
        Row: {
          bands: Database["public"]["Tables"]["bands"]["Row"][] | null
          city: string | null
          country: string | null
          date_end: string | null
          date_start: string | null
          festival_root: string | null
          genres: string[] | null
          id: number | null
          image: string | null
          location: string | null
          name: string | null
          search_strings: string[] | null
          spotify_artist_id: string | null
          type: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      compare_bands_seen: {
        Args: { user_1_id: string; user_2_id: string }
        Returns: {
          alt_names: string | null
          country_id: number | null
          created_at: string | null
          creator_id: string | null
          id: number
          is_archived: boolean
          name: string
          spotify_artist_id: string | null
          spotify_artist_images: Json | null
          youtube_url: string | null
        }[]
      }
      compare_concerts_seen: {
        Args: { user_1_id: string; user_2_id: string }
        Returns: {
          created_at: string
          creator_id: string | null
          date_end: string | null
          date_start: string
          doors_time: string | null
          festival_root_id: number | null
          id: number
          is_archived: boolean
          is_festival: boolean
          location_id: number
          name: string | null
          resource_status: Database["public"]["Enums"]["resource_status"] | null
          show_time: string | null
          source_link: string | null
        }[]
      }
      custom_access_token_hook: {
        Args: { event: Json }
        Returns: Json
      }
      json_matches_schema: {
        Args: { schema: Json; instance: Json }
        Returns: boolean
      }
      jsonb_matches_schema: {
        Args: { schema: Json; instance: Json }
        Returns: boolean
      }
      jsonschema_is_valid: {
        Args: { schema: Json }
        Returns: boolean
      }
      jsonschema_validation_errors: {
        Args: { schema: Json; instance: Json }
        Returns: string[]
      }
      search_bands: {
        Args: { search_string: string }
        Returns: Database["public"]["CompositeTypes"]["band_with_genres"][]
      }
      search_countries: {
        Args: { search_string: string }
        Returns: {
          continent: Database["public"]["Enums"]["continents"] | null
          id: number
          iso2: string
          iso3: string | null
          local_name: string | null
          name_de: string
          name_en: string | null
        }[]
      }
      search_festival_roots: {
        Args: { search_string: string }
        Returns: {
          created_at: string
          creator_id: string
          default_location_id: number | null
          id: number
          is_archived: boolean
          name: string
          website: string | null
        }[]
      }
      search_genres: {
        Args: { search_string: string }
        Returns: {
          id: number
          name: string
        }[]
      }
      search_global: {
        Args: { search_string: string }
        Returns: Database["public"]["CompositeTypes"]["search_result"][]
      }
      search_locations: {
        Args: { search_string: string }
        Returns: {
          alt_names: string | null
          city: string
          country_id: number | null
          created_at: string | null
          creator_id: string | null
          id: number
          image: string | null
          is_archived: boolean
          name: string
          updated_at: string | null
          website: string | null
          zip_code: string | null
        }[]
      }
      unaccent: {
        Args: { "": string }
        Returns: string
      }
      unaccent_init: {
        Args: { "": unknown }
        Returns: unknown
      }
    }
    Enums: {
      app_role: "developer" | "moderator"
      bands_type: "bands"
      continents:
        | "Africa"
        | "Antarctica"
        | "Asia"
        | "Europe"
        | "Oceania"
        | "North America"
        | "South America"
      locations_type: "locations"
      resource_status: "complete" | "incomplete_lineup"
      resources: "concerts" | "bands" | "locations"
    }
    CompositeTypes: {
      band_with_genres: {
        id: number | null
        genres: number[] | null
      }
      search_result: {
        type: string | null
        id: number | null
        search_strings: string[] | null
        image: string | null
        name: string | null
        festival_root: string | null
        date_start: string | null
        date_end: string | null
        bands: Database["public"]["Tables"]["bands"]["Row"][] | null
        location: string | null
        genres: string[] | null
        country: string | null
        spotify_artist_id: string | null
        city: string | null
        sim_score: number | null
      }
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["developer", "moderator"],
      bands_type: ["bands"],
      continents: [
        "Africa",
        "Antarctica",
        "Asia",
        "Europe",
        "Oceania",
        "North America",
        "South America",
      ],
      locations_type: ["locations"],
      resource_status: ["complete", "incomplete_lineup"],
      resources: ["concerts", "bands", "locations"],
    },
  },
} as const
