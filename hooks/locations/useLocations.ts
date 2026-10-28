import supabase from '@/utils/supabase/client'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getPagination } from '@/lib/getPagination'
import { ExtendedRes, Location, LocationFetchOptions, QueryOptions } from '@/types/types'

type FetchOptions = Pick<LocationFetchOptions, 'ids' | 'page' | 'size'>

async function fetchLocations(options?: FetchOptions): Promise<ExtendedRes<Location[]>> {
  const [from, to] = getPagination(options?.page, options?.size)

  let countQuery = supabase
    .from('locations')
    .select('*', { count: 'estimated', head: true })
    .eq('is_archived', false)
    .order('name')

  let dataQuery = supabase.from('locations').select('*').eq('is_archived', false).order('name')

  if (options?.ids && options.ids.length > 0) {
    countQuery = countQuery.in('id', options.ids)
    dataQuery = dataQuery.in('id', options.ids)
  }

  if (options?.page || options?.size) {
    countQuery = countQuery.range(from, to)
    dataQuery = dataQuery.range(from, to)
  }

  const { count } = await countQuery

  const { data, error } = await dataQuery

  if (error) {
    throw error
  }

  return { data, count }
}

export const useLocations = (
  options: FetchOptions & QueryOptions<ExtendedRes<Location[]>> = {}
) => {
  const { placeholderData, enabled, ...fetchOptions } = options
  return useQuery({
    queryKey: ['locations', JSON.stringify(fetchOptions)],
    queryFn: () => fetchLocations(fetchOptions),
    placeholderData: previousData => keepPreviousData(previousData || placeholderData),
    enabled: enabled !== false,
  })
}
