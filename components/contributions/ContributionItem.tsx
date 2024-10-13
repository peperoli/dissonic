'use client'

import { useBand } from '@/hooks/bands/useBand'
import { useConcert } from '@/hooks/concerts/useConcert'
import { useGenre } from '@/hooks/genres/useGenre'
import { useLocation } from '@/hooks/locations/useLocation'
import { useProfile } from '@/hooks/profiles/useProfile'
import { getRelativeTime } from '@/lib/relativeTime'
import { Tables, TablesInsert, TablesUpdate } from '@/types/supabase'
import { Concert } from '@/types/types'
import clsx from 'clsx'
import { ArrowRight, PenIcon, PlusIcon, TrashIcon } from 'lucide-react'
import Link from 'next/link'
import { ReactNode } from 'react'

type State = TablesInsert<'bands'> | TablesUpdate<'bands'> | null

const operationLabels = {
  INSERT: 'erstellte',
  UPDATE: 'aktualisierte',
  DELETE: 'löschte',
} as { [key: string]: string }

const relationOperationLabels = {
  INSERT: ['fügte', 'zu', 'hinzu'],
  DELETE: ['entfernte', 'von'],
} as { [key: string]: string[] }

const ressourceTypeLabels = {
  concerts: 'Konzert',
  bands: 'Band',
  locations: 'Location',
} as { [key: string]: string }

const ConcertContributionItem = ({ contribution }: { contribution: Tables<'contributions'> }) => {
  const { operation, ressource_type, ressource_id } = contribution
  const { data: concert } = useConcert(ressource_id)

  function getConcertName(ressource: Concert | undefined) {
    if (!ressource) {
      return null
    }

    if (ressource.festival_root) {
      return `${ressource.festival_root.name} ${new Date(ressource.date_start).getFullYear()}`
    } else if (ressource.name) {
      return ressource.name
    } else {
      return `${ressource.bands
        ?.map(band => band.name)
        .slice(0, 3)
        .join(', ')} @ ${ressource.location?.name}`
    }
  }

  return (
    <ContributionItemWrapper contribution={contribution}>
      <span className="text-slate-300">
        {operationLabels[operation]} {ressourceTypeLabels[ressource_type]}
      </span>
      <Link href={`/concerts/${ressource_id}`} className="hover:underline">
        {getConcertName(concert)} <span className="text-slate-300">(ID: {ressource_id})</span>
      </Link>
    </ContributionItemWrapper>
  )
}

const BandContributionItem = ({ contribution }: { contribution: Tables<'contributions'> }) => {
  const { operation, ressource_type, ressource_id } = contribution
  const { data: band } = useBand(ressource_id)

  return (
    <ContributionItemWrapper contribution={contribution}>
      <span className="text-slate-300">
        {operationLabels[operation]} {ressourceTypeLabels[ressource_type]}
      </span>
      <Link href={`/bands/${ressource_id}`} className="hover:underline">
        {band?.name} <span className="text-slate-300">(ID: {ressource_id})</span>
      </Link>
    </ContributionItemWrapper>
  )
}

const LocationContributionItem = ({ contribution }: { contribution: Tables<'contributions'> }) => {
  const { operation, ressource_type, ressource_id } = contribution
  const { data: location } = useLocation(ressource_id)

  return (
    <ContributionItemWrapper contribution={contribution}>
      <span className="text-slate-300">
        {operationLabels[operation]} {ressourceTypeLabels[ressource_type]}
      </span>
      <Link href={`/locations/${ressource_id}`} className="hover:underline">
        {location?.name} <span className="text-slate-300">(ID: {ressource_id})</span>
      </Link>
    </ContributionItemWrapper>
  )
}

