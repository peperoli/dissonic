import { GenreFetchOptions, QueryOptions } from '@/types/types'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { GenreRecord } from '@/types/algolia'
import { createAlgoliaClient } from '@/utils/algolia/client'
import { AlgoliaIndex } from '@/lib/algolia'

async function searchGenres(options: Omit<GenreFetchOptions, 'ids'> | undefined) {
  const algolia = createAlgoliaClient()

  const response = await algolia.searchSingleIndex<GenreRecord>({
    indexName: AlgoliaIndex.Genres,
    searchParams: {
      query: options?.search,
      hitsPerPage: options?.size ?? 25,
      page: (options?.page || 1) - 1,
    },
  })

  return {
    data: response.hits,
    count: response.nbHits ?? null,
  }
}

export function useSearchGenres(
  options: GenreFetchOptions & Pick<QueryOptions<unknown>, 'enabled'>
) {
  const { enabled, ...fetchOptions } = options

  return useQuery({
    queryKey: ['search-genres', fetchOptions],
    queryFn: () => searchGenres(fetchOptions),
    placeholderData: previousData => keepPreviousData(previousData),
    enabled: enabled !== false,
  })
}
