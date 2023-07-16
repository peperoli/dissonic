import { useMutation } from '@tanstack/react-query'
import supabase from '../utils/supabase'

const deleteComment = async (commentId: number) => {
  const { error } = await supabase.from('comments').delete().eq('id', commentId)

  if (error) {
    throw error
  }
}

export const useDeleteComment = (commentId: number) => {
  return useMutation(() => deleteComment(commentId))
}
