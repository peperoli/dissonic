import { useQuery } from '@tanstack/react-query'
import { BandSeen } from '../types/types'
import supabase from '../utils/supabase'
import { useSession } from './useSession'
import { useUser } from './useUser'

const fetchBandsSeen = async (profileId?: string): Promise<BandSeen[]> => {
  const { data, error } = await supabase
    .from('j_bands_seen')
    .select('*, band:bands(*, genres(*)), concert:concerts(*, location:locations(*))')
    .eq('user_id', profileId)

  if (error) {
    throw error
  }

  return data
}

export const useBandsSeen = (userId?: string) => {
  const { data: session } = useSession()
  const { data: user } = useUser(session?.access_token)
  const profileId = userId ?? user?.id
  return useQuery(['bandsSeen', profileId], () => fetchBandsSeen(profileId), {
    enabled: !!profileId,
    onError: error => console.error(error),
  })
}
