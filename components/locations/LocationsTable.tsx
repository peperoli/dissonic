import { RotateCcwIcon } from 'lucide-react'
import { Table } from '../Table'
import { useEffect } from 'react'
import { SearchField } from '../forms/SearchField'
import { Button } from '../Button'
import { Pagination, usePagination } from '../layout/Pagination'
import { usePathname, useRouter } from 'next/navigation'
import { StatusBanner } from '../forms/StatusBanner'
import { useLocale, useTranslations } from 'next-intl'
import { LocationTableRow } from './LocationTableRow'
import { CountryFilter } from '../bands/CountryFilter'
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs'
import { AlgoliaIndex } from '@/lib/algolia'
import { LocationRecord } from '@/types/algolia'

export function LocationsTable({
  locations,
}: {
  locations?: { data: LocationRecord[]; count: number | null }
}) {
  const [query, setQuery] = useQueryState('q', parseAsString.withDefault(''))

  const perPage = 25
  const [, setCurrentPage] = usePagination()
  const [selectedCountries, setSelectedCountries] = useQueryState(
    'countries',
    parseAsArrayOf(parseAsString)
  )
  const { push } = useRouter()
  const pathname = usePathname()
  const t = useTranslations('LocationsPage')
  const locale = useLocale()

  function resetAll() {
    push(pathname, { scroll: false })
  }

  useEffect(() => {
    if (query || selectedCountries) {
      setCurrentPage(1)
    }
  }, [query, selectedCountries])

  return (
    <Table>
      <div className="scrollbar-hidden -mx-4 flex gap-2 overflow-x-auto px-4 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible">
        <SearchField
          name="searchLocations"
          placeholder={t('searchLocation')}
          query={query}
          setQuery={setQuery}
        />
        <CountryFilter
          indexName={AlgoliaIndex.Locations}
          facetName={`country_facet.${locale.split('-')[0]}`}
          values={selectedCountries}
          onSubmit={setSelectedCountries}
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
        locations?.data.map(location => <LocationTableRow key={location.id} location={location} />)
      )}
      <Pagination entriesCount={locations?.count ?? 0} perPage={perPage} />
    </Table>
  )
}
