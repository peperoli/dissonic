import { useMutation } from '@tanstack/react-query'
import supabase from '../utils/supabase'

const uploadFile = async (newFile: { file: File; path: string, upsert?: boolean }): Promise<{ path: string }> => {
  const { data, error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(newFile.path, newFile.file, {
      cacheControl: '3600',
      upsert: newFile.upsert ?? false,
    })

  if (uploadError) {
    throw uploadError
  }

  return data
}

export const useUploadFile = () => {
  return useMutation(uploadFile, { onError: error => console.log(error) })
}
