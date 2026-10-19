import { useMutation, useQueryClient } from '@tanstack/react-query'
import { EditProfile } from '@/types/types'
import supabase from '@/utils/supabase/client'
import { useTranslations } from 'next-intl'
import toast from 'react-hot-toast'
import { compressImage } from '@/lib/compressImage'

async function uploadAvatar(file: File, profileId: string) {
  const { compressedFile } = await compressImage(file, {
    type: file.type === 'image/gif' ? 'image/gif' : 'image/webp',
    maxWidth: 1000,
    maxHeight: 1000,
    crop: true,
  })

  const fileName = `${profileId}.${compressedFile.type.split('/').at(-1)}`

  const { data, error: avatarError } = await supabase.storage
    .from('avatars')
    .upload(fileName, compressedFile, { upsert: true })

  if (avatarError) {
    throw avatarError
  }

  return data.path
}

const editProfile = async (formData: EditProfile & { avatarFile: File | string | null }) => {
  if (!formData.id) {
    throw new Error('Profile ID is required')
  }

  const avatarPath =
    formData.avatarFile instanceof File
      ? await uploadAvatar(formData.avatarFile, formData.id)
      : formData.avatarFile

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
    onError: error => {
      console.error(error)
      toast.error(error.message)
    },
    onSuccess: ({ profileId }) => {
      queryClient.invalidateQueries({ queryKey: ['profile', profileId] })
      toast.success(t('profileSaved'))
    },
  })
}
