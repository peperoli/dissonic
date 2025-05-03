import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Concert, ConcertFetchOptions, ExtendedRes, QueryOptions } from '@/types/types'
import supabase from '@/utils/supabase/client'

const fetchConcerts = async (options?: ConcertFetchOptions) => {
  let query = supabase.from('concerts_full').select(
    `id,
      bands!j_concert_bands(id),
      bands_seen:j_bands_seen(user_id)`,
    { count: 'estimated' }
  )

  if (options?.locations && options.locations.length > 0) {
    query = query.in('location_id', options.locations)
  }

  if (options?.years && options.years.length > 0) {
    query = query.gte('date_start', `${options.years[0]}-01-01`)
    query = query.lte('date_start', `${options.years[1]}-12-31`)
  }

  if (options?.dateRange) {
    const startDate = options.dateRange[0]
    const endDate = options.dateRange[1]

    if (startDate) {
      query = query.gt('date_start', startDate.toISOString())
    }
    
    if (endDate) {
      query = query.lte('date_start', endDate.toISOString())
    }
  }

  if (options?.festivalRoots && options.festivalRoots.length > 0) {
    query = query.in('festival_root_id', options.festivalRoots)
  }

  const { data: initalFilteredConcerts, error: countError } = await query

  if (countError) {
    throw countError
  }

  let filteredConcerts = initalFilteredConcerts

  if (options?.bands && options.bands.length > 0) {
    filteredConcerts = filteredConcerts?.filter(concert =>
      concert.bands.some(band => options.bands?.includes(band.id))
    )
  }

  if (options?.bandsSeenUsers && options.bandsSeenUsers.length > 0) {
    filteredConcerts = filteredConcerts?.filter(concert =>
      concert.bands_seen.some(band => options.bandsSeenUsers?.includes(band.user_id))
    )
  }

  let filteredQuery = supabase
    .from('concerts_full')
    .select('*, bands:j_concert_bands(*, ...bands(*, genres(*)))', { count: 'estimated' })
    .in(
      'id',
      filteredConcerts.map(id => id.id)
    )

  if (options?.sort) {
    filteredQuery = filteredQuery.order(options.sort.sort_by, { ascending: options.sort.sort_asc })
  }

  if (options?.size) {
    filteredQuery = filteredQuery.limit(options.size)
  }

  if (options?.bandsSize) {
    filteredQuery = filteredQuery.limit(options.bandsSize, { referencedTable: 'j_concert_bands' })
  }

  const { data, count, error } = await filteredQuery
    .order('item_index', { referencedTable: 'j_concert_bands', ascending: true })
    .overrideTypes<Concert[], { merge: false }>()

  if (error) {
    throw error
  }

  return { data, count }
}

export const useConcerts = (
  options: ConcertFetchOptions & QueryOptions<ExtendedRes<Concert[]>> = {}
) => {
  const { placeholderData, enabled, ...fetchOptions } = options
  return useQuery({
    queryKey: ['concerts', JSON.stringify(fetchOptions)],
    queryFn: () => fetchConcerts(fetchOptions),
    enabled: enabled !== false,
    placeholderData: previousData => keepPreviousData(previousData || placeholderData),
  })
}
