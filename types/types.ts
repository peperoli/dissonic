import { Database } from './supabase'

export interface ExtendedRes<TData> {
  data: TData
  count: number | null
}

export interface ConcertFetchOptions {
  filter?: {
    bands?: number[] | null
    locations?: number[] | null
    years?: number[] | null
    bandCount?: number[] | null
    bandsSeenUsers?: string[] | null
  }
  sort?: { sort_by: 'date_start'; sort_asc: boolean }
  size?: number
}

export type BandFetchOptions = {
  filter?: {
    ids?: number[] | null
    countries?: number[] | null
    genres?: number[] | null
    search?: string
  }
  size?: number
  page?: number
}

export type LocationFetchOptions = {
  filter: {
    ids?: number[] | null
    search?: string
  }
  size?: number
  page?: number
}

export type Concert = Database['public']['Tables']['concerts']['Row'] & {
  location?: Location | null
  bands?: Band[]
  bands_seen?: BandSeen[]
}

export type AddConcert = Database['public']['Tables']['concerts']['Insert'] & {
  bands?: Band[]
}

export type EditConcert = Database['public']['Tables']['concerts']['Update'] & {
  bands?: Band[]
}

export type Comment = Database['public']['Tables']['comments']['Row'] & {
  reactions?: Reaction[]
}

export type AddComment = Database['public']['Tables']['comments']['Insert']

export type EditComment = Database['public']['Tables']['comments']['Update']

export type Reaction = Database['public']['Tables']['reactions']['Row'] & { user: Profile | null }

export type AddReaction = Database['public']['Tables']['reactions']['Insert']

export type EditReaction = Database['public']['Tables']['reactions']['Update']

export type Band = Database['public']['Tables']['bands']['Row'] & {
  country?: Country | null
  genres: Genre[]
  concerts?: Concert[]
  item_index?: number | null
}

export type AddBand = Database['public']['Tables']['bands']['Insert'] & {
  genres: Genre[]
}

export type EditBand = Database['public']['Tables']['bands']['Update'] & {
  genres: Genre[]
}

export type BandSeen = Database['public']['Tables']['j_bands_seen']['Row'] & {
  band?: Band | null
  concert?: Concert | null
}

export type Genre = Database['public']['Tables']['genres']['Row']

export type Location = Database['public']['Tables']['locations']['Row']

export type AddLocation = Database['public']['Tables']['locations']['Insert']

export type Country = { id: number; iso2: string }

export type Profile = Database['public']['Tables']['profiles']['Row'] & {
  friends?:  [{ count: number }]
}

export type AddProfile = Database['public']['Tables']['profiles']['Insert']

export type EditProfile = Database['public']['Tables']['profiles']['Update']

export type Friend = Database['public']['Tables']['friends']['Row'] & {
  sender: Profile
  receiver: Profile
}

export type AddFriend = Database['public']['Tables']['friends']['Insert']

export type ListItem<IdType = number> = {
  id: IdType
  name: string
  [key: string]: any
}

export type ReorderableListItem = ListItem & {
  item_index: number | null
}

export type SpotifyArtist = {
  id: string
  name: string
  images: {
    height: number
    url: string
    width: number
  }[]
}
