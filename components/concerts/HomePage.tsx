'use client'

import { AddConcertForm } from './AddConcertForm'
import { useEffect, useState } from 'react'
import { Button } from '../Button'
import { PlusIcon } from '@heroicons/react/20/solid'
import { PageWrapper } from '../layout/PageWrapper'
import { Concert, ExtendedRes } from '../../types/types'
import { useConcerts } from '../../hooks/concerts/useConcerts'
import { ConcertCard } from './ConcertCard'
import { BandFilter } from './BandFilter'
import { LocationFilter } from './LocationFilter'
import { YearsFilter } from './YearsFilter'
import { BandCountFilter } from './BandCountFilter'
import Cookies from 'js-cookie'
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from '../../hooks/auth/useSession'
import { SegmentedControl } from '../controls/SegmentedControl'
import { useProfile } from '../../hooks/profiles/useProfile'
import { useQueryState, useQueryStates } from 'next-usequerystate'
import {
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  parseAsStringEnum,
} from 'next-usequerystate/parsers'
import { BookUser, ChevronDown, Globe, Plus, RotateCcw, User } from 'lucide-react'
import { useFriends } from '@/hooks/profiles/useFriends'

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
  const { data: friends } = useFriends({ profileId: session?.user?.id, pending: false })
  const [sort, setSort] = useQueryStates({
    sort_by: parseAsStringEnum<SortBy>(Object.values(SortBy)).withDefault(SortBy.dateStart),
    sort_asc: parseAsBoolean.withDefault(false),
  })

  function getView() {
    if (selectedUserId) return [selectedUserId]
    if (view === 'user' && session?.user) return [session.user.id]
    if (view === 'friends' && friends)
      return [
        ...new Set([
          ...friends?.map(item => item.sender_id),
          ...friends?.map(item => item.receiver_id),
        ]),
      ]
  }

  const { data: concerts, isFetching } = useConcerts(initialConcerts, {
    filter: {
      bands: selectedBands,
      locations: selectedLocations,
      years: selectedYears,
      bandCount: selectedBandCount,
      bandsSeenUsers: getView(),
    },
    sort,
    size,
  })
  const [isOpen, setIsOpen] = useState(false)
  const { push } = useRouter()
  const pathname = usePathname()
  const queryStateString = window.location.search

  useEffect(() => {
    Cookies.set('concertQueryState', queryStateString, { sameSite: 'strict' })
  }, [queryStateString])

  function handleView(value: string) {
    setView(value)
    Cookies.set('view', value, { expires: 365, sameSite: 'strict' })
  }

  function resetAll() {
    push(pathname, { scroll: false })
  }
  return (
    <PageWrapper>
      <main className="container">
        <div className="fixed bottom-0 right-0 m-4 md:hidden">
          <Button
            onClick={session ? () => setIsOpen(true) : () => push(`/login?redirect=${pathname}`)}
            label="Konzert hinzufügen"
            appearance="primary"
            contentType="icon"
            icon={<Plus className="size-icon" />}
          />
        </div>
        <div className="sr-only mb-6 flex items-center justify-between md:not-sr-only">
          <h1>Konzerte</h1>
          <Button
            onClick={session ? () => setIsOpen(true) : () => push(`/login?redirect=${pathname}`)}
            label="Konzert hinzufügen"
            appearance="primary"
            icon={<PlusIcon className="size-icon" />}
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
                icon={<RotateCcw className="size-icon" />}
                size="small"
                appearance="tertiary"
              />
            )}
          </div>
          <div className="scrollbar-hidden -mx-4 flex gap-2 overflow-x-auto px-4 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible">
            <BandFilter values={selectedBands} onSubmit={setSelectedBands} />
            <LocationFilter values={selectedLocations} onSubmit={setSelectedLocations} />
            <YearsFilter values={selectedYears} onSubmit={setSelectedYears} />
            <BandCountFilter values={selectedBandCount} onSubmit={setSelectedBandCount} />
          </div>
          <div className="scrollbar-hidden -mx-4 flex items-center gap-4 overflow-x-auto px-4">
            {session && (
              <SegmentedControl
                options={[
                  { value: 'global', label: 'Alle', icon: Globe },
                  { value: 'user', label: 'Du', icon: User },
                  { value: 'friends', label: 'Du & Freunde', icon: BookUser },
                ]}
                value={view}
                onValueChange={handleView}
              />
            )}
            <div className="ml-auto flex items-center gap-1 text-sm">
              <label htmlFor="sort" className="sr-only text-slate-300 md:not-sr-only">
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
                  className="appearance-none rounded-md bg-slate-750 py-1 pl-2 pr-7 font-sans hover:bg-slate-700"
                >
                  <option value="date_start,false">Neuste</option>
                  <option value="date_start,true">Älteste</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 h-icon text-xs" />
              </div>
            </div>
          </div>
          <div className="grid gap-4">
            {concerts?.data.map(concert => <ConcertCard concert={concert} key={concert.id} />)}
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
                appearance="primary"
              />
            )}
          </div>
        </div>
      </main>
      <AddConcertForm isOpen={isOpen} setIsOpen={setIsOpen} />
    </PageWrapper>
  )
}
