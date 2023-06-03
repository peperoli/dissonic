import { useMutation, useQueryClient } from 'react-query'
import supabase from '../utils/supabase'
import { AddReaction, Reaction } from '../types/types'

const addReaction = async (reaction: AddReaction): Promise<Reaction> => {
  const { data, error } = await supabase.from('reactions').insert(reaction).select().single()

  if (error) {
    throw error
  }

  return data
}

export const useAddReaction = (reaction: AddReaction, concertId: string) => {
  const queryClient = useQueryClient()
  return useMutation(() => addReaction(reaction), {
    onSuccess: () => queryClient.invalidateQueries(['comments', concertId]),
  })
}
