'use client'

import { useEffect, useState } from 'react'
import { Table } from '../Table'
import { SearchField } from '../forms/SearchField'
import { Button } from '../Button'
import { Pagination, usePagination } from '../layout/Pagination'
import { Band, ExtendedRes } from '../../types/types'
import { useBands } from '../../hooks/bands/useBands'
import { useDebounce } from '../../hooks/helpers/useDebounce'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useSession } from '../../hooks/auth/useSession'
import { StatusBanner } from '../forms/StatusBanner'
import { CountryFilter } from './CountryFilter'
import { GenreFilter } from './GenreFilter'
import { BandTableRow } from './BandTableRow'
import { parseAsArrayOf, parseAsInteger, useQueryState } from 'nuqs'
import Cookies from 'js-cookie'
import { useModal } from '../shared/ModalProvider'
import { Plus, RotateCcw } from 'lucide-react'
import { SpeedDial } from '../layout/SpeedDial'
import { useTranslations } from 'next-intl'

interface BandsPageProps {
  initialBands: ExtendedRes<Band[]>
}

export const BandsPage = ({ initialBands }: BandsPageProps) => {
  const perPage = 25
  const [currentPage, setCurrentPage] = usePagination()
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
  const { data: bands } = useBands({
    placeholderData: initialBands,
    countries: selectedCountries,
    genres: selectedGenres,
    search: debounceQuery,
    page: currentPage,
    size: perPage,
  })
  const { data: session } = useSession()
  const [_, setModal] = useModal()
  const { push } = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const t = useTranslations('BandsPage')
  const queryStateString = searchParams.toString()

  useEffect(() => {
    if (selectedCountries || selectedGenres || query) {
      setCurrentPage(1)
    }
  }, [selectedCountries, selectedGenres, query])

  function resetAll() {
    push(pathname, { scroll: false })
  }

  useEffect(() => {
    Cookies.set('bandQueryState', '?' + queryStateString, { sameSite: 'strict' })
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
    <main className="container-fluid">
      <div className="sr-only flex justify-between md:not-sr-only md:mb-6">
        <h1 className="mb-0">{t('bands')}</h1>
        <Button
          onClick={session ? () => setModal('add-band') : () => push(`/login?redirect=${pathname}`)}
          label={t('addBand')}
          appearance="primary"
          icon={<Plus className="size-icon" />}
          className="hidden md:block"
        />
      </div>
      <Table>
        <div className="scrollbar-hidden -mx-4 flex gap-2 overflow-x-auto px-4 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible">
          <SearchField name="searchBands" placeholder={t('searchBand')} query={query} setQuery={setQuery} />
          <CountryFilter values={selectedCountries} onSubmit={setSelectedCountries} />
          <GenreFilter values={selectedGenres} onSubmit={setSelectedGenres} />
        </div>
        <div className="flex items-center gap-4">
          <div className="my-4 text-sm text-slate-300">
            {t('nEntries', { count: bands?.count })}
          </div>
          {(selectedCountries || selectedGenres) && (
            <Button
              label={t('reset')}
              onClick={resetAll}
              icon={<RotateCcw className="size-icon text-slate-300" />}
              size="small"
              appearance="tertiary"
            />
          )}
        </div>
        {bands.data.length === 0 ? (
          <StatusBanner statusType="info" message={t('noEntriesFound')} />
        ) : (
          bands.data.map(band => <BandTableRow key={band.id} band={band} />)
        )}
        <Pagination entriesCount={bands?.count ?? 0} perPage={perPage} />
      </Table>
      <SpeedDial />
    </main>
  )
}
