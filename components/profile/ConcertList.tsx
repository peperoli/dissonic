'use client'

import { groupConcertsByMonth } from '@/lib/groupConcertsByMonth'
import { useConcerts } from '../../hooks/concerts/useConcerts'
import { Button } from '../Button'
import { ConcertCard } from '../concerts/ConcertCard'
import { parseAsInteger, useQueryState } from 'nuqs'
import { useLocale, useTranslations } from 'next-intl'

export function ConcertList({
  bandId,
  locationId,
  profileId,
  nested,
}: {
  bandId?: number
  locationId?: number
  profileId?: string
  nested?: boolean
}) {
  const [size, setSize] = useQueryState('size', parseAsInteger.withDefault(25))
  const {
    data: concerts,
    status,
    fetchStatus,
  } = useConcerts({
    bands: bandId ? [bandId] : null,
    locations: locationId ? [locationId] : null,
    bandsSeenUsers: profileId ? [profileId] : null,
    sort: { sort_by: 'date_start', sort_asc: false },
    size,
    bandsSize: 5,
  })
  const t = useTranslations('ConcertList')
  const locale = useLocale()

  if (status === 'pending') {
    return <p className="text-sm text-slate-300">{t('loading')}</p>
  }

  if (concerts?.data.length === 0) {
    return <p className="text-slate-300">{t('noConcertsFound')}</p>
  }

  return (
    <>
      {concerts?.data && (
        <div className="grid gap-4">
          {groupConcertsByMonth(concerts.data, locale).map(({ month, concerts }) => (
            <div key={month}>
              <h3 className="section-headline mb-4">{month}</h3>
              <div className="grid gap-4">
                {concerts.map(concert => (
                  <ConcertCard concert={concert} nested={nested} key={concert.id} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm text-slate-300">
          {concerts?.data.length} von {concerts?.count} Einträgen
        </p>
        {concerts?.data.length !== concerts?.count && (
          <Button
            label="Mehr anzeigen"
            onClick={() => setSize(prev => prev + 25)}
            loading={fetchStatus === 'fetching'}
            appearance="primary"
          />
        )}
      </div>
    </>
  )
}
