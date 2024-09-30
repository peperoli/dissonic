'use client'

import { useBand } from '@/hooks/bands/useBand'
import { useConcert } from '@/hooks/concerts/useConcert'
import { useLocation } from '@/hooks/locations/useLocation'
import { useProfile } from '@/hooks/profiles/useProfile'
import { getRelativeTime } from '@/lib/relativeTime'
import { Tables, TablesInsert, TablesUpdate } from '@/types/supabase'
import { Band, Concert, Location } from '@/types/types'
import clsx from 'clsx'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

type State = TablesInsert<'bands'> | TablesUpdate<'bands'> | null

export const ContributionItem = ({ contribution }: { contribution: Tables<'contributions'> }) => {
  const { operation, user_id, ressource_type, ressource_id, timestamp, state_old, state_new } =
    contribution
  const { data: profile } = useProfile(user_id)
  const { data: concert } = useConcert(ressource_id, null, ressource_type === 'concerts')
  const { data: band } = useBand(ressource_id, null, ressource_type === 'bands')
  const { data: location } = useLocation(ressource_id, null, ressource_type === 'locations')
  const operationLabels = {
    INSERT: 'erstellte',
    UPDATE: 'aktualisierte',
    DELETE: 'löschte',
  } as { [key: string]: string }
  const ressourceTypeLabels = {
    concerts: 'Konzert',
    bands: 'Band',
    locations: 'Location',
  } as { [key: string]: string }

  function getRessourceName(ressource: Band | Concert | Location | undefined) {
    if (!ressource) {
      return null
    }

    if (!('festival_root' in ressource)) {
      return ressource.name
    }

    if (!ressource.festival_root) {
      return `${ressource.bands
        ?.map(band => band.name)
        .slice(0, 3)
        .join(', ')} @ ${ressource.location?.name}`
    }

    return `${ressource.festival_root?.name} ${new Date(ressource.date_start).getFullYear()}`
  }

  function findChanges(oldState: State, newState: State) {
    if (!oldState || !newState) {
      return []
    }

    const changes: { key: string; old: unknown; new: unknown }[] = []

    Object.entries(oldState).forEach(([key, value]) => {
      if (newState[key as keyof State] !== value) {
        changes.push({ key, old: oldState[key as keyof State], new: newState[key as keyof State] })
      }
    })

    return changes
  }

  const changes = findChanges(state_old as State, state_new as State)

  return (
    <div className="rounded-lg bg-slate-800 p-4">
      <div className="flex flex-wrap items-center gap-1">
        <div
          className={clsx(
            'mr-1 rounded px-2 py-1 text-sm font-bold tracking-wider',
            operation === 'INSERT' && 'bg-venom/10 text-venom',
            operation === 'UPDATE' && 'bg-blue/10 text-blue',
            operation === 'DELETE' && 'bg-red/10 text-red'
          )}
        >
          {operation}
        </div>
        <Link href={`/users/${profile?.username}`} className="hover:underline">
          {profile?.username}
        </Link>
        <span className="text-slate-300">
          {operationLabels[operation]} {ressourceTypeLabels[ressource_type]}
        </span>
        <Link href={`/${ressource_type}/${ressource_id}`} className="hover:underline">
          {getRessourceName(concert || band || location)}{' '}
          <span className="text-slate-300">(ID: {ressource_id})</span>
        </Link>
        <span className="ml-auto text-slate-300">{getRelativeTime(timestamp, 'de-CH')}</span>
      </div>
      {changes.length > 0 && (
        <div className="mt-2 rounded border border-slate-700 p-2">
          {changes.map(change => (
            <div key={change.key} className="flex flex-wrap items-center gap-1">
              <strong>{change.key}:</strong>
              <span className="rounded bg-red/10 px-1 text-red">{JSON.stringify(change.old)}</span>
              <ArrowRight className="size-icon text-slate-300" />
              <span className="rounded bg-venom/10 px-1 text-venom">
                {JSON.stringify(change.new)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
