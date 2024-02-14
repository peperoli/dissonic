'use client'

import { TableRow } from '../TableRow'
import { UserMusicIcon } from '../layout/UserMusicIcon'
import { Band } from '../../types/types'
import { useSpotifyArtist } from '../../hooks/spotify/useSpotifyArtist'
import Image from 'next/image'

type BandTableRowProps = {
  band: Band
}

export function BandTableRow({ band }: BandTableRowProps) {
  const { data } = useSpotifyArtist(band.spotify_artist_id)
  const picture = data?.images[2]
  const regionNames = new Intl.DisplayNames('de', { type: 'region' })
  return (
    <TableRow key={band.id} href={`/bands/${band.id}`}>
      <div className="relative flex-shrink-0 flex justify-center items-center w-10 h-10 rounded-lg bg-slate-750">
        {picture ? (
          <Image
            src={picture.url}
            alt={band.name}
            fill
            sizes="150px"
            className="object-cover rounded-lg"
          />
        ) : (
          <UserMusicIcon className="h-icon text-slate-300" />
        )}
      </div>
      <div className="md:flex items-center gap-4 w-full">
        <div className="md:w-1/3">{band.name}</div>
        {band.country && (
          <div className="md:w-1/3 text-slate-300">{regionNames.of(band.country.iso2)}</div>
        )}
        <div className="hidden md:block md:w-1/3 text-slate-300 whitespace-nowrap text-ellipsis overflow-hidden">
          {band.genres?.map(item => item.name).join(' • ')}
        </div>
      </div>
    </TableRow>
  )
}
