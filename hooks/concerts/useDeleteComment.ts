import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'
import { useQueryState } from 'nuqs'
import toast from 'react-hot-toast'

const deleteComment = async (commentId: number) => {
  const { error } = await supabase.from('comments').delete().eq('id', commentId)

  if (error) {
    throw error
  }
}

export const useDeleteComment = () => {
  const queryClient = useQueryClient()
  const [_, setModal] = useQueryState('modal', { history: 'push' })
  return useMutation({
    mutationFn: deleteComment,
    onError: error => {
      console.error(error)
      toast.error(error.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] })
      setModal(null)
    },
  })
}
