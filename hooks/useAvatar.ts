import { useQuery } from 'react-query'
import supabase from '../utils/supabase'

const downloadAvatar = async (avatarPath: string | null | undefined): Promise<string | null> => {
  if (!avatarPath) {
    throw new Error('No avatar path')
  }

  const { data, error } = await supabase.storage.from('avatars').download(avatarPath)

  if (error) {
    throw error
  }

  const url = URL.createObjectURL(data)
  return url
}

export const useAvatar = (avatarPath: string | null | undefined) => {
  return useQuery(['avatar', avatarPath], () => downloadAvatar(avatarPath), { enabled: !!avatarPath })
}
