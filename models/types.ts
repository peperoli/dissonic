export interface IButton {
  onClick: () => void
  type?: 'button' | 'submit' | 'reset' | undefined
  label: string
  style?: 'primary' | 'secondary'
  contentType?: 'text' | 'icon'
  icon?: JSX.Element
  disabled?: boolean
  loading?: boolean
  size?: 'small' | 'medium'
  danger?: boolean
}

export interface IPagination {
  entriesCount: number
  currentPage: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
  perPage: number
}

export type Concert = {
  readonly id: string
  date_start: string
  date_end?: string
  is_festival: boolean
  name?: string
  location: Location
}

export type Comment = {
  readonly id: string
  created_at: Date
  concert_id: string
  user_id: string
  content: string
  edited_at: Date
}

export type Band = {
  readonly id: string
  name: string
  country: Country
}

type WithBands = {
  bands: Band[]
}

type ConcertWithBands = Concert & WithBands

type BandSeen = {
  readonly band_id: string
  readonly concert_id: string
  readonly user_id: string
  band: Band
  concert: Concert
}

type Genre = {
  readonly id: string
  readonly name: string
}

type WithGenres = {
  genres: Genre[]
}

type BandWithGenres = Band & WithGenres

type Location = {
  readonly id: string
  name: string
  city: string
}

type Country = {
  readonly id: string
  readonly name: string
  readonly iso2: string
}

export type User = {
  readonly id: string
  email: string
}

export type Profile = {
  readonly id: string
  username: string
  created_at: string
  avatar_path: string
}

export type Invite = {
  readonly sender: Profile
  readonly receiver: Profile
  readonly created_at: string
}

export type Friend = {
  readonly sender: Profile
  readonly receiver: Profile
  readonly created_at: string
  pending: boolean
  accepted_at: Date
}

export interface IConcertCard {
  concert: ConcertWithBands
  bandsSeen?: BandSeen[]
  user?: User
  profiles?: Profile[]
}

export interface IBandPage {
  initialBand: BandWithGenres
  countries: Country[]
  genres: Genre[]
  concerts: ConcertWithBands[]
}

export interface IProfilePage {
  profile: Profile
  bandsSeen: BandSeen[]
  friends: Friend[]
}

export interface IFriendsPage {
  profile: Profile
  friends: Friend[]
}

export interface IGenreChart {
  bands: BandWithGenres[]
}

export interface ITopBands {
  bands: Band[]
}

export interface ITopLocations {
  locations: Location[]
}

export interface IConcertsChart {
  concerts: ConcertWithBands[]
}
