export interface IButton {
  onClick?: () => void
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
  readonly id: number
  created_at: Date
  concert_id: string
  user_id: string
  content: string
  edited_at: Date
}

export type Band = {
  readonly id: number
  name: string
  country: Country
}

type WithBands = {
  bands: Band[]
}

export type ConcertWithBands = Concert & WithBands

type BandSeen = {
  readonly band_id: number
  readonly concert_id: string
  readonly user_id: string
  band: Band
  concert: Concert
}

export type Genre = {
  readonly id: number
  readonly name: string
}

type WithGenres = {
  genres: Genre[]
}

export type BandWithGenres = Band & WithGenres

export type Location = {
  readonly id: number
  name: string
  city: string
}

export type Country = {
  readonly id: number
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

export type Option = Band | Genre

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
