import { useQuery } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'
import { Profile } from '@/types/types'

const fetchLocationProfiles = async (locationId: number) => {
  const { data: bandsSeen, error } = await supabase
    .from('j_bands_seen')
    .select('user_id, profile:profiles(*), concert:concerts!inner(id)')
    .eq('concert.location_id', locationId)

  if (error) {
    throw error
  }
  const userIds = new Set(bandsSeen.map(item => item.user_id))

  const queries = Array.from(userIds).map(userId =>
    supabase
      .from('concerts')
      .select('bands_seen:j_bands_seen!inner(*)', { count: 'estimated' })
      .eq('location_id', locationId)
      .eq('bands_seen.user_id', userId)
  )

  const responses = await Promise.all(queries)

  const data = responses
    .map(res => ({
      profile: bandsSeen.find(item => item.user_id === res.data?.[0].bands_seen[0].user_id)?.profile,
      count: res.count,
    }))
    .filter(item => item.profile && item.count) as { profile: Profile; count: number }[]

  return data
}

export const useLocationProfiles = (locationId: number) => {
  return useQuery(['locationProfiles', locationId], () => fetchLocationProfiles(locationId), {
    onError: error => console.error(error),
  })
}
