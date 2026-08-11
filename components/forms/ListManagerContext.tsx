import { createContext, Dispatch, ReactNode, RefObject, SetStateAction, useContext } from 'react'
import { Band, ReorderableListItem } from '../../types/types'
import { BandRecord } from '@/types/algolia'

type ListManagerContextValue = {
  // refs
  searchRef: RefObject<HTMLInputElement | null>
  scrollContainerRef: RefObject<HTMLDivElement | null>
  itemsRef: RefObject<(HTMLButtonElement | null)[]>
  // list state
  listItems: ReorderableListItem<Band | BandRecord>[]
  setListItems: Dispatch<SetStateAction<ReorderableListItem<Band | BandRecord>[]>>
  selectedItemToReorder: number | null
  setSelectedItemToReorder: Dispatch<SetStateAction<number | null>>
  reorderItems: (start: number, end: number) => void
  // search state
  searchQuery: string
  setSearchQuery: Dispatch<SetStateAction<string>>
  searchResults: BandRecord[]
  searchResultsCount: number
  isSearchFetching: boolean
}

const ListManagerContext = createContext<ListManagerContextValue | null>(null)

export function ListManagerProvider({
  value,
  children,
}: {
  value: ListManagerContextValue
  children: ReactNode
}) {
  return <ListManagerContext.Provider value={value}>{children}</ListManagerContext.Provider>
}

export const useListManager = () => {
  const context = useContext(ListManagerContext)

  if (!context) {
    throw new Error('useListManager must be used within ListManagerProvider')
  }

  return context
}
