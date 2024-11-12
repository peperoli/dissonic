import { EditIcon } from 'lucide-react'
import { useState } from 'react'
import { useBands } from '../../hooks/bands/useBands'
import { useDebounce } from '../../hooks/helpers/useDebounce'
import { ReorderableListItem } from '../../types/types'
import { ListManager } from '../forms/ListManager'
import Modal from '../Modal'
import clsx from 'clsx'
import { TruncatedList } from 'react-truncate-list'

type BandsListManagerProps = {
  initialListItems: ReorderableListItem[]
  onSave: (items: ReorderableListItem[]) => void
}

const BandsListManager = ({ initialListItems, onSave }: BandsListManagerProps) => {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 200)
  const { data: bands, fetchStatus } = useBands({
    enabled: !!debouncedSearch,
    search: debouncedSearch,
  })
  return (
    <ListManager
      search={search}
      setSearch={setSearch}
      searchResults={bands?.data.map(band => ({ ...band, item_index: null })) ?? []}
      fetchStatus={fetchStatus}
      initialListItems={initialListItems}
      onSave={onSave}
    />
  )
}

type EditBandsButtonProps = {
  value: ReorderableListItem[]
  onChange: (value: ReorderableListItem[]) => void
  error?: any
}

export const EditBandsButton = ({ value, onChange, error }: EditBandsButtonProps) => {
  const [isOpen, setIsOpen] = useState(false)

  function onSave(items: ReorderableListItem[]) {
    onChange(items)
    setIsOpen(false)
  }
  return (
    <>
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={clsx(
            'group flex w-full items-center justify-between gap-4 rounded-lg border bg-slate-750 px-4 py-1 text-left focus:outline-none focus:ring-2 focus:ring-venom',
            error ? 'border-yellow' : 'border-slate-500'
          )}
        >
          <div>
            <div className="mb-1 text-xs text-slate-300 group-focus:text-venom">Bands</div>
            {value.length > 0 ? (
              <TruncatedList
                renderTruncator={({ hiddenItemsCount }) => (
                  <span className="text-sm font-bold text-slate-300">+{hiddenItemsCount}</span>
                )}
                className="flex max-h-13 flex-wrap items-start gap-1"
              >
                {value.map(item => (
                  <div
                    className="rounded bg-slate-700 px-1.5 py-0.5 text-sm font-bold"
                    key={item.id}
                  >
                    {item.name}
                  </div>
                ))}
              </TruncatedList>
            ) : (
              <div className="text-slate-300">Bands hinzufügen</div>
            )}
          </div>
          <EditIcon className="size-icon flex-none" />
        </button>
        {error && (
          <div className="mt-1 text-sm text-yellow">Bitte füge mindestens eine Band hinzu.</div>
        )}
      </div>
      <Modal open={isOpen} onOpenChange={setIsOpen} fullHeight>
        <BandsListManager initialListItems={value} onSave={onSave} />
      </Modal>
    </>
  )
}
