import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { PostgrestFilterBuilder } from '@supabase/supabase-js'
import { Concert, ConcertFetchOptions, ExtendedRes, QueryOptions } from '@/types/types'
import supabase from '@/utils/supabase/client'

function applyFilters<TQuery extends PostgrestFilterBuilder<any, any, any, any>>(
  query: TQuery,
  options?: ConcertFetchOptions
) {
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
      query = query.gte('date_start', startDate.toString())
    }

    if (endDate) {
      query = query.lte('date_start', endDate.toString())
    }
  }

  if (options?.festivalRoots && options.festivalRoots.length > 0) {
    query = query.in('festival_root_id', options.festivalRoots)
  }

  return query.eq('is_archived', false)
}

async function fetchConcerts(options?: ConcertFetchOptions) {
  const rpcOptions = {
    band_ids: options?.bands?.length ? options.bands : undefined,
    user_ids: options?.bandsSeenUsers?.length ? options.bandsSeenUsers : undefined,
    sort_by: options?.sort?.sort_by,
    sort_asc: options?.sort?.sort_asc,
  }

  const countQuery = supabase.rpc('get_concerts', rpcOptions, { count: 'estimated', head: true })

  const { count, error: countError } = await applyFilters(countQuery, options)

  if (countError) {
    throw countError
  }

  const dataQuery = supabase.rpc('get_concerts', rpcOptions).select(
    `*,
      festival_root:festival_roots(id, name),
      bands:j_concert_bands(item_index, ...bands(*, genres(*))),
      location:locations(*)`
  )

  let query = applyFilters(dataQuery, options)

  if (options?.size) {
    query = query.limit(options.size)
  }

  if (options?.bandsSize) {
    query = query.limit(options.bandsSize, { referencedTable: 'j_concert_bands' })
  }

  const { data, error } = await query.order('item_index', {
    referencedTable: 'j_concert_bands',
    ascending: true,
  })

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
    queryKey: ['concerts', fetchOptions],
    queryFn: () => fetchConcerts(fetchOptions),
    enabled: enabled !== false,
    placeholderData: previousData => keepPreviousData(previousData || placeholderData),
  })
}
