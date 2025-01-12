'use client'

import { ConcertStats as ConcertStatsComponent } from '@/components/concerts/ConcertStats'
import { useBandsSeen } from '@/hooks/bands/useBandsSeen'
import { getUniqueObjects } from '@/lib/getUniqueObjects'
import { useTranslations } from 'next-intl'

export function ConcertStats({ profileId }: { profileId?: string }) {
  const { data: bandsSeen, status: bandsSeenStatus } = useBandsSeen({ userId: profileId })
  const t = useTranslations('ConcertStats')
  const uniqueBandsSeen = getUniqueObjects(bandsSeen?.map(item => item.band) ?? [])

  if (bandsSeenStatus === 'pending') {
    return <p className="text-sm text-slate-300">{t('loading')}</p>
  }

  return (
    <ConcertStatsComponent
      bands={bandsSeen?.map(item => item.band).filter(item => !!item) ?? []}
      uniqueBands={uniqueBandsSeen}
    />
  )
}
