'use client'

import { useLastSearched, useSaveLastSearched } from '@/hooks/search/lastSearched'
import { Database } from '@/types/supabase'
import { Band, Concert, Location } from '@/types/types'
import { algoliasearch } from 'algoliasearch'
import { SearchIcon, XIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { InstantSearch, RefinementList, SearchBox, useHits } from 'react-instantsearch'
import { Button } from '../Button'
import { BandItem } from '../bands/BandItem'
import { ConcertItem } from '../concerts/ConcertItem'
import { SegmentedControl } from '../controls/SegmentedControl'
import { LocationItem } from '../locations/LocationItem'
import { SpinnerIcon } from './SpinnerIcon'

export type SearchResult = Database['public']['CompositeTypes']['search_result']

export function SearchForm() {
  const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY
  )
  const [selectedType, setSelectedType] = useState('all')
  const [isHitsVisible, setIsHitsVisible] = useState(false)
  const { data: lastSearched } = useLastSearched()
  const t = useTranslations('SearchForm')

  return (
    <section>
      <div className="sticky top-0 z-10 -m-4 grid gap-4 bg-slate-800 p-4">
        <InstantSearch searchClient={searchClient} indexName="global_index">
          <SearchBox
            queryHook={(query, search) => {
              let timerId = null
              setIsHitsVisible(query.length > 0)

              if (timerId) {
                clearTimeout(timerId)
              }

              timerId = setTimeout(() => search(query), 100)
            }}
            placeholder="Search ..."
            // @ts-expect-error - algolia and lucide props not compatible
            submitIconComponent={SearchIcon}
            loadingIconComponent={SpinnerIcon}
            // @ts-expect-error - algolia and lucide props not compatible
            resetIconComponent={XIcon}
            classNames={{
              form: 'form-control',
              input: 'min-w-48 !pl-10',
              submit: 'absolute top-1/2 ml-3 size-icon -translate-y-1/2',
              loadingIndicator: 'absolute right-0 m-2.5 size-icon animate-spin text-slate-300',
              reset: 'btn btn-icon btn-small absolute right-0 m-1 size-icon',
            }}
          />
          <RefinementList attribute="type" />
          {(!!lastSearched?.length || isHitsVisible) && (
            <SegmentedControl
              options={[
                { value: 'all', label: t('all') },
                { value: 'concerts', label: t('concerts') },
                { value: 'bands', label: t('bands') },
                { value: 'locations', label: t('locations') },
              ]}
              value={selectedType}
              onValueChange={setSelectedType}
            />
          )}
          {isHitsVisible ? (
            <CustomHits selectedType={selectedType} setSelectedType={setSelectedType} />
          ) : (
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
          )}
        </InstantSearch>
      </div>
    </section>
  )
}

function CustomHits({
  selectedType,
  setSelectedType,
}: {
  selectedType: string
  setSelectedType: (type: string) => void
}) {
  const { items, results } = useHits<SearchResult>()
  const groupedResults = Object.groupBy(items, item => item.type ?? 'unknown')
  const t = useTranslations('SearchForm')
  console.log('Algolia search results:', results)
  console.log('Algolia search items:', items)

  return (
    <div>
      {Object.entries(groupedResults).map(([type, results]) => (
        <div key={type} className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="h3">{t(type)}</h2>
            {selectedType === 'all' && results?.length > 3 && (
              <Button label={t('showAll')} onClick={() => setSelectedType(type)} size="small" />
            )}
          </div>
          <ul>
            {results?.slice(0, selectedType === 'all' ? 3 : undefined).map(result => {
              return <SearchResultItem key={result.id} result={result} />
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}

function SearchResultItem({ result }: { result: SearchResult }) {
  const { data: lastSearched } = useLastSearched()
  const saveLastSearched = useSaveLastSearched()

  function handleClick() {
    if (lastSearched) {
      const withoutDuplicates = lastSearched.filter(
        item => !(item.type === result.type && item.id === result.id)
      )
      saveLastSearched.mutate([result, ...withoutDuplicates].slice(0, 20))
    } else {
      saveLastSearched.mutate([result])
    }
  }

  return (
    <li key={`${result.type}${result.id}`} onClick={handleClick}>
      {result.type === 'concerts' ? (
        <ConcertItem
          concert={
            {
              id: result.id,
              name: result.name,
              festival_root: result.festival_root ? { name: result.festival_root } : null,
              date_start: result.date_start,
              date_end: result.date_end,
              bands: result.bands,
              location: { name: result.location, city: result.city },
            } as Concert
          }
        />
      ) : result.type === 'bands' ? (
        <BandItem
          band={
            {
              id: result.id,
              name: result.name,
              country: { iso2: result.country },
              genres: result.genres?.map(item => ({ name: item })),
              spotify_artist_images: result.image ? [{ url: result.image }] : null,
              spotify_artist_id: result.spotify_artist_id,
            } as Band
          }
        />
      ) : result.type === 'locations' ? (
        <LocationItem
          location={
            {
              id: result.id,
              image: result.image,
              name: result.name,
              city: result.city,
            } as Location
          }
        />
      ) : (
        <div key={result.id}>{result.name}</div>
      )}
    </li>
  )
}
