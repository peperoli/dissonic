import { useMutation } from '@tanstack/react-query'
import { AddConcert, Concert } from '../types/types'
import supabase from '../utils/supabase'

const addConcert = async (concert: AddConcert, bandIds: number[]): Promise<Concert> => {
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
    .insert(bandIds.map(item => ({ concert_id: newConcert?.id, band_id: item })))

  if (addBandsError) {
    throw addBandsError
  }

  return newConcert
}

export const useAddConcert = (concert: AddConcert, bandIds: number[]) => {
  return useMutation(() => addConcert(concert, bandIds))
}
