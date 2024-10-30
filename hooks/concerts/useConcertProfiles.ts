import { useQuery } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'
import { Concert, Profile } from '@/types/types'

const fetchConcertProfiles = async (
  concertId: Concert['id']
): Promise<{ profile: Profile | null; count: number }[]> => {
  const { data, error } = await supabase
    .from('j_bands_seen')
    .select('profile:profiles(*), band_id.count()')
    .eq('concert_id', concertId)

  if (error) {
    throw error
  }

  return data
}

export const useConcertProfiles = (concertId: Concert['id']) => {
  return useQuery({
    queryKey: ['bandsSeen', concertId],
    queryFn: () => fetchConcertProfiles(concertId),
  })
}