const ConcertBandContributionItem = ({
  contribution,
}: {
  contribution: Tables<'contributions'>
}) => {
  const { operation, ressource_id, state_old, state_new } = contribution
  const { data: concert } = useConcert(ressource_id, null)
  const bandId = state_new
    ? typeof state_new === 'object' && 'band_id' in state_new
      ? Number(state_new.band_id)
      : null
    : typeof state_old === 'object' && !!state_old && 'band_id' in state_old
      ? Number(state_old.band_id)
      : null
  const { data: band } = useBand(bandId)
  const operationLabel = relationOperationLabels[operation]

  return (
    <ContributionItemWrapper contribution={contribution}>
      <span className="text-slate-300">{operationLabel[0]} Band</span>
      <Link href={`/bands/${band?.id}`} className="hover:underline">
        {band?.name} <span className="text-slate-300">(ID: {band?.id})</span>
      </Link>
      <span className="text-slate-300">{operationLabel[1]} Konzert</span>
      <Link href={`/concerts/${concert?.id}`} className="hover:underline">
        {concert?.name} <span className="text-slate-300">(ID: {concert?.id})</span>
      </Link>
      {operationLabel[2] && <span className="text-slate-300">{operationLabel[2]}</span>}
    </ContributionItemWrapper>
  )
}

const BandGenreContributionItem = ({ contribution }: { contribution: Tables<'contributions'> }) => {
  const { operation, ressource_id, state_old, state_new } = contribution
  const { data: band } = useBand(ressource_id, null)
  const genreId = state_new
    ? typeof state_new === 'object' && 'genre_id' in state_new
      ? Number(state_new.genre_id)
      : null
    : typeof state_old === 'object' && !!state_old && 'genre_id' in state_old
      ? Number(state_old.genre_id)
      : null
  const { data: genre } = useGenre(genreId)
  const operationLabel = relationOperationLabels[operation]

  return (
    <ContributionItemWrapper contribution={contribution}>
      <span className="text-slate-300">{operationLabel[0]} Genre</span>
      <span>
        {genre?.name} <span className="text-slate-300">(ID: {genre?.id})</span>
      </span>
      <span className="text-slate-300">{operationLabel[1]} Band</span>
      <Link href={`/bands/${band?.id}`} className="hover:underline">
        {band?.name} <span className="text-slate-300">(ID: {band?.id})</span>
      </Link>
      {operationLabel[2] && <span className="text-slate-300">{operationLabel[2]}</span>}
    </ContributionItemWrapper>
  )
}

const ContributionItemWrapper = ({
  contribution,
  children,
}: {
  contribution: Tables<'contributions'>
  children?: ReactNode
}) => {
  const { operation, user_id, timestamp, state_old, state_new } = contribution
  const { data: profile } = useProfile(user_id)

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
      <div className="flex gap-4 md:flex-row md:items-center">
        <div
          className={clsx(
            'grid size-10 flex-none place-content-center rounded',
            operation === 'INSERT' && 'bg-venom/10 text-venom',
            operation === 'UPDATE' && 'bg-blue/10 text-blue',
            operation === 'DELETE' && 'bg-red/10 text-red'
          )}
        >
          {operation === 'INSERT' && <PlusIcon className="size-icon" />}
          {operation === 'UPDATE' && <PenIcon className="size-icon" />}
          {operation === 'DELETE' && <TrashIcon className="size-icon" />}
        </div>
        <div className="flex flex-wrap items-center gap-x-1 text-sm">
          <Link href={`/users/${profile?.username}`} className="hover:underline">
            {profile?.username}
          </Link>
          {children}
        </div>
        <span className="whitespace-nowrap text-sm text-slate-300 md:ml-auto">
          {getRelativeTime(timestamp, 'de-CH')}
        </span>
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

export const ContributionItem = ({ contribution }: { contribution: Tables<'contributions'> }) => {
  if (contribution.ressource_type === 'concerts') {
    return <ConcertContributionItem contribution={contribution} />
  } else if (contribution.ressource_type === 'bands') {
    return <BandContributionItem contribution={contribution} />
  } else if (contribution.ressource_type === 'locations') {
    return <LocationContributionItem contribution={contribution} />
  } else if (contribution.ressource_type === 'j_concert_bands') {
    return <ConcertBandContributionItem contribution={contribution} />
  } else if (contribution.ressource_type === 'j_band_genres') {
    return <BandGenreContributionItem contribution={contribution} />
  } else {
    return <p>Ressource nicht gefunden.</p>
  }
}
