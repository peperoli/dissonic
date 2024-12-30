'use client'

import { useBandsSeen } from '@/hooks/bands/useBandsSeen'
import { TopGrid } from './TopGrid'
import { getUniqueObjects } from '@/lib/getUniqueObjects'
import { useTranslations } from 'next-intl'
import { ItemCount } from '@/lib/getCounts'
import { Location } from '@/types/types'
import { MapPin } from 'lucide-react'
import Link from 'next/link'

export const LocationItem = ({ topItem }: { topItem: ItemCount & Location }) => {
  const t = useTranslations('TopLocations')

  return (
    <Link href={`/locations/${topItem.id}`} className="block">
      <div className="relative flex aspect-square flex-shrink-0 items-center justify-center rounded-2xl bg-slate-750">
        <MapPin className="size-8 text-slate-300" />
      </div>
      <div className="mt-2 overflow-hidden">
        <h3 className="mb-0 truncate whitespace-nowrap text-base">{topItem.name}</h3>
        <div className="text-sm text-slate-300">{t('nTimesVisited', { count: topItem.count })}</div>
      </div>
    </Link>
  )
}

export function TopLocations({ profileId }: { profileId?: string }) {
  const { data: bandsSeen, status: bandsSeenStatus } = useBandsSeen({ userId: profileId })
  const t = useTranslations('TopLocations')
  const concertsSeen = getUniqueObjects(bandsSeen?.map(item => item.concert) ?? [])

  if (bandsSeenStatus === 'pending') {
    return <p className="text-sm text-slate-300">{t('loading')}</p>
  }

  if (!bandsSeen || bandsSeen?.length === 0) {
    return null
  }

  return (
    <TopGrid
      headline={t('topLocations')}
      items={concertsSeen.map(item => item.location).filter(item => !!item)}
      Item={LocationItem}
    />
  )
}
