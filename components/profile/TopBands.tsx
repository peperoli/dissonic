'use client'

import { useSpotifyArtist } from '@/hooks/spotify/useSpotifyArtist'
import { ItemCount } from '@/lib/getCounts'
import { SpotifyArtist } from '@/types/types'
import { Guitar } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { TopGrid } from './TopGrid'
import supabase from '@/utils/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Tables } from '@/types/supabase'

async function fetchBandsSeen(profileId?: string) {
  let countQuery = supabase.from('j_bands_seen').select('*', { count: 'estimated', head: true })

  if (profileId) {
    countQuery = countQuery.eq('user_id', profileId)
  }

  const { count } = await countQuery
  const perPage = 1000
  const maxPage = count ? Math.ceil(count / perPage) : 1
  const queries = []

  for (let page = 1; page <= maxPage; page++) {
    let query = supabase
      .from('j_bands_seen')
      .select('*, band:bands(*)')
      .range((page - 1) * perPage, page * perPage - 1)

    if (profileId) {
      query = query.eq('user_id', profileId)
    }

    queries.push(query)
  }

  const responses = await Promise.all(queries)

  if (responses.some(({ error }) => error)) {
    throw responses.find(({ error }) => error)
  }

  return responses.flatMap(({ data }) => data).filter(bandSeen => bandSeen !== null)
}

const BandItem = ({ topItem }: { topItem: ItemCount & Tables<'bands'> }) => {
  const { data: spotifyArtist } = useSpotifyArtist(topItem.spotify_artist_id, {
    enabled: !topItem.spotify_artist_images,
  })
  const t = useTranslations('TopBands')
  const image =
    (topItem.spotify_artist_images as SpotifyArtist['images'])?.[1] || spotifyArtist?.images?.[1]

  return (
    <Link href={`/bands/${topItem.id}`} className="block">
      <div className="relative flex aspect-square flex-shrink-0 items-center justify-center rounded-2xl bg-slate-750">
        {image ? (
          <Image
            src={image.url}
            alt={topItem.name}
            fill
            unoptimized
            className="rounded-2xl object-cover"
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
  const { data: bandsSeen, status: bandsSeenStatus } = useQuery({
    queryKey: ['bandsSeenTopBands', profileId],
    queryFn: () => fetchBandsSeen(profileId),
  })
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
