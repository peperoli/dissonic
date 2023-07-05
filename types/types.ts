import { User } from '@supabase/supabase-js'
import { Database } from './supabase'

type WithLocation = {
  location: Location | null
}

type WithCountry = {
  country: Country | null
}

type WithBands = {
  bands: Band[] | null
}

type WithGenres = {
  genres: Genre[] | null
}

type WithBandsSeen = {
  bands_seen: BandSeen[] | null
}

export type Concert = Database['public']['Tables']['concerts']['Row'] &
  WithLocation &
  WithBands &
  WithBandsSeen

export type AddConcert = Database['public']['Tables']['concerts']['Insert']

export type EditConcert = Database['public']['Tables']['concerts']['Update']

export type Comment = Database['public']['Tables']['comments']['Row'] & {
  reactions?: Reaction[]
}

export type AddComment = Database['public']['Tables']['comments']['Insert']

export type EditComment = Database['public']['Tables']['comments']['Update']

export type Reaction = Database['public']['Tables']['reactions']['Row'] & { user: Profile }

export type AddReaction = Database['public']['Tables']['reactions']['Insert']

export type EditReaction = Database['public']['Tables']['reactions']['Update']

export type Band = Database['public']['Tables']['bands']['Row'] & WithCountry & WithGenres

export type AddBand = Database['public']['Tables']['bands']['Insert']

export type EditBand = Database['public']['Tables']['bands']['Update']

export type BandSeenFull = BandSeen & {
  band: Band
  concert: Concert
  user: User
}

export type BandSeen = Database['public']['Tables']['j_bands_seen']['Row']

export type Genre = Database['public']['Tables']['genres']['Row']

export type Location = Database['public']['Tables']['locations']['Row']

export type Country = Database['public']['Tables']['countries']['Row']

export type Profile = Database['public']['Tables']['profiles']['Row'] & {
  friends: [{ count: number }]
}

export type Friend = Database['public']['Tables']['friends']['Row'] & {
  sender: Profile
  receiver: Profile
}

export type Option = Band | Genre | Country

export type SpotifyArtist = {
  id: string
  name: string
  images: {
    height: number
    url: string
    width: number
  }[]
}
