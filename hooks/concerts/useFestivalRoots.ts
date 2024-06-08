import supabase from '@/utils/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Tables } from '@/types/supabase'
import { FestivalRootFetchOptions } from '@/types/types'

async function fetchLocations(
  options?: FestivalRootFetchOptions
): Promise<Tables<'festival_roots'>[]> {
  let query = supabase.from('festival_roots').select('*')

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

export const useFestivalRoots = (enabled?: boolean | null, options?: FestivalRootFetchOptions) => {
  return useQuery({
    queryKey: ['festivalRoots'],
    queryFn: () => fetchLocations(options),
    enabled: enabled !== false,
  })
}
