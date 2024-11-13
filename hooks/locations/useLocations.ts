import supabase from '@/utils/supabase/client'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getPagination } from '@/lib/getPagination'
import { ExtendedRes, Location, LocationFetchOptions, QueryOptions } from '@/types/types'

async function fetchLocations(options?: LocationFetchOptions): Promise<ExtendedRes<Location[]>> {
  let query = supabase
    .from('locations')
    .select('*, country:countries(id, iso2)', { count: 'estimated' })

  if (options?.search) {
    // @ts-expect-error
    query = supabase.rpc(
      'search_locations',
      { search_string: options.search },
      { count: 'estimated' }
    )
  }

  if (options?.ids && options.ids.length > 0) {
    query = query.in('id', options.ids)
  }

  const { count: initialCount, error: countError } = await query

  if (countError) {
    throw countError
  }

  const [from, to] = getPagination(options?.page, options?.size, initialCount ?? 0)

  if (options?.page || options?.size) {
    query = query.range(from, to)
  }

  const { data, count, error } = await query.order('name')

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
