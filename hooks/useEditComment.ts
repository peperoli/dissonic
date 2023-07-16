import { useMutation } from '@tanstack/react-query'
import { EditComment } from '../types/types'
import supabase from '../utils/supabase'

const editComment = async (comment: EditComment) => {
  const { error } = await supabase
  .from('comments')
  .update(comment)
  .eq('id', comment.id)

  if (error) {
    throw error
  }
}

export const useEditComment = (comment: EditComment) => {
  return useMutation(() => editComment(comment))
}
