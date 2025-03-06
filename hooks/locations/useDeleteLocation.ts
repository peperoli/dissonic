import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import toast from 'react-hot-toast'

const deleteLocation = async (locationId: number) => {
  const { error } = await supabase.from('locations').delete().eq('id', locationId)

  if (error) {
    throw error
  }
}

export const useDeleteLocation = () => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const t = useTranslations('useDeleteLocation')

  return useMutation({
    mutationFn: deleteLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] })
      router.push('/locations')
      toast.success(t('locationDeleted'))
    },
  })
}
