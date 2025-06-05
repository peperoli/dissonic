import { useQuery } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'

async function fetchMemories({ concertId }: { concertId?: number }) {
  let query = supabase.from('memories').select('*')

  if (concertId) {
    query = query.eq('concert_id', concertId)
  }

  const { data, error } = await query

  if (error) {
    throw error
  }

  return data
}

export function useMemories({ concertId }: { concertId?: number }) {
  return useQuery({
    queryKey: ['memories', concertId],
    queryFn: () => fetchMemories({ concertId }),
  })
}
