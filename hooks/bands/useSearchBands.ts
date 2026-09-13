import { BandFetchOptions, QueryOptions } from '@/types/types'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { BandRecord } from '@/types/algolia'
import { createAlgoliaClient } from '@/utils/algolia/client'

async function searchBands(options: BandFetchOptions | undefined) {
  const algolia = createAlgoliaClient()
  const filters: string[] = []

  if (options?.countries && options.countries.length > 0) {
    filters.push(options.countries.map(country => `countries_iso2:${country}`).join(' OR '))
  }

  if (options?.genres && options.genres.length > 0) {
    filters.push(options.genres.map(genre => `genres.id:${genre}`).join(' OR '))
  }

  const response = await algolia.searchSingleIndex<BandRecord>({
    indexName: 'bands',
    searchParams: {
      query: options?.search,
      hitsPerPage: options?.size ?? 25,
      filters: filters.map(filter => `(${filter})`).join(' AND '),
      facets: ['countries_iso2', 'genres.id'],
      page: (options?.page || 1) - 1,
      maxValuesPerFacet: 1000,
    },
  })

  return {
    data: response.hits,
    count: response.nbHits ?? null,
    facets: response.facets as {
      'countries_iso2': Record<number, number>
      'genres.id': Record<number, number>
    },
  }
}

export function useSearchBands(options: BandFetchOptions & Pick<QueryOptions<unknown>, 'enabled'>) {
  const { enabled, ...fetchOptions } = options

  return useQuery({
    queryKey: ['search-bands', fetchOptions],
    queryFn: () => searchBands(fetchOptions),
    placeholderData: previousData => keepPreviousData(previousData),
    enabled: enabled !== false,
  })
}
