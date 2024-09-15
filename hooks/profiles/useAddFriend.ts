import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AddFriend } from '@/types/types'
import supabase from '@/utils/supabase/client'
import { useModal } from '@/components/shared/ModalProvider'

const addFriend = async (friend: AddFriend) => {
  const { data, error } = await supabase.from('friends').insert(friend).select().single()

  if (error) {
    throw error
  }

  return { senderId: data.sender_id, receiverId: data.receiver_id }
}

export const useAddFriend = () => {
  const queryClient = useQueryClient()
  const [_, setModal] = useModal()
  return useMutation({
    mutationFn: addFriend,
    onError: error => console.error(error),
    onSuccess: ({ senderId, receiverId }) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: ['friends', senderId] })
      queryClient.invalidateQueries({ queryKey: ['friends', receiverId] })
      setModal(null)
    },
  })
}
