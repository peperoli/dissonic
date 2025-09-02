import { Tables } from '@/types/supabase'
import supabase from '@/utils/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import toast from 'react-hot-toast'
import { deleteImageCloudflare, deleteVideoCloudflare } from '@/actions/files'
import Cloudflare from 'cloudflare'

async function editLog({
  concertId,
  userId,
  bandsToAdd,
  bandsToDelete,
  memoriesToAdd,
  memoriesToDelete,
  memoriesToUpdate,
  comment,
}: {
  concertId: number
  userId: string
  bandsToAdd: number[]
  bandsToDelete: number[]
  memoriesToAdd: Tables<'memories'>[]
  memoriesToDelete: Tables<'memories'>[]
  memoriesToUpdate: Tables<'memories'>[]
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

  const { error: deleteBandsSeenError } = await supabase
    .from('j_bands_seen')
    .delete()
    .eq('concert_id', concertId)
    .eq('user_id', userId)
    .in('band_id', bandsToDelete)

  if (deleteBandsSeenError) {
    throw deleteBandsSeenError
  }

  const memoriesWithDimensions = await Promise.all(
    memoriesToAdd.map(async memory => {
      if (memory.file_type.startsWith('video/')) {
        const response = await fetch(
          `/api/cloudflare/get-video-details?videoId=${memory.cloudflare_file_id}`
        )
        const video: Cloudflare.Stream.Video = await response.json()

        return {
          ...memory,
          concert_id: concertId,
          width: video.input?.width ?? null,
          height: video.input?.height ?? null,
        }
      } else {
        return {
          ...memory,
          concert_id: concertId,
        }
      }
    })
  )

  const { error: insertMemoriesError } = await supabase
    .from('memories')
    .insert(memoriesWithDimensions)

  if (insertMemoriesError) {
    throw insertMemoriesError
  }

  try {
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

  if (!!comment?.length) {
    const { data: existingComment } = await supabase
      .from('comments')
      .select('id')
      .eq('concert_id', concertId)
      .eq('user_id', userId)
      .single()

    if (existingComment) {
      const { error: updateCommentError } = await supabase
        .from('comments')
        .update({ concert_id: concertId, content: comment })
        .eq('concert_id', concertId)
        .eq('user_id', userId)

      if (updateCommentError) {
        throw updateCommentError
      }
    } else {
      const { error: insertCommentError } = await supabase.from('comments').insert({
        concert_id: concertId,
        user_id: userId,
        content: comment,
      })

      if (insertCommentError) {
        throw insertCommentError
      }
    }
  } else {
    const { error: deleteCommentError } = await supabase
      .from('comments')
      .delete()
      .eq('concert_id', concertId)
      .eq('user_id', userId)

    if (deleteCommentError) {
      throw deleteCommentError
    }
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
      queryClient.invalidateQueries({ queryKey: ['concert', concertId] })
      queryClient.invalidateQueries({ queryKey: ['memories', concertId] })
      queryClient.invalidateQueries({ queryKey: ['comments', concertId] })
      toast.success(t('logUpdated'))
    },
  })
}
