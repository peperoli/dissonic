import { createContext, Dispatch, ReactNode, RefObject, SetStateAction, useContext } from 'react'
import { KeyboardEvent } from 'react'
import { Band, ReorderableListItem } from '../../../types/types'

type ListManagerContextValue = {
  listItems: ReorderableListItem<Band>[]
  setListItems: Dispatch<SetStateAction<ReorderableListItem<Band>[]>>
  selectedItemToReorder: number | null
  setSelectedItemToReorder: Dispatch<SetStateAction<number | null>>
  searchRef: RefObject<HTMLInputElement | null>
  scrollContainerRef: RefObject<HTMLDivElement | null>
  itemsRef: RefObject<(HTMLButtonElement | null)[]>
  queryHook: (query: string, search: (query: string) => void) => void
  handleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void
  removeItem: (id: number) => void
  reorderItems: (start: number, end: number) => void
}

const ListManagerContext = createContext<ListManagerContextValue | null>(null)

export const ListManagerProvider = ({
  value,
  children,
}: {
  value: ListManagerContextValue
  children: ReactNode
}) => {
  return <ListManagerContext.Provider value={value}>{children}</ListManagerContext.Provider>
}

export const useListManager = () => {
  const context = useContext(ListManagerContext)

  if (!context) {
    throw new Error('useListManager must be used within ListManagerProvider')
  }

  return context
}
