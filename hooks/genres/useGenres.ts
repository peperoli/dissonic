import { useQuery } from '@tanstack/react-query'
import { Genre, GenreFetchOptions } from '../../types/types'
import supabase from '../../utils/supabase/client'

const fetchGenres = async (options?: GenreFetchOptions): Promise<Genre[]> => {
  let query = supabase.from('genres').select('*').order('name')

  if (options?.search && options.search.length > 1) {
    query = supabase.rpc('search_genres', { search_string: options.search })
  }

  if (options?.ids && options.ids.length > 0) {
    query = query.in('id', options.ids)
  }

  const { data, error } = await query

  if (error) {
    throw error
  }

  return data
}

export const useGenres = (options?: GenreFetchOptions) => {
  return useQuery({
    queryKey: ['genres', JSON.stringify(options)],
    queryFn: () => fetchGenres(options),
  })
}
