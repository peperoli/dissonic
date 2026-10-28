import { QueryOptions } from '@/types/types'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { createAlgoliaClient } from '@/utils/algolia/client'
import { AlgoliaIndex } from '@/lib/algolia'

type FetchOptions = { search: string; size?: number }

async function searchFacet(indexName: AlgoliaIndex, facetName: string, options: FetchOptions) {
  const algolia = createAlgoliaClient()

  const response = await algolia.searchForFacetValues({
    indexName,
    facetName,
    searchForFacetValuesRequest: {
      facetQuery: options.search,
      maxFacetHits: 100,
    },
  })

  return response.facetHits
}

export function useSearchFacet(
  indexName: AlgoliaIndex,
  facetName: string,
  options: FetchOptions & Pick<QueryOptions<unknown>, 'enabled'>
) {
  const { enabled, ...fetchOptions } = options

  return useQuery({
    queryKey: ['search-facet', indexName, facetName, fetchOptions],
    queryFn: () => searchFacet(indexName, facetName, fetchOptions),
    placeholderData: previousData => keepPreviousData(previousData),
    enabled: enabled !== false,
  })
}
