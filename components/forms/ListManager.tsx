import {
  ImportIcon,
  ArrowDownUpIcon,
  CheckIcon,
  LightbulbIcon,
  SearchIcon,
  PlusCircleIcon,
  XCircleIcon,
  XIcon,
  Guitar,
} from 'lucide-react'
import Image from 'next/image'
import { forwardRef, KeyboardEvent, ReactNode, RefObject, useEffect, useRef, useState } from 'react'
import { useSpotifyArtist } from '../../hooks/spotify/useSpotifyArtist'
import { Band, ReorderableListItem, SpotifyArtist } from '../../types/types'
import { Button } from '../Button'
import clsx from 'clsx'
import { reorderList } from '../../lib/reorderList'
import { SpinnerIcon } from '../layout/SpinnerIcon'
import { Reorder } from 'motion/react'
import { useTranslations } from 'next-intl'
import { DialogTitle } from '../shared/Dialog'
import {
  InstantSearch,
  SearchBox,
  useHits,
  useInstantSearch,
  useSearchBox,
} from 'react-instantsearch'
import { algoliasearch } from 'algoliasearch'
import { BandRecord } from '@/app/api/algolia/bands/route'

const InsertHere = ({ reorderItems, isDown }: { reorderItems: () => void; isDown?: boolean }) => {
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

type ListItemProps = {
  band: ReorderableListItem<Band>
  index: number
  removeItem: () => void
  selectItemToReorder: () => void
  selectedItemToReorder: number | null
  reorderItems: (start: number, end: number) => void
}

const ListItem = ({
  band,
  removeItem,
  index,
  selectItemToReorder,
  selectedItemToReorder,
  reorderItems,
}: ListItemProps) => {
  const { data: spotifyArtist } = useSpotifyArtist(band.spotify_artist_id, {
    enabled: !band.spotify_artist_images,
  })
  const t = useTranslations('ListManager')
  const selectedToReorder = selectedItemToReorder === index
  const image =
    (band.spotify_artist_images as SpotifyArtist['images'])?.[2] || spotifyArtist?.images?.[2]

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
            <Guitar className="size-icon text-slate-300" />
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
            onClick={selectItemToReorder}
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

type SearchResultProps = {
  band: ReorderableListItem<Band>
  index: number
  selected: boolean
  addItem: () => void
  removeItem: () => void
  handleKeyNavigation: (event: KeyboardEvent<HTMLButtonElement>, index: number) => void
}

const SearchResult = forwardRef<HTMLButtonElement, SearchResultProps>(
  ({ band, index, selected, addItem, removeItem, handleKeyNavigation }, ref) => {
    const { data: spotifyArtist } = useSpotifyArtist(band.spotify_artist_id, {
      enabled: !band.spotify_artist_images,
    })
    const t = useTranslations('ListManager')
    const image =
      (band.spotify_artist_images as SpotifyArtist['images'])?.[2] || spotifyArtist?.images?.[2]

    return (
      <button
        ref={ref}
        onClick={selected ? removeItem : addItem}
        onKeyDown={e => handleKeyNavigation(e, index)}
        aria-label={selected ? t('removeEntry') : t('addEntry')}
        className={clsx('flex gap-4 rounded-lg p-2 text-left hover:bg-slate-700')}
      >
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
            <Guitar className="size-icon text-slate-300" />
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
)

SearchResult.displayName = 'SearchResult'

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
  const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY
  )
  const timerId = useRef<ReturnType<typeof setTimeout> | null>(null)
  const queryHook = (query: string, search: (query: string) => void) => {
    if (timerId.current) {
      clearTimeout(timerId.current)
    }

    timerId.current = setTimeout(() => search(query), 100)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    console.log(event.key)
    if (event.key === 'ArrowDown') {
      // Prevent default to avoid scrolling
      event.preventDefault()
      const firsItem = itemsRef.current[0]
      firsItem?.focus()
    }
  }

  function removeItem(id: number) {
    setListItems(listItems.filter(item => item.id !== id))
  }

  function reorderItems(start: number, end: number) {
    setListItems(reorderList(listItems, start, end))
    setSelectedItemToReorder(null)
  }

  return (
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
      <InstantSearch searchClient={searchClient} indexName="bands">
        <div className="order-last mt-auto flex gap-4 md:order-none md:mt-4">
          <SearchBox
            queryHook={queryHook}
            placeholder="Search ..."
            // @ts-expect-error - algolia and lucide props not compatible
            submitIconComponent={SearchIcon}
            loadingIconComponent={SpinnerIcon}
            // @ts-expect-error - algolia and lucide props not compatible
            resetIconComponent={XIcon}
            onKeyDown={handleKeyDown}
            classNames={{
              root: 'w-full',
              form: 'form-control',
              input: '!pl-10',
              submit: 'absolute top-1/2 ml-3 size-icon -translate-y-1/2',
              loadingIndicator: 'absolute right-0 m-2.5 size-icon animate-spin text-slate-300',
              reset: 'btn btn-icon btn-small absolute right-0 m-1 size-icon',
            }}
          />
          <Button onClick={() => onSave(listItems)} label={t('done')} appearance="primary" />
        </div>
        <div ref={scrollContainerRef} className="h-full overflow-auto">
          <HitsWrapper
            listItems={listItems}
            setListItems={setListItems}
            removeItem={removeItem}
            selectedItemToReorder={selectedItemToReorder}
            setSelectedItemToReorder={setSelectedItemToReorder}
            reorderItems={reorderItems}
            queryHook={queryHook}
            searchRef={searchRef}
            itemsRef={itemsRef}
            scrollContainerRef={scrollContainerRef}
          />
        </div>
      </InstantSearch>
    </div>
  )
}

function HitsWrapper({
  listItems,
  setListItems,
  removeItem,
  selectedItemToReorder,
  setSelectedItemToReorder,
  reorderItems,
  ...searchProps
}: {
  listItems: ReorderableListItem<Band>[]
  setListItems: (items: ReorderableListItem<Band>[]) => void
  removeItem: (id: number) => void
  queryHook: (query: string, search: (query: string) => void) => void
  selectedItemToReorder: number | null
  setSelectedItemToReorder: (index: number | null) => void
  reorderItems: (start: number, end: number) => void
  searchRef: RefObject<HTMLInputElement | null>
  itemsRef: RefObject<(HTMLButtonElement | null)[]>
  scrollContainerRef: RefObject<HTMLDivElement | null>
}) {
  const { indexUiState } = useInstantSearch()

  if (indexUiState?.query?.length) {
    return (
      <div className="grid content-start py-6">
        <NoResultsBoundary>
          <CustomHits
            listItems={listItems}
            setListItems={setListItems}
            removeItem={removeItem}
            {...searchProps}
          />
        </NoResultsBoundary>
      </div>
    )
  }

  return (
    <Reorder.Group
      values={listItems}
      onReorder={setListItems}
      axis="y"
      className="my-2 grid h-[calc(100%-1rem)] content-start py-4"
    >
      {listItems.map((listItem, index) => (
        <ListItem
          key={listItem.id}
          band={listItem}
          index={index}
          removeItem={() => removeItem(listItem.id)}
          selectedItemToReorder={selectedItemToReorder}
          selectItemToReorder={() => setSelectedItemToReorder(index)}
          reorderItems={reorderItems}
        />
      ))}
    </Reorder.Group>
  )
}

function NoResultsBoundary({ children }: { children: ReactNode }) {
  const { results, indexUiState } = useInstantSearch()
  const t = useTranslations('SearchForm')

  // The `__isArtificial` flag makes sure not to display the No Results message
  // when no hits have been returned.
  if (!results.__isArtificial && results.nbHits === 0) {
    return (
      <>
        <div>
          <p className="text-slate-300">{t('noResults', { query: indexUiState.query })}</p>
        </div>
        <div hidden>{children}</div>
      </>
    )
  }

  return children
}

function CustomHits({
  listItems,
  setListItems,
  removeItem,
  queryHook,
  searchRef,
  itemsRef,
  scrollContainerRef,
}: {
  listItems: ReorderableListItem<Band>[]
  setListItems: (items: ReorderableListItem<Band>[]) => void
  removeItem: (id: number) => void
  queryHook: (query: string, search: (query: string) => void) => void
  searchRef: RefObject<HTMLInputElement | null>
  itemsRef: RefObject<(HTMLButtonElement | null)[]>
  scrollContainerRef: RefObject<HTMLDivElement | null>
}) {
  const { items: hits } = useHits<BandRecord>()
  const { clear } = useSearchBox({ queryHook })

  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, listItems.length)
  }, [listItems.length])

  function handleKeyNavigation(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === 'ArrowUp' && index > 0) {
      itemsRef.current[index - 1]?.focus()
    } else if (event.key === 'ArrowDown' && index < hits.length - 1) {
      itemsRef.current[index + 1]?.focus()
    }
  }

  function addItem(searchResult: ReorderableListItem<Band>) {
    setListItems([...listItems, { ...searchResult, item_index: listItems.length }])
    clear()
    searchRef.current?.focus()
    setTimeout(() => {
      const scrollHeight = scrollContainerRef.current?.scrollHeight
      scrollContainerRef.current?.scrollTo({ top: scrollHeight })
    }, 50)
  }

  return (
    <>
      {hits.map((hit, index) => {
        const searchResult = {
          id: hit.id,
          name: hit.name,
          alt_names: hit.alt_names,
          country: hit.country ? { iso2: hit.country } : null,
          genres: hit.genres.map(genre => ({ name: genre })),
          spotify_artist_id: hit.spotify_artist_id,
          spotify_artist_images: hit.spotify_artist_images,
          item_index: null,
        } as ReorderableListItem<Band>
        return (
          <SearchResult
            key={searchResult.id}
            // @ts-expect-error - ref could be null, but it won't
            ref={el => (itemsRef.current[index] = el)}
            band={searchResult}
            index={index}
            selected={!!listItems.find(item => searchResult.id === item.id)}
            handleKeyNavigation={handleKeyNavigation}
            addItem={() => addItem(searchResult)}
            removeItem={() => removeItem(searchResult.id)}
          />
        )
      })}
    </>
  )
}
