import { BandFetchOptions, QueryOptions } from '@/types/types'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { BandRecord } from '@/types/algolia'
import { createAlgoliaClient } from '@/utils/algolia/client'

async function fetchSimilarBands(options: Pick<BandFetchOptions, 'search' | 'size'> | undefined) {
  const algolia = createAlgoliaClient()

  const response = await algolia.searchSingleIndex<BandRecord>({
    indexName: 'bands',
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

export function useSimilarBands(
  options: Pick<BandFetchOptions, 'search' | 'size'> & Pick<QueryOptions<unknown>, 'enabled'>
) {
  const { enabled, ...fetchOptions } = options

  return useQuery({
    queryKey: ['similar-bands', fetchOptions],
    queryFn: () => fetchSimilarBands(fetchOptions),
    placeholderData: previousData => keepPreviousData(previousData),
    enabled: enabled !== false,
  })
}
