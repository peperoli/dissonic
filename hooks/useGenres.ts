import { useQuery } from '@tanstack/react-query'
import { Genre } from '../types/types'
import supabase from '../utils/supabase/client'

const fetchGenres = async (options?: { ids: number[] | null }): Promise<Genre[]> => {
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

export const useGenres = (options?: { ids: number[] | null }) => {
  return useQuery(['genres', JSON.stringify(options)], () => fetchGenres(options))
}
