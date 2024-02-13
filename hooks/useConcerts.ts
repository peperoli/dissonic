import { useQuery } from '@tanstack/react-query'
import { Concert, ConcertFetchOptions, ExtendedRes } from '../types/types'
import supabase from '../utils/supabase/client'

const fetchConcerts = async (options?: ConcertFetchOptions) => {
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

  const { data: initalFilteredConcerts, error: countError } = await query

  if (countError) {
    throw countError
  }

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

  if (options?.filter?.bandCount) {
    filteredConcerts = filteredConcerts?.filter(item => {
      // @ts-ignore
      const count = item.bands_count[0].count
      !options?.filter?.bandCount ||
        (Array.isArray(item.bands_count) &&
          count >= options.filter.bandCount[0] &&
          count <= options?.filter?.bandCount[1])
    })
  }

  let filteredQuery = supabase
    .from('concerts')
    .select(
      `*,
      location:locations(*),
      bands:j_concert_bands(*, ...bands(*)),
      bands_seen:j_bands_seen(band_id, user_id)`,
      { count: 'estimated' }
    )
    .in('id', filteredConcerts.map(id => id.id) as string[])

  if (options?.size) {
    filteredQuery = filteredQuery.range(0, options.size - 1)
  }
  if (options?.sort) {
    filteredQuery = filteredQuery.order(options.sort.sort_by, { ascending: options.sort.sort_asc })
  }

  const { data, count, error } = await filteredQuery
    .order('item_index', { referencedTable: 'j_concert_bands', ascending: true })
    .returns<Concert[]>()

  if (error) {
    throw error
  }

  return { data, count }
}

export const useConcerts = (
  initialConcerts?: ExtendedRes<Concert[]>,
  options?: ConcertFetchOptions
) => {
  return useQuery(['concerts', JSON.stringify(options)], () => fetchConcerts(options), {
    initialData: initialConcerts,
    keepPreviousData: true,
  })
}
