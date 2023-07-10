import { useQuery } from 'react-query'
import { getPagination } from '../lib/getPagination'
import { Concert, FetchOptions, ExtendedRes } from '../types/types'
import supabase from '../utils/supabase'

const fetchConcerts = async (options?: FetchOptions): Promise<ExtendedRes<Concert[]>> => {
  let query = supabase.from('concerts').select(
    `id,
      location:locations!inner(id),
      bands!j_concert_bands!inner(id),
      bands_seen:j_bands_seen!inner(user_id)`,
    { count: 'estimated' }
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

  const { data: ids, count, error: countError } = await query
  
  if (countError) {
    throw countError
  }

  const [from, to] = getPagination(options?.page ?? 0, options?.size ?? 24, count ?? 0)

  let filteredQuery = supabase
    .from('concerts')
    .select(
      `*,
      location:locations(*),
      bands!j_concert_bands(*),
      bands_seen:j_bands_seen(band_id, user_id)`
    )
    .in('id', ids?.map(id => id.id) as string[])

  if (options?.page || options?.size) {
    filteredQuery = filteredQuery.range(from, to)
  }
  if (options?.sort) {
    filteredQuery = filteredQuery.order(options.sort[0], { ascending: options.sort[1] })
  }

  const { data, error } = await filteredQuery

  if (error) {
    throw error
  }

  return { data, count }
}

export const useConcerts = (initialConcerts?: ExtendedRes<Concert[]>, options?: FetchOptions) => {
  return useQuery(['concerts', JSON.stringify(options)], () => fetchConcerts(options), {
    initialData: initialConcerts,
    keepPreviousData: true,
  })
}
