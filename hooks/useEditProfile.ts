import { useMutation } from '@tanstack/react-query'
import { EditProfile } from '../types/types'
import supabase from '../utils/supabase'

const editProfile = async (newProfile: EditProfile) => {
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
  return useMutation(editProfile, { onError: error => console.log(error) })
}
