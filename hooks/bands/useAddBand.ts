import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AddBand } from '@/types/types'
import supabase from '@/utils/supabase/client'
import { useQueryState } from 'nuqs'

const addBand = async (band: AddBand) => {
  const { data: newBand, error: bandError } = await supabase
    .from('bands')
    .insert({
      name: band.name,
      country_id: band.country_id,
      spotify_artist_id: band.spotify_artist_id,
      youtube_url: band.youtube_url,
    })
    .select()
    .single()

  if (bandError) {
    throw bandError
  }

  const { error: genresError } = await supabase
    .from('j_band_genres')
    .insert(band.genres.map(genre => ({ band_id: newBand?.id, genre_id: genre.id })))

  if (genresError) {
    throw genresError
  }
}

export const useAddBand = () => {
  const queryClient = useQueryClient()
  const [_, setModal] = useQueryState('modal', { history: 'push' })
  return useMutation(addBand, {
    onError: error => console.error(error),
    onSuccess: () => {
      queryClient.invalidateQueries(['bands'])
      setModal(null)
    },
  })
}
