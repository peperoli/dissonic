'use client'

import { TopGrid } from './TopGrid'
import { getUniqueObjects } from '@/lib/getUniqueObjects'
import { useTranslations } from 'next-intl'
import { ItemCount } from '@/lib/getCounts'
import { MapPin } from 'lucide-react'
import Link from 'next/link'
import { getAssetUrl } from '@/lib/getAssetUrl'
import Image from 'next/image'
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
      .select('*, concert:concerts(id, location:locations(*))')
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

export const LocationItem = ({ topItem }: { topItem: ItemCount & Tables<'locations'> }) => {
  const imageUrl = getAssetUrl('ressources', topItem.image, topItem.updated_at)
  const t = useTranslations('TopLocations')

  return (
    <Link href={`/locations/${topItem.id}`} className="block">
      <div className="relative flex aspect-square flex-shrink-0 items-center justify-center rounded-2xl bg-slate-750">
        {imageUrl ? (
          <Image src={imageUrl} alt={topItem.name} fill unoptimized className="rounded-lg object-cover" />
        ) : (
          <MapPin className="size-8 text-slate-300" />
        )}

      </div>
      <div className="mt-2 overflow-hidden">
        <h3 className="mb-0 truncate whitespace-nowrap text-base">{topItem.name}</h3>
        <div className="text-sm text-slate-300">{t('nTimesVisited', { count: topItem.count })}</div>
      </div>
    </Link>
  )
}

export function TopLocations({ profileId }: { profileId?: string }) {
  const { data: bandsSeen, status: bandsSeenStatus } = useQuery({
    queryKey: ['bandsSeenTopLocations', profileId],
    queryFn: () => fetchBandsSeen(profileId),
  })
  const t = useTranslations('TopLocations')
  const concertsSeen = getUniqueObjects(
    bandsSeen?.map(item => ({
      id: item.concert_id + item.user_id,
      ...item,
    })) ?? []
  )
    .map(item => item.concert)
    .filter(item => item !== null)

  if (bandsSeenStatus === 'pending') {
    return <p className="text-sm text-slate-300">{t('loading')}</p>
  }

  if (!bandsSeen || bandsSeen?.length === 0) {
    return null
  }

  return (
    <TopGrid
      headline={t('topLocations')}
      items={concertsSeen.map(item => item.location).filter(item => item !== null)}
      Item={LocationItem}
    />
  )
}
