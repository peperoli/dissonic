import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'
import { useQueryState } from 'nuqs'
import { EditLocation } from '@/types/types'
import toast from 'react-hot-toast'
import { useTranslations } from 'next-intl'
import { editGlobalRecord, editLocationRecord } from '@/actions/algolia'

const editLocation = async (
  formData: EditLocation & { imageFile: File | string | null }
) => {
  const locationId = formData.id

  if (!locationId) {
    throw new Error('Location ID is required')
  }

  const imagePath =
    formData.imageFile instanceof File
      ? `locations/${locationId}.${formData.imageFile?.name.split('.').at(-1)}`
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

  const { data: newLocation, error } = await supabase
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
    .eq('id', locationId)
    .select('*, country:countries(iso2)')
    .single()

  if (error) {
    throw error
  }

  await Promise.all([
    editGlobalRecord(`locations-${locationId}`, {
      name: newLocation.name,
      country: newLocation.country?.iso2,
      city: newLocation.city,
      image: imagePath,
    }),
    editLocationRecord(locationId.toString(), newLocation),
  ])

  return { locationId }
}

export const useEditLocation = () => {
  const queryClient = useQueryClient()
  const [, setModal] = useQueryState('modal', { history: 'push' })
  const t = useTranslations('useEditLocation')

  return useMutation({
    mutationFn: editLocation,
    onError: error => {
      console.error(error)
      toast.error(error.message)
    },
    onSuccess: ({ locationId }) => {
      queryClient.invalidateQueries({ queryKey: ['location', locationId] })
      setModal(null)
      toast.success(t('locationSaved'))
    },
  })
}
