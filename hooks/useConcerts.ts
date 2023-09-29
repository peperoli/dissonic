import { useQuery } from '@tanstack/react-query'
import { getPagination } from '../lib/getPagination'
import { Concert, FetchOptions, ExtendedRes } from '../types/types'
import supabase from '../utils/supabase'

const fetchConcerts = async (options?: FetchOptions): Promise<ExtendedRes<Concert[]>> => {
  let query = supabase.from('concerts').select(
    `id,
      bands!j_concert_bands(id),
      bands_count:j_concert_bands(count),
      bands_seen:j_bands_seen(user_id)`,
    { count: 'estimated' }
  )

  if (options?.filter?.locations && options.filter.locations.length > 0) {
    query = query.in('location_id', options.filter.locations)
  }
  
  if (options?.filter?.years && options.filter.years.length > 0) {
    query = query.gte('date_start', `${options.filter.years[0]}-01-01`)
    query = query.lte('date_start', `${options.filter.years[1]}-12-31`)
  }

  const { data: initalFilteredConcerts, count: initialCount, error: countError } = await query

  if (countError) {
    throw countError
  }

  const [from, to] = getPagination(options?.page ?? 0, options?.size ?? 24, initialCount ?? 0)

  let filteredConcerts = initalFilteredConcerts

  if (options?.filter?.bands && options.filter.bands.length > 0) {
    filteredConcerts = filteredConcerts?.filter(concert =>
      concert.bands.some(band => options.filter?.bands?.includes(band.id))
    )
  }

  if (options?.filter?.bandsSeenUser) {
    filteredConcerts = filteredConcerts?.filter(concert =>
      concert.bands_seen.some(band => options.filter?.bandsSeenUser === band.user_id)
    )
  }

  if (options?.filter?.bandsPerConcert) {
    filteredConcerts = filteredConcerts?.filter(
      item =>
        !options?.filter?.bandsPerConcert ||
        (Array.isArray(item.bands_count) &&
          item.bands_count[0].count >= options.filter.bandsPerConcert[0] &&
          item.bands_count[0].count <= options?.filter?.bandsPerConcert[1])
    )
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
    .in('id', filteredConcerts.map(id => id.id) as string[])

  if (options?.page || options?.size) {
    filteredQuery = filteredQuery.range(from, to)
  }
  if (options?.sort) {
    filteredQuery = filteredQuery.order(options.sort[0], { ascending: options.sort[1] })
  }

  const { data, count, error } = await filteredQuery

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
