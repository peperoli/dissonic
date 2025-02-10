'use client'

import Link from 'next/link'
import { Band, SpotifyArtist } from '../../types/types'
import { useSpotifyArtist } from '@/hooks/spotify/useSpotifyArtist'
import Image from 'next/image'
import { GuitarIcon } from 'lucide-react'
import { useLocale } from 'next-intl'

export function BandItem({ band }: { band: Band }) {
  const { data: spotifyArtist } = useSpotifyArtist(band.spotify_artist_id, {
    enabled: !band.spotify_artist_images,
  })
  const locale = useLocale()
  const image =
    (band.spotify_artist_images as SpotifyArtist['images'])?.[2] || spotifyArtist?.images?.[2]
  const regionNames = new Intl.DisplayNames(locale, { type: 'region' })

  return (
    <Link
      href={`/bands/${band.id}`}
      className="flex gap-4 rounded-lg p-2 text-left hover:bg-slate-700"
    >
      <div className="relative grid h-11 w-11 flex-none place-content-center rounded-lg bg-slate-750">
        {image ? (
          <Image
            src={image.url}
            alt={band.name}
            fill
            sizes="150px"
            className="rounded-lg object-cover"
          />
        ) : (
          <GuitarIcon className="size-icon text-slate-300" />
        )}
      </div>
      <div className="grid">
        <div className="truncate">{band.name}</div>
        {band.country?.iso2 && (
          <div className="text-sm text-slate-300">{regionNames.of(band.country.iso2)}</div>
        )}
      </div>
    </Link>
  )
}
