import supabase from '@/utils/supabase/client'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getPagination } from '@/lib/getPagination'
import { ExtendedRes, Location, LocationFetchOptions, QueryOptions } from '@/types/types'

async function fetchLocations(options?: LocationFetchOptions): Promise<ExtendedRes<Location[]>> {
  function getQuery(type: 'data' | 'count') {
    const [from, to] = getPagination(options?.page, options?.size)

    let query =
      type === 'count'
        ? supabase.from('locations').select('*', { count: 'estimated', head: true })
        : supabase.from('locations').select('*, country:countries(id, iso2)')

    if (options?.search && options.search.length > 1) {
      query =
        type === 'count'
          ? supabase.rpc(
              'search_locations',
              { search_string: options.search },
              { count: 'estimated', head: true }
            )
          : supabase.rpc('search_locations', { search_string: options.search })
    }

    query = query.eq('is_archived', false).order('name')

    if (options?.ids && options.ids.length > 0) {
      query = query.in('id', options.ids)
    }

    if (options?.page || options?.size) {
      query = query.range(from, to)
    }

    return query
  }

  const { data, error } = await getQuery('data')

  const { count } = await getQuery('count')

  if (error) {
    throw error
  }

  return { data, count }
}

export const useLocations = (
  options: LocationFetchOptions & QueryOptions<ExtendedRes<Location[]>> = {}
) => {
  const { placeholderData, enabled, ...fetchOptions } = options
  return useQuery({
    queryKey: ['locations', JSON.stringify(fetchOptions)],
    queryFn: () => fetchLocations(fetchOptions),
    placeholderData: previousData => keepPreviousData(previousData || placeholderData),
    enabled: enabled !== false,
  })
}
