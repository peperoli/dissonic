'use client'

import { useState } from 'react'
import { SegmentedControl } from '../controls/SegmentedControl'
import { useTranslations } from 'next-intl'
import { useConcerts } from '@/hooks/concerts/useConcerts'
import { Concert } from '@/types/types'
import { useBands } from '@/hooks/bands/useBands'
import { useLocations } from '@/hooks/locations/useLocations'
import { ConcertItem } from '../concerts/ConcertItem'
import { BandItem } from '../bands/BandItem'
import { LocationItem } from '../locations/LocationItem'

export function RecentlyAdded({ concerts: initialConcerts }: { concerts: Concert[] }) {
  const [type, setType] = useState<'concerts' | 'bands' | 'locations'>('concerts')
  const { data: concerts } = useConcerts({
    placeholderData: { data: initialConcerts, count: null },
    enabled: type === 'concerts',
    sort: { sort_by: 'created_at', sort_asc: false },
    size: 5,
  })
  const { data: bands } = useBands({
    enabled: type === 'bands',
    sort: { sort_by: 'created_at', sort_asc: false },
    size: 5,
  })
  const { data: locations } = useLocations({
    enabled: type === 'locations',
    sort: { sort_by: 'created_at', sort_asc: false },
    size: 5,
  })
  const t = useTranslations('HomePage')

  return (
    <section className="mt-8">
      <h2>{t('recentlyAdded')}</h2>
      <SegmentedControl
        options={[
          { value: 'concerts', label: t('concerts') },
          { value: 'bands', label: t('bands') },
          { value: 'locations', label: t('locations') },
        ]}
        value={type}
        onValueChange={setType as (value: string) => void}
        className="mb-4"
      />
      {type === 'concerts' &&
        concerts?.data.map(concert => <ConcertItem key={concert.id} concert={concert} />)}
      {type === 'bands' && bands?.data.map(band => <BandItem key={band.id} band={band} />)}
      {type === 'locations' &&
        locations?.data.map(location => <LocationItem key={location.id} location={location} />)}
    </section>
  )
}
