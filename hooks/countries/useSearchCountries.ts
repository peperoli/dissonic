import { CountryFetchOptions, QueryOptions } from '@/types/types'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { CountryRecord } from '@/types/algolia'
import { createAlgoliaClient } from '@/utils/algolia/client'
import { AlgoliaIndex } from '@/lib/algolia'

async function searchCountries(options: CountryFetchOptions | undefined) {
  const algolia = createAlgoliaClient()
  const filters: string[] = []

  if (options?.iso2 && options.iso2.length > 0) {
    filters.push(options.iso2.map(iso2 => `country_iso2:${iso2}`).join(' OR '))
  }

  const response = await algolia.searchSingleIndex<CountryRecord>({
    indexName: AlgoliaIndex.Countries,
    searchParams: {
      query: options?.search,
      hitsPerPage: 1000,
    },
  })

  return {
    data: response.hits,
    count: response.nbHits ?? null,
  }
}

export function useSearchCountries(
  options: CountryFetchOptions & Pick<QueryOptions<unknown>, 'enabled'>
) {
  const { enabled, ...fetchOptions } = options

  return useQuery({
    queryKey: ['search-countries', fetchOptions],
    queryFn: () => searchCountries(fetchOptions),
    placeholderData: previousData => keepPreviousData(previousData),
    enabled: enabled !== false,
  })
}
