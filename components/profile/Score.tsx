'use client'

import { useBandsSeen } from '@/hooks/bands/useBandsSeen'
import { getUniqueObjects } from '@/lib/getUniqueObjects'
import { Tooltip } from '../shared/Tooltip'
import clsx from 'clsx'
import { Info, Loader2Icon } from 'lucide-react'
import { Tables } from '@/types/supabase'
import { useLocale, useTranslations } from 'next-intl'

const MONTH_MS = 1000 * 60 * 60 * 24 * 30.44

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
  const { data: bandsSeen, status: bandsSeenStatus } = useBandsSeen({ userId: profileId })
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
