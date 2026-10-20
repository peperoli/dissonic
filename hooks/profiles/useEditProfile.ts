import { useMutation, useQueryClient } from '@tanstack/react-query'
import { EditProfile } from '@/types/types'
import supabase from '@/utils/supabase/client'
import { useTranslations } from 'next-intl'
import toast from 'react-hot-toast'
import { compressImage } from '@/lib/compressImage'
import { Temporal } from 'temporal-polyfill'
import { compressGif } from '@/lib/compressGif'

async function uploadAvatar(file: File) {
  let compressedFile: File

  if (file.type === 'image/gif') {
    compressedFile = await compressGif(file, {
      maxWidth: 1000,
      maxHeight: 1000,
      crop: true,
    })
  } else {
    const { compressedFile: compressedImage } = await compressImage(file, {
      type: 'image/webp',
      maxWidth: 1000,
      maxHeight: 1000,
      crop: true,
    })

    compressedFile = compressedImage
  }

  const timestamp = Temporal.Now.instant().epochMilliseconds
  const fileName = `${timestamp}.${compressedFile.type.split('/').at(-1)}`

  const { data, error: avatarError } = await supabase.storage
    .from('avatars')
    .upload(fileName, compressedFile)

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
      ? await uploadAvatar(formData.avatarFile)
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
