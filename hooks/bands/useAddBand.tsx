import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AddBand } from '@/types/types'
import supabase from '@/utils/supabase/client'
import { useQueryState } from 'nuqs'
import toast from 'react-hot-toast'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { addBandRecord, addGlobalRecord } from '@/actions/algolia'

const addBand = async (formData: AddBand) => {
  const { data: newBand, error: bandError } = await supabase
    .from('bands')
    .insert({
      name: formData.name,
      country_id: formData.country_id,
      spotify_artist_id: formData.spotify_artist_id,
      spotify_artist_images: formData.spotify_artist_images,
      alt_names: formData.alt_names,
      youtube_url: formData.youtube_url,
    })
    .select('*, country:countries(iso2)')
    .single()

  if (bandError) {
    throw bandError
  }

  const { error: genresError } = await supabase
    .from('j_band_genres')
    .insert(formData.genres.map(genre => ({ band_id: newBand?.id, genre_id: genre.id })))

  if (genresError) {
    throw genresError
  }

  await Promise.all([
    addGlobalRecord({
      type: 'bands',
      id: newBand.id,
      search_strings: null,
      image: null,
      name: newBand.name,
      festival_root: null,
      date_start: null,
      date_end: null,
      bands: null,
      location: null,
      genres: formData.genres.map(genre => genre.name),
      country: newBand.country?.iso2 || null,
      spotify_artist_id: newBand.spotify_artist_id,
      city: null,
    }),
    addBandRecord({...newBand, genres: formData.genres }),
  ])

  return { bandId: newBand.id }
}

export const useAddBand = () => {
  const queryClient = useQueryClient()
  const [, setModal] = useQueryState('modal', { history: 'push' })
  const t = useTranslations('useAddBand')

  return useMutation({
    mutationFn: addBand,
    onError: error => {
      console.error(error)
      toast.error(error.message)
    },
    onSuccess: ({ bandId }) => {
      queryClient.invalidateQueries({ queryKey: ['bands'] })
      setModal(null)
      toast.success(
        <div className="flex items-center gap-3">
          {t('bandAdded')}
          <Link href={`/bands/${bandId}`} className="btn btn-small btn-tertiary">
            {t('open')}
          </Link>
        </div>
      )
    },
  })
}
