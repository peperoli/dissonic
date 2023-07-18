import { useMutation } from '@tanstack/react-query'
import { AddComment } from '../types/types'
import supabase from '../utils/supabase'

const addComment = async (comment: AddComment) => {
  const { error } = await supabase.from('comments').insert(comment)

  if (error) {
    throw error
  }
}

export const useAddComment = () => {
  return useMutation(addComment, { onError: error => console.log(error) })
}
