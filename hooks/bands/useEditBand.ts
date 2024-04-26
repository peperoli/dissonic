import { useMutation, useQueryClient } from '@tanstack/react-query'
import { EditBand, Genre } from '@/types/types'
import supabase from '@/utils/supabase/client'
import { useQueryState } from 'nuqs'

const editBand = async (newBand: EditBand) => {
  if (!newBand.id) {
    throw new Error('Band ID is required')
  }

  try {
    const { data: oldBand, error: oldGenresError } = await supabase
      .from('bands')
      .select('id, genres(*)')
      .eq('id', newBand.id)
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
        youtube_url: newBand.youtube_url,
      })
      .eq('id', newBand.id)

    if (editBandError) {
      throw editBandError
    }

    try {
      const addGenres: Genre[] = newBand.genres.filter(item => !oldBand.genres.includes(item))
      const deleteGenres: Genre[] = oldBand.genres.filter(item => !newBand.genres.includes(item))

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
        .insert(addGenres.map(genre => ({ band_id: newBand.id!, genre_id: genre.id })))

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
  const queryClient = useQueryClient()
  const [_, setModal] = useQueryState('modal', { history: 'push' })
  return useMutation(editBand, {
    onError: error => console.error(error),
    onSuccess: () => {
      queryClient.invalidateQueries(['bands'])
      setModal(null)
    },
  })
}
