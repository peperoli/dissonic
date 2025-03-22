import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'
import toast from 'react-hot-toast'
import { useTranslations } from 'next-intl'

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
  const t = useTranslations('ConcertPage')

  return useMutation({
    mutationFn: archiveConcert,
    onError: error => { console.error(error); toast.error(error.message)},
    onSuccess: ({ concertId }) => {
      queryClient.invalidateQueries({ queryKey: ['concert', concertId] })
      toast.success(t('concertArchived'))
    },
  })
}
