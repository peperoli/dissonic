'use client'

import Link from 'next/link'
import { useSpotifyArtist } from '@/hooks/spotify/useSpotifyArtist'
import Image from 'next/image'
import { CalendarIcon } from 'lucide-react'
import { Tables } from '@/types/supabase'

export function ConcertItem({
  concert,
}: {
  concert: Tables<'concerts'> & {
    festival_root: { name: string } | null
    bands: Tables<'bands'>[] | null
    location: Tables<'locations'> | null
  }
}) {
  const { data: spotifyArtist } = useSpotifyArtist(concert.bands?.[0]?.spotify_artist_id)
  const dateStart = new Date(concert.date_start)
  const dateEnd = concert.date_end ? new Date(concert.date_end) : null
  const isSameYear = dateStart.getFullYear() === dateEnd?.getFullYear()
  const concertDate = dateEnd
    ? `${dateStart.toLocaleDateString('de-CH', {
        day: 'numeric',
        month: 'numeric',
        year: isSameYear ? undefined : 'numeric',
      })} bis ${dateEnd.toLocaleDateString()}`
    : dateStart.toLocaleDateString()
  return (
    <Link href={`/concerts/${concert.id}`} className="flex gap-4 rounded-lg p-2 hover:bg-slate-700">
      <div className="relative grid size-16 flex-none place-content-center rounded-lg bg-slate-750">
        {spotifyArtist?.images[2] ? (
          <Image
            src={spotifyArtist?.images[2].url}
            alt={concert.bands?.[0]?.name ?? ''}
            fill
            sizes="150px"
            className="rounded-lg object-cover"
          />
        ) : (
          <CalendarIcon className="size-icon text-slate-300" />
        )}
      </div>
      <div className="grid">
        <div className="w-full truncate font-bold">
          {concert.festival_root?.name ||
            concert.name ||
            concert.bands
              ?.slice(0, 3)
              .map(band => band.name)
              .join(', ')}
        </div>
        <div className="text-sm">{concertDate}</div>
        <div className="truncate text-sm text-slate-300">
          {concert.location?.name}, {concert.location?.city}
        </div>
      </div>
    </Link>
  )
}
