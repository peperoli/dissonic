import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'
import { TablesInsert } from '@/types/supabase'
import { useModal } from '@/components/shared/ModalProvider'
import { useTranslations } from 'next-intl'
import toast from 'react-hot-toast'

const addFestivalRoot = async (formData: TablesInsert<'festival_roots'>) => {
  const { error } = await supabase.from('festival_roots').insert(formData)

  if (error) {
    throw error
  }
}

export const useAddFestivalRoot = () => {
  const queryClient = useQueryClient()
  const [_, setModal] = useModal()
  const t = useTranslations('useAddFestivalRoot')

  return useMutation({
    mutationFn: addFestivalRoot,
    onError: error => { console.error(error); toast.error(error.message)},
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['festivalRoots'] })
      setModal(null)
      toast.success(t('festivalRootAdded'))
    },
  })
}
