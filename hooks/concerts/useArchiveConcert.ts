import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'

const archiveConcert = async (concertId: number) => {
  const { error } = await supabase
    .from('concerts')
    .update({ is_archived: true })
    .eq('id', concertId)

  if (error) {
    throw error
  }

  return { concertId }
}

export const useArchiveConcert = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: archiveConcert,
    onError: error => console.error(error),
    onSuccess: ({ concertId }) => {
      queryClient.invalidateQueries({ queryKey: ['concert', concertId] })
    },
  })
}
