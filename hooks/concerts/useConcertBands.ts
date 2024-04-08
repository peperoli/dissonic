import { useQuery } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'

const fetchConcertBands = async () => {
  const { data, error } = await supabase
    .from('concerts')
    .select('id, bands_count:j_concert_bands(count)')
    
    if (error) {
      throw error
    }
    
  return data
}

export const useConcertBands = () => {
  return useQuery(['concertBands'], () => fetchConcertBands())
}
