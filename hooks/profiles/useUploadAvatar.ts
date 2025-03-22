import { useMutation } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'
import toast from 'react-hot-toast'

const uploadAvatar = async (avatar: { file: Blob; path: string }) => {
  const { error } = await supabase.storage.from('avatars').upload(avatar.path, avatar.file, {
    cacheControl: '3600',
    upsert: true,
  })

  if (error) {
    throw error
  }
}

export const useUploadAvatar = () => {
  return useMutation({
    mutationFn: uploadAvatar,
    onError: error => {
      console.error(error)
      toast.error(error.message)
    },
  })
}
