import { Tables, TablesInsert, TablesUpdate } from './supabase'

export interface ExtendedRes<TData> {
  data: TData
  count: number | null
}

export interface ConcertFetchOptions {
  bands?: number[] | null
  locations?: number[] | null
  years?: number[] | null
  festivalRoots?: number[] | null
  bandsSeenUsers?: string[] | null
  sort?: { sort_by: 'date_start'; sort_asc: boolean }
  size?: number
}

export type BandFetchOptions = {
  ids?: number[] | null
  countries?: number[] | null
  genres?: number[] | null
  search?: string
  size?: number
  page?: number
}

export type LocationFetchOptions = {
  ids?: number[] | null
  search?: string
  size?: number
  page?: number
}

export type Concert = Tables<'concerts'> & {
  festival_root?: { name: string } | null
  location?: Location | null
  bands?: Band[]
  bands_seen?: BandSeen[]
}

export type AddConcert = TablesInsert<'concerts'> & {
  bands?: Band[]
}

export type EditConcert = TablesUpdate<'concerts'> & {
  bands?: Band[]
}

export type Comment = Tables<'comments'> & {
  reactions?: Reaction[]
}

export type AddComment = TablesInsert<'comments'>

export type EditComment = TablesUpdate<'comments'>

export type Reaction = Tables<'reactions'> & { user: Profile | null }

export type AddReaction = TablesInsert<'reactions'>

export type EditReaction = TablesUpdate<'reactions'>

export type Band = Tables<'bands'> & {
  country?: Country | null
  genres: Genre[]
  concerts?: Concert[]
  item_index?: number | null
}

export type AddBand = TablesInsert<'bands'> & {
  genres: Genre[]
}

export type EditBand = TablesUpdate<'bands'> & {
  genres: Genre[]
}

export type BandSeen = Tables<'j_bands_seen'> & {
  band?: Band | null
  concert?: Concert | null
}

export type Genre = Tables<'genres'>

export type Location = Tables<'locations'>

export type AddLocation = TablesInsert<'locations'>

export type Country = { id: number; iso2: string }

export type Profile = Tables<'profiles'> & {
  friends?: [{ count: number }]
}

export type AddProfile = TablesInsert<'profiles'>

export type EditProfile = TablesUpdate<'profiles'>

export type Friend = Tables<'friends'> & {
  sender: Profile
  receiver: Profile
}

export type AddFriend = TablesInsert<'friends'>

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
  genres: string[]
  followers: {
    href: string | null
    total: number
  }
}
