import React, { FC } from 'react'
import { useProfiles } from '../../hooks/useProfiles'
import { Concert } from '../../types/types'
import { ConcertCard } from './ConcertCard'

interface ConcertsGridProps {
  concerts: Concert[] | undefined
  concertsIsLoading: boolean
}

export const ConcertsGrid: FC<ConcertsGridProps> = ({ concerts, concertsIsLoading }) => {
  const { data: profiles } = useProfiles()

  if (concertsIsLoading) {
    return (
      <div className="grid gap-4">
        {Array.from({ length: 10 }).map((item, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row gap-4 p-6 rounded-2xl bg-slate-800 animate-pulse"
          >
            <div className="flex-shrink-0 w-20 h-20 rounded-lg bg-slate-700" />
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex gap-2">
                <div className="w-32 h-6 rounded bg-slate-700" />
                <div className="w-32 h-6 rounded bg-slate-700" />
                <div className="w-32 h-6 rounded bg-slate-700" />
              </div>
              <div className="w-1/3 h-5 rounded bg-slate-700" />
              <div className="flex gap-2">
                <div className="w-24 h-5 rounded bg-slate-700" />
                <div className="w-24 h-5 rounded bg-slate-700" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (concerts?.length === 0) {
    return <div>Blyat! Keine Einträge gefunden.</div>
  }

  return (
    <div className="grid gap-4">
      {concerts?.map(concert => (
        <ConcertCard key={concert.id} concert={concert} profiles={profiles} />
      ))}
    </div>
  )
}
