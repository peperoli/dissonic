import { Json } from './supabase'

export type BandRecord = {
  objectID: string
  id: number
  name: string
  alt_names: string | null
  country: {
    id: number
    iso2: string
    name_de: string | null
    name_en: string | null
  } | null
  genres: {
    id: number
    name: string
  }[]
  spotify_artist_id: string | null
  spotify_artist_images: Json | null
}
