import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useQuery } from '@tanstack/react-query'
import { Database } from '../types/supabase'

const fetchCountries = async () => {
  const supabase = createClientComponentClient<Database>()
  
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
