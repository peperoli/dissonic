'use client'

import { BarChart } from '../BarChart'
import { useBandsSeen } from '@/hooks/bands/useBandsSeen'
import { getUniqueObjects } from '@/lib/getUniqueObjects'
import { useLocale, useTranslations } from 'next-intl'

type ConcertsByWeekdayProps = {
  profileId: string
}

export const ConcertsByWeekday = ({ profileId }: ConcertsByWeekdayProps) => {
  const { data: bandsSeen } = useBandsSeen({ userId: profileId })
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
