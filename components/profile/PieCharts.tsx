'use client'

import { useBandsSeen } from '@/hooks/bands/useBandsSeen'
import { PieChart } from './PieChart'
import { getUniqueObjects } from '@/lib/getUniqueObjects'

export function PieCharts({ profileId }: { profileId: string }) {
  const { data: bandsSeen, status: bandsSeenStatus } = useBandsSeen({ userId: profileId })
  const concertsSeen = getUniqueObjects(bandsSeen?.map(item => item.concert) ?? [])
  const uniqueBandsSeen = getUniqueObjects(bandsSeen?.map(item => item.band) ?? [])

  if (bandsSeenStatus === 'pending') {
    return <p className="text-sm text-slate-300">Lade ...</p>
  }

  if (!bandsSeen || bandsSeen?.length === 0) {
    return null
  }

  return (
    <section className="grid gap-4 rounded-lg bg-slate-800 p-4 md:grid-cols-2 md:p-6">
      <PieChart
        data={[
          {
            name: 'Konzerte',
            value: concertsSeen.filter(item => !item.is_festival).length,
          },
          {
            name: 'Festivals',
            value: concertsSeen.filter(item => item.is_festival).length,
          },
        ]}
      />
      <PieChart
        data={[
          { name: 'Einmal erlebte Bands', value: uniqueBandsSeen.length },
          {
            name: 'Mehrfach erlebte Bands',
            value: bandsSeen?.length - uniqueBandsSeen.length,
          },
        ]}
      />
    </section>
  )
}
