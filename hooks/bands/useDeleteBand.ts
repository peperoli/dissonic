import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

const deleteBand = async (bandId: number) => {
  const { error } = await supabase.from('bands').delete().eq('id', bandId)

  if (error) {
    throw error
  }
}

export const useDeleteBand = () => {
  const queryClient = useQueryClient()
  const router = useRouter()
  return useMutation(deleteBand, {
    onSuccess: () => {
      queryClient.invalidateQueries(['bands'])
      router.push('/bands')
    },
  })
}
