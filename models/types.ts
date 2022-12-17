export interface IButton {
  onClick: () => void,
  type?: "button" | "submit" | "reset" | undefined,
  label: string,
  style?: string,
  contentType?: string,
  icon?: JSX.Element,
  disabled?: boolean,
  loading?: boolean,
  size?: string,
  danger?: boolean,
}

export interface IPagination {
  entriesCount: number,
  currentPage: number,
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>,
  perPage: number,
}
