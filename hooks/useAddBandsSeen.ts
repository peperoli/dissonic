import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { BandSeen } from '../types/types'
import { useMutation } from '@tanstack/react-query'
import { Database } from '../types/supabase'

async function addBandsSeen(bandsSeen: BandSeen[]) {
  const supabase = createClientComponentClient<Database>()

  const { error } = await supabase.from('j_bands_seen').insert(bandsSeen)

  if (error) {
    throw error
  }
}

export function useAddBandsSeen() {
  return useMutation(addBandsSeen, {
    onError: error => console.error(error),
  })
}
