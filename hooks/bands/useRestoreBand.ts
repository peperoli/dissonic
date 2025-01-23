import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'
import toast from 'react-hot-toast'
import { useTranslations } from 'next-intl'

const restoreBand = async (bandId: number) => {
  const { error } = await supabase
    .from('bands')
    .update({ is_archived: false })
    .eq('id', bandId)

  if (error) {
    throw error
  }

  return { bandId }
}

export const useRestoreBand = () => {
  const queryClient = useQueryClient()
  const t = useTranslations('BandPage')

  return useMutation({
    mutationFn: restoreBand,
    onError: error => console.error(error),
    onSuccess: ({ bandId }) => {
      queryClient.invalidateQueries({ queryKey: ['band', bandId] })
      toast.success(t('bandArchived'))
    },
  })
}
