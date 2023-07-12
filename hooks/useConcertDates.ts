import { useQuery } from 'react-query'
import { Concert } from '../types/types'
import supabase from '../utils/supabase'

const fetchConcertDates = async (): Promise<Partial<Concert>[]> => {
  const { data, error } = await supabase
    .from('concerts')
    .select('date_start')

  if (error) {
    throw error
  }

  return data
}

export const useConcertDates = () => {
  return useQuery(['concertYears'], () => fetchConcertDates())
}