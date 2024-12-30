'use client'

import { useBandsSeen } from '@/hooks/bands/useBandsSeen'
import { PieChart } from './PieChart'
import { getUniqueObjects } from '@/lib/getUniqueObjects'
import { useTranslations } from 'next-intl'

export function PieCharts({ profileId }: { profileId?: string }) {
  const { data: bandsSeen, status: bandsSeenStatus } = useBandsSeen({ userId: profileId })
  const t = useTranslations('PieCharts')
  const concertsSeen = getUniqueObjects(bandsSeen?.map(item => item.concert) ?? [])
  const uniqueBandsSeen = getUniqueObjects(bandsSeen?.map(item => item.band) ?? [])

  if (bandsSeenStatus === 'pending') {
    return <p className="text-sm text-slate-300">Lade ...</p>
  }

  if (!bandsSeen || bandsSeen?.length === 0) {
    return null
  }

  return (
    <section className="grid gap-4 rounded-lg bg-slate-800 p-4 md:p-6">
      <PieChart
        data={[
          {
            name: t('concerts'),
            value: concertsSeen.filter(item => !item.is_festival).length,
          },
          {
            name: t('festivals'),
            value: concertsSeen.filter(item => item.is_festival).length,
          },
        ]}
      />
      <PieChart
        data={[
          { name: t('bandsSeenOnce'), value: uniqueBandsSeen.length },
          {
            name: t('bandsSeenMultipleTimes'),
            value: bandsSeen?.length - uniqueBandsSeen.length,
          },
        ]}
      />
    </section>
  )
}
