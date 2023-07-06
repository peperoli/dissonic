'use client'

import { useState } from 'react'
import { AddBandForm } from './AddBandForm'
import { ArrowUturnLeftIcon, PlusIcon } from '@heroicons/react/20/solid'
import { PageWrapper } from '../layout/PageWrapper'
import { Table } from '../Table'
import { TableRow } from '../TableRow'
import { Search } from '../Search'
import { Button } from '../Button'
import useMediaQuery from '../../hooks/useMediaQuery'
import { Pagination } from '../layout/Pagination'
import { UserMusicIcon } from '../layout/UserMusicIcon'
import { MultiSelectFilter } from '../MultiSelectFilter'
import { Band, Country, Genre, WithCount } from '../../types/types'
import { useBands } from '../../hooks/useBands'
import { useGenres } from '../../hooks/useGenres'
import { useCountries } from '../../hooks/useCountries'
import { useSpotifyArtist } from '../../hooks/useSpotifyArtist'
import Image from 'next/image'
import { useDebounce } from '../../hooks/useDebounce'

interface BandTableRowProps {
  band: Band
}

const BandTableRow = ({ band }: BandTableRowProps) => {
  const { data } = useSpotifyArtist(band.spotify_artist_id)
  const picture = data?.images[2]
  return (
    <TableRow key={band.id} href={`/bands/${band.id}`}>
      <div className="relative flex-shrink-0 flex justify-center items-center w-10 h-10 rounded-lg bg-slate-750">
        {picture ? (
          <Image
            src={picture.url}
            alt={band.name}
            fill
            sizes="150px"
            className="object-cover rounded-lg"
          />
        ) : (
          <UserMusicIcon className="h-icon text-slate-300" />
        )}
      </div>
      <div className="md:flex items-center gap-4 w-full">
        <div className="md:w-1/3">{band.name}</div>
        <div className="md:w-1/3 text-slate-300">{band.country?.name}</div>
        <div className="hidden md:block md:w-1/3 text-slate-300 whitespace-nowrap text-ellipsis overflow-hidden">
          {band.genres?.map(item => item.name).join(' • ')}
        </div>
      </div>
    </TableRow>
  )
}

interface BandsPageProps {
  initialBands: WithCount<Band[]>
}

export const BandsPage = ({ initialBands }: BandsPageProps) => {
  const perPage = 25
  const [currentPage, setCurrentPage] = useState(0)
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([])
  const [selectedCountries, setSelectedCountries] = useState<Country[]>([])
  const [query, setQuery] = useState('')
  const debounceQuery = useDebounce(query, 500)
  const { data } = useBands(initialBands, {
    filter: {
      countries: selectedCountries.map(item => item.id),
      genres: selectedGenres.map(item => item.id),
      search: debounceQuery,
    },
    page: currentPage,
    size: perPage,
  })
  const bands = data?.data
  const count = data?.count

  const { data: genres } = useGenres()
  const { data: countries } = useCountries()

  const [isOpen, setIsOpen] = useState(false)

  function resetAll() {
    setQuery('')
    setSelectedCountries([])
    setSelectedGenres([])
  }

  const isDesktop = useMediaQuery('(min-width: 768px)')
  return (
    <PageWrapper>
      <main className="p-4 md:p-8 w-full">
        {!isDesktop && (
          <div className="fixed bottom-0 right-0 m-4">
            <Button
              onClick={() => setIsOpen(true)}
              label="Band hinzufügen"
              style="primary"
              contentType="icon"
              icon={<PlusIcon className="h-icon" />}
            />
          </div>
        )}
        <div className="sr-only md:not-sr-only flex justify-between md:mb-6">
          <h1 className="mb-0">Bands</h1>
          {isDesktop && (
            <Button
              onClick={() => setIsOpen(true)}
              label="Band hinzufügen"
              style="primary"
              icon={<PlusIcon className="h-icon" />}
            />
          )}
        </div>
        <Table>
          <div className="flex md:grid md:grid-cols-3 gap-2 md:gap-4 -mx-4 px-4 overflow-x-auto md:overflow-visible scrollbar-hidden">
            <Search name="searchBands" placeholder="Bands" query={query} setQuery={setQuery} />
            <MultiSelectFilter
              name="countries"
              options={countries}
              selectedOptions={selectedCountries}
              setSelectedOptions={setSelectedCountries}
            />
            <MultiSelectFilter
              name="genres"
              options={genres}
              selectedOptions={selectedGenres}
              setSelectedOptions={setSelectedGenres}
            />
          </div>
          <div className="flex gap-4 items-center">
            <div className="my-4 text-sm text-slate-300">
              {count}&nbsp;{count === 1 ? 'Eintrag' : 'Einträge'}
            </div>
            {(selectedCountries.length > 0 || selectedGenres.length > 0 || query.length > 0) && (
              <button
                onClick={resetAll}
                className="flex gap-2 px-2 py-1 rounded-md text-sm hover:bg-slate-700"
              >
                <ArrowUturnLeftIcon className="h-icon text-slate-300" />
                Zurücksetzen
              </button>
            )}
          </div>
          {bands?.length === 0 ? (
            <div>Blyat! Keine Einträge gefunden.</div>
          ) : (
            bands?.map(band => <BandTableRow key={band.id} band={band} />)
          )}
          <Pagination
            entriesCount={count ?? 0}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            perPage={perPage}
          />
        </Table>
      </main>
      {isOpen && (
        <AddBandForm
          countries={countries}
          genres={genres}
          bands={bands}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      )}
    </PageWrapper>
  )
}
