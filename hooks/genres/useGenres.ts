import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Genre, GenreFetchOptions, QueryOptions } from '../../types/types'
import supabase from '../../utils/supabase/client'

type FetchOptions = Pick<GenreFetchOptions, 'ids'>

const fetchGenres = async (options?: FetchOptions): Promise<Genre[]> => {
  let query = supabase.from('genres').select('*').order('name')

  if (options?.ids && options.ids.length > 0) {
    query = query.in('id', options.ids)
  }

  const { data, error } = await query

  if (error) {
    throw error
  }

  return data
}

export const useGenres = (options: FetchOptions & QueryOptions<Genre[]> = {}) => {
  const { placeholderData, enabled, ...fetchOptions } = options

  return useQuery({
    queryKey: ['genres', JSON.stringify(fetchOptions)],
    queryFn: () => fetchGenres(fetchOptions),
    placeholderData: previousData => keepPreviousData(previousData || placeholderData),
    enabled,
  })
}
