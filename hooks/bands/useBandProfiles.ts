import { useQuery } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'
import { Profile } from '@/types/types'

const fetchBandProfiles = async (bandId: number): Promise<{ profile: Profile; count: number }[]> => {
  const { data, error } = await supabase
    .from('j_bands_seen')
    .select('profile:user_id(*), concert_id.count()')
    .eq('band_id', bandId)

  if (error) {
    throw error
  }

  // @ts-expect-error
  return data
}

export const useBandProfiles = (bandId: number) => {
  return useQuery(['bandProfiles', bandId], () => fetchBandProfiles(bandId), {
    onError: error => console.error(error),
  })
}
