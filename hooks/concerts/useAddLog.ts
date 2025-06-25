import { getPutUrl } from '@/actions/files'
import { Memory } from '@/components/concerts/ConcertLogForm'
import { Tables } from '@/types/supabase'
import supabase from '@/utils/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import toast from 'react-hot-toast'

export async function uploadMemory(memory: Exclude<Memory, Tables<'memories'>>, concertId: number) {
  try {
    const fileName = `${Date.now()}-${memory.file.name}`
    const { signedUrl } = await getPutUrl(fileName)
    const dimensions: { width: number | null; height: number | null } = {
      width: null,
      height: null,
    }

    if (memory.file.type.startsWith('image/')) {
      const reader = new FileReader()

      reader.onload = event => {
        const img = new Image()
        img.onload = () => {
          dimensions.width = img.width
          dimensions.height = img.height
        }
        if (!event.target?.result) {
          throw new Error('Failed to read file')
        }
        img.src = event.target?.result as string
      }

      reader.readAsDataURL(memory.file)
    }

    await fetch(signedUrl, {
      method: 'PUT',
      body: memory.file,
      headers: {
        'Content-Type': memory.file.type,
      },
    })

    const { error: insertMemoriesError } = await supabase.from('memories').insert({
      concert_id: concertId,
      band_id: memory.band_id,
      file_name: fileName,
      file_size: memory.file.size,
      file_type: memory.file.type,
      file_width: dimensions.width,
      file_height: dimensions.height,
    })

    if (insertMemoriesError) {
      throw insertMemoriesError
    }
  } catch (error) {
    throw error
  }
}

async function addLog({
  concertId,
  userId,
  bandsToAdd,
  memoriesToAdd,
  comment,
}: {
  concertId: number
  userId: string
  bandsToAdd: number[]
  memoriesToAdd: Exclude<Memory, Tables<'memories'>>[]
  comment: Tables<'comments'>['content']
}) {
  const { error: insertBandsError } = await supabase.from('j_bands_seen').insert(
    bandsToAdd.map(bandId => ({
      concert_id: concertId,
      band_id: bandId,
      user_id: userId,
    }))
  )

  if (insertBandsError) {
    throw insertBandsError
  }

  await Promise.all(memoriesToAdd.map(memory => uploadMemory(memory, concertId)))

  if (!!comment?.length) {
    const { error: insertCommentError } = await supabase
      .from('comments')
      .insert({ concert_id: concertId, content: comment })

    if (insertCommentError) {
      throw insertCommentError
    }
  }

  return { concertId }
}

export function useAddLog() {
  const queryClient = useQueryClient()
  const t = useTranslations('useAddLog')

  return useMutation({
    mutationFn: addLog,
    onError: error => {
      console.error(error)
      toast.error(error.message)
    },
    onSuccess: ({ concertId }) => {
      queryClient.invalidateQueries({ queryKey: ['concert', concertId] })
      queryClient.invalidateQueries({ queryKey: ['memories', concertId] })
      queryClient.invalidateQueries({ queryKey: ['comments', concertId] })
      toast.success(t('logAdded'))
    },
  })
}
