import { useMutation, useQueryClient } from '@tanstack/react-query'
import { EditBand, Genre } from '@/types/types'
import supabase from '@/utils/supabase/client'
import { useQueryState } from 'nuqs'
import toast from 'react-hot-toast'
import { useTranslations } from 'next-intl'

const editBand = async (formData: EditBand) => {
  if (!formData.id) {
    throw new Error('Band ID is required')
  }

  try {
    const { data: oldBand, error: oldGenresError } = await supabase
      .from('bands')
      .select('id, genres(*)')
      .eq('id', formData.id)
      .single()

    if (oldGenresError) {
      throw oldGenresError
    }

    const { error: editBandError } = await supabase
      .from('bands')
      .update({
        name: formData.name,
        country_id: formData.country_id,
        spotify_artist_id: formData.spotify_artist_id,
        spotify_artist_images: formData.spotify_artist_images,
        alt_names: formData.alt_names,
        youtube_url: formData.youtube_url,
      })
      .eq('id', formData.id)

    if (editBandError) {
      throw editBandError
    }

    try {
      const addGenres: Genre[] = formData.genres.filter(
        item => !oldBand.genres.find(item2 => item.id === item2.id)
      )
      const deleteGenres: Genre[] = oldBand.genres.filter(
        item => !formData.genres.find(item2 => item.id === item2.id)
      )

      const { error: deleteGenresError } = await supabase
        .from('j_band_genres')
        .delete()
        .eq('band_id', formData.id)
        .in(
          'genre_id',
          deleteGenres.map(item => item.id)
        )

      if (deleteGenresError) {
        throw deleteGenresError
      }

      const { error: addGenresError } = await supabase
        .from('j_band_genres')
        .insert(addGenres.map(genre => ({ band_id: formData.id!, genre_id: genre.id })))

      if (addGenresError) {
        throw addGenresError
      }
    } catch (error) {
      throw error
    }

    return { bandId: formData.id, spotifyArtistId: formData.spotify_artist_id }
  } catch (error) {
    throw error
  }
}

export const useEditBand = () => {
  const queryClient = useQueryClient()
  const [_, setModal] = useQueryState('modal', { history: 'push' })
  const t = useTranslations('useEditBand')

  return useMutation({
    mutationFn: editBand,
    onError: error => console.error(error),
    onSuccess: ({ bandId, spotifyArtistId }) => {
      queryClient.invalidateQueries({ queryKey: ['band', bandId] })
      queryClient.invalidateQueries({ queryKey: ['spotifyArtist', spotifyArtistId] })
      queryClient.invalidateQueries({
        queryKey: ['contributions-count', 'bands', bandId, null],
      })
      setModal(null)
      toast.success(t('bandSaved'))
    },
  })
}
