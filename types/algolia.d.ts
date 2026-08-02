import { AlgoliaIndex } from '@/lib/algolia'
import { Json } from './supabase'

export type ConcertRecord = {
  objectID: `${AlgoliaIndex.Concerts}-${number}`
  type: AlgoliaIndex.Concerts
  id: number
  festival_root: {
    id: number
    name: string
  } | null
  date_start: string
  date_start_unix?: number
  date_end: string | null
  date_end_unix?: number | null
  bands: {
    id: number
    name: string
    alt_names: string | null
    spotify_artist_id: string | null
    spotify_artist_images: Json | null
  }[]
  bands_count: number
  location: {
    id: number
    name: string
    alt_names: string | null
    city: string
  }
  name: string | null
  fan_ids: string[]
}

export type BandRecord = {
  objectID: `${AlgoliaIndex.Bands}-${number}`
  type: AlgoliaIndex.Bands
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

export type LocationRecord = {
  objectID: `${AlgoliaIndex.Locations}-${number}`
  id: number
  type: AlgoliaIndex.Locations
  name: string
  alt_names: string | null
  zip_code: string | null
  city: string
  country: {
    id: number
    iso2: string
    name_de: string | null
    name_en: string | null
  } | null
  image: string | null
  updated_at: string | null
}
