import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'
import { useQueryState } from 'nuqs'
import { TablesInsert } from '@/types/supabase'

const editLocation = async (formData: TablesInsert<'locations'>) => {
  if (!formData.id) {
    throw new Error('Location ID is required')
  }

  const { error } = await supabase
    .from('locations')
    .update({
      name: formData.name,
      zip_code: formData.zip_code,
      city: formData.city,
      country_id: formData.country_id,
      website: formData.website,
    })
    .eq('id', formData.id)

  if (error) {
    throw error
  }
}

export const useEditLocation = () => {
  const queryClient = useQueryClient()
  const [_, setModal] = useQueryState('modal', { history: 'push' })
  return useMutation(editLocation, {
    onError: error => console.error(error),
    onSuccess: () => {
      queryClient.invalidateQueries(['location'])
      setModal(null)
    },
  })
}
