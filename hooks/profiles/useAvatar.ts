import { useQuery } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'

const downloadAvatar = async (avatarPath?: string | null) => {
  if (!avatarPath) {
    throw new Error('No avatar path')
  }

  const { data, error } = await supabase.storage.from('avatars').download(avatarPath)

  if (error) {
    throw error
  }

  const url = URL.createObjectURL(data)
  return { file: data, url }
}

export const useAvatar = (avatarPath?: string | null) => {
  return useQuery(['avatar', avatarPath], () => downloadAvatar(avatarPath), {
    enabled: !!avatarPath,
  })
}
