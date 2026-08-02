'use client'

import { PlusIcon, RotateCcwIcon } from 'lucide-react'
import { Table } from '../Table'
import { useEffect, useState } from 'react'
import { SearchField } from '../forms/SearchField'
import { Button } from '../Button'
import { useDebounce } from '../../hooks/helpers/useDebounce'
import { Pagination, usePagination } from '../layout/Pagination'
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from '../../hooks/auth/useSession'
import { useModal } from '../shared/ModalProvider'
import { StatusBanner } from '../forms/StatusBanner'
import { SpeedDial } from '../layout/SpeedDial'
import { useTranslations } from 'next-intl'
import { LocationTableRow } from './LocationTableRow'
import { useSearchLocations } from '@/hooks/locations/useSearchLocations'
import { CountryFilter } from '../bands/CountryFilter'
import { parseAsArrayOf, parseAsInteger, useQueryState } from 'nuqs'

export function LocationsPage() {
  const [query, setQuery] = useState('')
  const debounceQuery = useDebounce(query, 200)
  const perPage = 25
  const [currentPage, setCurrentPage] = usePagination()
  const [selectedCountries, setSelectedCountries] = useQueryState(
    'countries',
    parseAsArrayOf(parseAsInteger)
  )
  const { data: locations } = useSearchLocations({
    search: debounceQuery,
    countries: selectedCountries,
    page: currentPage,
    size: perPage,
  })
  const [, setModal] = useModal()
  const { data: session } = useSession()
  const { push } = useRouter()
  const pathname = usePathname()
  const t = useTranslations('LocationsPage')

  function resetAll() {
    push(pathname, { scroll: false })
  }

  useEffect(() => {
    if (query || selectedCountries) {
      setCurrentPage(1)
    }
  }, [query, selectedCountries])

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
      <Table>
        <div className="scrollbar-hidden -mx-4 flex gap-2 overflow-x-auto px-4 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible">
          <SearchField
            name="searchLocations"
            placeholder={t('searchLocation')}
            query={query}
            setQuery={setQuery}
          />
          <CountryFilter
            values={selectedCountries}
            onSubmit={setSelectedCountries}
            facetCounts={locations?.facets['country.id'] ?? {}}
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="my-4 text-sm text-slate-300">
            {t('nEntries', { count: locations?.count ?? 0 })}
          </div>
          {selectedCountries && (
            <Button
              label={t('reset')}
              onClick={resetAll}
              icon={<RotateCcwIcon className="size-icon text-slate-300" />}
              size="small"
              appearance="tertiary"
            />
          )}
        </div>{' '}
        {locations?.count === 0 ? (
          <StatusBanner statusType="info" message={t('noEntriesFound')} />
        ) : (
          locations?.data.map(location => (
            <LocationTableRow key={location.id} location={location} />
          ))
        )}
        <Pagination entriesCount={locations?.count ?? 0} perPage={perPage} />
      </Table>
      <SpeedDial />
    </main>
  )
}
