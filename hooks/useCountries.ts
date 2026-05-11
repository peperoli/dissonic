import { CountryFetchOptions } from '@/types/types'
import supabase from '../utils/supabase/client'
import { useQuery } from '@tanstack/react-query'

const fetchCountries = async (options?: CountryFetchOptions) => {
  const searchString = options?.search && options.search.length > 1 ? options.search : null

  let query = searchString
    ? supabase.rpc('search_countries', { search_string: searchString })
    : supabase.from('countries').select('*')

  if (options?.ids && options.ids.length > 0) {
    query = query.in('id', options.ids)
  }

  const { data, error } = await query.order('name_en')

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
