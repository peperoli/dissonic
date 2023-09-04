import Image from 'next/legacy/image'
import Link from 'next/link'
import { useState } from 'react'
import { useSpotifyArtist } from '../../hooks/useSpotifyArtist'
import { Band } from '../../types/types'
import { Button } from '../Button'
import { UserMusicIcon } from '../layout/UserMusicIcon'

type TopBand = {
  readonly id: number
  name: string
  spotify_artist_id: string | null
  count: number
}

type BandItemProps = {
  topBand: TopBand
}

const BandItem = ({ topBand }: BandItemProps) => {
  const { data } = useSpotifyArtist(topBand.spotify_artist_id)
  const picture = data?.images[1]
  return (
    <Link href={`/bands/${topBand.id}`} className="flex gap-4 md:block">
      <div className="relative flex-shrink-0 flex justify-center items-center w-15 h-15 md:w-auto md:h-auto md:aspect-square rounded-2xl bg-slate-750">
        {picture ? (
          <Image
            src={picture.url}
            alt={topBand.name}
            layout="fill"
            objectFit="cover"
            placeholder="blur"
            blurDataURL={data?.images[2].url}
            className="rounded-2xl"
          />
        ) : (
          <UserMusicIcon className="h-8 text-slate-300" />
        )}
      </div>
      <div className="mt-2">
        <h3 className="mb-0">{topBand.name}</h3>
        <div className="text-slate-300">{topBand.count} Konzerte</div>
      </div>
    </Link>
  )
}

type TopBandsProps = {
  bands: Band[]
}

export const TopBands = ({ bands }: TopBandsProps) => {
  const topBands: TopBand[] = []
  const [visibleItems, setVisibleItems] = useState(8)

  bands.forEach(band => {
    let topBand = topBands.find(item => item.id === band.id)
    if (!topBand) {
      topBands.push({
        id: band.id,
        name: band.name,
        spotify_artist_id: band.spotify_artist_id,
        count: 1,
      })
    } else if (topBand?.count) {
      topBand.count += 1
    }
  })

  const totalCount = topBands.filter(item => item.count > 1).length

  function compare(a: { count: number }, b: { count: number }): number {
    let comparison = 0
    if (a.count > b.count) {
      comparison = -1
    } else if (a.count < b.count) {
      comparison = 1
    }
    return comparison
  }

  if (topBands.filter(item => item.count > 1).length > 0) {
    return (
      <div className="col-span-full p-6 rounded-lg bg-slate-800">
        <h2>Top Bands</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-6">
          {topBands
            .filter(item => item.count > 1)
            .sort(compare)
            .slice(0, visibleItems)
            .map(item => (
              <BandItem topBand={item} key={item.id} />
            ))}
        </div>
        {visibleItems < totalCount ? (
          <Button onClick={() => setVisibleItems(prev => (prev += 8))} label="Mehr anzeigen" />
        ) : (
          <Button onClick={() => setVisibleItems(8)} label="Weniger anzeigen" />
        )}
      </div>
    )
  }

  return null
}
