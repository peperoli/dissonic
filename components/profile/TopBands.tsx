'use client'

import { useBandsSeen } from '@/hooks/bands/useBandsSeen'
import { TopGrid } from './TopGrid'
import { BandItem } from './BandItem'

export function TopBands({ profileId }: { profileId: string }) {
  const { data: bandsSeen, status: bandsSeenStatus } = useBandsSeen(profileId)

  if (bandsSeenStatus === 'pending') {
    return <p className="text-sm text-slate-300">Lade ...</p>
  }

  if (!bandsSeen || bandsSeen?.length === 0) {
    return null
  }

  return (
    <TopGrid
      headline="Top Bands"
      items={bandsSeen.map(item => item.band).filter(item => !!item)}
      Item={BandItem}
    />
  )
}
