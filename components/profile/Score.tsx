'use client'

import { useBandsSeen } from '@/hooks/bands/useBandsSeen'
import { getUniqueObjects } from '@/lib/getUniqueObjects'
import * as Tooltip from '@radix-ui/react-tooltip'
import clsx from 'clsx'
import { Info, Loader2Icon } from 'lucide-react'
import { Concert } from '../../types/types'

const MONTH_MS = 1000 * 60 * 60 * 24 * 30.44

function getLongestStreak(concerts: Concert[]) {
  const sortedConcerts = concerts.sort(
    (a, b) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime()
  )
  const streaks: { start: Date; end: Date }[] = []
  for (let i = 0; i < sortedConcerts.length; i++) {
    const date = new Date(sortedConcerts[i].date_start)
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

export function Score({ profileId }: { profileId: string }) {
  const { data: bandsSeen, status: bandsSeenStatus } = useBandsSeen(profileId)
  const uniqueBandsSeen = getUniqueObjects(bandsSeen?.map(item => item.band) ?? [])
  const concertsSeen = getUniqueObjects(bandsSeen?.map(item => item.concert) ?? [])
  const festivalsSeen = concertsSeen.filter(item => item.is_festival)
  const streak = getLongestStreak(concertsSeen)

  if (bandsSeenStatus === 'pending') {
    return (
      <div className="grid h-24 w-full animate-pulse place-content-center rounded-lg bg-slate-800">
        <Loader2Icon className="size-icon animate-spin" />
      </div>
    )
  }

  return (
    <section
      className={clsx(
        'mb-4 grid gap-4',
        festivalsSeen.length > 0 ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-3'
      )}
    >
      <h2 className="sr-only">Score</h2>
      <div className="rounded-lg bg-radial-gradient from-venom/50 px-2 py-6 text-center">
        <div className="text-[1.75rem] font-bold leading-none">{uniqueBandsSeen.length}</div>
        Bands
      </div>
      <div className="rounded-lg bg-radial-gradient from-blue/50 px-2 py-6 text-center">
        <div className="text-[1.75rem] font-bold leading-none">
          {concertsSeen.filter(item => !item.is_festival).length}
        </div>
        Konzerte
      </div>
      {festivalsSeen.length > 0 && (
        <div className="rounded-lg bg-radial-gradient from-purple/50 px-2 py-6 text-center">
          <div className="text-[1.75rem] font-bold leading-none">{festivalsSeen.length}</div>
          Festivals
        </div>
      )}
      {streak && (
        <div className="rounded-lg bg-radial-gradient from-slate-500/50 px-2 py-6 text-center">
          <div className="text-[1.75rem] font-bold leading-none">
            {Math.ceil(streak.diff / MONTH_MS + 1)}
          </div>
          <div className="flex justify-center gap-1">
            längste Serie
            <Tooltip.Root>
              <Tooltip.Trigger>
                <Info className="size-4" />
              </Tooltip.Trigger>
              <Tooltip.Content className="z-10 rounded-lg border border-slate-800 bg-slate-900 p-2 text-sm shadow-lg">
                {streak.start.toLocaleDateString('de-CH', { month: 'long', year: 'numeric' })} bis{' '}
                {streak.end.toLocaleDateString('de-CH', { month: 'long', year: 'numeric' })}
                <br />
                Mindestens ein Konzert pro Monat
              </Tooltip.Content>
            </Tooltip.Root>
          </div>
        </div>
      )}
    </section>
  )
}
