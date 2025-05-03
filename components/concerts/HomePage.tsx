'use client'

import { useEffect } from 'react'
import { Button } from '../Button'
import { BookUserIcon, GlobeIcon, PlusIcon, UserIcon } from 'lucide-react'
import { Concert, ExtendedRes } from '../../types/types'
import { useConcerts } from '../../hooks/concerts/useConcerts'
import { ConcertCard } from './ConcertCard'
import { BandFilter } from './BandFilter'
import { LocationFilter } from './LocationFilter'
import { YearsFilter } from './YearsFilter'
import { FestivalRootFilter } from './FestivalRootFilter'
import { usePathname, useRouter } from 'next/navigation'
import { SegmentedControl } from '../controls/SegmentedControl'
import { useProfile } from '../../hooks/profiles/useProfile'
import {
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryState,
  useQueryStates,
} from 'nuqs'
import { RotateCcw } from 'lucide-react'
import { useFriends } from '@/hooks/profiles/useFriends'
import { Select } from '../forms/Select'
import { FilterButton } from '../FilterButton'
import useMediaQuery from '@/hooks/helpers/useMediaQuery'
import { modalPaths } from '../shared/ModalProvider'
import { SpeedDial } from '../layout/SpeedDial'
import { useLocale, useTranslations } from 'next-intl'
import { User } from '@supabase/supabase-js'
import { saveLastQueryState, setViewPreference } from '@/actions/preferences'
import { groupConcertsByMonth } from '@/lib/groupConcertsByMonth'

type HomePageProps = {
  concerts: ExtendedRes<Concert[]>
  currentUser: User | null
  view: { concertsView: string; userView: string }
}

