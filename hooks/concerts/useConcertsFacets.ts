import { ConcertFetchOptions, QueryOptions } from '@/types/types'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ConcertRecord } from '@/types/algolia'
import { createAlgoliaClient } from '@/utils/algolia/client'
import { getUnixTimestamp } from '@/lib/date'

type FetchOptions = Pick<
  ConcertFetchOptions,
  'bands' | 'locations' | 'dateRange' | 'years' | 'festivalRoots' | 'bandsSeenUsers'
>

async function fetchConcertsFacets(options: FetchOptions) {
  const algolia = createAlgoliaClient()
  const filters: string[] = []

  if (options.dateRange) {
    const startDate = options.dateRange[0]
    const endDate = options.dateRange[1]

    if (startDate) {
      filters.push(`date_start_unix >= ${getUnixTimestamp(startDate)}`)
    }

    if (endDate) {
      filters.push(`date_start_unix <= ${getUnixTimestamp(endDate)}`)
    }
  }
  if (options.bands && options.bands.length > 0) {
    filters.push(options.bands.map(band => `bands.id:${band}`).join(' OR '))
  }

  if (options.locations && options.locations.length > 0) {
    filters.push(options.locations.map(location => `location.id:${location}`).join(' OR '))
  }

  if (options.years && options.years.length > 0) {
    filters.push(`date_start_unix >= ${getUnixTimestamp(`${options.years[0]}-01-01`)}`)
    filters.push(`date_start_unix <= ${getUnixTimestamp(`${options.years[1]}-12-31`)}`)
  }

  if (options.festivalRoots && options.festivalRoots.length > 0) {
    filters.push(
      options.festivalRoots.map(festivalRoot => `festival_root.id:${festivalRoot}`).join(' OR ')
    )
  }

  if (options?.bandsSeenUsers && options.bandsSeenUsers.length > 0) {
    filters.push(options.bandsSeenUsers.map(userId => `fan_ids:${userId}`).join(' OR '))
  }

  const response = await algolia.searchSingleIndex<
    Omit<ConcertRecord, 'date_start_unix' | 'date_end_unix'>
  >({
    indexName: 'concerts',
    searchParams: {
      attributesToRetrieve: ['*', '-date_start_unix', '-date_end_unix'],
      attributesToHighlight: [],
      filters: filters.map(filter => `(${filter})`).join(' AND '),
      facets: ['date_start_unix', 'bands.id', 'location.id', 'festival_root.id'],
      maxValuesPerFacet: 1000,
      hitsPerPage: 0,
    },
  })

  return response.facets as {
    'bands.id': Record<number, number>
    'location.id': Record<number, number>
    'festival_root.id': Record<number, number>
  }
}

export function useConcertsFacets(options: FetchOptions & Pick<QueryOptions<unknown>, 'enabled'>) {
  const { enabled, ...fetchOptions } = options

  return useQuery({
    queryKey: ['search-concerts', fetchOptions],
    queryFn: () => fetchConcertsFacets(fetchOptions),
    placeholderData: previousData => keepPreviousData(previousData),
    enabled: enabled !== false,
  })
}
