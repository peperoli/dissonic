import { useSpotifySearch } from '../../hooks/useSpotifySearch'
import { CheckIcon, ChevronDownIcon, LinkIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import { SpotifyArtist } from '../../types/types'
import { Popover } from '@headlessui/react'

interface SelectItemProps {
  item: SpotifyArtist
  value: string | null
  handleChange: (value: string) => void
}

const SelectItem = ({ item, value, handleChange }: SelectItemProps) => {
  return (
    <label className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-slate-600 focus-within:bg-slate-600">
      <input
        type="radio"
        checked={value === item.id}
        onChange={() => handleChange(item.id)}
        className="sr-only"
      />
      <span className="relative flex-shrink-0 flex justify-center items-center w-10 h-10 rounded-lg bg-slate-800">
        {item.images && item.images[2] ? (
          <Image
            src={item.images[2].url}
            alt={item.name}
            fill
            sizes="150px"
            className="object-cover rounded-lg"
          />
        ) : (
          <LinkIcon className="h-icon text-slate-300" />
        )}
      </span>
      <span>{item.name}</span>
      {value === item.id && <CheckIcon className="ml-auto h-icon" />}
    </label>
  )
}

interface SpotifyArtistSelectProps {
  bandName: string
  value: string | null
  onChange: (event: string) => void
}

export const SpotifyArtistSelect = ({
  bandName,
  value,
  onChange,
}: SpotifyArtistSelectProps) => {
  const { data: searchResults } = useSpotifySearch(bandName)
  const selectedArtist = searchResults?.find(item => item.id === value)

  return (
    <Popover className="relative">
      <Popover.Button className="w-full px-4 pt-1 pb-3 rounded-lg border border-slate-500 text-left bg-slate-700 accent-slate-50">
        <span className="inline-block w-max mb-2 text-xs text-slate-300">Spotify-Verknüpfung</span>
        <span className='flex items-center gap-3'>
          {value !== '' && (
            <span className="relative flex-shrink-0 flex justify-center items-center w-10 h-10 rounded-lg bg-slate-800">
              {selectedArtist?.images && selectedArtist?.images[2] ? (
                <Image
                  src={selectedArtist.images[2].url}
                  alt={selectedArtist.name}
                  fill
                  sizes="150px"
                  className="object-cover rounded-lg"
                />
              ) : (
                <LinkIcon className="h-icon text-slate-300" />
              )}
            </span>
          )}
          <span>{value !== '' ? selectedArtist?.name : 'Keine Verknüpfung'}</span>
          <ChevronDownIcon className="h-icon ml-auto" />
        </span>
      </Popover.Button>
      <Popover.Overlay className="fixed md:hidden inset-0 bg-black opacity-30" />
      <Popover.Panel className="fixed md:absolute inset-8 md:inset-auto md:w-full md:max-h-72 md:mt-1 p-2 rounded-lg bg-slate-700 overflow-auto z-20">
        {({ close }) => {
          function handleChange(value: string) {
            onChange(value)
            close()
          }
          return (
            <>
              <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-600 focus-within:bg-slate-600">
                <input
                  type="radio"
                  checked={value === ''}
                  onChange={() => handleChange('')}
                  className="sr-only"
                />
                <span className="inline-flex items-center h-10">Keine Verknüpfung</span>
                {value === '' && <CheckIcon className="h-icon ml-auto" />}
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
