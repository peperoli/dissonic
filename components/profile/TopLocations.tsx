'use client'

import { useBandsSeen } from '@/hooks/bands/useBandsSeen'
import { TopGrid } from './TopGrid'
import { LocationItem } from './LocationItem'
import { getUniqueObjects } from '@/lib/getUniqueObjects'

export function TopLocations({ profileId }: { profileId: string }) {
  const { data: bandsSeen, status: bandsSeenStatus } = useBandsSeen(profileId)
  const concertsSeen = getUniqueObjects(bandsSeen?.map(item => item.concert) ?? [])

  if (bandsSeenStatus === 'pending') {
    return <p className="text-sm text-slate-300">Lade ...</p>
  }

  if (!bandsSeen || bandsSeen?.length === 0) {
    return null
  }

  return (
    <TopGrid
      headline="Top Locations"
      items={concertsSeen.map(item => item.location).filter(item => !!item)}
      Item={LocationItem}
    />
  )
}
