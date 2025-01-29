import { useMutation, useQueryClient } from '@tanstack/react-query'
import { EditProfile } from '@/types/types'
import supabase from '@/utils/supabase/client'

const editProfile = async (newProfile: EditProfile) => {
  if (!newProfile.id) {
    throw new Error('Profile ID is required')
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({
      username: newProfile.username,
      avatar_path: newProfile.avatar_path,
    })
    .eq('id', newProfile.id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return { profileId: data.id, avatarPath: data.avatar_path }
}

export const useEditProfile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: editProfile,
    onError: error => console.error(error),
    onSuccess: ({ profileId, avatarPath }) => {
      queryClient.invalidateQueries({ queryKey: ['profile', profileId] })
      queryClient.invalidateQueries({ queryKey: ['avatar', avatarPath] })
    },
  })
}
