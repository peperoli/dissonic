import supabase from '@/utils/supabase/client'
import { useQuery } from '@tanstack/react-query'

async function compareConcertsSeen(user1Id: string, user2Id: string) {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error('No active session')
  }

  const { data, count, error } = await supabase.rpc(
    'compare_concerts_seen',
    {
      user_1_id: user1Id,
      user_2_id: user2Id,
    },
    { count: 'estimated', head: true }
  )

  if (error) {
    throw error
  }

  return { data, count }
}

export function useCompareConcertsSeen(user1Id: string, user2Id: string) {
  return useQuery({
    queryKey: ['compareConcertsSeen', user1Id, user2Id],
    queryFn: () => compareConcertsSeen(user1Id, user2Id),
  })
}
