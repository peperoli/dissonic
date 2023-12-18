import { useMutation } from '@tanstack/react-query'
import { EditConcert } from '../types/types'
import supabase from '../utils/supabase'

const editConcert = async (newConcert: EditConcert) => {
  try {
    const { data: oldConcert, error: oldConcertError } = await supabase
      .from('concerts')
      .select('id, bands!j_concert_bands(*)')
      .eq('id', newConcert.id)
      .single()

    if (oldConcertError) {
      throw oldConcertError
    }

    const { error: editConcertError } = await supabase
      .from('concerts')
      .update({
        name: newConcert.name,
        is_festival: newConcert.is_festival,
        date_start: newConcert.date_start,
        date_end: newConcert.date_end,
        location_id: newConcert.location_id,
      })
      .eq('id', newConcert.id)

    if (editConcertError) {
      throw editConcertError
    }

    try {
      const addBands = newConcert.bands?.filter(
        item => !oldConcert.bands?.find(item2 => item.id === item2.id)
      )
      const deleteBands = oldConcert.bands?.filter(
        item => !newConcert.bands?.find(item2 => item.id === item2.id)
      )

      const { error: addBandsError } = await supabase
        .from('j_concert_bands')
        .insert(
          addBands?.map((item, index) => ({ concert_id: newConcert.id, band_id: item.id, index }))
        )

      if (addBandsError) {
        throw addBandsError
      }

      newConcert.bands?.forEach(async (band, index) => {
        const { error: editBandsError } = await supabase
          .from('j_concert_bands')
          .update({ index })
          .eq('concert_id', newConcert.id)
          .eq('band_id', band.id)

        if (editBandsError) {
          throw editBandsError
        }
      })

      if (deleteBands) {
        const { error: deleteBandsError } = await supabase
          .from('j_concert_bands')
          .delete()
          .eq('concert_id', newConcert.id)
          .in(
            'band_id',
            deleteBands.map(item => item.id)
          )

        if (deleteBandsError) {
          throw deleteBandsError
        }
      }
    } catch (error) {
      throw error
    }
  } catch (error) {
    throw error
  }
}

export const useEditConcert = () => {
  return useMutation(editConcert, { onError: error => console.error(error) })
}
