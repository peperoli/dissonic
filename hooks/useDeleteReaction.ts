import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '../utils/supabase'

const deleteReaction = async (commentId: number, userId: string) => {
  const { error } = await supabase
    .from('reactions')
    .delete()
    .eq('comment_id', commentId)
    .eq('user_id', userId)

  if (error) {
    throw error
  }
}

export const useDeleteReaction = (commentId: number, userId: string, concertId: string) => {
  const queryClient = useQueryClient()
  return useMutation(() => deleteReaction(commentId, userId), {
    onSuccess: () => queryClient.invalidateQueries(['comments', concertId]),
  })
}
