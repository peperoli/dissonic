'use client'

import { Tooltip } from '../shared/Tooltip'
import clsx from 'clsx'
import { Info, Loader2Icon } from 'lucide-react'
import { Tables } from '@/types/supabase'
import { useLocale, useTranslations } from 'next-intl'
import { useQuery } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'
import { Temporal } from '@js-temporal/polyfill'
import { getYearMonth } from '@/lib/date'

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
      .select('*, concert:concerts(date_start, location_id)')
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

function getLongestStreak(concertDates: Tables<'concerts'>['date_start'][]) {
  const sortedConcertDates = Array.from(
    new Set(concertDates.map(date => Temporal.PlainYearMonth.from(date).toString()))
  ).sort((a, b) => Temporal.PlainYearMonth.compare(a, b))
  const streaks: { start: Temporal.PlainYearMonth; end: Temporal.PlainYearMonth }[] = []
  for (let i = 0; i < sortedConcertDates.length; i++) {
    const date = Temporal.PlainYearMonth.from(sortedConcertDates[i])
    const matchingStreak = streaks.find(
      streak =>
        (streak.end.year === date.year && streak.end.month + 1 === date.month) ||
        (streak.end.year + 1 === date.year && streak.end.month === 12 && date.month === 1)
    )

    if (matchingStreak) {
      matchingStreak.end = date
    } else {
      streaks.push({
        start: date,
        end: date,
      })
    }
  }

  return streaks
    .map(streak => ({
      ...streak,
      diff: streak.end
        .since(streak.start)
        .total({ unit: 'months', relativeTo: streak.start.toString() + '-01' }),
    }))
    .sort((a, b) => b.diff - a.diff)
    .at(0)
}

export function Score({ profileId }: { profileId?: string }) {
  const { data: bandsSeen, status: bandsSeenStatus } = useQuery({
    queryKey: ['bandsSeenScore', profileId],
    queryFn: () => fetchBandsSeen(profileId),
  })
  const t = useTranslations('Score')
  const locale = useLocale()
  const uniqueBandsSeen = new Set(bandsSeen?.map(item => item.band_id))
  const concertsSeen = new Set(bandsSeen?.map(item => item.concert_id))
  const locationsSeen = new Set(bandsSeen?.map(item => item.concert.location_id))
  const streak = getLongestStreak(bandsSeen?.map(item => item.concert.date_start) ?? [])

  if (bandsSeenStatus === 'pending') {
    return (
      <div className="grid h-24 w-full animate-pulse place-content-center rounded-lg bg-slate-800">
        <Loader2Icon className="size-icon animate-spin" />
      </div>
    )
  }

  return (
    <section
      className={clsx('mb-4 grid gap-4', true ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-3')}
    >
      <h2 className="sr-only">{t('score')}</h2>
      <div className="rounded-lg bg-radial-gradient from-venom/50 px-2 py-6 text-center">
        <div className="text-[1.75rem] font-bold leading-none">{concertsSeen.size}</div>
        {t('concerts')}
      </div>
      <div className="rounded-lg bg-radial-gradient from-blue/50 px-2 py-6 text-center">
        <div className="text-[1.75rem] font-bold leading-none">{uniqueBandsSeen.size}</div>
        {t('bands')}
      </div>
      <div className="rounded-lg bg-radial-gradient from-purple/50 px-2 py-6 text-center">
        <div className="text-[1.75rem] font-bold leading-none">{locationsSeen.size}</div>
        {t('locations')}
      </div>
      {streak && (
        <div className="rounded-lg bg-radial-gradient from-slate-500/50 px-2 py-6 text-center">
          <div className="text-[1.75rem] font-bold leading-none">{Math.ceil(streak.diff) + 1}</div>
          <div className="flex justify-center gap-1">
            <span className="truncate">{t('longestStreak')}</span>
            <Tooltip
              content={
                <>
                  {t('dToD', {
                    startDate: getYearMonth(streak.start, locale),
                    endDate: getYearMonth(streak.end, locale),
                  })}
                  <br />
                  {t('minOneConcertPerMonth')}
                </>
              }
              shouldToggleOnClick
            >
              <button>
                <Info className="size-4" />
              </button>
            </Tooltip>
          </div>
        </div>
      )}
    </section>
  )
}
