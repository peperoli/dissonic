import supabase from '@/utils/supabase/client'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { FestivalRoot, FestivalRootFetchOptions, QueryOptions } from '@/types/types'

async function fetchLocations(options?: FestivalRootFetchOptions): Promise<FestivalRoot[]> {
  let query = supabase.from('festival_roots').select('*, default_location:locations(*)')

  if (options?.search) {
    // @ts-expect-error
    query = supabase.rpc('search_festival_roots', { search_string: options.search })
  }

  if (options?.ids && options.ids.length > 0) {
    query = query.in('id', options.ids)
  }

  if (options?.sort) {
    query = query.order(options.sort.sort_by, { ascending: options.sort.sort_asc })
  }

  const { data, error } = await query

  if (error) {
    throw error
  }

  return data
}

export const useFestivalRoots = (
  options: FestivalRootFetchOptions & QueryOptions<FestivalRoot[]> = {}
) => {
  const { placeholderData, enabled, ...fetchOptions } = options
  return useQuery({
    queryKey: ['festivalRoots', JSON.stringify(fetchOptions)],
    queryFn: () => fetchLocations(fetchOptions),
    placeholderData: previousData => keepPreviousData(previousData || placeholderData),
    enabled: enabled !== false,
  })
}
