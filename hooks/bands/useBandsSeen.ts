import { useQuery } from '@tanstack/react-query'
import { BandSeen } from '@/types/types'
import supabase from '@/utils/supabase/client'
import { useSession } from '../auth/useSession'
import { useUser } from '../auth/useUser'

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

export const useBandsSeen = (userId?: string) => {
  const { data: session } = useSession()
  const { data: user } = useUser(session?.access_token)
  const profileId = userId ?? user?.id
  return useQuery({
    queryKey: ['bandsSeen', profileId],
    queryFn: () => fetchBandsSeen(profileId!),
    enabled: !!profileId,
  })
}
