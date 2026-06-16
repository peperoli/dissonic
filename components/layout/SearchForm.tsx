'use client'

import { useLastSearched, useSaveLastSearched } from '@/hooks/search/lastSearched'
import { Database } from '@/types/supabase'
import { Band, Concert, Location } from '@/types/types'
import { searchClient } from '@algolia/client-search'
import { SearchIcon, XIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { InstantSearch, SearchBox, useHits, useInstantSearch, useMenu } from 'react-instantsearch'
import { Button } from '../Button'
import { BandItem } from '../bands/BandItem'
import { ConcertItem } from '../concerts/ConcertItem'
import { SegmentedControl } from '../controls/SegmentedControl'
import { LocationItem } from '../locations/LocationItem'
import { SpinnerIcon } from './SpinnerIcon'

export type SearchResult = Database['public']['CompositeTypes']['search_result']

function createAlgoliaClient() {
  return searchClient(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY
  )
}


export function SearchForm() {
  const [isHitsVisible, setIsHitsVisible] = useState(false)
  const timerId = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { data: lastSearched } = useLastSearched()
  const t = useTranslations('SearchForm')

  useEffect(() => {
    return () => {
      if (timerId.current) {
        clearTimeout(timerId.current)
      }
    }
  }, [])

  return (
    <section>
      <div className="sticky top-0 z-10 -m-4 grid gap-4 bg-slate-800 p-4">
        <InstantSearch searchClient={createAlgoliaClient()} indexName="global_index">
          <SearchBox
            queryHook={(query, search) => {
              setIsHitsVisible(query.length > 0)

              if (timerId.current) {
                clearTimeout(timerId.current)
              }

              timerId.current = setTimeout(() => search(query), 100)
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
          {isHitsVisible ? (
            <NoResultsBoundary>
              <CustomMenu />
              <CustomHits />
            </NoResultsBoundary>
          ) : (
            lastSearched && (
              <div>
                <h2 className="h3">{t('lastSearched')}</h2>
                <ul>
                  {lastSearched.map(result => {
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

function CustomMenu() {
  const { items, refine } = useMenu({ attribute: 'type', sortBy: ['count:desc'] })
  const t = useTranslations('SearchForm')

  return (
    <SegmentedControl
      options={[
        { value: 'all', label: t('all') },
        ...items.map(item => ({ value: item.value, label: t(item.value), count: item.count })),
      ]}
      value={items.find(item => item.isRefined)?.value || 'all'}
      onValueChange={value => refine(value === 'all' ? '' : value)}
    />
  )
}

function CustomHits() {
  const { items: hits } = useHits<SearchResult>()
  const { items: menuItems, refine } = useMenu({ attribute: 'type' })
  const groupedHits = Object.groupBy(hits, hit => hit.type ?? 'unknown')
  const t = useTranslations('SearchForm')
  const selectedType = menuItems.find(item => item.isRefined)?.value ?? 'all'

  return (
    <div>
      {Object.entries(groupedHits).map(([type, hits]) => {
        if (!hits?.length) {
          return null
        }

        return (
          <div key={type} className="mt-6">
            <div className="flex items-center justify-between">
              <h2 className="h3">{t(type)}</h2>
              {selectedType === 'all' && hits.length > 3 && (
                <Button label={t('showAll')} onClick={() => refine(type)} size="small" />
              )}
            </div>
            <ul>
              {hits.slice(0, selectedType === 'all' ? 3 : undefined).map(result => {
                return <SearchResultItem key={result.id} result={result} />
              })}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

function NoResultsBoundary({ children }: { children: ReactNode }) {
  const { results, indexUiState } = useInstantSearch()
  const t = useTranslations('SearchForm')

  // The `__isArtificial` flag makes sure not to display the No Results message
  // when no hits have been returned.
  if (!results.__isArtificial && results.nbHits === 0) {
    return (
      <>
        <div>
          <p className="text-slate-300">{t('noResults', { query: indexUiState.query })}</p>
        </div>
        <div hidden>{children}</div>
      </>
    )
  }

  return children
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
