import { useSpotifySearch } from '../../hooks/spotify/useSpotifySearch'
import Image from 'next/image'
import { SpotifyArtist } from '../../types/types'
import { Popover } from '../shared/Popover'
import { Check, ChevronDown, LinkIcon } from 'lucide-react'
import { Button } from '../Button'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useSpotifyArtist } from '@/hooks/spotify/useSpotifyArtist'

interface SelectItemProps {
  item: SpotifyArtist
  value: SpotifyArtist | null
  handleChange: (value: SpotifyArtist | null) => void
}

const SelectItem = ({ item, value, handleChange }: SelectItemProps) => {
  const t = useTranslations('SpotifyArtistSelect')

  return (
    <label className="flex w-full items-center gap-3 rounded-lg p-2 focus-within:bg-slate-600 hover:bg-slate-600">
      <input
        type="radio"
        checked={value?.id === item.id}
        onChange={() => handleChange(item)}
        className="sr-only"
      />
      <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-slate-800">
        {item.images && item.images[2] ? (
          <Image
            src={item.images[2].url}
            alt={item.name}
            fill
            sizes="150px"
            unoptimized
            className="rounded-lg object-cover"
          />
        ) : (
          <LinkIcon className="size-icon text-slate-300" />
        )}
      </div>
      <div className="grid">
        <div>{item.name}</div>
        <div className="truncate text-sm text-slate-300">
          {t('nFollowers', { count: item.followers.total })}
          {item.genres.length > 0 && <> &bull; {item.genres.join(', ')}</>}
        </div>
      </div>
      {value?.id === item.id && <Check className="ml-auto size-icon" />}
    </label>
  )
}

interface SpotifyArtistSelectProps {
  bandName: string
  value: SpotifyArtist | null
  onChange: (event: SpotifyArtist | null) => void
}

export const SpotifyArtistSelect = ({ bandName, value, onChange }: SpotifyArtistSelectProps) => {
  const [limit, setLimit] = useState(10)
  const { data: searchResults, isLoading } = useSpotifySearch(bandName, { limit })
  const t = useTranslations('SpotifyArtistSelect')
  const { data: selectedArtist } = useSpotifyArtist(value?.id ?? null)

  useEffect(() => {
    if (selectedArtist) {
      onChange(selectedArtist)
    }
  }, [value])

  return (
    <Popover.Root>
      <Popover.Trigger className="w-full rounded-lg border border-slate-500 bg-slate-750 px-4 pb-3 pt-1 text-left accent-white">
        <span className="mb-2 inline-block w-max text-xs text-slate-300">{t('spotifyLink')}</span>
        <span className="flex items-center gap-3">
          {value !== null && (
            <span className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-slate-800">
              {selectedArtist?.images && selectedArtist?.images[2] ? (
                <Image
                  src={selectedArtist.images[2].url}
                  alt={selectedArtist.name}
                  fill
                  sizes="150px"
                  unoptimized
                  className="rounded-lg object-cover"
                />
              ) : (
                <LinkIcon className="size-icon text-slate-300" />
              )}
            </span>
          )}
          <span>{value !== null ? selectedArtist?.name : t('noLink')}</span>
          <ChevronDown className="ml-auto size-icon" />
        </span>
      </Popover.Trigger>
      <Popover.Content className="fixed inset-8 z-20 overflow-auto rounded-lg bg-slate-700 p-2 md:absolute md:inset-auto md:mt-1 md:max-h-72 md:w-full">
        {({ close }) => {
          function handleChange(value: SpotifyArtist | null) {
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
                <span className="inline-flex h-10 items-center">{t('noLink')}</span>
                {value === null && <Check className="ml-auto size-icon" />}
              </label>
              {searchResults?.map(item => (
                <SelectItem key={item.id} item={item} value={value} handleChange={handleChange} />
              ))}
              <div className="mt-2 flex justify-center">
                {!!searchResults?.length && (
                  <Button
                    onClick={() => setLimit(prev => prev + 10)}
                    label={t('showMore')}
                    size="small"
                    appearance="primary"
                    loading={isLoading}
                    disabled={limit >= 50}
                  />
                )}
              </div>
            </>
          )
        }}
      </Popover.Content>
    </Popover.Root>
  )
}