export const HomePage = ({
  concerts: initialConcerts,
  currentUser,
  view: initialView,
}: HomePageProps) => {
  const [size, setSize] = useQueryState('size', parseAsInteger.withDefault(25))
  const [selectedBands, setSelectedBands] = useQueryState('bands', parseAsArrayOf(parseAsInteger))
  const [selectedLocations, setSelectedLocations] = useQueryState(
    'locations',
    parseAsArrayOf(parseAsInteger)
  )
  const [selectedYears, setSelectedYears] = useQueryState('years', parseAsArrayOf(parseAsInteger))
  const [selectedFestivalRoots, setSelectedFestivalRoots] = useQueryState(
    'festivals',
    parseAsArrayOf(parseAsInteger)
  )
  const [user] = useQueryState('user')
  const { data: profile } = useProfile(null, user)
  const selectedUserId = user && profile?.id
  const [view, setView] = useQueryStates({
    concerts_view: parseAsString.withDefault(initialView.concertsView ?? 'past'),
    user_view: parseAsString.withDefault(initialView.userView ?? 'global'),
  })
  const { data: friends } = useFriends({ profileId: currentUser?.id, pending: false })
  const sortBy = ['date_start', 'bands_count'] as const
  const [sort, setSort] = useQueryStates({
    sort_by: parseAsStringLiteral(sortBy).withDefault('date_start'),
    sort_asc: parseAsBoolean.withDefault(initialView.concertsView === 'future'),
  })
  const [_, setModal] = useQueryState('modal', parseAsStringLiteral(modalPaths))
  const today = new Date(new Date().setHours(0, 0, 0, 0))
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  function getView() {
    if (!currentUser) return
    if (view.user_view === 'user') return [currentUser.id]
    if (view.user_view === 'friends' && friends)
      return [
        ...new Set([
          ...friends?.map(item => item.sender_id),
          ...friends?.map(item => item.receiver_id),
        ]),
      ]
  }

  const { data: concerts, isFetching } = useConcerts({
    placeholderData: initialConcerts,
    bands: selectedBands,
    locations: selectedLocations,
    dateRange: view.concerts_view === 'future' ? [tomorrow, null] : [null, tomorrow],
    years: selectedYears,
    festivalRoots: selectedFestivalRoots,
    bandsSeenUsers:
      view.concerts_view !== 'future' ? (selectedUserId ? [selectedUserId] : getView()) : null,
    sort,
    size,
    bandsSize: 5,
  })
  const { push } = useRouter()
  const pathname = usePathname()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const t = useTranslations('HomePage')
  const locale = useLocale()
  const queryStates = {
    bands: selectedBands,
    locations: selectedLocations,
    years: selectedYears,
    festivals: selectedFestivalRoots,
    user: selectedUserId,
    sort_by: sort.sort_by,
    sort_asc: sort.sort_asc,
  }
  const sortItems = [
    { id: 0, value: 'date_start,false', name: t('newest') },
    { id: 1, value: 'date_start,true', name: t('oldest') },
    { id: 2, value: 'bands_count,false', name: t('mostBands') },
    { id: 3, value: 'bands_count,true', name: t('fewestBands') },
  ]

  useEffect(() => {
    if (view.concerts_view === 'future') {
      setSort({
        sort_by: 'date_start',
        sort_asc: true,
      })
    } else {
      setSort({
        sort_by: 'date_start',
        sort_asc: false,
      })
    }
  }, [view.concerts_view])

  useEffect(() => {
    saveLastQueryState('concerts', queryStates)
  }, [JSON.stringify(queryStates)])

  async function handleView(value: { concerts_view: string; user_view: string }) {
    setView(value)
    await setViewPreference(value)
  }

  function resetAll() {
    push(pathname, { scroll: false })
  }
  return (
    <main className="container">
      <div className="mb-6 hidden items-center justify-between md:flex">
        <h1 className="mb-0">{t('concerts')}</h1>
        <Button
          onClick={
            currentUser ? () => setModal('add-concert') : () => push(`/login?redirect=${pathname}`)
          }
          label={t('addConcert')}
          appearance="primary"
          icon={<PlusIcon className="size-icon" />}
          className="hidden md:block"
        />
      </div>
      <section className="-mx-4 mb-4 grid gap-4 bg-radial-gradient from-blue/20 p-5 md:mx-auto md:rounded-2xl">
        <SegmentedControl
          options={[
            { value: 'past', label: t('past') },
            { value: 'future', label: t('future') },
          ]}
          value={view.concerts_view}
          onValueChange={value => handleView({ ...view, concerts_view: value })}
        />
        <div className="scrollbar-hidden -mx-4 flex gap-2 overflow-x-auto px-4 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible">
          <BandFilter values={selectedBands} onSubmit={setSelectedBands} />
          <LocationFilter values={selectedLocations} onSubmit={setSelectedLocations} />
          <YearsFilter values={selectedYears} onSubmit={setSelectedYears} />
          <FestivalRootFilter values={selectedFestivalRoots} onSubmit={setSelectedFestivalRoots} />
        </div>
        <div className="flex items-center gap-4">
          <div className="my-1.5 text-sm text-slate-300">
            {t('nEntries', { count: concerts?.count })}
          </div>
          {(selectedBands ||
            selectedLocations ||
            selectedYears ||
            selectedFestivalRoots ||
            selectedUserId) && (
            <Button
              label={t('reset')}
              onClick={resetAll}
              icon={<RotateCcw className="size-icon" />}
              contentType={isDesktop ? 'text' : 'icon'}
              size="small"
              appearance="tertiary"
            />
          )}
          <div className="ml-auto">
            <FilterButton
              label={t('sortBy')}
              items={sortItems}
              type="singleselect"
              size="sm"
              appearance="tertiary"
              selectedId={sortItems.findIndex(
                item => item.value === `${sort.sort_by},${sort.sort_asc}`
              )}
            >
              <Select
                name="sort"
                items={sortItems}
                value={sortItems.findIndex(
                  item => item.value === `${sort.sort_by},${sort.sort_asc}`
                )}
                onValueChange={value =>
                  setSort({
                    sort_by: sortItems[value].value.split(',')[0] as 'date_start',
                    sort_asc: sortItems[value].value.split(',')[1] === 'true',
                  })
                }
                searchable={false}
              />
            </FilterButton>
          </div>
        </div>
        {currentUser && view.concerts_view !== 'future' && (
          <SegmentedControl
            options={[
              { value: 'global', label: t('all'), icon: GlobeIcon },
              { value: 'friends', label: t('friends'), icon: BookUserIcon },
              { value: 'user', label: t('you'), icon: UserIcon },
            ]}
            value={view.user_view}
            onValueChange={value => handleView({ ...view, user_view: value })}
          />
        )}
      </section>
      {concerts?.data && (
        <section className="grid gap-4">
          {sort.sort_by === 'date_start'
            ? groupConcertsByMonth(concerts.data, locale).map(({ month, concerts }) => (
                <div key={month}>
                  <h3 className="section-headline mb-4">{month}</h3>
                  <div className="grid gap-4">
                    {concerts.map(concert => (
                      <ConcertCard concert={concert} key={concert.id} />
                    ))}
                  </div>
                </div>
              ))
            : concerts.data.map(concert => <ConcertCard concert={concert} key={concert.id} />)}
        </section>
      )}
      <div className="mt-4 flex flex-col items-center gap-2">
        <p className="text-sm text-slate-300">
          {t('nOfNEntries', { count: concerts?.data.length, total: concerts?.count })}
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
      <SpeedDial />
    </main>
  )
}
