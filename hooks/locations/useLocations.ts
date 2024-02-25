import supabase from '@/utils/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { getPagination } from '@/lib/getPagination'
import { ExtendedRes, Location, LocationFetchOptions } from '@/types/types'

async function fetchLocations(options?: LocationFetchOptions): Promise<ExtendedRes<Location[]>> {
  let query = supabase.from('locations').select('*', { count: 'estimated' })

  if (options?.filter?.search) {
    query = supabase.rpc(
      'search_locations',
      { search_string: options.filter.search },
      { count: 'estimated' }
    )
  }

  if (options?.filter?.ids && options.filter.ids.length > 0) {
    query = query.in('id', options.filter.ids)
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
  initialLocations?: ExtendedRes<Location[]> | null,
  options?: LocationFetchOptions
) => {
  return useQuery(['locations', JSON.stringify(options)], () => fetchLocations(options), {
    initialData: initialLocations,
    keepPreviousData: true,
  })
}
