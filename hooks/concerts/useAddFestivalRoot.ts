import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'
import { TablesInsert } from '@/types/supabase'

const addFestivalRoot = async (formData: TablesInsert<'festival_roots'>) => {
  const { error } = await supabase.from('festival_roots').insert({
    name: formData.name,
    default_location_id: formData.default_location_id,
    website: formData.website,
  })

  if (error) {
    throw error
  }
}

export const useAddFestivalRoot = () => {
  const queryClient = useQueryClient()
  return useMutation(addFestivalRoot, {
    onError: error => console.error(error),
    onSuccess: () => queryClient.invalidateQueries(['bands']),
  })
}
