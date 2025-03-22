import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AddLocation } from '@/types/types'
import supabase from '@/utils/supabase/client'
import { useQueryState } from 'nuqs'
import toast from 'react-hot-toast'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

const addLocation = async (formData: AddLocation & { imageFile: File | string | null }) => {
  const { data, error } = await supabase
    .from('locations')
    .insert({
      name: formData.name,
      zip_code: formData.zip_code,
      city: formData.city,
      country_id: formData.country_id,
      alt_names: formData.alt_names,
      website: formData.website,
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  const imagePath =
    formData.imageFile instanceof File
      ? `locations/${data.id}.${formData.imageFile?.name.split('.').at(-1)}`
      : formData.imageFile

  if (formData.imageFile && imagePath) {
    const { error: imageError } = await supabase.storage
      .from('ressources')
      .upload(imagePath, formData.imageFile)

    if (imageError) {
      throw imageError
    }

    const { error: updateImageError } = await supabase
      .from('locations')
      .update({
        image: imagePath,
      })
      .eq('id', data.id)

    if (updateImageError) {
      throw updateImageError
    }
  }

  return { locationId: data.id }
}

export const useAddLocation = () => {
  const queryClient = useQueryClient()
  const [_, setModal] = useQueryState('modal', { history: 'push' })
  const t = useTranslations('useAddLocation')

  return useMutation({
    mutationFn: addLocation,
    onError: error => {
      console.error(error)
      toast.error(error.message)
    },
    onSuccess: ({ locationId }) => {
      queryClient.invalidateQueries({ queryKey: ['locations'] })
      setModal(null)
      toast.success(
        <div className="flex items-center gap-3">
          {t('locationAdded')}
          <Link href={`/locations/${locationId}`} className="btn btn-small btn-tertiary">
            {t('open')}
          </Link>
        </div>
      )
    },
  })
}
