import supabase from '@/utils/supabase/client'
import { BandSeen } from '@/types/types'
import { useMutation } from '@tanstack/react-query'

async function deleteBandsSeen(bandsSeen: BandSeen[]) {
  const bandsSeenIds = bandsSeen.map(item => item.band_id)

  if (bandsSeenIds.length === 0) {
    return
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
}

export function useDeleteBandsSeen() {
  return useMutation({ mutationFn: deleteBandsSeen, onError: error => console.error(error) })
}
