import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { createAlgoliaClient } from '@/utils/algolia/client'
import { SearchResult } from '@/components/layout/SearchForm'

function getSortedTypes(sortedHits: Pick<SearchResult, 'type'>[]) {
  const types = ['concerts', 'bands', 'locations'] as const
  const sortedTypes = []
  const seen = new Set()
  for (const hit of sortedHits) {
    if (!seen.has(hit.type)) {
      seen.add(hit.type)
      sortedTypes.push(hit.type)
    }
  }

  // fallback for types that are not in the first 20 search results
  for (const type of types) {
    if (!seen.has(type)) {
      sortedTypes.push(type)
    }
  }

  return sortedTypes
}

type GlobalSearchFetchOptions = {
  search: string
  type?: string | null
}

async function fetchGlobalSearch(options: GlobalSearchFetchOptions) {
  const algolia = createAlgoliaClient()

  const rankingAndFacetsResult = await algolia.searchSingleIndex<Pick<SearchResult, 'type'>>({
    indexName: 'global_index',
    searchParams: {
      query: options.search,
      attributesToRetrieve: ['type'],
      facets: ['type'],
      hitsPerPage: 20, // Enough to get the best hits in most cases
      analytics: false,
    },
  })

  const sortedTypes = getSortedTypes(rankingAndFacetsResult.hits)

  const typeQueries = sortedTypes
    .filter(type => options.type === null || options.type === type)
    .map(t => ({
      indexName: 'global_index',
      params: {
        query: options.search,
        hitsPerPage: options.type !== t ? 4 : 1000,
        filters: `type:${t}`,
      },
    }))

  const { results: typeResults } = await algolia.searchForHits<SearchResult>([...typeQueries])

  return {
    data: typeResults.flatMap(result => result.hits),
    count: rankingAndFacetsResult.nbHits,
    facets: rankingAndFacetsResult.facets as { type: Record<string, number> },
  }
}

export function useGlobalSearch(options: GlobalSearchFetchOptions & { enabled?: boolean }) {
  const { enabled, ...fetchOptions } = options

  return useQuery({
    queryKey: ['algolia-bands', fetchOptions],
    queryFn: () => fetchGlobalSearch(fetchOptions),
    placeholderData: previousData => keepPreviousData(previousData),
    enabled: enabled !== false,
  })
}
