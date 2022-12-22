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

type Band = {
  readonly id: string
  name: string
  country?: string
}

type Location = {
  readonly id: string
  name: string
  city: string
}

export interface ITopBands {
  bands: Band[]
}

export interface ITopLocations {
  locations: Location[]
}
