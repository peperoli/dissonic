import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'
import { useQueryState } from 'nuqs'

async function deleteFriend({ friendId, userId }: { friendId: string; userId: string }) {
  const { error } = await supabase
    .from('friends')
    .delete()
    .or(`sender_id.eq.${userId}, receiver_id.eq.${userId}`)
    .or(`sender_id.eq.${friendId}, receiver_id.eq.${friendId}`)

  if (error) {
    throw error
  }
}

export function useDeleteFriend() {
  const queryClient = useQueryClient()
  const [_, setModal] = useQueryState('modal', { history: 'push' })
  return useMutation(deleteFriend, {
    onError: error => console.error(error),
    onSuccess: () => {
      queryClient.invalidateQueries(['friends'])
      setModal(null)
    },
  })
}
