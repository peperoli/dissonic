import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { createAlgoliaClient } from '@/utils/algolia/client'
import { BandRecord, ConcertRecord, AlgoliaIndex, LocationRecord } from '@/types/algolia'

type GlobalSearchFetchOptions = {
  search: string
  type?: string | null
}

async function fetchGlobalSearch(options: GlobalSearchFetchOptions) {
  const algolia = createAlgoliaClient()
  const types = [AlgoliaIndex.Concerts, AlgoliaIndex.Bands, AlgoliaIndex.Locations] as const

  const typeQueries = types
    .filter(type => options.type === null || options.type === type)
    .map(t => ({
      indexName: t,
      params: {
        query: options.search,
        hitsPerPage: options.type !== t ? 4 : 1000,
        getRankingInfo: true,
      },
    }))

  const { results: typeResults } = await algolia.searchForHits<
    ConcertRecord | BandRecord | LocationRecord
  >([...typeQueries])

  return {
    data: typeResults.sort(
      (a, b) => a.hits[0]._rankingInfo!.nbTypos - b.hits[0]._rankingInfo!.nbTypos
    ),
    count: typeResults.reduce((sum, result) => sum + (result.nbHits || 0), 0),
    facets: {
      type: Object.fromEntries(
        types.map(t => [t, typeResults.find(result => result.index === t)?.nbHits ?? 0])
      ),
    },
  }
}

export function useGlobalSearch(options: GlobalSearchFetchOptions & { enabled?: boolean }) {
  const { enabled, ...fetchOptions } = options

  return useQuery({
    queryKey: ['search-global', fetchOptions],
    queryFn: () => fetchGlobalSearch(fetchOptions),
    placeholderData: previousData => keepPreviousData(previousData),
    enabled: enabled !== false,
  })
}
