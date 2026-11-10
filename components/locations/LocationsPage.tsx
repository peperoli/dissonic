'use client'

import { ListIcon, MapIcon, PlusIcon } from 'lucide-react'
import { Button } from '../Button'
import { useDebounce } from '../../hooks/helpers/useDebounce'
import { usePagination } from '../layout/Pagination'
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from '../../hooks/auth/useSession'
import { useModal } from '../shared/ModalProvider'
import { SpeedDial } from '../layout/SpeedDial'
import { useTranslations } from 'next-intl'
import { useSearchLocations } from '@/hooks/locations/useSearchLocations'
import { parseAsArrayOf, parseAsString, parseAsStringLiteral, useQueryState } from 'nuqs'
import { LocationsMap } from './LocationsMap'
import { SegmentedControl } from '../controls/SegmentedControl'
import { LocationsTable } from './LocationsTable'

export function LocationsPage() {
  const views = ['map', 'list'] as const
  const [view, setView] = useQueryState('view', parseAsStringLiteral(views).withDefault('list'))
  const [query] = useQueryState('q', parseAsString.withDefault(''))
  const debounceQuery = useDebounce(query, 200)
  const perPage = 25
  const [currentPage] = usePagination()
  const [selectedCountries] = useQueryState('countries', parseAsArrayOf(parseAsString))
  const { data: locations } = useSearchLocations(
    view === 'map'
      ? {
          size: 1000,
        }
      : {
          search: debounceQuery,
          countries: selectedCountries,
          page: currentPage,
          size: perPage,
        }
  )
  const [, setModal] = useModal()
  const { data: session } = useSession()
  const { push } = useRouter()
  const pathname = usePathname()
  const t = useTranslations('LocationsPage')

  return (
    <main className="container-fluid">
      <div className="sr-only flex justify-between md:not-sr-only md:mb-6">
        <h1 className="mb-0">{t('locations')}</h1>
        <Button
          onClick={
            session ? () => setModal('add-location') : () => push(`/login?redirect=${pathname}`)
          }
          label={t('addLocation')}
          appearance="primary"
          icon={<PlusIcon className="size-icon" />}
          className="hidden md:block"
        />
      </div>
      <SegmentedControl
        options={[
          { label: t('list'), value: 'list', icon: ListIcon },
          { label: t('map'), value: 'map', icon: MapIcon },
        ]}
        value={view}
        onValueChange={setView as (value: string) => void}
        className="mb-6"
      />
      {view === 'map' ? (
        <LocationsMap locations={locations} />
      ) : (
        <LocationsTable locations={locations} />
      )}
      <SpeedDial />
    </main>
  )
}
