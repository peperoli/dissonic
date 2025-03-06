import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Concert } from '@/types/types'
import toast from 'react-hot-toast'
import { useTranslations } from 'next-intl'

const deleteConcert = async (concertId: Concert['id']) => {
  const { error } = await supabase.from('concerts').delete().eq('id', concertId)

  if (error) {
    throw error
  }
}

export const useDeleteConcert = () => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const t = useTranslations('useDeleteConcert')

  return useMutation({
    mutationFn: deleteConcert,
    onError: error => console.error(error),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['concerts'] })
      router.push('/')
      toast.success(t('concertDeleted'))
    },
  })
}
