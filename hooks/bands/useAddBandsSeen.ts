import { BandSeen } from '@/types/types'
import { useMutation } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'

async function addBandsSeen(bandsSeen: BandSeen[]) {
  const { error } = await supabase.from('j_bands_seen').insert(bandsSeen)

  if (error) {
    throw error
  }
}

export function useAddBandsSeen() {
  return useMutation({ mutationFn: addBandsSeen, onError: error => console.error(error) })
}
