import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '../utils/supabase'
import { EditReaction } from '../types/types'

const editReaction = async (reaction: EditReaction) => {
  const { error } = await supabase
    .from('reactions')
    .update(reaction)
    .eq('comment_id', reaction.comment_id)
    .eq('user_id', reaction.user_id)

  if (error) {
    throw error
  }
}

export const useEditReaction = (reaction: EditReaction, concertId: string) => {
  const queryClient = useQueryClient()
  return useMutation(() => editReaction(reaction), {
    onSuccess: () => queryClient.invalidateQueries(['comments', concertId]),
  })
}
