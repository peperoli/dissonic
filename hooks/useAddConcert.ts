import { useMutation } from '@tanstack/react-query'
import { AddConcert, Band, Concert } from '../types/types'
import supabase from '../utils/supabase'

const addConcert = async (concert: AddConcert, bands: Band[]): Promise<Concert> => {
  const { data: newConcert, error: addConcertError } = await supabase
    .from('concerts')
    .insert(concert)
    .select()
    .single()

  if (addConcertError) {
    throw addConcertError
  }

  const { error: addBandsError } = await supabase
    .from('j_concert_bands')
    .insert(bands.map(item => ({ concert_id: newConcert?.id, band_id: item.id })))

  if (addBandsError) {
    throw addBandsError
  }

  return newConcert
}

export const useAddConcert = (concert: AddConcert, bands: Band[]) => {
  return useMutation(() => addConcert(concert, bands))
}
