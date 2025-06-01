import { uploadMemories } from '@/actions/files'
import { TablesInsert } from '@/types/supabase'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import toast from 'react-hot-toast'
import supabase from '@/utils/supabase/client'

async function addLog({
  concertId,
  userId,
  bandsToAdd,
  bandsToDelete,
  files,
}: {
  concertId: number
  userId: string
  bandsToAdd: TablesInsert<'j_bands_seen'>[]
  bandsToDelete: TablesInsert<'j_bands_seen'>[]
  files: File[]
}) {
  const { error: insertBandsError } = await supabase.from('j_bands_seen').insert(bandsToAdd)

  if (insertBandsError) {
    throw insertBandsError
  }

  const { error: deleteBandsSeenError } = await supabase
    .from('j_bands_seen')
    .delete()
    .eq('concert_id', concertId)
    .eq('user_id', userId)
    .in(
      'band_id',
      bandsToDelete.map(band => band.band_id)
    )

  if (deleteBandsSeenError) {
    throw deleteBandsSeenError
  }

  try {
    const fileNames = await uploadMemories(files)

    if (!!fileNames?.length) {
      const { error: insertMemoriesError } = await supabase.from('memories').insert(
        fileNames.map(fileName => ({
          concert_id: concertId,
          file_name: fileName,
        }))
      )

      if (insertMemoriesError) {
        throw insertMemoriesError
      }
    }
  } catch (error) {
    throw error
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
      toast.success(t('bandsSeenUpdated'))
    },
  })
}
