import { LocationFetchOptions, QueryOptions } from '@/types/types'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { LocationRecord } from '@/types/algolia'
import { createAlgoliaClient } from '@/utils/algolia/client'
import { AlgoliaIndex } from '@/lib/algolia'

async function fetchSimilarLocations(options: Pick<LocationFetchOptions, 'search' | 'size'> | undefined) {
  const algolia = createAlgoliaClient()

  const response = await algolia.searchSingleIndex<LocationRecord>({
    indexName: AlgoliaIndex.Locations,
    searchParams: {
      query: options?.search,
      hitsPerPage: options?.size ?? 25,
      restrictSearchableAttributes: ['name'],
    },
  })

  return {
    data: response.hits,
    count: response.nbHits ?? null,
  }
}

export function useSimilarLocations(
  options: Pick<LocationFetchOptions, 'search' | 'size'> & Pick<QueryOptions<unknown>, 'enabled'>
) {
  const { enabled, ...fetchOptions } = options

  return useQuery({
    queryKey: ['similar-locations', fetchOptions],
    queryFn: () => fetchSimilarLocations(fetchOptions),
    placeholderData: previousData => keepPreviousData(previousData),
    enabled: enabled !== false,
  })
}
