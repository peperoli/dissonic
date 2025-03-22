import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'
import { useQueryState } from 'nuqs'
import { TablesInsert } from '@/types/supabase'
import toast from 'react-hot-toast'
import { useTranslations } from 'next-intl'

const editLocation = async (
  formData: TablesInsert<'locations'> & { imageFile: File | string | null }
) => {
  if (!formData.id) {
    throw new Error('Location ID is required')
  }

  const imagePath =
    formData.imageFile instanceof File
      ? `locations/${formData.id}.${formData.imageFile?.name.split('.').at(-1)}`
      : formData.image

  if (formData.imageFile instanceof File && imagePath) {
    const { error: imageError } = await supabase.storage
      .from('ressources')
      .upload(imagePath, formData.imageFile, { upsert: true })

    if (imageError) {
      throw imageError
    }
  } else if (formData.imageFile === null && imagePath) {
    const { error: imageError } = await supabase.storage.from('ressources').remove([imagePath])

    if (imageError) {
      throw imageError
    }
  }

  const { error } = await supabase
    .from('locations')
    .update({
      name: formData.name,
      zip_code: formData.zip_code,
      city: formData.city,
      country_id: formData.country_id,
      alt_names: formData.alt_names,
      website: formData.website,
      image: imagePath,
    })
    .eq('id', formData.id)

  if (error) {
    throw error
  }

  return { locationId: formData.id }
}

export const useEditLocation = () => {
  const queryClient = useQueryClient()
  const [_, setModal] = useQueryState('modal', { history: 'push' })
  const t = useTranslations('useEditLocation')

  return useMutation({
    mutationFn: editLocation,
    onError: error => { console.error(error); toast.error(error.message)},
    onSuccess: ({ locationId }) => {
      queryClient.invalidateQueries({ queryKey: ['location', locationId] })
      setModal(null)
      toast.success(t('locationSaved'))
    },
  })
}
