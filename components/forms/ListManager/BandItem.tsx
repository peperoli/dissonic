import Image from 'next/image'
import { GuitarIcon } from 'lucide-react'
import { Band, ReorderableListItem, SpotifyArtist } from '../../../types/types'
import { useSpotifyArtist } from '@/hooks/spotify/useSpotifyArtist'

export function BandItem({ band }: { band: ReorderableListItem<Band> }) {
  const { data: spotifyArtist } = useSpotifyArtist(band.spotify_artist_id, {
    enabled: !band.spotify_artist_images,
  })
  const image =
    (band.spotify_artist_images as SpotifyArtist['images'])?.[2] || spotifyArtist?.images?.[2]

  return (
    <div className="flex w-full items-center gap-4">
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
      <div className="grid w-full">
        <div className="truncate">{band.name}</div>
        <div className="truncate text-sm text-slate-300">
          {band.country?.iso2}
          {!!band.genres.length && ' | '}
          {band.genres?.map(item => item.name).join(' • ')}
        </div>
      </div>
    </div>
  )
}
