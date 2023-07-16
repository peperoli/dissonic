import { useMutation } from '@tanstack/react-query'
import { Genre, EditBand } from '../types/types'
import supabase from '../utils/supabase'

const addBand = async (band: EditBand, addGenres: Genre[], spotifyArtistId: string | null) => {
  const { data: newBand, error: bandError } = await supabase
    .from('bands')
    .insert({
      name: band.name,
      country_id: band.country_id,
      spotify_artist_id: spotifyArtistId,
    })
    .select()
    .single()

  if (bandError) {
    throw bandError
  }

  const { error: genresError } = await supabase
    .from('j_band_genres')
    .insert(addGenres.map(genre => ({ band_id: newBand?.id, genre_id: genre.id })))

  if (genresError) {
    throw genresError
  }
}

export const useAddBand = (band: EditBand, addGenres: Genre[], spotifyArtistId: string | null) => {
  return useMutation(() => addBand(band, addGenres, spotifyArtistId))
}
