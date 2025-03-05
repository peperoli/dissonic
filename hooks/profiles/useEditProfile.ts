import { useMutation, useQueryClient } from '@tanstack/react-query'
import { EditProfile } from '@/types/types'
import supabase from '@/utils/supabase/client'
import { useTranslations } from 'next-intl'
import toast from 'react-hot-toast'

const editProfile = async (formData: EditProfile & { avatarFile: File | string | null }) => {
  if (!formData.id) {
    throw new Error('Profile ID is required')
  }

  const avatarPath =
    formData.avatarFile instanceof File
      ? `${formData.id}.${formData.avatarFile?.name.split('.').at(-1)}`
      : formData.avatarFile

  if (formData.avatarFile instanceof File && avatarPath) {
    const { error: avatarError } = await supabase.storage
      .from('avatars')
      .upload(avatarPath, formData.avatarFile, { upsert: true })

    if (avatarError) {
      throw avatarError
    }
  } else if (formData.avatarFile === null && avatarPath) {
    const { error: avatarError } = await supabase.storage.from('avatars').remove([avatarPath])

    if (avatarError) {
      throw avatarError
    }
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({
      username: formData.username,
      avatar_path: avatarPath,
    })
    .eq('id', formData.id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return { profileId: data.id }
}

export const useEditProfile = () => {
  const queryClient = useQueryClient()
  const t = useTranslations('useEditProfile')

  return useMutation({
    mutationFn: editProfile,
    onError: error => console.error(error),
    onSuccess: ({ profileId }) => {
      queryClient.invalidateQueries({ queryKey: ['profile', profileId] })
      toast.success(t('profileSaved'))
    },
  })
}
