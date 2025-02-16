'use client'

import { useBandsSeen } from '@/hooks/bands/useBandsSeen'
import { TopGrid } from './TopGrid'
import { getUniqueObjects } from '@/lib/getUniqueObjects'
import { useTranslations } from 'next-intl'
import { ItemCount } from '@/lib/getCounts'
import { Location } from '@/types/types'
import { MapPin } from 'lucide-react'
import Link from 'next/link'
import { getAssetUrl } from '@/lib/getAssetUrl'
import Image from 'next/image'

export const LocationItem = ({ topItem }: { topItem: ItemCount & Location }) => {
  const imageUrl = getAssetUrl('ressources', topItem.image, topItem.updated_at)
  const t = useTranslations('TopLocations')

  return (
    <Link href={`/locations/${topItem.id}`} className="block">
      <div className="relative flex aspect-square flex-shrink-0 items-center justify-center rounded-2xl bg-slate-750">
        {imageUrl ? (
          <Image src={imageUrl} alt={topItem.name} fill className="rounded-lg object-cover" />
        ) : (
          <MapPin className="size-8 text-slate-300" />
        )}

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
  const concertsSeen = getUniqueObjects(
    bandsSeen?.map(item => ({
      id: item.concert_id + item.user_id,
      ...item,
    })) ?? []
  )
    .map(item => item.concert)
    .filter(item => item !== null)

  if (bandsSeenStatus === 'pending') {
    return <p className="text-sm text-slate-300">{t('loading')}</p>
  }

  if (!bandsSeen || bandsSeen?.length === 0) {
    return null
  }

  return (
    <TopGrid
      headline={t('topLocations')}
      items={concertsSeen.map(item => item.location).filter(item => item !== null)}
      Item={LocationItem}
    />
  )
}
