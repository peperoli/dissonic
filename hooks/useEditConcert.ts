import { useMutation } from 'react-query'
import { EditConcert, Band } from '../types/types'
import supabase from '../utils/supabase'

const editConcert = async (concert: EditConcert, addBands: Band[], deleteBands: Band[]) => {
  const { error: addConcertError } = await supabase
    .from('concerts')
    .update(concert)
    .eq('id', concert.id)

  if (addConcertError) {
    throw addConcertError
  }

  const { error: addBandsError } = await supabase
    .from('j_concert_bands')
    .insert(addBands.map(item => ({ concert_id: concert.id, band_id: item.id })))

  if (addBandsError) {
    throw addBandsError
  }

  const { error: deleteBandsError } = await supabase
    .from('j_concert_bands')
    .delete()
    .eq('concert_id', concert.id)
    .in(
      'band_id',
      deleteBands.map(item => item.id)
    )

  if (deleteBandsError) {
    throw deleteBandsError
  }
}

export const useEditConcert = (concert: EditConcert, addBands: Band[], deleteBands: Band[]) => {
  return useMutation(() => editConcert(concert, addBands, deleteBands))
}
