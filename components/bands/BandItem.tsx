'use client'

import Link from 'next/link'
import { Band, SpotifyArtist } from '../../types/types'
import { useSpotifyArtist } from '@/hooks/spotify/useSpotifyArtist'
import Image from 'next/image'
import { GuitarIcon } from 'lucide-react'

export function BandItem({ band }: { band: Band }) {
  const { data: spotifyArtist } = useSpotifyArtist(band.spotify_artist_id, {
    enabled: !band.spotify_artist_images,
  })
  const image =
    (band.spotify_artist_images as SpotifyArtist['images'])?.at(-1) || spotifyArtist?.images?.[2]

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
            unoptimized
            className="rounded-lg object-cover"
          />
        ) : (
          <GuitarIcon className="size-icon text-slate-300" />
        )}
      </div>
      <div className="grid">
        <div className="truncate">{band.name}</div>
        <div className="truncate text-sm text-slate-300">
          {band.country?.iso2}
          {!!band.genres.length && ' | '}
          {band.genres?.map(item => item.name).join(' • ')}
        </div>
      </div>
    </Link>
  )
}
