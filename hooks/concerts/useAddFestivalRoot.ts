import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'
import { TablesInsert } from '@/types/supabase'
import { useModal } from '@/components/shared/ModalProvider'

const addFestivalRoot = async (formData: TablesInsert<'festival_roots'>) => {
  const { error } = await supabase.from('festival_roots').insert(formData)

  if (error) {
    throw error
  }
}

export const useAddFestivalRoot = () => {
  const queryClient = useQueryClient()
  const [_, setModal] = useModal()
  return useMutation({
    mutationFn: addFestivalRoot,
    onError: error => console.error(error),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['festivalRoots'] })
      setModal(null)
    },
  })
}
