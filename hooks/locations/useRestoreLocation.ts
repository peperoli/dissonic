import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'
import toast from 'react-hot-toast'
import { useTranslations } from 'next-intl'

const restoreLocation = async (locationId: number) => {
  const { error } = await supabase
    .from('locations')
    .update({ is_archived: false })
    .eq('id', locationId)

  if (error) {
    throw error
  }

  return { locationId }
}

export const useRestoreLocation = () => {
  const queryClient = useQueryClient()
  const t = useTranslations('LocationPage')

  return useMutation({
    mutationFn: restoreLocation,
    onError: error => console.error(error),
    onSuccess: ({ locationId }) => {
      queryClient.invalidateQueries({ queryKey: ['location', locationId] })
      toast.success(t('locationArchived'))
    },
  })
}
