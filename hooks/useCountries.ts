import supabase from '../utils/supabase/client'
import { useQuery } from '@tanstack/react-query'

const fetchCountries = async (options?: { ids?: number[] | null }) => {
  let query = supabase
    .from('countries')
    .select('id, iso2')
    .neq('local_name', null)
    .neq('iso2', 'AQ')
    .order('name')

  if (options?.ids && options.ids.length > 0) {
    query = query.in('id', options.ids)
  }

  const { data, error } = await query

  if (error) {
    throw error
  }

  return data
}

export const useCountries = (options?: { ids?: number[] | null }) => {
  return useQuery(['countries', JSON.stringify(options)], () => fetchCountries(options))
}
