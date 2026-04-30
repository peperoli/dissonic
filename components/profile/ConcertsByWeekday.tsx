'use client'

import { BarChart } from '../BarChart'
import { getUniqueObjects } from '@/lib/getUniqueObjects'
import { useLocale, useTranslations } from 'next-intl'
import supabase from '@/utils/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Temporal } from '@js-temporal/polyfill'

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

  if (!bandsSeen || bandsSeen.length === 0) {
    return null
  }

  const concerts = getUniqueObjects(bandsSeen.map(band => band.concert))
  const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const concertsPerWeekday = weekdays.map((day, index) => ({
    name: t(day),
    value: concerts.filter(
      concert => Temporal.PlainDate.from(concert.date_start).dayOfWeek === index + 1
    ).length,
  }))

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
