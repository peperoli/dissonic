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
import { forwardRef, KeyboardEvent, useEffect, useRef, useState } from 'react'
import { useSpotifyArtist } from '../../hooks/spotify/useSpotifyArtist'
import { ReorderableListItem } from '../../types/types'
import { Button } from '../Button'
import clsx from 'clsx'
import { reorderList } from '../../lib/reorderList'
import { FetchStatus } from '@tanstack/react-query'
import { SpinnerIcon } from '../layout/SpinnerIcon'
import { Reorder } from 'framer-motion'

type InsertHereProps = {
  reorderItems: () => void
  isDown?: boolean
}

const InsertHere = ({ reorderItems, isDown }: InsertHereProps) => {
  return (
    <div className="relative flex items-center justify-center">
      <hr className="mx-2 my-0 w-full border-t border-slate-500" />
      <Button
        onClick={reorderItems}
        label="Hier einfügen"
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
  band: ReorderableListItem
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
  const { data: spotifyArtist } = useSpotifyArtist(band.spotify_artist_id)
  const regionNames = new Intl.DisplayNames('de', { type: 'region' })
  const selectedToReorder = selectedItemToReorder === index
  return (
    <>
      {selectedItemToReorder !== null && !selectedToReorder && index === 0 && (
        <InsertHere reorderItems={() => reorderItems(selectedItemToReorder, index)} />
      )}
      <Reorder.Item
        value={band}
        dragListener={false}
        // @ts-expect-error
        className={clsx(
          'group flex items-center gap-4 rounded-lg p-2',
          selectedToReorder && 'bg-venom/10'
        )}
      >
        <div className="relative grid h-11 w-11 flex-none place-content-center rounded-lg bg-slate-750">
          {spotifyArtist?.images?.[2] ? (
            <Image
              src={spotifyArtist.images[2].url}
              alt={band.name}
              fill
              sizes="150px"
              className="rounded-lg object-cover"
            />
          ) : (
            <Guitar className="size-icon text-slate-300" />
          )}
        </div>
        <div className="w-full">
          {band.name}
          {band.country?.iso2 && (
            <div className="text-sm text-slate-300">{regionNames.of(band.country.iso2)}</div>
          )}
        </div>
        <div
          className={clsx(
            'flex flex-none group-focus-within:opacity-100 group-hover:opacity-100 md:opacity-0',
            selectedItemToReorder !== null && 'invisible'
          )}
        >
          <Button
            onClick={removeItem}
            label="Eintrag entfernen"
            contentType="icon"
            icon={<XCircleIcon className="size-icon text-red" />}
            appearance="tertiary"
          />
          <Button
            onClick={selectItemToReorder}
            label="Eintrag verschieben"
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
  band: ReorderableListItem
  index: number
  selected: boolean
  addItem: () => void
  removeItem: () => void
  handleKeyNavigation: (event: KeyboardEvent<HTMLButtonElement>, index: number) => void
}

const SearchResult = forwardRef<HTMLButtonElement, SearchResultProps>(
  ({ band, index, selected, addItem, removeItem, handleKeyNavigation }, ref) => {
    const { data: spotifyArtist } = useSpotifyArtist(band.spotify_artist_id)
    const regionNames = new Intl.DisplayNames('de', { type: 'region' })
    return (
      <button
        ref={ref}
        onClick={selected ? removeItem : addItem}
        onKeyDown={e => handleKeyNavigation(e, index)}
        aria-label={selected ? 'Eintrage entfernen' : 'Eintrag hinzufügen'}
        className={clsx('flex gap-4 rounded-lg p-2 text-left hover:bg-slate-700')}
      >
        <div className="relative grid h-11 w-11 flex-none place-content-center rounded-lg bg-slate-750">
          {spotifyArtist?.images?.[2] ? (
            <Image
              src={spotifyArtist.images[2].url}
              alt={band.name}
              fill
              sizes="150px"
              className="rounded-lg object-cover"
            />
          ) : (
            <Guitar className="size-icon text-slate-300" />
          )}
        </div>
        <div className="w-full">
          {band.name}
          {band.country?.iso2 && (
            <div className="text-sm text-slate-300">{regionNames.of(band.country.iso2)}</div>
          )}
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

type ListManagerProps = {
  searchResults: ReorderableListItem[]
  fetchStatus: FetchStatus
  initialListItems: ReorderableListItem[]
  search: string
  setSearch: (search: string) => void
  onSave: (items: ReorderableListItem[]) => void
}

export const ListManager = ({
  searchResults,
  fetchStatus,
  initialListItems,
  search,
  setSearch,
  onSave,
}: ListManagerProps) => {
  const [listItems, setListItems] = useState(initialListItems)
  const [selectedItemToReorder, setSelectedItemToReorder] = useState<number | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, listItems.length)
  }, [listItems.length])

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      // Prevent default to avoid scrolling
      event.preventDefault()
      const firsItem = itemsRef.current[0]
      firsItem?.focus()
    }
  }

  function handleKeyNavigation(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === 'ArrowUp' && index > 0) {
      itemsRef.current[index - 1]?.focus()
    } else if (event.key === 'ArrowDown' && index < searchResults.length - 1) {
      itemsRef.current[index + 1]?.focus()
    }
  }

  function addItem(searchResult: ReorderableListItem) {
    setListItems([...listItems, { ...searchResult, index: listItems.length }])
    setSearch('')
    searchRef.current?.focus()
    setTimeout(() => {
      const scrollHeight = scrollContainerRef.current?.scrollHeight
      scrollContainerRef.current?.scrollTo({ top: scrollHeight })
    }, 50)
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
        <h3>Bands hinzufügen</h3>
        <p className="text-sm text-slate-300">
          Tipp: Ordne für optimale Übersicht die Headliner zuoberst ein.
        </p>
      </div>
      <div
        className={clsx(
          'flex items-center gap-4 rounded-lg bg-slate-750 p-4 text-sm',
          selectedItemToReorder === null && 'invisible'
        )}
      >
        <LightbulbIcon className="size-icon flex-none text-yellow" />
        Auf ein Ziel klicken, um den Eintrag zu verschieben.
        <Button
          onClick={() => setSelectedItemToReorder(null)}
          label="Abbrechen"
          contentType="icon"
          icon={<XIcon className="size-icon" />}
          size="small"
          className="flex-none"
        />
      </div>
      <div className="order-last mt-auto flex gap-4 md:order-none md:mt-4">
        <div className="relative flex w-full items-center">
          <SearchIcon className="pointer-events-none absolute ml-4 size-icon text-slate-300" />
          <input
            ref={searchRef}
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Bands hinzufügen"
            className="block w-full rounded-lg border border-slate-500 bg-slate-750 py-2 pl-12 pr-4"
          />
          {search && (
            <button onClick={() => setSearch('')} className="btn btn-icon absolute right-0">
              <span className="sr-only">Suche zurücksetzen</span>
              {fetchStatus === 'fetching' ? (
                <SpinnerIcon className="size-icon animate-spin" />
              ) : (
                <XIcon className="size-icon" />
              )}
            </button>
          )}
        </div>
        <Button onClick={() => onSave(listItems)} label="Fertig" appearance="primary" />
      </div>
      <div ref={scrollContainerRef} className="h-full overflow-auto">
        {search === '' ? (
          <Reorder.Group
            values={listItems}
            onReorder={setListItems}
            axis="y"
            // @ts-expect-error
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
        ) : (
          <div className="grid content-start py-6">
            {searchResults.length > 0 ? (
              searchResults.map((searchResult, index) => (
                <SearchResult
                  key={searchResult.id}
                  // @ts-expect-error
                  ref={el => (itemsRef.current[index] = el)}
                  band={searchResult}
                  index={index}
                  selected={!!listItems.find(item => searchResult.id === item.id)}
                  handleKeyNavigation={handleKeyNavigation}
                  addItem={() => addItem(searchResult)}
                  removeItem={() => removeItem(searchResult.id)}
                />
              ))
            ) : (
              <div className="p-4 text-center text-sm text-slate-300">
                {fetchStatus === 'fetching' ? 'Laden ...' : 'Keine Ergebnisse gefunden.'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
