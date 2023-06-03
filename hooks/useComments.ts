import { useQuery } from 'react-query'
import { Comment } from '../types/types'
import supabase from '../utils/supabase'

const fetchComments = async (concertId: string): Promise<Comment[]> => {
  const { data, error } = await supabase.from('comments').select('*, reactions(*)').eq('concert_id', concertId)

  if (error) {
    throw error
  }

  return data
}

export const useComments = (concertId: string) => {
  return useQuery(['comments', concertId], () => fetchComments(concertId), { enabled: !!concertId })
}
