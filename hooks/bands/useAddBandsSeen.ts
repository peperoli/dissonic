import { useMutation } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'
import { TablesInsert } from '@/types/supabase'

async function addBandsSeen(bandsSeen: TablesInsert<'j_bands_seen'>[]) {
  const { error } = await supabase.from('j_bands_seen').insert(bandsSeen)

  if (error) {
    throw error
  }
}

export function useAddBandsSeen() {
  return useMutation({ mutationFn: addBandsSeen, onError: error => console.error(error) })
}
