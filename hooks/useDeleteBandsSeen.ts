import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { BandSeen } from '../types/types'
import { useMutation } from '@tanstack/react-query'
import { Database } from '../types/supabase'

async function deleteBandsSeen(bandsSeen: BandSeen[]) {
  const supabase = createClientComponentClient<Database>()
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
  return useMutation(deleteBandsSeen, {
    onError: error => console.error(error),
  })
}
