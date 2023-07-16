import { useMutation } from '@tanstack/react-query'
import { Genre, EditBand } from '../types/types'
import supabase from '../utils/supabase'

const editBand = async (
  bandId: number,
  band: EditBand,
  addGenres: Genre[],
  deleteGenres: Genre[],
  spotifyArtistId: string | null
) => {
  const { error: editBandError } = await supabase
    .from('bands')
    .update({ spotify_artist_id: spotifyArtistId, ...band })
    .eq('id', bandId)

  if (editBandError) {
    throw editBandError
  }

  const { error: addGenresError } = await supabase
    .from('j_band_genres')
    .insert(addGenres.map(genre => ({ band_id: bandId, genre_id: genre.id })))

  if (addGenresError) {
    throw addGenresError
  }

  if (deleteGenres) {
    const { error: deleteGenresError } = await supabase
      .from('j_band_genres')
      .delete()
      .eq('band_id', bandId)
      .in(
        'genre_id',
        deleteGenres.map(item => item.id)
      )

    if (deleteGenresError) {
      throw deleteGenresError
    }
  }
}

export const useEditBand = (
  bandId: number,
  band: EditBand,
  addGenres: Genre[],
  deleteGenres: Genre[],
  spotifyArtistId: string | null
) => {
  return useMutation(() => editBand(bandId, band, addGenres, deleteGenres, spotifyArtistId))
}
