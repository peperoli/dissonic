'use client'

import { useState } from 'react'
import { SearchField } from '../forms/SearchField'
import { useSearchGlobal } from '@/hooks/search/useSearchGlobal'
import { useTranslations } from 'next-intl'
import { ConcertItem } from '../concerts/ConcertItem'
import { Button } from '../Button'
import { BandItem } from '../bands/BandItem'
import { LocationItem } from '../locations/LocationItem'
import { SegmentedControl } from '../controls/SegmentedControl'
import { useDebounce } from '@/hooks/helpers/useDebounce'
import { useLastSearched, useSaveLastSearched } from '@/hooks/search/lastSearched'
import { BandRecord, ConcertRecord, LocationRecord } from '@/types/algolia'
import { AlgoliaIndex } from '@/lib/algolia'

export type SearchResult = ConcertRecord | BandRecord | LocationRecord

export function SearchForm() {
  const [searchString, setSearchString] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const debouncedSearchString = useDebounce(searchString, 100)
  const { data: lastSearched } = useLastSearched()
  const { data: searchResults, isFetching } = useSearchGlobal({
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
                value: AlgoliaIndex.Concerts,
                label: t(AlgoliaIndex.Concerts),
                count: searchResults?.facets?.type?.concerts ?? 0,
              },
              {
                value: AlgoliaIndex.Bands,
                label: t(AlgoliaIndex.Bands),
                count: searchResults?.facets?.type?.bands ?? 0,
              },
              {
                value: AlgoliaIndex.Locations,
                label: t(AlgoliaIndex.Locations),
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
                  return <SearchResultItem key={result.objectID} result={result} />
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
          const indexName = response.index as `${AlgoliaIndex}`

          if (response.nbHits === 0) {
            return null
          }

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
                {response.hits.map(hit => {
                  return <SearchResultItem key={hit.objectID} result={hit} />
                })}
              </ul>
            </div>
          )
        })
      )}
    </section>
  )
}

function SearchResultItem({ result }: { result: SearchResult }) {
  const { data: lastSearched } = useLastSearched()
  const saveLastSearched = useSaveLastSearched()

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
      {result.type === 'concerts' ? (
        <ConcertItem concert={result} />
      ) : result.type === 'bands' ? (
        <BandItem band={result} />
      ) : result.type === 'locations' ? (
        <LocationItem location={result} />
      ) : null}
    </li>
  )
}
