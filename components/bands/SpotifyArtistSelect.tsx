import React, { Dispatch, FC, SetStateAction } from 'react'
import * as Select from '@radix-ui/react-select'
import { useSpotifySearch } from '../../hooks/useSpotifySearch'
import { CheckIcon, ChevronDownIcon, LinkIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'

interface SpotifyArtistSelectProps {
  bandName: string
  value: string
  onValueChange: Dispatch<SetStateAction<string>>
}

export const SpotifyArtistSelect: FC<SpotifyArtistSelectProps> = ({
  bandName,
  value,
  onValueChange,
}) => {
  const { data: searchResults } = useSpotifySearch(bandName)
  const selectedArtist = searchResults?.find(item => item.id === value)
  return (
    <div>
      <label className="block mb-1 text-xs text-slate-300">Spotify-Verknüpfung</label>
      <Select.Root value={value} onValueChange={onValueChange}>
        <Select.Trigger className="flex items-center gap-3 w-full px-4 pt-3 pb-3 rounded-lg border border-slate-500 bg-slate-700 accent-slate-50">
          {value !== '' && (
            <div className="relative flex-shrink-0 flex justify-center items-center w-10 h-10 rounded-lg bg-slate-800">
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
            </div>
          )}
          <Select.Value placeholder="Bitte Künstler wählen ..." aria-label={value}>
            {value !== '' ? selectedArtist?.name : 'Keine Verknüpfung'}
          </Select.Value>
          <Select.Icon className="ml-auto">
            <ChevronDownIcon className="h-icon" />
          </Select.Icon>
        </Select.Trigger>
        <Select.Content className="w-full max-h-72 mt-1 p-2 rounded-lg bg-slate-700 overflow-auto z-10">
          <Select.Item
            value=""
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-600"
          >
            <Select.ItemText>Keine Verknüpfung</Select.ItemText>
            <Select.ItemIndicator className="ml-auto">
              <CheckIcon className="h-icon" />
            </Select.ItemIndicator>
          </Select.Item>
          {searchResults?.map(item => (
            <Select.Item
              key={item.id}
              value={item.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-600"
            >
              <div className="relative flex-shrink-0 flex justify-center items-center w-10 h-10 rounded-lg bg-slate-800">
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
              </div>
              <Select.ItemText>{item.name}</Select.ItemText>
              <Select.ItemIndicator className="ml-auto">
                <CheckIcon className="h-icon" />
              </Select.ItemIndicator>
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </div>
  )
}
