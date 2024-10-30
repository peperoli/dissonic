import { useQuery } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'
import { Profile } from '@/types/types'

const fetchBandProfiles = async (
  bandId: number
): Promise<{ profile: Profile | null; count: number }[]> => {
  const { data, error } = await supabase
    .from('j_bands_seen')
    .select('profile:profiles(*), concert_id.count()')
    .eq('band_id', bandId)

  if (error) {
    throw error
  }

  return data
}

export const useBandProfiles = (bandId: number) => {
  return useQuery({
    queryKey: ['bandProfiles', bandId],
    queryFn: () => fetchBandProfiles(bandId),
  })
}
