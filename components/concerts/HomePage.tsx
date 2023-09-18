'use client'

import { AddConcertForm } from './AddConcertForm'
import { ChangeEvent, useCallback, useState } from 'react'
import { Button } from '../Button'
import {
  ArrowUturnLeftIcon,
  ChevronDownIcon,
  GlobeAltIcon,
  PlusIcon,
  UserIcon,
} from '@heroicons/react/20/solid'
import { PageWrapper } from '../layout/PageWrapper'
import { Concert, ExtendedRes, Option } from '../../types/types'
import { useConcerts } from '../../hooks/useConcerts'
import { ConcertCard } from './ConcertCard'
import { BandFilter } from './BandFilter'
import { LocationFilter } from './LocationFilter'
import { YearsFilter } from './YearsFilter'
import { BandCountFilter } from './BandCountFilter'
import Cookies from 'js-cookie'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useSession } from '../../hooks/useSession'
import { SegmentedControl } from '../controls/SegmentedControl'

type HomePageProps = {
  initialConcerts: ExtendedRes<Concert[]>
}

export const HomePage = ({ initialConcerts }: HomePageProps) => {
  const searchParams = useSearchParams()
  const size = searchParams.get('size') ? Number(searchParams.get('size')) : 25
  const selectedBands =
    searchParams
      .get('filter[bands]')
      ?.split('|')
      .map(item => Number(item)) ?? []
  const [selectedLocations, setSelectedLocations] = useState<Option[]>([])
  const [selectedYears, setSelectedYears] = useState<[number, number] | null>(null)
  const [selectedBandsPerConcert, setSelectedBandsPerConcert] = useState<[number, number] | null>(
    null
  )
  const { data: session } = useSession()
  const [view, setView] = useState(Cookies.get('view') ?? 'global')
  const sort = searchParams.get('sort') ?? 'date_start,desc'

  const { data: concerts, isFetching } = useConcerts(initialConcerts, {
    filter: {
      locations: selectedLocations.map(item => item.id),
      bands: selectedBands,
      years: selectedYears,
      bandsPerConcert: selectedBandsPerConcert,
      bandsSeenUser: view === 'user' ? session?.user.id : undefined,
    },
    sort: [sort.split(',')[0], sort.split(',')[1] === 'asc' ? true : false],
    size: size,
  })
  const [isOpen, setIsOpen] = useState(false)
  const { push } = useRouter()
  const pathname = usePathname()

  function updateSearchParams(name: string, value: string | number) {
    // now you got a read/write object
    const current = new URLSearchParams(Array.from(searchParams.entries())) // -> has to use this form
    // update as necessary
    if (!value) {
      current.delete(name)
    } else {
      current.set(name, String(value))
    }

    // cast to string
    const search = current.toString()
    // or const query = `${'?'.repeat(search.length && 1)}${search}`;
    const query = search ? `?${search}` : ''

    push(`${pathname}${query}`, { scroll: false })
  }

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
            {(selectedBands.length > 0 ||
              selectedLocations.length > 0 ||
              selectedYears ||
              selectedBandsPerConcert) && (
              <Button
                label="Zurücksetzen"
                onClick={resetAll}
                icon={<ArrowUturnLeftIcon className="h-icon" />}
                size="small"
              />
            )}
          </div>
          <div className="flex md:grid md:grid-cols-2 gap-2 md:gap-4 -mx-4 px-4 overflow-x-auto md:overflow-visible scrollbar-hidden">
            <BandFilter
              value={selectedBands}
              onSubmit={value => updateSearchParams('filter[bands]', value.join('|'))}
            />
            <LocationFilter
              selectedOptions={selectedLocations}
              setSelectedOptions={setSelectedLocations}
            />
            <YearsFilter selectedOptions={selectedYears} setSelectedOptions={setSelectedYears} />
            <BandCountFilter
              selectedOptions={selectedBandsPerConcert}
              setSelectedOptions={setSelectedBandsPerConcert}
            />
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
                  value={sort}
                  onChange={event => updateSearchParams('sort', event.target.value)}
                  name="sort"
                  id="sort"
                  className="appearance-none pl-2 pr-7 py-1 rounded-md font-sans bg-slate-750 hover:bg-slate-700"
                >
                  <option value="date_start,desc">Neuste</option>
                  <option value="date_start,asc">Älteste</option>
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
                onClick={() => updateSearchParams('size', size + 25)}
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
