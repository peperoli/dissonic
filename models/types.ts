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

type Concert = {
  readonly id: string
  date_start: string
  date_end?: string
  is_festival: boolean
  name?: string
  location: Location
}

type Band = {
  readonly id: string
  name: string
  country?: string
}

type Genre = {
  readonly id: string
  readonly name: string
}

type BandWithGenres = {
  readonly id: string
  name: string
  country?: string
  genres: Genre[]
}

type Location = {
  readonly id: string
  name: string
  city: string
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
  concerts: any[]
}
