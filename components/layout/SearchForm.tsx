'use client'

import { useState } from 'react'
import { SearchField } from '../forms/SearchField'
import { useSearch } from '@/hooks/search/useSearch'
import { Database } from '@/types/supabase'
import { useTranslations } from 'next-intl'
import { Band, Concert, Location } from '@/types/types'
import { ConcertItem } from '../concerts/ConcertItem'
import { Button } from '../Button'
import { BandItem } from '../bands/BandItem'
import { LocationItem } from '../locations/LocationItem'
import { SegmentedControl } from '../controls/SegmentedControl'
import { useDebounce } from '@/hooks/helpers/useDebounce'

type SearchResult = Database['public']['CompositeTypes']['search_result']

export function SearchForm() {
  const [searchString, setSearchString] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const debouncedSearchString = useDebounce(searchString, 100)

  const { data: searchResults, isFetching } = useSearch({
    searchString: debouncedSearchString,
    type: selectedType === 'all' ? null : selectedType,
  })
  const t = useTranslations('SearchForm')

  function groupResultsByType(results: SearchResult[]) {
    const groupedResults: Record<string, typeof results> = {}
    results?.forEach(result => {
      const type = result.type as string
      if (!groupedResults[type]) {
        groupedResults[type] = []
      }
      groupedResults[type].push(result)
    })
    return Object.entries(groupedResults)
  }
  return (
    <section>
      <div className="sticky top-0 z-10 -m-4 grid gap-4 bg-slate-800 p-4">
        <SearchField
          name="globalSearch"
          query={searchString}
          setQuery={setSearchString}
          isLoading={isFetching}
        />
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
      </div>
      {groupResultsByType(searchResults ?? []).map(([type, results]) => {
        return (
          <div key={type} className="mt-6">
            <div className="flex items-center justify-between">
              <h2 className="h3">{t(type)}</h2>
              {selectedType === 'all' && results.length > 3 && (
                <Button label={t('showAll')} onClick={() => setSelectedType(type)} size="small" />
              )}
            </div>
            <ul>
              {results?.slice(0, selectedType === 'all' ? 3 : undefined).map(result => {
                if (type === 'concerts') {
                  return (
                    <li key={result.id}>
                      <ConcertItem
                        concert={
                          {
                            id: result.id,
                            name: result.name,
                            festival_root: result.festival_root
                              ? { name: result.festival_root }
                              : null,
                            date_start: result.date_start,
                            date_end: result.date_end,
                            bands: result.bands,
                            location: { name: result.location, city: result.city },
                          } as Concert
                        }
                      />
                    </li>
                  )
                }

                if (type === 'bands') {
                  return (
                    <li key={result.id}>
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
                    </li>
                  )
                }

                if (type === 'locations') {
                  return (
                    <li key={result.id}>
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
                    </li>
                  )
                }

                return <li key={result.id}>{result.name}</li>
              })}
            </ul>
          </div>
        )
      })}
    </section>
  )
}
