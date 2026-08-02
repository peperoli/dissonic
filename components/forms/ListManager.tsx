import {
  ImportIcon,
  CheckIcon,
  LightbulbIcon,
  SearchIcon,
  PlusCircleIcon,
  XCircleIcon,
  XIcon,
  GuitarIcon,
  ArrowDownUpIcon,
} from 'lucide-react'
import Image from 'next/image'
import { KeyboardEvent, Ref, useEffect, useRef, useState } from 'react'
import { useSpotifyArtist } from '../../hooks/spotify/useSpotifyArtist'
import { Band, ReorderableListItem, SpotifyArtist } from '../../types/types'
import { Button } from '../Button'
import clsx from 'clsx'
import { reorderList } from '../../lib/reorderList'
import { SpinnerIcon } from '../layout/SpinnerIcon'
import { Reorder } from 'motion/react'
import { useTranslations } from 'next-intl'
import { DialogTitle } from '../shared/Dialog'
import { useDebounce } from '@/hooks/helpers/useDebounce'
import { useSearchBands } from '@/hooks/bands/useSearchBands'
import { ListManagerProvider, useListManager } from './ListManagerContext'
import { BandRecord } from '@/types/algolia'

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
  const [searchQuery, setSearchQuery] = useState('')
  const debounceQuery = useDebounce(searchQuery, 200)
  const { data: searchResults, isFetching } = useSearchBands({
    search: debounceQuery,
  })

  const t = useTranslations('ListManager')

  function reorderItems(start: number, end: number) {
    setListItems(reorderList(listItems, start, end))
    setSelectedItemToReorder(null)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      // Prevent default to avoid scrolling
      event.preventDefault()
      const firsItem = itemsRef.current[0]
      firsItem?.focus()
    }
  }

  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, listItems.length)
  }, [listItems.length])

  return (
    <ListManagerProvider
      value={{
        // refs
        searchRef,
        scrollContainerRef,
        itemsRef,
        // list state
        listItems,
        setListItems,
        selectedItemToReorder,
        setSelectedItemToReorder,
        reorderItems,
        // search state
        searchQuery,
        setSearchQuery,
        searchResults: searchResults?.data ?? [],
        searchResultsCount: searchResults?.count ?? 0,
        isSearchFetching: isFetching,
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
        <div className="order-last mt-auto flex gap-4 md:order-none md:mt-4">
          <div className="relative flex w-full items-center">
            <SearchIcon className="pointer-events-none absolute ml-4 size-icon text-slate-300" />
            <input
              ref={searchRef}
              type="search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('searchBands')}
              className="block w-full rounded-lg border border-slate-500 bg-slate-750 py-2 pl-12 pr-4"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="btn btn-icon absolute right-0">
                <span className="sr-only">{t('resetSearch')}</span>
                {isFetching ? (
                  <SpinnerIcon className="size-icon animate-spin" />
                ) : (
                  <XIcon className="size-icon" />
                )}
              </button>
            )}
          </div>
          <Button onClick={() => onSave(listItems)} label={t('done')} appearance="primary" />
        </div>
        <div ref={scrollContainerRef} className="h-full overflow-auto">
          <Content />
        </div>
      </div>
    </ListManagerProvider>
  )
}

export const Content = () => {
  const { listItems, setListItems, selectedItemToReorder, reorderItems, searchQuery } =
    useListManager()

  function removeItem(id: number) {
    setListItems(listItems.filter(item => item.id !== id))
  }

  if (searchQuery.length > 0) {
    return <Search />
  }

  return (
    <Reorder.Group
      values={listItems}
      onReorder={setListItems}
      axis="y"
      className="my-2 grid h-[calc(100%-1rem)] content-start py-4"
    >
      {listItems.map((listItem, index) => {
        const selectedToReorder = selectedItemToReorder === index

        return (
          <>
            {selectedItemToReorder !== null && !selectedToReorder && index === 0 && (
              <InsertHere reorderItems={() => reorderItems(selectedItemToReorder, index)} />
            )}
            <ListItem
              key={listItem.id}
              band={listItem}
              index={index}
              removeItem={() => removeItem(listItem.id)}
            />
            {selectedItemToReorder !== null &&
              !selectedToReorder &&
              selectedItemToReorder !== index + 1 && (
                <InsertHere
                  reorderItems={() => reorderItems(selectedItemToReorder, index + 1)}
                  isDown={selectedItemToReorder < index + 1}
                />
              )}
          </>
        )
      })}
    </Reorder.Group>
  )
}

function Search() {
  const {
    searchRef,
    scrollContainerRef,
    itemsRef,
    listItems,
    setListItems,
    setSearchQuery,
    searchResults,
    searchResultsCount,
    isSearchFetching,
  } = useListManager()
  const t = useTranslations('ListManager')

  function addItem(searchResult: BandRecord) {
    setListItems([
      ...listItems,
      {
        id: searchResult.id,
        name: searchResult.name,
        alt_names: searchResult.alt_names,
        country: searchResult.country,
        genres: searchResult.genres,
        spotify_artist_id: searchResult.spotify_artist_id,
        spotify_artist_images: searchResult.spotify_artist_images,
        item_index: listItems.length,
      } as ReorderableListItem<Band>,
    ])
    setSearchQuery('')
    searchRef.current?.focus()
    setTimeout(() => {
      const scrollHeight = scrollContainerRef.current?.scrollHeight
      scrollContainerRef.current?.scrollTo({ top: scrollHeight })
    }, 50)
  }

  function removeItem(id: number) {
    setListItems(listItems.filter(item => item.id !== id))
  }

  function handleKeyNavigation(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === 'ArrowUp' && index > 0) {
      itemsRef.current[index - 1]?.focus()
    } else if (event.key === 'ArrowDown' && index < searchResults.length - 1) {
      itemsRef.current[index + 1]?.focus()
    }
  }

  return (
    <div className="grid content-start py-6">
      {!searchResultsCount ? (
        <div className="p-4 text-center text-sm text-slate-300">
          {isSearchFetching ? t('loading') : t('noResultsFound')}
        </div>
      ) : (
        searchResults.map((searchResult, index) => (
          <SearchResult
            key={searchResult.id}
            ref={el => {
              itemsRef.current[index] = el
            }}
            band={searchResult}
            index={index}
            selected={!!listItems.find(item => searchResult.id === item.id)}
            handleKeyNavigation={handleKeyNavigation}
            addItem={() => addItem(searchResult)}
            removeItem={() => removeItem(searchResult.id)}
          />
        ))
      )}
    </div>
  )
}

