import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AddBand } from '@/types/types'
import supabase from '@/utils/supabase/client'
import { useQueryState } from 'nuqs'
import toast from 'react-hot-toast'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

const addBand = async (band: AddBand) => {
  const { data: newBand, error: bandError } = await supabase
    .from('bands')
    .insert({
      name: band.name,
      country_id: band.country_id,
      spotify_artist_id: band.spotify_artist_id,
      spotify_artist_images: band.spotify_artist_images,
      alt_names: band.alt_names,
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

  return { bandId: newBand.id }
}

export const useAddBand = () => {
  const queryClient = useQueryClient()
  const [_, setModal] = useQueryState('modal', { history: 'push' })
  const t = useTranslations('useAddBand')

  return useMutation({
    mutationFn: addBand,
    onError: error => { console.error(error); toast.error(error.message)},
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
