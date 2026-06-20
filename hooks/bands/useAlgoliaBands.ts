import { BandFetchOptions, QueryOptions } from '@/types/types'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { BandRecord } from '@/types/algolia'
import { createAlgoliaClient } from '@/utils/algolia/client'

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
      query: options?.search,
      hitsPerPage: options?.size ?? 25,
      filters: filters.map(filter => `(${filter})`).join(' AND '),
      facets: ['country.id', 'genres.id'],
      page: (options?.page || 1) - 1,
      maxValuesPerFacet: 1000,
    },
  })

  return {
    data: response.hits,
    count: response.nbHits ?? null,
    facets: response.facets as {
      'genres.id': Record<number, number>
      'country.id': Record<number, number>
    },
  }
}

export function useAlgoliaBands(options: BandFetchOptions & Pick<QueryOptions<unknown>, 'enabled'>) {
  const { enabled, ...fetchOptions } = options

  return useQuery({
    queryKey: ['algolia-bands', fetchOptions],
    queryFn: () => fetchAlgoliaBands(fetchOptions),
    placeholderData: previousData => keepPreviousData(previousData),
    enabled: enabled !== false,
  })
}
