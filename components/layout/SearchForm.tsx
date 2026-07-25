'use client'

import { useState } from 'react'
import { SearchField } from '../forms/SearchField'
import { useGlobalSearch } from '@/hooks/search/useGlobalSearch'
import { useTranslations } from 'next-intl'
import { Band, Concert, Location } from '@/types/types'
import { ConcertItem } from '../concerts/ConcertItem'
import { Button } from '../Button'
import { BandItem } from '../bands/BandItem'
import { LocationItem } from '../locations/LocationItem'
import { SegmentedControl } from '../controls/SegmentedControl'
import { useDebounce } from '@/hooks/helpers/useDebounce'
import { useLastSearched, useSaveLastSearched } from '@/hooks/search/lastSearched'
import { BandRecord, ConcertRecord, AlgoliaIndex, LocationRecord } from '@/types/algolia'

export type SearchResult = ConcertRecord | BandRecord | LocationRecord

export function SearchForm() {
  const [searchString, setSearchString] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const debouncedSearchString = useDebounce(searchString, 100)
  const { data: lastSearched } = useLastSearched()
  const { data: searchResults, isFetching } = useGlobalSearch({
    search: debouncedSearchString,
    type: selectedType === 'all' ? null : selectedType,
  })
  const t = useTranslations('SearchForm')

  return (
    <section>
      <div className="sticky top-0 z-10 -m-4 grid gap-4 bg-slate-800 p-4">
        <SearchField
          name="globalSearch"
          query={searchString}
          setQuery={setSearchString}
          isLoading={isFetching}
        />
        {(!!lastSearched?.length || !!searchString.length) && (
          <SegmentedControl
            options={[
              {
                value: 'all',
                label: t('all'),
                count: searchResults?.count ?? 0,
              },
              {
                value: 'concerts',
                label: t('concerts'),
                count: searchResults?.facets?.type?.concerts ?? 0,
              },
              {
                value: 'bands',
                label: t('bands'),
                count: searchResults?.facets?.type?.bands ?? 0,
              },
              {
                value: 'locations',
                label: t('locations'),
                count: searchResults?.facets?.type?.locations ?? 0,
              },
            ]}
            value={selectedType}
            onValueChange={setSelectedType}
          />
        )}
      </div>
      {!searchString.length ? (
        lastSearched && (
          <div className="mt-6">
            <h2 className="h3">{t('lastSearched')}</h2>
            <ul>
              {lastSearched
                ?.filter(result => selectedType === 'all' || result.type === selectedType)
                .map(result => {
                  return <SearchResultItem key={result.id} result={result} />
                })}
            </ul>
          </div>
        )
      ) : searchResults?.count === 0 ? (
        <div className="mt-6">
          <p className="text-slate-300">{t('noResults', { query: searchString })}</p>
        </div>
      ) : (
        searchResults?.data.map(response => {
          const indexName = response.index as AlgoliaIndex
          return (
            <div key={response.index} className="mt-6">
              {selectedType === 'all' && (
                <div className="flex items-center justify-between">
                  <h2 className="h3">
                    {t(indexName)}
                    <span className="ml-2 min-w-4 flex-none rounded bg-slate-700 px-1 text-center text-sm font-normal">
                      {searchResults?.facets.type[indexName]}
                    </span>
                  </h2>
                  {(response.nbHits ?? 0) > 3 && (
                    <Button
                      label={t('showAll')}
                      onClick={() => setSelectedType(indexName)}
                      size="small"
                    />
                  )}
                </div>
              )}
              <ul>
                {response.hits?.slice(0, selectedType === 'all' ? 3 : undefined).map(hit => {
                  return (
                    <SearchResultItem
                      key={`${response.index}${hit.id}`}
                      result={hit}
                      indexName={response.index}
                    />
                  )
                })}
              </ul>
            </div>
          )
        })
      )}
    </section>
  )
}

function SearchResultItem({ result, indexName }: { result: SearchResult; indexName?: string }) {
  const { data: lastSearched } = useLastSearched()
  const saveLastSearched = useSaveLastSearched()
  const concert = result as ConcertRecord
  const band = result as BandRecord
  const location = result as LocationRecord

  function handleClick() {
    if (lastSearched) {
      const withoutDuplicates = lastSearched.filter(item => item.objectID !== result.objectID)
      saveLastSearched.mutate([result, ...withoutDuplicates].slice(0, 20))
    } else {
      saveLastSearched.mutate([result])
    }
  }

  return (
    <li onClick={handleClick}>
      {indexName === 'concerts' ? (
        <ConcertItem
          concert={
            {
              id: concert.id,
              name: concert.name,
              festival_root: concert.festival_root,
              date_start: concert.date_start,
              date_end: concert.date_end,
              bands: concert.bands,
              location: concert.location,
            } as Concert
          }
        />
      ) : indexName === 'bands' ? (
        <BandItem
          band={
            {
              id: band.id,
              name: band.name,
              country: band.country,
              genres: band.genres,
              spotify_artist_images: band.spotify_artist_images,
              spotify_artist_id: band.spotify_artist_id,
            } as Band
          }
        />
      ) : indexName === 'locations' ? (
        <LocationItem
          location={
            {
              id: location.id,
              name: location.name,
              city: location.city,
              image: location.image,
            } as Location
          }
        />
      ) : (
        <div key={result.id}>{result.name}</div>
      )}
    </li>
  )
}
