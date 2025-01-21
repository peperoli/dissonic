import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'

const restoreConcert = async (concertId: number) => {
  const { error } = await supabase
    .from('concerts')
    .update({ is_archived: false })
    .eq('id', concertId)

  if (error) {
    throw error
  }

  return { concertId }
}

export const useRestoreConcert = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: restoreConcert,
    onError: error => console.error(error),
    onSuccess: ({ concertId }) => {
      queryClient.invalidateQueries({ queryKey: ['concert', concertId] })
    },
  })
}
