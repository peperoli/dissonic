import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { createAlgoliaClient } from '@/utils/algolia/client'
import { SearchResult } from '@/components/layout/SearchForm'

type GlobalSearchFetchOptions = {
  search: string
  type?: string | null
}

async function fetchGlobalSearch(options: GlobalSearchFetchOptions) {
  const algolia = createAlgoliaClient()
  const filters: string[] = []
  const { search, type } = options

  if (type) {
    filters.push(`type:${type}`)
  }

  const { results } = await algolia.search([
    {
      indexName: 'global_index',
      params: {
        query: search,
        hitsPerPage: 1000,
        filters: filters.map(filter => `(${filter})`).join(' AND '),
        facets: ['type'],
        maxValuesPerFacet: 1000,
      },
    },
    {
      indexName: 'global_index',
      params: {
        query: search,
        facets: ['type'],
        hitsPerPage: 0,
        analytics: false,
      },
    },
  ])

  return {
    data: 'hits' in results[0] ? (results[0].hits as SearchResult[]) : [],
    count: 'nbHits' in results[1] ? results[1].nbHits : null,
    facets:
      'facets' in results[1]
        ? (results[1].facets as {
            type: Record<string, number>
          })
        : {
            type: {},
          },
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
