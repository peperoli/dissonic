import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'
import { useQueryState } from 'nuqs'

const deleteComment = async (commentId: number) => {
  const { error } = await supabase.from('comments').delete().eq('id', commentId)

  if (error) {
    throw error
  }
}

export const useDeleteComment = () => {
  const queryClient = useQueryClient()
  const [_, setModal] = useQueryState('modal', { history: 'push' })
  return useMutation(deleteComment, {
    onError: error => console.error(error),
    onSuccess: () => {
      queryClient.invalidateQueries(['comments'])
      setModal(null)
    },
  })
}
