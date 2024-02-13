import { useMutation } from '@tanstack/react-query'
import { EditComment } from '../types/types'
import supabase from '../utils/supabase/client'

const editComment = async (comment: EditComment) => {
  if (!comment.id) {
    throw new Error('Comment ID is required')
  }
  
  const { error } = await supabase.from('comments').update(comment).eq('id', comment.id)

  if (error) {
    throw error
  }
}

export const useEditComment = () => {
  return useMutation(editComment, { onError: error => console.error(error) })
}
