'use client'

import { ConcertStats as ConcertStatsComponent } from '@/components/concerts/ConcertStats'
import { useBandsSeen } from '@/hooks/bands/useBandsSeen'
import { getUniqueObjects } from '@/lib/getUniqueObjects'

export function ConcertStats({ profileId }: { profileId: string }) {
  const { data: bandsSeen } = useBandsSeen({ userId: profileId })
  const uniqueBandsSeen = getUniqueObjects(bandsSeen?.map(item => item.band) ?? [])

  return (
    <ConcertStatsComponent
      bands={bandsSeen?.map(item => item.band).filter(item => !!item) ?? []}
      uniqueBands={uniqueBandsSeen}
    />
  )
}
