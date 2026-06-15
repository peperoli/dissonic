import { useMutation, useQueryClient } from '@tanstack/react-query'
import { EditBand } from '@/types/types'
import supabase from '@/utils/supabase/client'
import { useQueryState } from 'nuqs'
import toast from 'react-hot-toast'
import { useTranslations } from 'next-intl'
import { editBandRecord, editGlobalRecord } from '@/actions/algolia'

const editBand = async (formData: EditBand) => {
  const bandId = formData.id

  if (!bandId) {
    throw new Error('Band ID is required')
  }

  const { data: oldBand, error: oldGenresError } = await supabase
    .from('bands')
    .select('id, genres(*)')
    .eq('id', bandId)
    .single()

  if (oldGenresError) {
    throw oldGenresError
  }

  const { data: newBand, error: editBandError } = await supabase
    .from('bands')
    .update({
      name: formData.name,
      country_id: formData.country_id,
      spotify_artist_id: formData.spotify_artist_id,
      spotify_artist_images: formData.spotify_artist_images,
      alt_names: formData.alt_names,
      youtube_url: formData.youtube_url,
    })
    .eq('id', bandId)
    .select('*, country:countries(iso2)')
    .single()

  if (editBandError) {
    throw editBandError
  }

  const addGenres = formData.genres.filter(
    item => !oldBand.genres.find(item2 => item.id === item2.id)
  )
  const deleteGenres = oldBand.genres.filter(
    item => !formData.genres.find(item2 => item.id === item2.id)
  )

  if (deleteGenres.length) {
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

  const { error: addGenresError } = await supabase
    .from('j_band_genres')
    .insert(addGenres.map(genre => ({ band_id: bandId, genre_id: genre.id })))

  if (addGenresError) {
    throw addGenresError
  }

  await Promise.all([
    editGlobalRecord(`bands-${bandId}`, {
      name: newBand.name,
      genres: formData.genres.map(genre => genre.name),
      country: newBand.country?.iso2,
      spotify_artist_id: newBand.spotify_artist_id,
    }),
    editBandRecord(bandId.toString(), { ...newBand, genres: formData.genres }),
  ])

  return { bandId, spotifyArtistId: newBand.spotify_artist_id }
}

export const useEditBand = () => {
  const queryClient = useQueryClient()
  const [, setModal] = useQueryState('modal', { history: 'push' })
  const t = useTranslations('useEditBand')

  return useMutation({
    mutationFn: editBand,
    onError: error => {
      console.error(error)
      toast.error(error.message)
    },
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
