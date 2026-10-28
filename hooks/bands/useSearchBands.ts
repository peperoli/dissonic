import { BandFetchOptions, QueryOptions } from '@/types/types'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { BandRecord } from '@/types/algolia'
import { createAlgoliaClient } from '@/utils/algolia/client'

async function searchBands(
  options: Pick<BandFetchOptions, 'search' | 'countries' | 'genres' | 'size' | 'page'> | undefined
) {
  const algolia = createAlgoliaClient()
  const filters: string[] = []

  if (options?.countries && options.countries.length > 0) {
    filters.push(options.countries.map(country => `countries_iso2:${country}`).join(' OR '))
  }

  if (options?.genres && options.genres.length > 0) {
    filters.push(options.genres.map(genre => `genres.id:"${genre}"`).join(' OR '))
  }

  const response = await algolia.searchSingleIndex<BandRecord>({
    indexName: 'bands',
    searchParams: {
      query: options?.search,
      hitsPerPage: options?.size ?? 25,
      filters: filters.map(filter => `(${filter})`).join(' AND '),
      page: (options?.page || 1) - 1,
    },
  })

  return {
    data: response.hits,
    count: response.nbHits ?? null,
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
