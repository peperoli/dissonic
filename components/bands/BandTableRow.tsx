'use client'

import { TableRow } from '../TableRow'
import { Band, SpotifyArtist } from '../../types/types'
import { useSpotifyArtist } from '../../hooks/spotify/useSpotifyArtist'
import Image from 'next/image'
import { Guitar } from 'lucide-react'
import { useLocale } from 'next-intl'

type BandTableRowProps = {
  band: Band
}

export function BandTableRow({ band }: BandTableRowProps) {
  const { data } = useSpotifyArtist(band.spotify_artist_id, {
    enabled: !band.spotify_artist_images,
  })
  const locale = useLocale()
  const picture = (band.spotify_artist_images as SpotifyArtist['images'])?.[2] || data?.images?.[2]
  const regionNames = new Intl.DisplayNames(locale, { type: 'region' })
  return (
    <TableRow href={`/bands/${band.id}`}>
      <div className="relative flex size-11 flex-shrink-0 items-center justify-center rounded-lg bg-slate-750 md:size-12">
        {picture ? (
          <Image
            src={picture.url}
            alt={band.name}
            fill
            sizes="150px"
            unoptimized
            className="rounded-lg object-cover"
          />
        ) : (
          <Guitar className="size-icon text-slate-300" />
        )}
      </div>
      <div className="md:hidden">
        <div className="line-clamp-1">{band.name}</div>
        <div className="line-clamp-1 text-sm text-slate-300">
          {band.country?.iso2}
          {!!band.genres.length && ' | '}
          {band.genres?.map(item => item.name).join(' • ')}
        </div>
      </div>
      <div className="hidden w-full items-center gap-4 md:flex">
        <div className="w-1/3">{band.name}</div>
        {band.country && (
          <div className="w-1/3 text-slate-300">{regionNames.of(band.country.iso2)}</div>
        )}
        <div className="line-clamp-2 w-1/3 text-sm text-slate-300">
          {band.genres?.map(item => item.name).join(' • ')}
        </div>
      </div>
    </TableRow>
  )
}
