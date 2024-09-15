import { useMutation, useQueryClient } from '@tanstack/react-query'
import { EditComment } from '@/types/types'
import supabase from '@/utils/supabase/client'

const editComment = async (comment: EditComment) => {
  if (!comment.id) {
    throw new Error('Comment ID is required')
  }

  const { data, error } = await supabase
    .from('comments')
    .update(comment)
    .eq('id', comment.id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return { concertId: data.concert_id }
}

export const useEditComment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: editComment,
    onError: error => console.error(error),
    onSuccess: ({ concertId }) =>
      queryClient.invalidateQueries({ queryKey: ['comments', concertId] }),
  })
}
