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
          user_id: string
        }
        Insert: {
          concert_id: number
          content?: string | null
          created_at?: string
          edited_at?: string | null
          id?: number
          user_id: string
        }
        Update: {
          concert_id?: number
          content?: string | null
          created_at?: string
          edited_at?: string | null
          id?: number
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
          festival_root_id: number | null
          id: number
          is_archived: boolean
          is_festival: boolean
          location_id: number
          name: string | null
          ressource_status:
            | Database["public"]["Enums"]["ressource_status"]
            | null
        }
        Insert: {
          created_at?: string
          creator_id?: string | null
          date_end?: string | null
          date_start: string
          festival_root_id?: number | null
          id?: number
          is_archived?: boolean
          is_festival?: boolean
          location_id: number
          name?: string | null
          ressource_status?:
            | Database["public"]["Enums"]["ressource_status"]
            | null
        }
        Update: {
          created_at?: string
          creator_id?: string | null
          date_end?: string | null
          date_start?: string
          festival_root_id?: number | null
          id?: number
          is_archived?: boolean
          is_festival?: boolean
          location_id?: number
          name?: string | null
          ressource_status?:
            | Database["public"]["Enums"]["ressource_status"]
            | null
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
          ressource_id: number | null
          ressource_type: string
          state_new: Json | null
          state_old: Json | null
          timestamp: string
          user_id: string
        }
        Insert: {
          id?: number
          operation: string
          ressource_id?: number | null
          ressource_type: string
          state_new?: Json | null
          state_old?: Json | null
          timestamp?: string
          user_id: string
        }
        Update: {
          id?: number
          operation?: string
          ressource_id?: number | null
          ressource_type?: string
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
      profiles: {
        Row: {
          avatar_path: string | null
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"] | null
          updated_at: string | null
          username: string
        }
        Insert: {
          avatar_path?: string | null
          created_at?: string | null
          id: string
          role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string | null
          username: string
        }
        Update: {
          avatar_path?: string | null
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
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
    }
    Functions: {
      custom_access_token_hook: {
        Args: {
          event: Json
        }
        Returns: Json
      }
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
      json_matches_schema: {
        Args: {
          schema: Json
          instance: Json
        }
        Returns: boolean
      }
      jsonb_matches_schema: {
        Args: {
          schema: Json
          instance: Json
        }
        Returns: boolean
      }
      jsonschema_is_valid: {
        Args: {
          schema: Json
        }
        Returns: boolean
      }
      jsonschema_validation_errors: {
        Args: {
          schema: Json
          instance: Json
        }
        Returns: string[]
      }
      search_bands: {
        Args: {
          search_string: string
        }
        Returns: Database["public"]["CompositeTypes"]["band_with_genres"][]
      }
      search_countries: {
        Args: {
          search_string: string
        }
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
        Args: {
          search_string: string
        }
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
        Args: {
          search_string: string
        }
        Returns: {
          id: number
          name: string
        }[]
      }
      search_locations: {
        Args: {
          search_string: string
        }
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
        Returns: string[]
      }
      unaccent: {
        Args: {
          "": string
        }
        Returns: string
      }
      unaccent_init: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
    }
    Enums: {
      app_role: "developer" | "moderator"
      bands_type: "bands"
      concerts_type: "concerts"
      content_status: "complete" | "incomplete"
      continents:
        | "Africa"
        | "Antarctica"
        | "Asia"
        | "Europe"
        | "Oceania"
        | "North America"
        | "South America"
      locations_type: "locations"
      ressource_status: "complete" | "incomplete_lineup"
      ressources: "concerts" | "bands" | "locations"
    }
    CompositeTypes: {
      band_with_genres: {
        id: number | null
        genres: number[] | null
      }
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
