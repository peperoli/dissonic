import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'
import { AddReaction } from '@/types/types'

const addReaction = async (reaction: AddReaction) => {
  const { error } = await supabase.from('reactions').insert(reaction).select().single()

  if (error) {
    throw error
  }
}

export const useAddReaction = (reaction: AddReaction, concertId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => addReaction(reaction),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments', concertId] }),
  })
}
