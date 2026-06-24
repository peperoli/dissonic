import { LocationFetchOptions, QueryOptions } from '@/types/types'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { LocationRecord } from '@/types/algolia'
import { createAlgoliaClient } from '@/utils/algolia/client'

async function fetchAlgoliaLocations(options: LocationFetchOptions | undefined) {
  const algolia = createAlgoliaClient()
  const filters: string[] = []

  if (options?.countries && options.countries.length > 0) {
    filters.push(options.countries.map(country => `country.id:${country}`).join(' OR '))
  }

  const response = await algolia.searchSingleIndex<LocationRecord>({
    indexName: 'locations',
    searchParams: {
      query: options?.search,
      hitsPerPage: options?.size ?? 25,
      filters: filters.map(filter => `(${filter})`).join(' AND '),
      facets: ['country.id'],
      page: (options?.page || 1) - 1,
      maxValuesPerFacet: 1000,
    },
  })

  return {
    data: response.hits,
    count: response.nbHits ?? null,
    facets: response.facets as {
      'country.id': Record<number, number>
    },
  }
}

export function useAlgoliaLocations(options: LocationFetchOptions & Pick<QueryOptions<unknown>, 'enabled'>) {
  const { enabled, ...fetchOptions } = options

  return useQuery({
    queryKey: ['algolia-locations', fetchOptions],
    queryFn: () => fetchAlgoliaLocations(fetchOptions),
    placeholderData: previousData => keepPreviousData(previousData),
    enabled: enabled !== false,
  })
}
