import supabase from '@/utils/supabase/client'
import { BandSeen } from '@/types/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

async function deleteBandsSeen(bandsSeen: BandSeen[]) {
  const bandsSeenIds = bandsSeen.map(item => item.band_id)

  if (bandsSeenIds.length === 0) {
    return { concertId: null }
  }

  const { error } = await supabase
    .from('j_bands_seen')
    .delete()
    .eq('concert_id', bandsSeen[0].concert_id)
    .eq('user_id', bandsSeen[0].user_id)
    .in('band_id', bandsSeenIds)

  if (error) {
    throw error
  }

  return { concertId: bandsSeen[0].concert_id }
}

export function useDeleteBandsSeen() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteBandsSeen,
    onError: error => {
      console.error(error)
      toast.error(error.message)
    },
    onSuccess: ({ concertId }) => {
      queryClient.invalidateQueries({ queryKey: ['bandsSeen', concertId] })
    },
  })
}
