import { useQuery } from 'react-query'
import { Band, FetchOptions, WithCount } from '../types/types'
import supabase from '../utils/supabase'
import { getPagination } from '../lib/getPagination'

const fetchBands = async (options?: FetchOptions): Promise<WithCount<Band[]>> => {
  let query = supabase
    .from('bands')
    .select('*, country:countries!inner(*), genres!inner(*)', { count: 'exact' })

  if (options?.filter?.countries && options.filter.countries.length > 0) {
    query = query.in('countries.id', options.filter.countries)
  }
  if (options?.filter?.genres && options.filter.genres.length > 0) {
    query = query.in('genres.id', options.filter.genres)
  }
  if (options?.filter?.search) {
    query = query.ilike('name', `%${options.filter.search}%`)
  }

  const { count } = await query

  const [from, to] = getPagination(options?.page ?? 0, options?.size ?? 24, count ?? 0)

  const { data, error } = await query.range(from, to).order('name')

  if (error) {
    throw error
  }

  return { data, count }
}

export const useBands = (initialBands?: WithCount<Band[]>, options?: FetchOptions) => {
  return useQuery(['bands', JSON.stringify(options)], () => fetchBands(options), {
    initialData: initialBands,
  })
}
