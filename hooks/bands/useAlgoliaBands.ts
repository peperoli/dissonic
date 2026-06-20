import { BandFetchOptions } from '@/types/types'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { searchClient } from '@algolia/client-search'
import { BandRecord } from '@/types/algolia'

function createAlgoliaClient() {
  return searchClient(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY
  )
}

async function fetchAlgoliaBands(options: BandFetchOptions | undefined) {
  const algolia = createAlgoliaClient()
  const filters: string[] = []

  if (options?.countries && options.countries.length > 0) {
    filters.push(options.countries.map(country => `country.id:${country}`).join(' OR '))
  }

  if (options?.genres && options.genres.length > 0) {
    filters.push(options.genres.map(genre => `genres.id:${genre}`).join(' OR '))
  }

  const response = await algolia.searchSingleIndex<BandRecord>({
    indexName: 'bands',
    searchParams: {
      query: options?.search || '',
      hitsPerPage: 25,
      filters: filters.map(filter => `(${filter})`).join(' AND '),
      facets: ['country.id', 'genres.id'],
      page: (options?.page || 1) - 1,
      maxValuesPerFacet: 1000,
    },
  })

  return {
    hits: response.hits,
    count: response.nbHits,
    facets: response.facets as {
      'genres.id': Record<number, number>
      'country.id': Record<number, number>
    },
  }
}

export function useAlgoliaBands(fetchOptions: BandFetchOptions) {
  return useQuery({
    queryKey: ['algolia-bands', fetchOptions],
    queryFn: () => fetchAlgoliaBands(fetchOptions),
    placeholderData: previousData => keepPreviousData(previousData),
  })
}
