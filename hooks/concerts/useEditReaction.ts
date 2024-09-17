import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'
import { Concert, EditReaction } from '@/types/types'

const editReaction = async (reaction: EditReaction) => {
  if (!reaction.comment_id || !reaction.user_id) {
    throw new Error('Comment ID and User ID are required')
  }

  const { error } = await supabase
    .from('reactions')
    .update(reaction)
    .eq('comment_id', reaction.comment_id)
    .eq('user_id', reaction.user_id)

  if (error) {
    throw error
  }
}

export const useEditReaction = (reaction: EditReaction, concertId: Concert['id']) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => editReaction(reaction),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments', concertId] }),
  })
}
