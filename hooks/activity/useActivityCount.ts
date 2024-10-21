import { useQuery } from '@tanstack/react-query'
import supabase from 'utils/supabase/client'

async function fetchActivityCount(userId?: string) {
  let query = supabase.from('activity').select('*', { count: 'estimated', head: true })

  if (userId) {
    query = query.contains('user_id', [userId])
  }

  const { count, error } = await query
  console.log(count, error)

  if (error) {
    throw error
  }

  return count
}

export function useActivityCount({ userId }: { userId?: string }) {
  return useQuery({
    queryKey: ['activity-count', userId],
    queryFn: () => fetchActivityCount(userId),
  })
}