function ListItem({
  band,
  removeItem,
  index,
}: {
  band: ReorderableListItem<Band>
  index: number
  removeItem: () => void
}) {
  const { selectedItemToReorder, setSelectedItemToReorder, reorderItems } = useListManager()
  const t = useTranslations('ListManager')
  const selectedToReorder = selectedItemToReorder === index

  return (
    <>
      {selectedItemToReorder !== null && !selectedToReorder && index === 0 && (
        <InsertHere reorderItems={() => reorderItems(selectedItemToReorder, index)} />
      )}
      <Reorder.Item
        value={band}
        dragListener={false}
        className={clsx(
          'group flex items-center gap-4 rounded-lg p-2',
          selectedToReorder && 'bg-venom/10'
        )}
      >
        <BandItem band={band} />
        <div
          className={clsx(
            'flex flex-none group-focus-within:opacity-100 group-hover:opacity-100 md:opacity-0',
            selectedItemToReorder !== null && 'invisible'
          )}
        >
          <Button
            onClick={removeItem}
            label={t('removeEntry')}
            contentType="icon"
            icon={<XCircleIcon className="size-icon text-red" />}
            appearance="tertiary"
          />
          <Button
            onClick={() => setSelectedItemToReorder(index)}
            label={t('reorderEntry')}
            contentType="icon"
            icon={<ArrowDownUpIcon className="size-icon" />}
            appearance="tertiary"
          />
        </div>
      </Reorder.Item>
      {selectedItemToReorder !== null &&
        !selectedToReorder &&
        selectedItemToReorder !== index + 1 && (
          <InsertHere
            reorderItems={() => reorderItems(selectedItemToReorder, index + 1)}
            isDown={selectedItemToReorder < index + 1}
          />
        )}
    </>
  )
}

function InsertHere({ reorderItems, isDown }: { reorderItems: () => void; isDown?: boolean }) {
  const t = useTranslations('ListManager')
  return (
    <div className="relative flex items-center justify-center">
      <hr className="mx-2 my-0 w-full border-t border-slate-500" />
      <Button
        onClick={reorderItems}
        label={t('insertHere')}
        contentType="icon"
        size="small"
        icon={<ImportIcon className={clsx('size-icon', !isDown && 'rotate-180')} />}
        appearance="secondary"
        className="absolute"
      />
    </div>
  )
}

function BandItem({ band }: { band: ReorderableListItem<Band> | BandRecord }) {
  const { data: spotifyArtist } = useSpotifyArtist(band.spotify_artist_id, {
    enabled: !band.spotify_artist_images,
  })
  const image =
    (band.spotify_artist_images as SpotifyArtist['images'])?.[2] || spotifyArtist?.images?.[2]

  return (
    <div className="flex w-full items-center gap-4">
      <div className="relative grid h-11 w-11 flex-none place-content-center rounded-lg bg-slate-750">
        {image ? (
          <Image
            src={image.url}
            alt={band.name}
            fill
            sizes="150px"
            unoptimized
            className="rounded-lg object-cover"
          />
        ) : (
          <GuitarIcon className="size-icon text-slate-300" />
        )}
      </div>
      <div className="grid w-full">
        <div className="truncate">{band.name}</div>
        <div className="truncate text-sm text-slate-300">
          {band.country?.iso2}
          {!!band.genres.length && ' | '}
          {band.genres?.map(item => item.name).join(' • ')}
        </div>
      </div>
    </div>
  )
}

function SearchResult({
  ref,
  band,
  index,
  selected,
  addItem,
  removeItem,
  handleKeyNavigation,
}: {
  ref: Ref<HTMLButtonElement | null>
  band: BandRecord
  index: number
  selected: boolean
  addItem: () => void
  removeItem: () => void
  handleKeyNavigation: (event: KeyboardEvent<HTMLButtonElement>, index: number) => void
}) {
  const t = useTranslations('ListManager')

  return (
    <button
      ref={ref}
      onClick={selected ? removeItem : addItem}
      onKeyDown={e => handleKeyNavigation(e, index)}
      aria-label={selected ? t('removeEntry') : t('addEntry')}
      className={clsx('flex gap-4 rounded-lg p-2 text-left hover:bg-slate-700')}
    >
      <BandItem band={band} />
      {selected ? (
        <div className="flex flex-none">
          <div className="btn btn-icon btn-tertiary">
            <XCircleIcon className="size-icon text-red" />
          </div>
          <div className="btn btn-icon">
            <CheckIcon className="size-icon text-slate-300" />
          </div>
        </div>
      ) : (
        <div className="btn btn-icon btn-tertiary flex-none">
          <PlusCircleIcon className="size-icon text-venom" />
        </div>
      )}
    </button>
  )
}
