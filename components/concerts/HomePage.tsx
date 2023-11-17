'use client'

import { AddConcertForm } from './AddConcertForm'
import { ChangeEvent, useEffect, useState } from 'react'
import { Button } from '../Button'
import {
  ArrowUturnLeftIcon,
  ChevronDownIcon,
  GlobeAltIcon,
  PlusIcon,
  UserIcon,
} from '@heroicons/react/20/solid'
import { PageWrapper } from '../layout/PageWrapper'
import { Concert, ExtendedRes } from '../../types/types'
import { useConcerts } from '../../hooks/useConcerts'
import { ConcertCard } from './ConcertCard'
import { BandFilter } from './BandFilter'
import { LocationFilter } from './LocationFilter'
import { YearsFilter } from './YearsFilter'
import { BandCountFilter } from './BandCountFilter'
import Cookies from 'js-cookie'
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useSession } from '../../hooks/useSession'
import { SegmentedControl } from '../controls/SegmentedControl'
import { useProfile } from '../../hooks/useProfile'
import {
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  parseAsStringEnum,
  useQueryState,
  useQueryStates,
  subscribeToQueryUpdates
} from 'next-usequerystate'

type HomePageProps = {
  initialConcerts: ExtendedRes<Concert[]>
}

enum SortBy {
  dateStart = 'date_start',
}

export const HomePage = ({ initialConcerts }: HomePageProps) => {
  const { data: session } = useSession()
  const [size, setSize] = useQueryState('size', parseAsInteger.withDefault(25))
  const [selectedBands, setSelectedBands] = useQueryState('bands', parseAsArrayOf(parseAsInteger))
  const [selectedLocations, setSelectedLocations] = useQueryState(
    'locations',
    parseAsArrayOf(parseAsInteger)
  )
  const [selectedYears, setSelectedYears] = useQueryState('years', parseAsArrayOf(parseAsInteger))
  const [selectedBandCount, setSelectedBandCount] = useQueryState(
    'band_count',
    parseAsArrayOf(parseAsInteger)
  )
  const [user] = useQueryState('user')
  const { data: profile } = useProfile(null, user)
  const selectedUserId = user && profile?.id
  const [view, setView] = useState(Cookies.get('view') ?? 'global')
  const [sort, setSort] = useQueryStates({
    sort_by: parseAsStringEnum<SortBy>(Object.values(SortBy)).withDefault(SortBy.dateStart),
    sort_asc: parseAsBoolean.withDefault(false),
  })
  const { data: concerts, isFetching } = useConcerts(initialConcerts, {
    filter: {
      bands: selectedBands,
      locations: selectedLocations,
      years: selectedYears,
      bandsPerConcert: selectedBandCount,
      bandsSeenUser: selectedUserId ?? (view === 'user' ? session?.user.id : undefined),
    },
    sort,
    size,
  })
  const [isOpen, setIsOpen] = useState(false)
  const { push } = useRouter()
  const pathname = usePathname()  

  useEffect(() => {
    subscribeToQueryUpdates(({search}) => {
      Cookies.set('concertQueryState', search.toString(), { sameSite: 'strict' })
    })
  }, [])

  function handleView(event: ChangeEvent) {
    const target = event.target as HTMLInputElement
    setView(target.value)
    Cookies.set('view', target.value, { expires: 365, sameSite: 'strict' })
  }

  function resetAll() {
    push(pathname, { scroll: false })
  }
  return (
    <PageWrapper>
      <main className="container">
        <div className="md:hidden fixed bottom-0 right-0 m-4">
          <Button
            onClick={session ? () => setIsOpen(true) : () => push(`/login?redirect=${pathname}`)}
            label="Konzert hinzufügen"
            style="primary"
            contentType="icon"
            icon={<PlusIcon className="h-icon" />}
          />
        </div>
        <div className="sr-only md:not-sr-only flex justify-between items-center mb-6">
          <h1>Konzerte</h1>
          <Button
            onClick={session ? () => setIsOpen(true) : () => push(`/login?redirect=${pathname}`)}
            label="Konzert hinzufügen"
            style="primary"
            icon={<PlusIcon className="h-icon" />}
            className="hidden md:block"
          />
        </div>
        <div className="grid gap-4">
          <div className="flex items-center gap-4">
            <div className="my-1.5 text-sm text-slate-300">{concerts?.count}&nbsp;Einträge</div>
            {(selectedBands ||
              selectedLocations ||
              selectedYears ||
              selectedBandCount ||
              selectedUserId) && (
              <Button
                label="Zurücksetzen"
                onClick={resetAll}
                icon={<ArrowUturnLeftIcon className="h-icon" />}
                size="small"
              />
            )}
          </div>
          <div className="flex md:grid md:grid-cols-2 gap-2 md:gap-4 -mx-4 px-4 overflow-x-auto md:overflow-visible scrollbar-hidden">
            <BandFilter value={selectedBands} onSubmit={setSelectedBands} />
            <LocationFilter value={selectedLocations} onSubmit={setSelectedLocations} />
            <YearsFilter value={selectedYears} onSubmit={setSelectedYears} />
            <BandCountFilter value={selectedBandCount} onSubmit={setSelectedBandCount} />
          </div>
          <div className="flex items-center gap-4 -mx-4 px-4 overflow-x-auto scrollbar-hidden">
            {session && (
              <SegmentedControl
                options={[
                  { value: 'global', label: 'Alle', icon: <GlobeAltIcon className="h-icon" /> },
                  { value: 'user', label: 'Gesehene', icon: <UserIcon className="h-icon" /> },
                ]}
                value={view}
                onValueChange={handleView}
              />
            )}
            <div className="flex items-center gap-1 ml-auto text-sm">
              <label htmlFor="sort" className="sr-only md:not-sr-only text-slate-300">
                Sortieren nach:
              </label>
              <div className="relative flex items-center">
                <select
                  value={`${sort.sort_by},${sort.sort_asc}`}
                  onChange={event =>
                    setSort({
                      sort_by: event.target.value.split(',')[0] as SortBy,
                      sort_asc: Boolean(event.target.value.split(',')[1]),
                    })
                  }
                  name="sort"
                  id="sort"
                  className="appearance-none pl-2 pr-7 py-1 rounded-md font-sans bg-slate-750 hover:bg-slate-700"
                >
                  <option value="date_start,false">Neuste</option>
                  <option value="date_start,true">Älteste</option>
                </select>
                <ChevronDownIcon className="absolute right-2 text-xs h-icon pointer-events-none" />
              </div>
            </div>
          </div>
          <div className="grid gap-4">
            {concerts?.data.map(concert => (
              <ConcertCard concert={concert} key={concert.id} />
            ))}
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-slate-300">
              {concerts?.data.length} von {concerts?.count} Einträgen
            </p>
            {concerts?.data.length !== concerts?.count && (
              <Button
                label="Mehr anzeigen"
                onClick={() => setSize(prev => prev + 25)}
                loading={isFetching}
                style="primary"
              />
            )}
          </div>
        </div>
      </main>
      <AddConcertForm isOpen={isOpen} setIsOpen={setIsOpen} />
    </PageWrapper>
  )
}
