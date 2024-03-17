'use client'

import { PageWrapper } from '../layout/PageWrapper'
import { PlusIcon } from '@heroicons/react/20/solid'
import { Table } from '../Table'
import { TableRow } from '../TableRow'
import { useEffect, useState } from 'react'
import { SearchField } from '../forms/SearchField'
import { Button } from '../Button'
import useMediaQuery from '../../hooks/helpers/useMediaQuery'
import { ExtendedRes, Location } from '../../types/types'
import { useLocations } from '../../hooks/locations/useLocations'
import { useDebounce } from '../../hooks/helpers/useDebounce'
import { Pagination } from '../layout/Pagination'
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from '../../hooks/auth/useSession'
import { parseAsInteger, parseAsStringLiteral, useQueryState } from 'nuqs'
import { modalPaths } from '../shared/ModalProvider'

interface LocationsPageProps {
  initialLocations: ExtendedRes<Location[]>
}

export const LocationsPage = ({ initialLocations }: LocationsPageProps) => {
  const [query, setQuery] = useState('')
  const debounceQuery = useDebounce(query, 200)
  const perPage = 25
  const [currentPage, setCurrentPage] = useQueryState('page', parseAsInteger.withDefault(1))
  const { data: locations } = useLocations(initialLocations, {
    search: debounceQuery,
    page: currentPage,
    size: perPage,
  })
  const [_, setModal] = useQueryState(
    'modal',
    parseAsStringLiteral(modalPaths).withOptions({ history: 'push' })
  )
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const { data: session } = useSession()
  const { push } = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (query) {
      setCurrentPage(1)
    }
  }, [query])
  return (
    <PageWrapper>
      <main className="container-fluid">
        {!isDesktop && (
          <div className="fixed bottom-0 right-0 m-4">
            <Button
              onClick={
                session
                  ? () => setModal('add-location')
                  : () => push(`/login?redirect=${pathname}`)
              }
              label="Location hinzufügen"
              appearance="primary"
              contentType="icon"
              icon={<PlusIcon className="h-icon" />}
            />
          </div>
        )}
        <div className="sr-only flex justify-between md:not-sr-only md:mb-6">
          <h1 className="mb-0">Locations</h1>
          {isDesktop && (
            <Button
              onClick={
                session
                  ? () => setModal('add-location')
                  : () => push(`/login?redirect=${pathname}`)
              }
              label="Location hinzufügen"
              appearance="primary"
              icon={<PlusIcon className="h-icon" />}
            />
          )}
        </div>
        <Table>
          <SearchField
            name="searchLocations"
            placeholder="Locations"
            query={query}
            setQuery={setQuery}
          />
          <div className="my-4 text-sm text-slate-300">
            {locations?.count}&nbsp;{locations?.count === 1 ? 'Eintrag' : 'Einträge'}
          </div>
          {locations?.count === 0 ? (
            <div>Blyat! Keine Einträge gefunden.</div>
          ) : (
            locations?.data.map(location => (
              <TableRow key={location.id} href="">
                <div className="w-full items-center gap-4 md:flex">
                  <div className="font-bold md:w-1/2">{location.name}</div>
                  <div className="text-slate-300 md:w-1/2">{location.city}</div>
                </div>
              </TableRow>
            ))
          )}
          <Pagination
            entriesCount={locations?.count ?? 0}
            perPage={perPage}
            currentPage={currentPage}
            onChange={setCurrentPage}
          />
        </Table>
      </main>
    </PageWrapper>
  )
}
