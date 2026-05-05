import supabase from '@/utils/supabase/client'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ExtendedRes, FestivalRoot, FestivalRootFetchOptions, QueryOptions } from '@/types/types'

async function fetchFestivalRoots(
  options?: FestivalRootFetchOptions
): Promise<ExtendedRes<FestivalRoot[]>> {
  const searchString = options?.search && options.search.length > 1 ? options.search : null

  let query = searchString
    ? supabase.rpc('search_festival_roots', { search_string: searchString }, { count: 'estimated' })
    : supabase.from('festival_roots').select('*, default_location:locations(*)', {
        count: 'estimated',
      })

  if (options?.ids && options.ids.length > 0) {
    query = query.in('id', options.ids)
  }

  if (options?.sort) {
    query = query.order(options.sort.sort_by, { ascending: options.sort.sort_asc })
  }

  if (options?.size) {
    query = query.limit(options.size)
  }

  const { data, count, error } = await query

  if (error) {
    throw error
  }

  return { data, count }
}

export const useFestivalRoots = (
  options: FestivalRootFetchOptions & QueryOptions<FestivalRoot[]> = {}
) => {
  const { placeholderData, enabled, ...fetchOptions } = options
  return useQuery({
    queryKey: ['festivalRoots', JSON.stringify(fetchOptions)],
    queryFn: () => fetchFestivalRoots(fetchOptions),
    placeholderData: previousData =>
      keepPreviousData(previousData || { data: placeholderData ?? [], count: 0 }),
    enabled: enabled !== false,
  })
}
