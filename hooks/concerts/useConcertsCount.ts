import { ConcertFetchOptions } from '@/types/types'
import { useQuery } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'

async function fetchConcertsCount(options?: Pick<ConcertFetchOptions, 'bands' | 'locations'>) {
  let query = supabase.from('concerts_full').select('*, bands!j_concert_bands!inner(*)', { count: 'estimated', head: true })

  if (options?.bands && options.bands.length > 0) {
    query = query.in('bands.id', options.bands)
  }

  if (options?.locations && options.locations.length > 0) {
    query = query.in('location_id', options.locations)
  }

  const { count, error } = await query

  if (error) {
    throw error
  }

  return count
}

export function useConcertsCount(options?: Pick<ConcertFetchOptions, 'bands' | 'locations'>) {
  return useQuery({
    queryKey: ['concerts-count', JSON.stringify(options)],
    queryFn: () => fetchConcertsCount(options),
  })
}
