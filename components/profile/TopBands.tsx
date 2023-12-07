import clsx from 'clsx'
import Image from 'next/legacy/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import useMediaQuery from '../../hooks/useMediaQuery'
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
    <Link href={`/bands/${topBand.id}`} className="block">
      <div className="relative flex-shrink-0 flex justify-center items-center aspect-square rounded-2xl bg-slate-750">
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
      <div className="mt-2 overflow-hidden">
        <h3 className="mb-0 max-md:text-base whitespace-nowrap truncate">{topBand.name}</h3>
        <div className="text-slate-300 max-md:text-sm">{topBand.count} Konzerte</div>
      </div>
    </Link>
  )
}

type TopBandsProps = {
  bands: Band[]
}

export const TopBands = ({ bands }: TopBandsProps) => {
  const topBands: TopBand[] = []
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [visibleItems, setVisibleItems] = useState(9)

  useEffect(() => {
    if (isDesktop) {
      setVisibleItems(8)
    } else {
      setVisibleItems(9)
    }
  }, [isDesktop])

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

  function compare(a: TopBand, b: TopBand): number {
    if (a.count > b.count) {
      return -1
    } else if (a.count < b.count) {
      return 1
    } else {
      if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return 1
      } else if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1
      }
    }
    return 0
  }

  if (topBands.filter(item => item.count > 1).length > 0) {
    return (
      <div className="col-span-full p-6 rounded-lg bg-slate-800">
        <h2>Top Bands</h2>
        <div
          className={clsx(
            'grid grid-cols-3 md:grid-cols-4 gap-4 md:gap-6',
            totalCount >= 4 && 'mb-6'
          )}
        >
          {topBands
            .filter(item => item.count > 1)
            .sort(compare)
            .slice(0, visibleItems)
            .map(item => (
              <BandItem topBand={item} key={item.id} />
            ))}
        </div>
        {totalCount >= 4 && (
          <>
            {visibleItems < totalCount ? (
              <Button
                onClick={() => setVisibleItems(prev => (prev += isDesktop ? 8 : 9))}
                label="Mehr anzeigen"
              />
            ) : (
              <Button onClick={() => setVisibleItems(8)} label="Weniger anzeigen" />
            )}
          </>
        )}
      </div>
    )
  }

  return null
}
