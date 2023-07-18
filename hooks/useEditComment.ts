import { useMutation } from '@tanstack/react-query'
import { EditComment } from '../types/types'
import supabase from '../utils/supabase'

const editComment = async (comment: EditComment) => {
  const { error } = await supabase.from('comments').update(comment).eq('id', comment.id)

  if (error) {
    throw error
  }
}

export const useEditComment = () => {
  return useMutation(editComment, { onError: error => console.log(error) })
}
