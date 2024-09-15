import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AddComment } from '@/types/types'
import supabase from '@/utils/supabase/client'

const addComment = async (comment: AddComment) => {
  const { data, error } = await supabase.from('comments').insert(comment).select().single()

  if (error) {
    throw error
  }

  return { concertId: data.concert_id }
}

export const useAddComment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addComment,
    onError: error => console.error(error),
    onSuccess: ({ concertId }) =>
      queryClient.invalidateQueries({ queryKey: ['comments', concertId] }),
  })
}
