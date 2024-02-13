import supabase from '../utils/supabase/client'
import { useQuery } from '@tanstack/react-query'

const fetchCountries = async () => {
  const { data, error } = await supabase
    .from('countries')
    .select('id, iso2')
    .neq('local_name', null)
    .neq('iso2', 'AQ')
    .order('name')

  if (error) {
    throw error
  }

  return data
}

export const useCountries = () => {
  return useQuery(['countries'], fetchCountries)
}
