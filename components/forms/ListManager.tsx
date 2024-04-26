import {
  ImportIcon,
  ArrowDownUpIcon,
  CheckIcon,
  LightbulbIcon,
  SearchIcon,
  PlusCircleIcon,
  XCircleIcon,
  XIcon,
} from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { useSpotifyArtist } from '../../hooks/spotify/useSpotifyArtist'
import { ReorderableListItem } from '../../types/types'
import { Button } from '../Button'
import { UserMusicIcon } from '../layout/UserMusicIcon'
import clsx from 'clsx'
import { reorderList } from '../../lib/reorderList'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { FetchStatus } from '@tanstack/react-query'
import { SpinnerIcon } from '../layout/SpinnerIcon'

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
      <li
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
            <UserMusicIcon className="size-icon text-slate-300" />
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
      </li>
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
  selected: boolean
  addItem: () => void
}

const SearchResult = ({ band, selected, addItem }: SearchResultProps) => {
  const { data: spotifyArtist } = useSpotifyArtist(band.spotify_artist_id)
  const regionNames = new Intl.DisplayNames('de', { type: 'region' })
  return (
    <button
      onClick={addItem}
      disabled={selected}
      className={clsx(
        'flex gap-4 rounded-lg p-2 text-left hover:bg-slate-700',
        selected && 'pointer-events-none'
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
          <UserMusicIcon className="size-icon text-slate-300" />
        )}
      </div>
      <div className="w-full">
        {band.name}
        {band.country?.iso2 && (
          <div className="text-sm text-slate-300">{regionNames.of(band.country.iso2)}</div>
        )}
      </div>
      {selected ? (
        <div className="btn btn-icon">
          <CheckIcon className="size-icon text-slate-300" />
        </div>
      ) : (
        <div
          onClick={addItem}
          aria-label="Eintrag hinzufügen"
          className="btn btn-icon btn-tertiary flex-none"
        >
          <PlusCircleIcon className="size-icon text-venom" />
        </div>
      )}
    </button>
  )
}

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
  const [animationParent] = useAutoAnimate()

  function addItem(searchResult: ReorderableListItem) {
    setListItems([...listItems, { ...searchResult, index: listItems.length }])
    setSearch('')
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
      <div className="h-full overflow-auto">
        {search === '' ? (
          <ul ref={animationParent} className="my-2 grid content-start py-4">
            {listItems.map((listItem, index) => (
              <ListItem
                key={listItem.id}
                band={listItem}
                index={index}
                removeItem={() => setListItems(listItems.filter(item => item.id !== listItem.id))}
                selectedItemToReorder={selectedItemToReorder}
                selectItemToReorder={() => setSelectedItemToReorder(index)}
                reorderItems={reorderItems}
              />
            ))}
          </ul>
        ) : (
          <div className="grid content-start py-6">
            {searchResults.length > 0 ? (
              searchResults.map(searchResult => (
                <SearchResult
                  key={searchResult.id}
                  band={searchResult}
                  selected={!!listItems.find(item => searchResult.id === item.id)}
                  addItem={() => addItem(searchResult)}
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
      <div className="mt-auto flex gap-4">
        <div className="relative flex w-full items-center">
          <SearchIcon className="pointer-events-none absolute ml-4 size-icon text-slate-300" />
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
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
    </div>
  )
}
