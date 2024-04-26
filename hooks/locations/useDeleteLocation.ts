import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

const deleteLocation = async (locationId: number) => {
  const { error } = await supabase.from('locations').delete().eq('id', locationId)

  if (error) {
    throw error
  }
}

export const useDeleteLocation = () => {
  const queryClient = useQueryClient()
  const router = useRouter()
  return useMutation(deleteLocation, {
    onSuccess: () => {
      queryClient.invalidateQueries(['locations'])
      router.push('/locations')
    },
  })
}
