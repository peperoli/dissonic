import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AddLocation } from '@/types/types'
import supabase from '@/utils/supabase/client'

const addLocation = async (location: AddLocation) => {
  const { error } = await supabase.from('locations').insert(location)

  if (error) {
    throw error
  }
}

export const useAddLocation = () => {
  const queryClient = useQueryClient()
  return useMutation(addLocation, {
    onError: error => console.error(error),
    onSuccess: () => queryClient.invalidateQueries(['locations']),
  })
}
