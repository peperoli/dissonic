import { useMutation } from '@tanstack/react-query'
import { AddConcert, Concert } from '@/types/types'
import supabase from '@/utils/supabase/client'

const addConcert = async (concert: AddConcert): Promise<Concert> => {
  const { data: newConcert, error: addConcertError } = await supabase
    .from('concerts')
    .insert({
      name: concert.name,
      is_festival: concert.is_festival,
      festival_root_id: concert.festival_root_id,
      date_start: concert.date_start,
      date_end: concert.date_end,
      location_id: concert.location_id,
    })
    .select()
    .single()

  if (addConcertError) {
    throw addConcertError
  }

  const { error: addBandsError } = await supabase
    .from('j_concert_bands')
    .insert(
      concert.bands?.map((item, index) => ({
        concert_id: newConcert.id,
        band_id: item.id,
        item_index: index,
      })) ?? []
    )

  if (addBandsError) {
    throw addBandsError
  }

  return newConcert
}

export const useAddConcert = () => {
  return useMutation(addConcert, { onError: error => console.error(error) })
}
