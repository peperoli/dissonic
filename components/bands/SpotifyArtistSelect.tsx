import { useSpotifySearch } from '../../hooks/spotify/useSpotifySearch'
import { CheckIcon, ChevronDownIcon, LinkIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import { SpotifyArtist } from '../../types/types'
import { Popover } from '@headlessui/react'

interface SelectItemProps {
  item: SpotifyArtist
  value: string | null
  handleChange: (value: string | null) => void
}

const SelectItem = ({ item, value, handleChange }: SelectItemProps) => {
  const formatter = new Intl.NumberFormat('de-CH')
  return (
    <label className="flex w-full items-center gap-3 rounded-lg p-2 focus-within:bg-slate-600 hover:bg-slate-600">
      <input
        type="radio"
        checked={value === item.id}
        onChange={() => handleChange(item.id)}
        className="sr-only"
      />
      <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-slate-800">
        {item.images && item.images[2] ? (
          <Image
            src={item.images[2].url}
            alt={item.name}
            fill
            sizes="150px"
            className="rounded-lg object-cover"
          />
        ) : (
          <LinkIcon className="h-icon text-slate-300" />
        )}
      </div>
      <div className="grid">
        <div>{item.name}</div>
        <div className="truncate text-sm text-slate-300">
          {formatter.format(item.followers.total)} Follower
          {item.genres.length > 0 && <> &bull; {item.genres.join(', ')}</>}
        </div>
      </div>
      {value === item.id && <CheckIcon className="ml-auto h-icon" />}
    </label>
  )
}

interface SpotifyArtistSelectProps {
  bandName: string
  value: string | null
  onChange: (event: string | null) => void
}

export const SpotifyArtistSelect = ({ bandName, value, onChange }: SpotifyArtistSelectProps) => {
  const { data: searchResults } = useSpotifySearch(bandName)
  const selectedArtist = searchResults?.find(item => item.id === value)

  return (
    <Popover className="relative">
      <Popover.Button className="w-full rounded-lg border border-slate-500 bg-slate-750 px-4 pb-3 pt-1 text-left accent-slate-50">
        <span className="mb-2 inline-block w-max text-xs text-slate-300">Spotify-Verknüpfung</span>
        <span className="flex items-center gap-3">
          {value !== null && (
            <span className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-slate-800">
              {selectedArtist?.images && selectedArtist?.images[2] ? (
                <Image
                  src={selectedArtist.images[2].url}
                  alt={selectedArtist.name}
                  fill
                  sizes="150px"
                  className="rounded-lg object-cover"
                />
              ) : (
                <LinkIcon className="h-icon text-slate-300" />
              )}
            </span>
          )}
          <span>{value !== null ? selectedArtist?.name : 'Keine Verknüpfung'}</span>
          <ChevronDownIcon className="ml-auto h-icon" />
        </span>
      </Popover.Button>
      <Popover.Overlay className="fixed inset-0 bg-black opacity-30 md:hidden" />
      <Popover.Panel className="fixed inset-8 z-20 overflow-auto rounded-lg bg-slate-700 p-2 md:absolute md:inset-auto md:mt-1 md:max-h-72 md:w-full">
        {({ close }) => {
          function handleChange(value: string | null) {
            onChange(value)
            close()
          }
          return (
            <>
              <label className="flex items-center gap-3 rounded-lg p-2 focus-within:bg-slate-600 hover:bg-slate-600">
                <input
                  type="radio"
                  checked={value === null}
                  onChange={() => handleChange(null)}
                  className="sr-only"
                />
                <span className="inline-flex h-10 items-center">Keine Verknüpfung</span>
                {value === null && <CheckIcon className="ml-auto h-icon" />}
              </label>
              {searchResults?.map(item => (
                <SelectItem key={item.id} item={item} value={value} handleChange={handleChange} />
              ))}
            </>
          )
        }}
      </Popover.Panel>
    </Popover>
  )
}
