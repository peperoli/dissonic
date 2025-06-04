import { useQuery } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'

async function fetchMemories({ concertId }: { concertId: number }) {
  const { data, error } = await supabase.from('memories').select('*').eq('concert_id', concertId)

  if (error) {
    throw error
  }

  return data
}

export function useMemories({ concertId }: { concertId: number }) {
  return useQuery({
    queryKey: ['memories', concertId],
    queryFn: () => fetchMemories({ concertId }),
  })
}
