import { GenreFetchOptions, QueryOptions } from '@/types/types'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { createAlgoliaClient } from '@/utils/algolia/client'
import { AlgoliaIndex } from '@/lib/algolia'

type FetchOptions = Pick<GenreFetchOptions, 'search'>

async function searchGenresFacet(options: FetchOptions) {
  const algolia = createAlgoliaClient()

  const response = await algolia.searchForFacetValues({
    indexName: AlgoliaIndex.Bands,
    facetName: 'genres.name',
    searchForFacetValuesRequest: {
      facetQuery: options.search,
      'maxFacetHits': 100,
    },
  })

  return response.facetHits
}

export function useSearchGenresFacet(options: FetchOptions & Pick<QueryOptions<unknown>, 'enabled'>) {
  const { enabled, ...fetchOptions } = options

  return useQuery({
    queryKey: ['search-genres-facet', options],
    queryFn: () => searchGenresFacet(fetchOptions),
    placeholderData: previousData => keepPreviousData(previousData),
    enabled: enabled !== false,
  })
}
