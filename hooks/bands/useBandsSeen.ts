import { useQuery } from '@tanstack/react-query'
import { BandSeen } from '@/types/types'
import supabase from '@/utils/supabase/client'
import { useUser } from '../auth/useUser'

const fetchBandsSeen = async (userId: string): Promise<BandSeen[]> => {
  const { data, error } = await supabase
    .from('j_bands_seen')
    .select(
      `*,
      band:bands(*, genres(*), country:countries(id, iso2)),
      concert:concerts(*, location:locations(*))`
    )
    .eq('user_id', userId)

  if (error) {
    throw error
  }

  return data
}

export const useBandsSeen = (userId?: string) => {
  const user = useUser()
  userId = userId ?? user?.id
  return useQuery(['bandsSeen', userId], () => fetchBandsSeen(userId!), {
    enabled: !!userId,
    onError: error => console.error(error),
  })
}
