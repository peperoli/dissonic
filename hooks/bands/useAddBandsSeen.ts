import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'
import { TablesInsert } from '@/types/supabase'
import toast from 'react-hot-toast'

async function addBandsSeen(bandsSeen: TablesInsert<'j_bands_seen'>[]) {
  const { error } = await supabase.from('j_bands_seen').insert(bandsSeen)

  if (error) {
    throw error
  }

  return { concertId: bandsSeen[0].concert_id }
}

export function useAddBandsSeen() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addBandsSeen,
    onError: error => {
      console.error(error)
      toast.error(error.message)
    },
    onSuccess: ({ concertId }) => {
      queryClient.invalidateQueries({ queryKey: ['bandsSeen', concertId] })
    },
  })
}
