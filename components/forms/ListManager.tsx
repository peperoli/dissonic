import {
  ArrowRightEndOnRectangleIcon,
  ArrowsUpDownIcon,
  CheckIcon,
  LightBulbIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid'
import Image from 'next/image'
import { useState } from 'react'
import { useSpotifyArtist } from '../../hooks/useSpotifyArtist'
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
    <div className="relative flex justify-center items-center">
      <hr className="w-full mx-2 my-0 border-t border-slate-500" />
      <Button
        onClick={reorderItems}
        label="Hier einfügen"
        contentType="icon"
        size="small"
        icon={
          <ArrowRightEndOnRectangleIcon
            className={clsx('h-icon', isDown ? 'rotate-90' : '-rotate-90')}
          />
        }
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
          'group flex items-center gap-4 p-2 rounded-lg',
          selectedToReorder && 'bg-venom/10'
        )}
      >
        <div className="relative grid place-content-center w-11 h-11 flex-none rounded-lg bg-slate-750">
          {spotifyArtist?.images?.[2] ? (
            <Image
              src={spotifyArtist.images[2].url}
              alt={band.name}
              fill
              sizes="150px"
              className="rounded-lg object-cover"
            />
          ) : (
            <UserMusicIcon className="h-icon text-slate-300" />
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
            'flex flex-none md:opacity-0 group-hover:opacity-100 group-focus-within:opacity-100',
            selectedItemToReorder !== null && 'invisible'
          )}
        >
          <Button
            onClick={removeItem}
            label="Eintrag entfernen"
            contentType="icon"
            icon={<XCircleIcon className="h-icon text-red" />}
            appearance="tertiary"
          />
          <Button
            onClick={selectItemToReorder}
            label="Eintrag verschieben"
            contentType="icon"
            icon={<ArrowsUpDownIcon className="h-icon" />}
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
        'p-2 rounded-lg flex gap-4 text-left hover:bg-slate-700',
        selected && 'pointer-events-none'
      )}
    >
      <div className="relative grid place-content-center w-11 h-11 flex-none rounded-lg bg-slate-750">
        {spotifyArtist?.images?.[2] ? (
          <Image
            src={spotifyArtist.images[2].url}
            alt={band.name}
            fill
            sizes="150px"
            className="rounded-lg object-cover"
          />
        ) : (
          <UserMusicIcon className="h-icon text-slate-300" />
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
          <CheckIcon className="h-icon text-slate-300" />
        </div>
      ) : (
        <div
          onClick={addItem}
          aria-label="Eintrag hinzufügen"
          className="btn btn-icon btn-tertiary flex-none"
        >
          <PlusCircleIcon className="h-icon text-venom" />
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
    setListItems(prev => [...prev, { ...searchResult, index: prev.length }])
    setSearch('')
  }

  function reorderItems(start: number, end: number) {
    setListItems(reorderList(listItems, start, end))
    setSelectedItemToReorder(null)
  }
  return (
    <div className="relative flex flex-col h-full">
      <div className={clsx('absolute', selectedItemToReorder !== null && 'invisible')}>
        <h3>Bands hinzufügen</h3>
        <p className="text-sm text-slate-300">
          Tipp: Ordne für optimale Übersicht die Headliner zuoberst ein.
        </p>
      </div>
      <div
        className={clsx(
          'p-4 flex items-center gap-4 rounded-lg bg-slate-750 text-sm',
          selectedItemToReorder === null && 'invisible'
        )}
      >
        <LightBulbIcon className="h-icon flex-none text-yellow" />
        Auf ein Ziel klicken, um den Eintrag zu verschieben.
        <Button
          onClick={() => setSelectedItemToReorder(null)}
          label="Abbrechen"
          contentType="icon"
          icon={<XMarkIcon className="h-icon" />}
          size="small"
          className="flex-none"
        />
      </div>
      <div className="h-full overflow-auto">
        {search === '' ? (
          <ul ref={animationParent} className="grid content-start my-2 py-4">
            {listItems.map((listItem, index) => (
              <ListItem
                key={listItem.id}
                band={listItem}
                index={index}
                removeItem={() =>
                  setListItems(prev => prev.filter(item => item.id !== listItem.id))
                }
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
      <div className="flex gap-4 mt-auto">
        <div className="relative flex items-center w-full">
          <MagnifyingGlassIcon className="absolute pointer-events-none h-icon ml-4 text-slate-300" />
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Bands hinzufügen"
            className="block w-full pl-12 pr-4 py-2 border rounded-lg border-slate-500 bg-slate-750"
          />
          {search &&  (
            <button onClick={() => setSearch('')} className="btn btn-icon absolute right-0">
              <span className="sr-only">Suche zurücksetzen</span>
              {fetchStatus === 'fetching' ? <SpinnerIcon className="h-icon animate-spin" /> : <XMarkIcon className="h-icon" />}
            </button>
          )}
        </div>
        <Button onClick={() => onSave(listItems)} label="Fertig" appearance="primary" />
      </div>
    </div>
  )
}
