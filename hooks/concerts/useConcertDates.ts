import { useQuery } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'

const fetchConcertDates = async () => {
  const { data, error } = await supabase.from('concerts_full').select('date_start')

  if (error) {
    throw error
  }

  return data
}

export const useConcertDates = () => {
  return useQuery({ queryKey: ['concertYears'], queryFn: fetchConcertDates })
}
