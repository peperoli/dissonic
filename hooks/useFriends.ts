import { useQuery } from '@tanstack/react-query'
import { Friend } from '../types/types'
import supabase from '../utils/supabase/client'

async function fetchFriends(profileId: string): Promise<Friend[]> {
  const { data, error } = await supabase
    .from('friends')
    .select('*, sender:sender_id(*), receiver:receiver_id(*)')
    .or(`sender_id.eq.${profileId}, receiver_id.eq.${profileId}`)

  if (error) {
    throw error
  }
  // @ts-expect-error
  return data
}

export function useFriends(profileId: string, initialData?: Friend[]) {
  return useQuery(['friends', profileId], () => fetchFriends(profileId), {
    enabled: !!profileId,
    initialData,
    onError: error => console.error(error),
  })
}
