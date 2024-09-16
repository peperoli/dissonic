'use client'

import { useBand } from '@/hooks/bands/useBand'
import { useProfile } from '@/hooks/profiles/useProfile'
import { getRelativeTime } from '@/lib/getRelativeTime'
import { Tables, TablesInsert, TablesUpdate } from '@/types/supabase'
import clsx from 'clsx'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

type State = TablesInsert<'bands'> | TablesUpdate<'bands'> | null

export const ContributionItem = ({ contribution }: { contribution: Tables<'contributions'> }) => {
  const { operation, user_id, ressource_type, ressource_id, timestamp, state_old, state_new } =
    contribution
  const { data: profile } = useProfile(user_id)
  const { data: band } = useBand(ressource_id)
  const operationLabels = {
    INSERT: 'erstellt',
    UPDATE: 'aktualisiert',
    DELETE: 'löscht',
  } as { [key: string]: string }

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
        <span className="text-slate-300">{operationLabels[operation]}</span>
        <Link href={`/${ressource_type}/${ressource_id}`} className="hover:underline">
          {band?.name} <span className="text-slate-300">(ID: {ressource_id})</span>
        </Link>
        <span className="ml-auto text-slate-300">{getRelativeTime(timestamp, 'de-CH')}</span>
      </div>
      {operation === 'UPDATE' && (
        <div className="mt-2 rounded border border-slate-700 p-2">
          {findChanges(state_old as State, state_new as State).map(change => (
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
