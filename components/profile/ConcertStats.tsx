'use client'

import { ConcertStats as ConcertStatsComponent } from '@/components/concerts/ConcertStats'
import { getUniqueObjects } from '@/lib/getUniqueObjects'
import { useTranslations } from 'next-intl'

import supabase from '@/utils/supabase/client'
import { useQuery } from '@tanstack/react-query'

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
      .select('*, band:bands(*, country:countries(id, iso2), genres(*))')
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

export function ConcertStats({ profileId }: { profileId?: string }) {
  const { data: bandsSeen, status: bandsSeenStatus } = useQuery({
    queryKey: ['bandsSeenConcertStats', profileId],
    queryFn: () => fetchBandsSeen(profileId),
  })
  const t = useTranslations('ConcertStats')
  const uniqueBandsSeen = getUniqueObjects(bandsSeen?.map(item => item.band) ?? [])

  if (bandsSeenStatus === 'pending') {
    return <p className="text-sm text-slate-300">{t('loading')}</p>
  }

  return (
    <ConcertStatsComponent
      bands={bandsSeen?.map(item => item.band).filter(item => !!item) ?? []}
      uniqueBands={uniqueBandsSeen}
    />
  )
}
