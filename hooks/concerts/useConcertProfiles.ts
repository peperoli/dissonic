import { useQuery } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'
import { Profile } from '@/types/types'

const fetchConcertProfiles = async (concertId: string): Promise<{ profile: Profile; count: number }[]> => {
  const { data, error } = await supabase
    .from('j_bands_seen')
    .select('profile:user_id(*), band_id.count()')
    .eq('concert_id', concertId)

  if (error) {
    throw error
  }

  // @ts-expect-error
  return data
}

export const useConcertProfiles = (concertId: string) => {
  return useQuery(['bandsSeen', concertId], () => fetchConcertProfiles(concertId), {
    onError: error => console.error(error),
  })
}
