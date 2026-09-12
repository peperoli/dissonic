import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'
import { useModal } from '@/components/shared/ModalProvider'
import { useTranslations } from 'next-intl'
import toast from 'react-hot-toast'
import { FestivalRootFields } from '@/components/concerts/FestivalRootForm'
import { addFestivalRootRecord } from '@/actions/algolia'

const addFestivalRoot = async (formData: FestivalRootFields) => {
  const { data: newFestivalRoot, error } = await supabase
    .from('festival_roots')
    .insert({
      name: formData.name,
      default_location_id: formData.default_location.id,
      website: formData.website,
    })
    .select('id, name, default_location:locations(id, name, alt_names, city)')
    .single()

  if (error) {
    throw error
  }

  await addFestivalRootRecord(newFestivalRoot)
}

export const useAddFestivalRoot = () => {
  const queryClient = useQueryClient()
  const [, setModal] = useModal()
  const t = useTranslations('useAddFestivalRoot')

  return useMutation({
    mutationFn: addFestivalRoot,
    onError: error => {
      console.error(error)
      toast.error(error.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['festivalRoots'] })
      setModal(null)
      toast.success(t('festivalRootAdded'))
    },
  })
}
