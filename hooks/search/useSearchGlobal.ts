import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { createAlgoliaClient } from '@/utils/algolia/client'
import { BandRecord, ConcertRecord, LocationRecord } from '@/types/algolia'
import { AlgoliaIndex } from '@/lib/algolia'
import { SearchResponse } from '@algolia/client-search'

type SearchGlobalFetchOptions = {
  search: string
  type?: string | null
}

function sortByFirstHitRanking(a: SearchResponse, b: SearchResponse) {
  let diff = 0
  const aRankingInfo = a.hits[0]?._rankingInfo
  const bRankingInfo = b.hits[0]?._rankingInfo

  if (!aRankingInfo || !bRankingInfo) {
    return 0
  }

  diff = aRankingInfo.nbTypos - bRankingInfo.nbTypos

  if (diff === 0) {
    diff = aRankingInfo.firstMatchedWord - bRankingInfo.firstMatchedWord
  }

  return diff
}

async function searchGlobal(options: SearchGlobalFetchOptions) {
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
    data: typeResults.toSorted(sortByFirstHitRanking),
    count: typeResults.reduce((sum, result) => sum + (result.nbHits || 0), 0),
    facets: {
      type: Object.fromEntries(
        types.map(t => [t, typeResults.find(result => result.index === t)?.nbHits ?? 0])
      ),
    },
  }
}

export function useSearchGlobal(options: SearchGlobalFetchOptions & { enabled?: boolean }) {
  const { enabled, ...fetchOptions } = options

  return useQuery({
    queryKey: ['search-global', fetchOptions],
    queryFn: () => searchGlobal(fetchOptions),
    placeholderData: previousData => keepPreviousData(previousData),
    enabled: enabled !== false,
  })
}
