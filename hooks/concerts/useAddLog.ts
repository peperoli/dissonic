import { Memory } from '@/components/concerts/ConcertLogForm'
import { uploadMemory } from '@/lib/uploadMemory'
import { Tables } from '@/types/supabase'
import supabase from '@/utils/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import toast from 'react-hot-toast'

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

  await Promise.all(
    memoriesToAdd.map(memory =>
      uploadMemory(memory, concertId, progress => {
        console.log(`Upload progress: ${Math.round(progress * 100)}%`)
      })
    )
  )

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
