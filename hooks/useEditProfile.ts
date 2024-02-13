import { useMutation } from '@tanstack/react-query'
import { EditProfile } from '../types/types'
import supabase from '../utils/supabase/client'

const editProfile = async (newProfile: EditProfile) => {
  if (!newProfile.id) {
    throw new Error('Profile ID is required')
  }
  
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      username: newProfile.username,
      avatar_path: newProfile.avatar_path,
    })
    .eq('id', newProfile.id)

  if (profileError) {
    throw profileError
  }
}

export const useEditProfile = () => {
  return useMutation(editProfile, { onError: error => console.error(error) })
}
