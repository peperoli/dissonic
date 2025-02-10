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
    <TableRow key={band.id} href={`/bands/${band.id}`}>
      <div className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-slate-750">
        {picture ? (
          <Image
            src={picture.url}
            alt={band.name}
            fill
            sizes="150px"
            className="rounded-lg object-cover"
          />
        ) : (
          <Guitar className="size-icon text-slate-300" />
        )}
      </div>
      <div className="w-full items-center gap-4 md:flex">
        <div className="md:w-1/3">{band.name}</div>
        {band.country && (
          <div className="text-slate-300 md:w-1/3">{regionNames.of(band.country.iso2)}</div>
        )}
        <div className="line-clamp-2 hidden text-sm text-slate-300 md:w-1/3 md:[display:-webkit-box]">
          {band.genres?.map(item => item.name).join(' • ')}
        </div>
      </div>
    </TableRow>
  )
}
