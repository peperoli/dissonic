'use client'

import { useConcerts } from '../../hooks/concerts/useConcerts'
import { Button } from '../Button'
import { ConcertCard } from '../concerts/ConcertCard'
import { parseAsInteger, useQueryState } from 'nuqs'

export function ConcertList({ profileId }: { profileId: string }) {
  const [size, setSize] = useQueryState('size', parseAsInteger.withDefault(25))
  const {
    data: concerts,
    status,
    fetchStatus,
  } = useConcerts({
    bandsSeenUsers: [profileId],
    sort: { sort_by: 'date_start', sort_asc: false },
    size,
  })

  if (status === 'pending') return <p className="text-sm text-slate-300">Lade ...</p>

  if (concerts?.data.length === 0) {
    return <p className="text-slate-300">Keine Konzerte gefunden.</p>
  }

  return (
    <>
      {concerts?.data.map(concert => <ConcertCard concert={concert} key={concert.id} />)}
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
