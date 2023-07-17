import { useMutation } from '@tanstack/react-query'
import { EditBand, Band } from '../types/types'
import supabase from '../utils/supabase'

const editBand = async (newBand: EditBand) => {
  try {
    const { data: oldBand, error: oldGenresError } = await supabase
      .from('bands')
      .select('id, genres(*)')
      .eq('id', newBand.id)
      .returns<Band>()
      .single()

    if (oldGenresError) {
      throw oldGenresError
    }

    const { error: editBandError } = await supabase
      .from('bands')
      .update({
        name: newBand.name,
        country_id: newBand.country_id,
        spotify_artist_id: newBand.spotify_artist_id,
      })
      .eq('id', newBand.id)

    if (editBandError) {
      throw editBandError
    }

    try {
      const addGenres = newBand.genres.filter(item => !oldBand.genres.includes(item))
      const deleteGenres = oldBand.genres.filter(item => !newBand.genres.includes(item))

      const { error: deleteGenresError } = await supabase
        .from('j_band_genres')
        .delete()
        .eq('band_id', newBand.id)
        .in(
          'genre_id',
          deleteGenres.map(item => item.id)
        )

      if (deleteGenresError) {
        throw deleteGenresError
      }

      const { error: addGenresError } = await supabase
        .from('j_band_genres')
        .insert(addGenres.map(genre => ({ band_id: newBand.id, genre_id: genre.id })))

      if (addGenresError) {
        throw addGenresError
      }
    } catch (error) {
      throw error
    }
  } catch (error) {
    throw error
  }
}

export const useEditBand = () => {
  return useMutation(editBand, {
    onError: error => console.error(error),
  })
}
