import { useMutation } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'

const deleteAvatar = async (path: string) => {
  const { error } = await supabase.storage.from('avatars').remove([path])

  if (error) {
    throw error
  }
}

export const useDeleteAvatar = () => {
  return useMutation(deleteAvatar, { onError: error => console.error(error) })
}
