import { LightbulbIcon, XIcon } from 'lucide-react'
import { KeyboardEvent, useCallback, useRef, useState } from 'react'
import { Band, ReorderableListItem } from '../../../types/types'
import { Button } from '../../Button'
import clsx from 'clsx'
import { reorderList } from '../../../lib/reorderList'
import { useTranslations } from 'next-intl'
import { DialogTitle } from '../../shared/Dialog'
import { ListManagerContent } from './Content'
import { InstantSearch } from 'react-instantsearch'
import { searchClient } from '@algolia/client-search'
import { ListManagerProvider } from './Context'
import { SearchBox as CustomSearchBox } from './SearchBox'

function createAlgoliaClient() {
  return searchClient(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY
  )
}

export const ListManager = ({
  initialListItems,
  onSave,
}: {
  initialListItems: ReorderableListItem<Band>[]
  onSave: (items: ReorderableListItem<Band>[]) => void
}) => {
  const [listItems, setListItems] = useState(initialListItems)
  const [selectedItemToReorder, setSelectedItemToReorder] = useState<number | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([])
  const t = useTranslations('ListManager')
  const timerId = useRef<ReturnType<typeof setTimeout> | null>(null)
  const queryHook = useCallback((query: string, search: (query: string) => void) => {
    if (timerId.current) {
      clearTimeout(timerId.current)
    }

    timerId.current = setTimeout(() => search(query), 100)
  }, [])

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      const firstItem = itemsRef.current[0]
      firstItem?.focus()
    }
  }

  function removeItem(id: number) {
    setListItems(currentItems => currentItems.filter(item => item.id !== id))
  }

  function reorderItems(start: number, end: number) {
    setListItems(currentItems => reorderList(currentItems, start, end))
    setSelectedItemToReorder(null)
  }

  return (
    <ListManagerProvider
      value={{
        listItems,
        setListItems,
        selectedItemToReorder,
        setSelectedItemToReorder,
        searchRef,
        scrollContainerRef,
        itemsRef,
        queryHook,
        handleKeyDown,
        removeItem,
        reorderItems,
      }}
    >
      <div className="relative flex h-full flex-col">
        <div className={clsx('absolute', selectedItemToReorder !== null && 'invisible')}>
          <DialogTitle>{t('addBands')}</DialogTitle>
          <p className="text-sm text-slate-300">{t('orderBandsByBilling')}</p>
        </div>
        <div
          className={clsx(
            'flex items-center gap-4 rounded-lg bg-slate-750 p-4 text-sm',
            selectedItemToReorder === null && 'invisible'
          )}
        >
          <LightbulbIcon className="size-icon flex-none text-yellow" />
          {t('clickOnATargetToMoveTheEntry')}
          <Button
            onClick={() => setSelectedItemToReorder(null)}
            label={t('cancelReorder')}
            contentType="icon"
            icon={<XIcon className="size-icon" />}
            size="small"
            className="ml-auto flex-none"
          />
        </div>
        <InstantSearch searchClient={createAlgoliaClient()} indexName="bands">
          <div className="order-last mt-auto flex gap-4 md:order-none md:mt-4">
            <CustomSearchBox ref={searchRef} />
            <Button onClick={() => onSave(listItems)} label={t('done')} appearance="primary" />
          </div>
          <div ref={scrollContainerRef} className="h-full overflow-auto">
            <ListManagerContent />
          </div>
        </InstantSearch>
      </div>
    </ListManagerProvider>
  )
}
