import { useQuery } from 'react-query'
import { Band, FetchOptions, ExtendedRes } from '../types/types'
import supabase from '../utils/supabase'
import { getPagination } from '../lib/getPagination'

const fetchBands = async (options?: FetchOptions): Promise<ExtendedRes<Band[]>> => {
  let filterQuery = supabase
    .from('bands')
    .select('id, country:countries!inner(id), genres!inner(id)', { count: 'estimated' })

  if (options?.filter?.countries && options.filter.countries.length > 0) {
    filterQuery = filterQuery.in('countries.id', options.filter.countries)
  }
  if (options?.filter?.genres && options.filter.genres.length > 0) {
    filterQuery = filterQuery.in('genres.id', options.filter.genres)
  }
  if (options?.filter?.search) {
    filterQuery = filterQuery.ilike('name', `%${options.filter.search.split(' ').join('%')}%`)
  }

  const { data: ids, count, error: countError } = await filterQuery

  if (countError) {
    throw countError
  }

  const [from, to] = getPagination(options?.page ?? 0, options?.size ?? 24, count ?? 0)

  let query = supabase
    .from('bands')
    .select('*, country:countries(*), genres(*)')
    .in('id', ids?.map(item => item.id) as string[])

  if (options?.page || options?.size) {
    query = query.range(from, to)
  }
  query = query.order('name')

  const { data, error } = await query.order('name')

  if (error) {
    throw error
  }

  return { data, count }
}

export const useBands = (initialBands?: ExtendedRes<Band[]>, options?: FetchOptions) => {
  return useQuery(['bands', JSON.stringify(options)], () => fetchBands(options), {
    initialData: initialBands,
    keepPreviousData: true,
  })
}
