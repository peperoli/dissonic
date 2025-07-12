import { useQuery } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'

async function fetchMemories({concertId, size}: { concertId?: number, size?: number }) {
  let query = supabase
    .from('memories')
    .select('*, band:bands(id, name), profile:profiles(id, username, role, avatar_path, updated_at)')
    .order('created_at', { ascending: false })

  if (concertId) {
    query = query.eq('concert_id', concertId)
  }

  if (size) {
    query = query.limit(size)
  }

  const { data, error } = await query

  if (error) {
    throw error
  }

  return data
}

export function useMemories(fetchOptions: { concertId?: number, size?: number }) {
  return useQuery({
    queryKey: ['memories', fetchOptions.concertId, fetchOptions.size],
    queryFn: () => fetchMemories(fetchOptions),
  })
}
