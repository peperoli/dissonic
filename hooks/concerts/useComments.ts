import { useQuery } from '@tanstack/react-query'
import { Comment, Concert } from '@/types/types'
import supabase from '@/utils/supabase/client'

const fetchComments = async (concertId: Concert['id']): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from('comments')
    .select('*, reactions(*, user:profiles(*))')
    .eq('concert_id', concertId)

  if (error) {
    throw error
  }

  return data
}

export const useComments = (concertId: Concert['id']) => {
  return useQuery({
    queryKey: ['comments', concertId],
    queryFn: () => fetchComments(concertId),
    enabled: !!concertId,
  })
}
