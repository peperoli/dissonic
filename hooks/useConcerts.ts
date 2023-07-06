import { useQuery } from 'react-query'
import { getPagination } from '../lib/getPagination'
import { Concert, FetchOptions, WithCount } from '../types/types'
import supabase from '../utils/supabase'

const fetchConcerts = async (options?: FetchOptions): Promise<WithCount<Concert[]>> => {
  let query = supabase
    .from('concerts')
    .select(
      '*, location:locations(*), bands!j_concert_bands!inner(*), bands_seen:j_bands_seen(band_id, user_id)',
      { count: 'exact' }
    )

  if (options?.filter?.bands && options.filter.bands.length > 0) {
    query = query.in('bands.id', options.filter.bands)
  }
  if (options?.filter?.genres && options.filter.genres.length > 0) {
    query = query.in('genres.id', options.filter.genres)
  }

  const { count } = await query

  const [from, to] = getPagination(options?.page ?? 0, options?.size ?? 24, count ?? 0)

  const { data, error } = await query.range(from, to).order('date_start', { ascending: false })

  if (error) {
    throw error
  }

  return { data, count }
}

export const useConcerts = (initialConcerts?: WithCount<Concert[]>, options?: FetchOptions) => {
  return useQuery(['concerts', JSON.stringify(options)], () => fetchConcerts(options), {
    initialData: initialConcerts,
  })
}
