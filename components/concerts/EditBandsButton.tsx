import { PencilSquareIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'
import { useBands } from '../../hooks/useBands'
import { useDebounce } from '../../hooks/useDebounce'
import { ReorderableListItem } from '../../types/types'
import { ListManager } from '../forms/ListManager'
import Modal from '../Modal'

type BandsListManagerProps = {
  initialListItems: ReorderableListItem[]
  close: () => void
}

const BandsListManager = ({ initialListItems, close }: BandsListManagerProps) => {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 200)
  const { data: bands } = useBands(
    undefined,
    { filter: { search: debouncedSearch } },
    !!debouncedSearch
  )
  return (
    <ListManager
      search={search}
      setSearch={setSearch}
      searchResults={bands?.data.map(band => ({ ...band, index: null })) ?? []}
      initialListItems={initialListItems}
      close={close}
    />
  )
}

type EditBandsButtonProps = {
  selectedBands: ReorderableListItem[]
}

export const EditBandsButton = ({ selectedBands }: EditBandsButtonProps) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group flex justify-between items-center gap-4 px-4 pt-1 border rounded-lg border-slate-500 bg-slate-750 text-left focus:outline-none focus:ring-2 focus:ring-venom"
      >
        <div>
          <div className="mb-1 text-xs text-slate-300 group-focus:text-venom">Bands</div>
          <div className="relative flex flex-wrap items-start gap-1 h-12 overflow-hidden">
            {selectedBands.length > 0 ? (
              selectedBands.map(item => (
                <div className="px-1.5 py-0.5 rounded bg-slate-700 text-sm font-bold" key={item.id}>
                  {item.name}
                </div>
              ))
            ) : (
              <div className="text-slate-300">Bands hinzufügen</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-750" />
          </div>
        </div>
        <PencilSquareIcon className="h-icon flex-none text-slate-300" />
      </button>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} fullHeight>
        <BandsListManager initialListItems={selectedBands} close={() => setIsOpen(false)} />
      </Modal>
    </>
  )
}
