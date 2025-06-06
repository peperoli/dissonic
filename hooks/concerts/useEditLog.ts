import { deleteMemories, uploadMemories } from '@/actions/files'
import { Tables, TablesInsert } from '@/types/supabase'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import toast from 'react-hot-toast'
import supabase from '@/utils/supabase/client'
import { Memory } from '@/components/forms/MemoriesControl'

async function editLog({
  concertId,
  userId,
  bandsToAdd,
  bandsToDelete,
  memoriesToAdd,
  memoriesToDelete,
  memoriesToUpdate,
}: {
  concertId: number
  userId: string
  bandsToAdd: TablesInsert<'j_bands_seen'>[]
  bandsToDelete: TablesInsert<'j_bands_seen'>[]
  memoriesToAdd: Exclude<Memory, Tables<'memories'>>[]
  memoriesToDelete: Exclude<Memory, { file: File; band_id: number | null }>[]
  memoriesToUpdate: Exclude<Memory, { file: File; band_id: number | null }>[]
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
    const urlsToAdd = await uploadMemories(memoriesToAdd.map(memory => memory.file))
    await deleteMemories(memoriesToDelete.map(memory => memory.file_name))

    if (urlsToAdd.length > 0) {
      const { error: insertMemoriesError } = await supabase.from('memories').insert(
        urlsToAdd.map((url, index) => ({
          concert_id: concertId,
          file_url: url,
          band_id: memoriesToAdd[index].band_id,
          file_size: memoriesToAdd[index].file.size,
          file_name: memoriesToAdd[index].file.name,
          file_type: memoriesToAdd[index].file.type,
        }))
      )

      if (insertMemoriesError) {
        throw insertMemoriesError
      }
    }

    if (memoriesToDelete.length > 0) {
      const { error } = await supabase
        .from('memories')
        .delete()
        .eq('concert_id', concertId)
        .in(
          'id',
          memoriesToDelete.map(memory => memory.id)
        )

      if (error) {
        throw error
      }
    }

    memoriesToUpdate.forEach(async memory => {
      const { error } = await supabase
        .from('memories')
        .update({ band_id: memory.band_id })
        .eq('id', memory.id)

      if (error) {
        throw error
      }
    })
  } catch (error) {
    throw error
  }

  return { concertId }
}

export function useEditLog() {
  const queryClient = useQueryClient()
  const t = useTranslations('useEditLog')

  return useMutation({
    mutationFn: editLog,
    onError: error => {
      console.error(error)
      toast.error(error.message)
    },
    onSuccess: ({ concertId }) => {
      queryClient.invalidateQueries({ queryKey: ['bandsSeen', concertId] })
      queryClient.invalidateQueries({ queryKey: ['memories', concertId] })
      toast.success(t('logUpdated'))
    },
  })
}
