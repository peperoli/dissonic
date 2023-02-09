import { useQuery } from 'react-query'
import { Concert } from '../types/types'
import supabase from '../utils/supabase'

const fetchConcert = async (concertId: string): Promise<Concert> => {
  const { data, error } = await supabase
    .from('concerts')
    .select(
      '*, location:locations(*), bands!j_concert_bands(*, genres(*)), bands_seen:j_bands_seen(band_id, user_id)'
    )
    .eq('id', concertId)
    .single()

  if (error) {
    throw error
  }

  return data
}

export const useConcert = (concert: Concert) => {
  return useQuery(['concert', concert.id], () => fetchConcert(concert.id), { initialData: concert })
}