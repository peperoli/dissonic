'use client'

import { ConcertCard } from '@/components/concerts/ConcertCard'
import { SegmentedControl } from '@/components/controls/SegmentedControl'
import { Carousel } from '@/components/home/Carousel'
import { useConcerts } from '@/hooks/concerts/useConcerts'
import useMediaQuery from '@/hooks/helpers/useMediaQuery'
import { Concert, Profile } from '@/types/types'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Temporal } from 'temporal-polyfill'
import Link from 'next/link'
import { ArrowRightIcon } from 'lucide-react'

export function RecentConcerts({
  concerts: initialConcerts,
  profiles,
}: {
  concerts: Concert[]
  profiles: Profile[]
}) {
  const [view, setView] = useState<'past' | 'future'>('past')
  const today = Temporal.Now.plainDateISO()
  const tomorrow = today.add({ days: 1 })
  const { data: concerts } = useConcerts({
    placeholderData: { data: initialConcerts, count: null },
    dateRange: view === 'future' ? [tomorrow, null] : [null, today],
    sort: { sort_by: 'date_start', sort_asc: view === 'future' },
    size: 10,
  })
  const t = useTranslations('HomePage')
  const hasHover = useMediaQuery('(hover: hover)')

  return (
    <section>
      <Link href="/concerts" className="mb-3 flex items-center justify-between gap-4">
        <h2 className="mb-0">{t('recentConcerts')}</h2>
        <div aria-label={t('showAll')} className="btn btn-icon btn-small btn-tertiary">
          <ArrowRightIcon className="size-icon" />
        </div>
      </Link>
      <SegmentedControl
        options={[
          { value: 'past', label: t('past') },
          { value: 'future', label: t('future') },
        ]}
        value={view}
        onValueChange={setView as (value: string) => void}
        className="mb-4"
      />
      <Carousel hideControls={!hasHover}>
        {concerts?.data.map(concert => (
          <ConcertCard
            key={concert.id}
            concert={concert}
            profiles={profiles}
            orientation="vertical"
          />
        )) ?? []}
      </Carousel>
    </section>
  )
}
