'use client'

import { BarChart } from '../BarChart'
import { getUniqueObjects } from '@/lib/getUniqueObjects'
import { useLocale, useTranslations } from 'next-intl'
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
      .select('*, concert:concerts(id, date_start)')
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

export const ConcertsByWeekday = ({ profileId }: { profileId?: string }) => {
  const { data: bandsSeen } = useQuery({
    queryKey: ['bandsSeenConcertsByWeekday', profileId],
    queryFn: () => fetchBandsSeen(profileId),
  })
  const t = useTranslations('ConcertsByWeekday')
  const locale = useLocale()

  if (!bandsSeen || bandsSeen.length === 0) {
    return null
  }

  const concerts = getUniqueObjects(bandsSeen.map(band => band.concert))
  let concertsPerWeekday = Array.from({ length: 7 }, (_, day) => ({
    name: new Date(0, 0, day).toLocaleDateString(locale, { weekday: 'long' }),
    value: concerts.filter(concert => new Date(concert.date_start).getDay() === day).length,
  }))
  const sunday = concertsPerWeekday.slice(0, 1)
  const withoutSunday = concertsPerWeekday.slice(1)
  concertsPerWeekday = withoutSunday.concat(sunday)

  return (
    <div className="rounded-lg bg-slate-800 p-6">
      <h2>{t('concertsByWeekday')}</h2>
      <BarChart
        datasets={[
          {
            unit: 'nConcerts',
            color: 'venom',
            data: concertsPerWeekday,
          },
        ]}
        aspectRatio={2.5}
      />
    </div>
  )
}
