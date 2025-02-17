'use client'

import Link from 'next/link'
import { useSpotifyArtist } from '@/hooks/spotify/useSpotifyArtist'
import Image from 'next/image'
import { CalendarIcon } from 'lucide-react'
import { Tables } from '@/types/supabase'
import { useLocale } from 'next-intl'
import { Fragment } from 'react'
import { SpotifyArtist } from '@/types/types'

export function ConcertItem({
  concert,
}: {
  concert: Tables<'concerts'> & {
    festival_root: { name: string } | null
    bands: Tables<'bands'>[] | null
    location: Tables<'locations'> | null
  }
}) {
  const { data: spotifyArtist } = useSpotifyArtist(concert.bands?.[0]?.spotify_artist_id, {
    enabled: !concert.bands?.[0]?.spotify_artist_images,
  })
  const locale = useLocale()
  const image =
    (concert.bands?.[0]?.spotify_artist_images as SpotifyArtist['images'])?.[2] ||
    spotifyArtist?.images?.[2]
  const dateStart = new Date(concert.date_start)
  const dateEnd = concert.date_end ? new Date(concert.date_end) : null
  const isSameYear = dateStart.getFullYear() === dateEnd?.getFullYear()
  const concertDate = dateEnd
    ? `${dateStart.toLocaleDateString(locale, {
        day: 'numeric',
        month: 'numeric',
        year: isSameYear ? undefined : 'numeric',
      })} bis ${dateEnd.toLocaleDateString(locale)}`
    : dateStart.toLocaleDateString(locale)
  return (
    <Link href={`/concerts/${concert.id}`} className="flex gap-4 rounded-lg p-2 hover:bg-slate-700">
      <div className="relative grid size-15 flex-none place-content-center rounded-lg bg-slate-750">
        {image ? (
          <Image
            src={image.url}
            alt={concert.bands?.[0]?.name ?? ''}
            fill
            sizes="150px"
            unoptimized
            className="rounded-lg object-cover"
          />
        ) : (
          <CalendarIcon className="size-icon text-slate-300" />
        )}
      </div>
      <div className="grid content-start">
        {concert.festival_root && (
          <div className="line-clamp-1 justify-self-start rounded-md bg-white px-1 text-sm font-bold text-slate-850">
            {concert.festival_root.name} {dateStart.getFullYear()}
          </div>
        )}
        {concert.name && <div className="truncate text-sm font-bold">{concert.name}</div>}
        <div className="w-full truncate font-bold">
          {concert.bands?.map((band, index) => (
            <Fragment key={band.id}>
              {index !== 0 && <span className="text-slate-300"> &bull; </span>}
              {band.name}
            </Fragment>
          ))}
        </div>
        <div className="text-sm">{concertDate}</div>
        {!concert.festival_root && !concert.name && (
          <div className="truncate text-sm text-slate-300">
            {concert.location?.name}, {concert.location?.city}
          </div>
        )}
      </div>
    </Link>
  )
}
