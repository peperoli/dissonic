import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AddLocation } from '@/types/types'
import supabase from '@/utils/supabase/client'
import { useQueryState } from 'nuqs'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

const addLocation = async (formData: AddLocation & { imageFile: File | string | null }) => {
  const imagePath =
    formData.imageFile instanceof File
      ? `locations/${formData.id}.${formData.imageFile?.name.split('.').at(-1)}`
      : formData.imageFile

  const { data, error } = await supabase
    .from('locations')
    .insert({ ...formData, image: imagePath })
    .select()
    .single()

  if (error) {
    throw error
  }

  if (formData.imageFile && imagePath) {
    const { error: imageError } = await supabase.storage
      .from('ressources')
      .upload(imagePath, formData.imageFile)

    if (imageError) {
      throw imageError
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
    onError: error => console.error(error),
    onSuccess: ({ locationId }) => {
      queryClient.invalidateQueries({ queryKey: ['locations'] })
      setModal(null)
      toast.success(
        <>
          {t('locationAdded')}
          <Link href={`/locations/${locationId}`} className="btn btn-small btn-tertiary">
            {t('open')}
          </Link>
        </>
      )
    },
  })
}
