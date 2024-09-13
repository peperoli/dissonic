import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AddLocation } from '@/types/types'
import supabase from '@/utils/supabase/client'
import { useQueryState } from 'nuqs'
import { useRouter } from 'next/navigation'

const addLocation = async (location: AddLocation) => {
  const { data, error } = await supabase.from('locations').insert(location).select().single()

  if (error) {
    throw error
  }

  return { locationId: data.id }
}

export const useAddLocation = () => {
  const queryClient = useQueryClient()
  const [_, setModal] = useQueryState('modal', { history: 'push' })
  const { push } = useRouter()
  return useMutation({
    mutationFn: addLocation,
    onError: error => console.error(error),
    onSuccess: ({ locationId }) => {
      queryClient.invalidateQueries({ queryKey: ['locations'] })
      setModal(null)
      push(`/locations/${locationId}`)
    },
  })
}
