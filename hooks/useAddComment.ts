import { useMutation } from '@tanstack/react-query'
import { AddComment } from '../types/types'
import supabase from '../utils/supabase'

const addComment = async (comment: AddComment) => {
  const { error } = await supabase.from('comments').insert(comment).select().single()

  if (error) {
    throw error
  }
}

export const useAddComment = (comment: AddComment) => {
  return useMutation(() => addComment(comment))
}
