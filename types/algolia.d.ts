import { Json } from "./supabase"

export type BandRecord = {
  objectID: string
  id: number
  name: string
  alt_names: string | null
  country: string | null
  genres: string[]
  spotify_artist_id: string | null
  spotify_artist_images: Json | null
}