import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Concert } from '@/types/types'

const deleteConcert = async (concertId: Concert['id']) => {
  const { error } = await supabase.from('concerts').delete().eq('id', concertId)

  if (error) {
    throw error
  }
}

export const useDeleteConcert = () => {
  const queryClient = useQueryClient()
  const router = useRouter()
  return useMutation({
    mutationFn: deleteConcert,
    onError: error => console.error(error),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['concerts'] })
      router.push('/')
    },
  })
}
