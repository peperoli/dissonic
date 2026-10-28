import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { FestivalRootFetchOptions, QueryOptions } from '@/types/types'
import { createAlgoliaClient } from '@/utils/algolia/client'
import { FestivalRootRecord } from '@/types/algolia'

type FetchOptions = Pick<FestivalRootFetchOptions, 'search' | 'size'>

async function fetchSearchFestivalRoots(options?: FetchOptions) {
  const algolia = createAlgoliaClient()

  const response = await algolia.searchSingleIndex<FestivalRootRecord>({
    indexName: 'festival_roots',
    searchParams: {
      query: options?.search,
      hitsPerPage: options?.size ?? 25,
      maxValuesPerFacet: 1000,
    },
  })

  return {
    data: response.hits,
    count: response.nbHits ?? null,
  }
}

export const useSearchFestivalRoots = (
  options: FetchOptions & Pick<QueryOptions<unknown>, 'enabled'>
) => {
  const { enabled, ...fetchOptions } = options
  return useQuery({
    queryKey: ['search-festival-roots', fetchOptions],
    queryFn: () => fetchSearchFestivalRoots(fetchOptions),
    placeholderData: previousData => keepPreviousData(previousData),
    enabled: enabled !== false,
  })
}
