import { Tables, TablesInsert, TablesUpdate } from './supabase'

export type ExtendedRes<TData> = {
  data: TData
  count: number | null
}

export type ConcertFetchOptions = {
  bands?: number[] | null
  locations?: number[] | null
  years?: number[] | null
  festivalRoots?: number[] | null
  bandsSeenUsers?: string[] | null
  sort?: { sort_by: 'date_start' | 'bands_count'; sort_asc: boolean }
  size?: number
  bandsSize?: number
}

export type BandFetchOptions = {
  ids?: number[] | null
  countries?: number[] | null
  genres?: number[] | null
  search?: string
  size?: number
  page?: number
}

export type GenreFetchOptions = {
  ids?: number[] | null
  search?: string
}

export type FestivalRootFetchOptions = {
  ids?: number[] | null
  search?: string
  sort?: { sort_by: 'name'; sort_asc: boolean }
  size?: number
}

export type LocationFetchOptions = {
  ids?: number[] | null
  search?: string
  size?: number
  page?: number
}

export type CountryFetchOptions = {
  ids?: number[] | null
  search?: string
}

export type ActivityFetchOptions = {
  size?: number
  activityType?: 'all' | 'j_bands_seen' | 'comments' | 'reactions' | 'friends' | 'profiles'
  user?: string
  view?: 'global' | 'friends' | 'user'
}

export type ContributionFetchOptions = {
  size?: string
  ressourceType?: 'all' | 'concerts' | 'bands' | 'locations' | 'festival_roots'
  ressourceId?: string
  userId?: string
  operation?: 'all' | 'INSERT' | 'UPDATE' | 'ARCHIVE' | 'RESTORE' | 'DELETE'
}

export type QueryOptions<T> = {
  placeholderData?: T
  enabled?: boolean
}

export type Concert = Tables<'concerts'> & {
  festival_root: { name: string } | null
  location: Location | null
  bands: Band[]
  bands_seen?: Tables<'j_bands_seen'>[]
  creator?: { username: string } | null
}

export type AddConcert = TablesInsert<'concerts'> & {
  bands?: Band[]
}

export type EditConcert = TablesUpdate<'concerts'> & {
  bands?: Band[]
}

export type FestivalRoot = Tables<'festival_roots'> & {
  default_location?: Tables<'locations'> | null
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
  concerts?: Tables<'concerts'>[] | null
  item_index?: number | null
  creator?: { username: string } | null
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

export type Location = Tables<'locations'> & {
  country?: Country | null
  creator?: { username: string } | null
}

export type AddLocation = TablesInsert<'locations'>

export type Country = { id: number; iso2: string }

export type Profile = Tables<'profiles'> & {
  friends?: { count: number }[]
}

export type AddProfile = TablesInsert<'profiles'>

export type EditProfile = TablesUpdate<'profiles'>

export type Friend = Tables<'friends'> & {
  sender: Profile | null
  receiver: Profile | null
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
  images?: {
    height: number
    url: string
    width: number
  }[]
  genres: string[]
  followers: {
    href: string | null
    total: number
  }
  external_urls: {
    spotify: string
  }
}
