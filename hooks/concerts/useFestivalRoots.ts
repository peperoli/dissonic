import supabase from '@/utils/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Tables } from '@/types/supabase'

async function fetchLocations(options?: { ids?: number[] | null }): Promise<Tables<'festival_roots'>[]> {
  const query = supabase.from('festival_roots').select('*')

  if (options?.ids && options.ids.length > 0) {
    query.in('id', options.ids)
  }

  const { data, error } = await query

  if (error) {
    throw error
  }

  return data
}

export const useFestivalRoots = (enabled?: boolean | null, options?: { ids?: number[] | null }) => {
  return useQuery(['festivalRoots'], () => fetchLocations(options), {
    enabled: enabled !== false,
  })
}
