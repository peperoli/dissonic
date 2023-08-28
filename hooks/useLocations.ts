import { useQuery } from '@tanstack/react-query'
import { getPagination } from '../lib/getPagination'
import { ExtendedRes, FetchOptions, Location } from '../types/types'
import supabase from '../utils/supabase'

async function fetchLocations(options?: FetchOptions): Promise<ExtendedRes<Location[]>> {
  let query = supabase.from('locations').select('*', { count: 'estimated' })

  if (options?.filter?.search) {
    query = query.ilike('name', `%${options.filter.search.replace(' ', '%')}%`)
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
  initialLocations?: ExtendedRes<Location[]>,
  options?: FetchOptions
) => {
  return useQuery(['locations', JSON.stringify(options)], () => fetchLocations(options), {
    initialData: initialLocations,
    keepPreviousData: true,
  })
}
