'use client'

import { useEffect, useState } from 'react'
import { AddBandForm } from './AddBandForm'
import { ArrowUturnLeftIcon, PlusIcon } from '@heroicons/react/20/solid'
import { PageWrapper } from '../layout/PageWrapper'
import { Table } from '../Table'
import { SearchField } from '../forms/SearchField'
import { Button } from '../Button'
import useMediaQuery from '../../hooks/helpers/useMediaQuery'
import { Pagination } from '../layout/Pagination'
import { Band, ExtendedRes } from '../../types/types'
import { useBands } from '../../hooks/bands/useBands'
import { useDebounce } from '../../hooks/helpers/useDebounce'
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from '../../hooks/auth/useSession'
import { StatusBanner } from '../forms/StatusBanner'
import { CountryFilter } from './CountryFilter'
import { GenreFilter } from './GenreFilter'
import { BandTableRow } from './TableRow'
import {
  parseAsArrayOf,
  parseAsInteger, useQueryState
} from 'next-usequerystate'
import Cookies from 'js-cookie'

interface BandsPageProps {
  initialBands: ExtendedRes<Band[]>
}

export const BandsPage = ({ initialBands }: BandsPageProps) => {
  const perPage = 25
  const [currentPage, setCurrentPage] = useQueryState('page', parseAsInteger.withDefault(1))
  const [selectedCountries, setSelectedCountries] = useQueryState(
    'countries',
    parseAsArrayOf(parseAsInteger)
  )
  const [selectedGenres, setSelectedGenres] = useQueryState(
    'genres',
    parseAsArrayOf(parseAsInteger)
  )
  const [query, setQuery] = useState('')
  const debounceQuery = useDebounce(query, 200)
  const { data: bands } = useBands(initialBands, {
    filter: {
      countries: selectedCountries,
      genres: selectedGenres,
      search: debounceQuery,
    },
    page: currentPage,
    size: perPage,
  })
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const { push } = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (selectedCountries || selectedGenres || query) {
      setCurrentPage(1)
    }
  }, [selectedCountries, selectedGenres, query])

  function resetAll() {
    push(pathname, { scroll: false })
  }

  const isDesktop = useMediaQuery('(min-width: 768px)')
  
  const queryStateString = window.location.search
  useEffect(() => {
    Cookies.set('bandQueryState', queryStateString, { sameSite: 'strict' })
  }, [queryStateString])

  if (!bands) {
    return (
      <StatusBanner
        statusType="error"
        message="Es ist ein Fehler aufgetreten. Bitte versuche es später erneut."
        className="container"
      />
    )
  }
  return (
    <PageWrapper>
      <main className="container-fluid">
        {!isDesktop && (
          <div className="fixed bottom-0 right-0 m-4">
            <Button
              onClick={session ? () => setIsOpen(true) : () => push(`/login?redirect=${pathname}`)}
              label="Band hinzufügen"
              appearance="primary"
              contentType="icon"
              icon={<PlusIcon className="h-icon" />}
            />
          </div>
        )}
        <div className="sr-only md:not-sr-only flex justify-between md:mb-6">
          <h1 className="mb-0">Bands</h1>
          {isDesktop && (
            <Button
              onClick={session ? () => setIsOpen(true) : () => push(`/login?redirect=${pathname}`)}
              label="Band hinzufügen"
              appearance="primary"
              icon={<PlusIcon className="h-icon" />}
            />
          )}
        </div>
        <Table>
          <div className="flex md:grid md:grid-cols-3 gap-2 md:gap-4 -mx-4 px-4 overflow-x-auto md:overflow-visible scrollbar-hidden">
            <SearchField name="searchBands" placeholder="Bands" query={query} setQuery={setQuery} />
            <CountryFilter values={selectedCountries} onSubmit={setSelectedCountries} />
            <GenreFilter values={selectedGenres} onSubmit={setSelectedGenres} />
          </div>
          <div className="flex gap-4 items-center">
            <div className="my-4 text-sm text-slate-300">
              {bands?.count}&nbsp;{bands?.count === 1 ? 'Eintrag' : 'Einträge'}
            </div>
            {(selectedCountries || selectedGenres) && (
              <button
                onClick={resetAll}
                className="flex gap-2 px-2 py-1 rounded-md text-sm hover:bg-slate-700"
              >
                <ArrowUturnLeftIcon className="h-icon text-slate-300" />
                Zurücksetzen
              </button>
            )}
          </div>
          {bands.data.length === 0 ? (
            <StatusBanner statusType="info" message="Blyat! Keine Einträge gefunden." />
          ) : (
            bands.data.map(band => <BandTableRow key={band.id} band={band} />)
          )}
          <Pagination
            entriesCount={bands?.count ?? 0}
            currentPage={currentPage}
            onChange={setCurrentPage}
            perPage={perPage}
          />
        </Table>
      </main>
      <AddBandForm isOpen={isOpen} setIsOpen={setIsOpen} />
    </PageWrapper>
  )
}
