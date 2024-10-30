import { useQuery } from '@tanstack/react-query'
import { BandSeen } from '@/types/types'
import supabase from '@/utils/supabase/client'

const fetchBandsSeen = async (profileId: string): Promise<BandSeen[]> => {
  const { data, error } = await supabase
    .from('j_bands_seen')
    .select(
      `*,
      band:bands(*, genres(*), country:countries(id, iso2)),
      concert:concerts(*, location:locations(*))`
    )
    .eq('user_id', profileId)

  if (error) {
    throw error
  }

  return data
}

export const useBandsSeen = (profileId: string) => {
  return useQuery({
    queryKey: ['bandsSeen', profileId],
    queryFn: () => fetchBandsSeen(profileId),
  })
}
