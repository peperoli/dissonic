import { User } from '@supabase/supabase-js'
import { Database } from './supabase'

export interface ExtendedRes<TData> {
  data: TData
  count: number | null
}

export interface FetchOptions {
  filter?: {
    bands?: number[]
    locations?: number[]
    years?: [number, number] | null
    bandsPerConcert?: [number, number] | null
    bandsSeenUser?: string
    countries?: number[]
    genres?: number[]
    search?: string
  }
  sort?: [string, boolean?]
  page?: number
  size?: number
}

export type Concert = Database['public']['Tables']['concerts']['Row'] & {
  location?: Location
  bands?: Band[]
  bands_seen?: BandSeen[]
}

export type AddConcert = Database['public']['Tables']['concerts']['Insert'] & {
  bands?: Option[]
}

export type EditConcert = Database['public']['Tables']['concerts']['Update'] & {
  bands?: Option[]
}

export type Comment = Database['public']['Tables']['comments']['Row'] & {
  reactions?: Reaction[]
}

export type AddComment = Database['public']['Tables']['comments']['Insert']

export type EditComment = Database['public']['Tables']['comments']['Update']

export type Reaction = Database['public']['Tables']['reactions']['Row'] & { user: Profile }

export type AddReaction = Database['public']['Tables']['reactions']['Insert']

export type EditReaction = Database['public']['Tables']['reactions']['Update']

export type Band = Database['public']['Tables']['bands']['Row'] & {
  country: Country
  genres: Genre[]
  concerts?: Concert[]
}

export type AddBand = Database['public']['Tables']['bands']['Insert'] & {
  genres: Genre[]
}

export type EditBand = Database['public']['Tables']['bands']['Update'] & {
  genres: Genre[]
}

export type BandSeen = Database['public']['Tables']['j_bands_seen']['Row'] & {
  band?: Band
  concert?: Concert
}

export type Genre = Database['public']['Tables']['genres']['Row']

export type Location = Database['public']['Tables']['locations']['Row']

export type AddLocation = Database['public']['Tables']['locations']['Insert']

export type Country = Database['public']['Tables']['countries']['Row']

export type Profile = Database['public']['Tables']['profiles']['Row'] & {
  friends: [{ count: number }]
}

export type EditProfile = Database['public']['Tables']['profiles']['Update']

export type Friend = Database['public']['Tables']['friends']['Row'] & {
  sender: Profile
  receiver: Profile
}

export type AddFriend = Database['public']['Tables']['friends']['Insert']

export type Option<IdType = number> = { id: IdType; name: string, [key: string]: any }

export type SpotifyArtist = {
  id: string
  name: string
  images: {
    height: number
    url: string
    width: number
  }[]
}
