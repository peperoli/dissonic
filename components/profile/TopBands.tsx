'use client'

import { useBandsSeen } from '@/hooks/bands/useBandsSeen'
import { useSpotifyArtist } from '@/hooks/spotify/useSpotifyArtist'
import { ItemCount } from '@/lib/getCounts'
import { Band } from '@/types/types'
import { Guitar } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/legacy/image'
import Link from 'next/link'
import { TopGrid } from './TopGrid'

const BandItem = ({ topItem }: { topItem: ItemCount & Band }) => {
  const { data: spotifyArtist } = useSpotifyArtist(topItem.spotify_artist_id)
  const t = useTranslations('TopBands')

  return (
    <Link href={`/bands/${topItem.id}`} className="block">
      <div className="relative flex aspect-square flex-shrink-0 items-center justify-center rounded-2xl bg-slate-750">
        {spotifyArtist?.images?.[1] ? (
          <Image
            src={spotifyArtist.images[1].url}
            alt={topItem.name}
            layout="fill"
            objectFit="cover"
            placeholder="blur"
            blurDataURL={spotifyArtist.images[2].url}
            className="rounded-2xl"
          />
        ) : (
          <Guitar className="h-8 text-slate-300" />
        )}
      </div>
      <div className="mt-2 overflow-hidden">
        <h3 className="mb-0 truncate whitespace-nowrap text-base">{topItem.name}</h3>
        <div className="text-sm text-slate-300">{t('nTimesSeen', { count: topItem.count })}</div>
      </div>
    </Link>
  )
}

export function TopBands({ profileId }: { profileId?: string }) {
  const { data: bandsSeen, status: bandsSeenStatus } = useBandsSeen({ userId: profileId })
  const t = useTranslations('TopBands')

  if (bandsSeenStatus === 'pending') {
    return <p className="text-sm text-slate-300">{t('loading')}</p>
  }

  if (!bandsSeen || bandsSeen?.length === 0) {
    return null
  }

  return (
    <TopGrid
      headline={t('topBands')}
      items={bandsSeen.map(item => item.band).filter(item => !!item)}
      Item={BandItem}
    />
  )
}
