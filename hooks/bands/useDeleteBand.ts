import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useTranslations } from 'next-intl'

const deleteBand = async (bandId: number) => {
  const { error } = await supabase.from('bands').delete().eq('id', bandId)

  if (error) {
    throw error
  }
}

export const useDeleteBand = () => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const t = useTranslations('useDeleteBand')

  return useMutation({
    mutationFn: deleteBand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bands'] })
      router.push('/bands')
      toast.success(t('bandDeleted'))
    },
  })
}
