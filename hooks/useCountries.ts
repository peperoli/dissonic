import { CountryFetchOptions } from '@/types/types'
import supabase from '../utils/supabase/client'
import { useQuery } from '@tanstack/react-query'

const fetchCountries = async (options?: CountryFetchOptions) => {
  let query = supabase.from('countries').select('id, iso2').order('name_en')

  if (options?.search && options.search.length > 1) {
    query = supabase.rpc('search_countries', { search_string: options.search })
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

export const useCountries = (options?: CountryFetchOptions) => {
  return useQuery({
    queryKey: ['countries', JSON.stringify(options)],
    queryFn: () => fetchCountries(options),
  })
}
