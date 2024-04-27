import { useQuery } from '@tanstack/react-query'
import { Friend } from '@/types/types'
import supabase from '@/utils/supabase/client'

type Options = {
  profileId?: string
  pending?: boolean
}

async function fetchFriends(options?: Options): Promise<Friend[]> {
  let query = supabase.from('friends').select('*, sender:sender_id(*), receiver:receiver_id(*)')

  if (options?.profileId) {
    query = query.or(`sender_id.eq.${options.profileId}, receiver_id.eq.${options.profileId}`)
  }

  if (options?.pending !== undefined) {
    query = query.eq('pending', options.pending)
  }

  const { data, error } = await query

  if (error) {
    throw error
  }

  // @ts-expect-error
  return data
}

export function useFriends(options?: Options, initialFriends?: Friend[]) {
  return useQuery({
    queryKey: ['friends', JSON.stringify(options)],
    queryFn: () => fetchFriends(options),
    placeholderData: initialFriends,
  })
}
