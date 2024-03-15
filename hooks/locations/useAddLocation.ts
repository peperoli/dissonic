import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AddLocation } from '@/types/types'
import supabase from '@/utils/supabase/client'
import { useQueryState } from 'nuqs'

const addLocation = async (location: AddLocation) => {
  const { error } = await supabase.from('locations').insert(location)

  if (error) {
    throw error
  }
}

export const useAddLocation = () => {
  const queryClient = useQueryClient()
  const [_, setModal] = useQueryState('modal', { history: 'push' })
  return useMutation(addLocation, {
    onError: error => console.error(error),
    onSuccess: () => {
      queryClient.invalidateQueries(['locations'])
      setModal(null)
    },
  })
}
