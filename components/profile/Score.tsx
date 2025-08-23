'use client'

import { Tooltip } from '../shared/Tooltip'
import clsx from 'clsx'
import { Info, Loader2Icon } from 'lucide-react'
import { Tables } from '@/types/supabase'
import { useLocale, useTranslations } from 'next-intl'
import { useQuery } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'

const MONTH_MS = 1000 * 60 * 60 * 24 * 30.44

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

function getLongestStreak(concerts: Tables<'concerts'>['date_start'][]) {
  const sortedConcerts = concerts.sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
  const streaks: { start: Date; end: Date }[] = []
  for (let i = 0; i < sortedConcerts.length; i++) {
    const date = new Date(sortedConcerts[i])
    const matchingStreak = streaks.find(
      streak =>
        (streak.end.getFullYear() === date.getFullYear() &&
          streak.end.getMonth() + 1 === date.getMonth()) ||
        (streak.end.getFullYear() + 1 === date.getFullYear() &&
          streak.end.getMonth() === 11 &&
          date.getMonth() === 0)
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

  return streaks.length > 0
    ? streaks
        .map(streak => ({ ...streak, diff: streak.end.getTime() - streak.start.getTime() }))
        .sort((a, b) => b.diff - a.diff)[0]
    : null
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
  const locationsSeen = new Set(bandsSeen?.map(item => item.concert?.location_id))
  const streak = getLongestStreak(
    Array.from(new Set(bandsSeen?.map(item => item.concert?.date_start ?? '')))
  )

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
          <div className="text-[1.75rem] font-bold leading-none">
            {Math.ceil(streak.diff / MONTH_MS + 1)}
          </div>
          <div className="flex justify-center gap-1">
            <span className="truncate">{t('longestStreak')}</span>
            <Tooltip
              content={
                <>
                  {t('dToD', {
                    startDate: streak.start.toLocaleDateString(locale, {
                      month: 'long',
                      year: 'numeric',
                    }),
                    endDate: streak.end.toLocaleDateString(locale, {
                      month: 'long',
                      year: 'numeric',
                    }),
                  })}
                  <br />
                  {t('minOneConcertPerMonth')}
                </>
              }
              triggerOnClick
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
