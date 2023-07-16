import { useQuery } from '@tanstack/react-query'
import { Country } from '../types/types'
import supabase from '../utils/supabase'

const fetchCountries = async (): Promise<Country[]> => {
  const { data, error } = await supabase
    .from('countries')
    .select('*')
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
