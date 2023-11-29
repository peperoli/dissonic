import { useQuery } from '@tanstack/react-query'
import { Concert, ConcertFetchOptions, ExtendedRes } from '../types/types'
import supabase from '../utils/supabase'

const fetchConcerts = async (options?: ConcertFetchOptions): Promise<ExtendedRes<Concert[]>> => {
  let query = supabase.from('concerts').select(
    `id,
      location:locations!inner(id),
      bands!j_concert_bands!inner(id),
      bands_count:j_concert_bands(count),
      bands_seen:j_bands_seen!inner(user_id)`
  )

  if (options?.filter?.bands && options.filter.bands.length > 0) {
    query = query.in('bands.id', options.filter.bands)
  }
  if (options?.filter?.locations && options.filter.locations.length > 0) {
    query = query.in('location.id', options.filter.locations)
  }
  if (options?.filter?.years && options.filter.years.length > 0) {
    query = query.gte('date_start', `${options.filter.years[0]}-01-01`)
    query = query.lte('date_start', `${options.filter.years[1]}-12-31`)
  }
  if (options?.filter?.bandsSeenUser) {
    query = query.eq('bands_seen.user_id', options.filter.bandsSeenUser)
  }

  const { data: ids, error: countError } = await query

  if (countError) {
    throw countError
  }

  let filteredIds = ids.map(id => id.id) as string[]

  if (options?.filter?.bandCount) {
    filteredIds = ids
      ?.filter(
        item =>
          !options?.filter?.bandCount ||
          (Array.isArray(item.bands_count) &&
            item.bands_count[0].count >= options.filter.bandCount[0] &&
            item.bands_count[0].count <= options?.filter?.bandCount[1])
      )
      .map(id => id.id)
  }

  let filteredQuery = supabase
    .from('concerts')
    .select(
      `*,
      location:locations(*),
      bands!j_concert_bands(*),
      bands_seen:j_bands_seen(band_id, user_id)`,
      { count: 'estimated' }
    )
    .in('id', filteredIds)

  if (options?.size) {
    filteredQuery = filteredQuery.range(0, options.size - 1)
  }
  if (options?.sort) {
    filteredQuery = filteredQuery.order(options.sort.sort_by, { ascending: options.sort.sort_asc })
  }

  const { data, count, error } = await filteredQuery

  if (error) {
    throw error
  }

  return { data, count }
}

export const useConcerts = (initialConcerts?: ExtendedRes<Concert[]>, options?: ConcertFetchOptions) => {
  return useQuery(['concerts', JSON.stringify(options)], () => fetchConcerts(options), {
    initialData: initialConcerts,
    keepPreviousData: true,
  })
}
