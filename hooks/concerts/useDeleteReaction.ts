import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'
import { Concert } from '@/types/types'

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

export const useDeleteReaction = (commentId: number, userId: string, concertId: Concert['id']) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => deleteReaction(commentId, userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments', concertId] }),
  })
}
