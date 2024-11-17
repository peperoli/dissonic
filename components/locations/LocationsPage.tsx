'use client'

import { PlusIcon } from 'lucide-react'
import { Table } from '../Table'
import { TableRow } from '../TableRow'
import { useEffect, useState } from 'react'
import { SearchField } from '../forms/SearchField'
import { Button } from '../Button'
import { ExtendedRes, Location } from '../../types/types'
import { useLocations } from '../../hooks/locations/useLocations'
import { useDebounce } from '../../hooks/helpers/useDebounce'
import { Pagination, usePagination } from '../layout/Pagination'
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from '../../hooks/auth/useSession'
import { useModal } from '../shared/ModalProvider'
import { StatusBanner } from '../forms/StatusBanner'
import { SpeedDial } from '../layout/SpeedDial'
import { useLocale, useTranslations } from 'next-intl'

interface LocationsPageProps {
  initialLocations: ExtendedRes<Location[]>
}

export const LocationsPage = ({ initialLocations }: LocationsPageProps) => {
  const [query, setQuery] = useState('')
  const debounceQuery = useDebounce(query, 200)
  const perPage = 25
  const [currentPage, setCurrentPage] = usePagination()
  const { data: locations } = useLocations({
    placeholderData: initialLocations,
    search: debounceQuery,
    page: currentPage,
    size: perPage,
  })
  const [_, setModal] = useModal()
  const { data: session } = useSession()
  const { push } = useRouter()
  const pathname = usePathname()
  const t = useTranslations('LocationsPage')
  const locale = useLocale()
  const regionNames = new Intl.DisplayNames(locale, { type: 'region' })

  useEffect(() => {
    if (query) {
      setCurrentPage(1)
    }
  }, [query])
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
        <SearchField
          name="searchLocations"
          placeholder={t('searchLocation')}
          query={query}
          setQuery={setQuery}
        />
        <div className="my-4 text-sm text-slate-300">
          {t('nEntries', { count: locations?.count })}
        </div>
        {locations?.count === 0 ? (
          <StatusBanner statusType="info" message={t('noEntriesFound')} />
        ) : (
          locations?.data.map(location => (
            <TableRow key={location.id} href={`/locations/${location.id}`}>
              <div className="w-full grid-cols-3 items-center gap-4 md:grid">
                <div className="font-bold">{location.name}</div>
                <div className="text-slate-300">{location.city}</div>
                <div className="text-slate-300">
                  {location.country && regionNames.of(location.country?.iso2)}
                </div>
              </div>
            </TableRow>
          ))
        )}
        <Pagination entriesCount={locations?.count ?? 0} perPage={perPage} />
      </Table>
      <SpeedDial />
    </main>
  )
}
