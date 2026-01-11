import { Tables, TablesInsert } from '@/types/supabase'
import supabase from '@/utils/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import toast from 'react-hot-toast'
import { MemoryFileItem } from '../helpers/useMemoriesControl'
import { getCloudflareVideoDetails } from '@/lib/cloudflareHelpers'

async function addLog({
  concertId,
  userId,
  bandsToAdd,
  memoryFileItemsToAdd,
}: {
  concertId: number
  userId: string
  bandsToAdd: number[]
  memoryFileItemsToAdd: MemoryFileItem[]
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

  const memoriesToAdd = await Promise.all(
    memoryFileItemsToAdd
      .filter(memoryFileItem => memoryFileItem.fileId != null)
      .map(async memoryFileItem => {
        let dimensions: { width: number | null; height: number | null } = {
          width: null,
          height: null,
        }
        let duration: number | null = null

        if (memoryFileItem.file.type.startsWith('video/')) {
          const videoDetails = await getCloudflareVideoDetails(memoryFileItem.fileId!)

          dimensions = {
            width: videoDetails.input?.width ?? null,
            height: videoDetails.input?.height ?? null,
          }
          duration = videoDetails.duration ? Math.round(videoDetails.duration) : null
        }

        return {
          file_id: memoryFileItem.fileId!,
          file_type: memoryFileItem.file.type,
          band_id: memoryFileItem.bandId,
          concert_id: concertId,
          width: dimensions.width,
          height: dimensions.height,
          duration,
        } satisfies TablesInsert<'memories'>
      })
  )

  const { error: insertMemoriesError } = await supabase.from('memories').insert(memoriesToAdd)

  if (insertMemoriesError) {
    throw insertMemoriesError
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
      queryClient.invalidateQueries({ queryKey: ['image-memories-count', concertId] })
      queryClient.invalidateQueries({ queryKey: ['video-memories-count', concertId] })
      queryClient.invalidateQueries({ queryKey: ['memories-count', concertId] })
      queryClient.invalidateQueries({ queryKey: ['comments', concertId] })
      toast.success(t('logAdded'))
    },
  })
}
