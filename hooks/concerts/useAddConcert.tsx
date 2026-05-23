import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AddConcert, SpotifyArtist } from '@/types/types'
import supabase from '@/utils/supabase/client'
import { useModal } from '@/components/shared/ModalProvider'
import toast from 'react-hot-toast'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { addSearchRecord } from '@/actions/algolia'

const addConcert = async (formData: AddConcert) => {
  const { data: newConcert, error: addConcertError } = await supabase
    .from('concerts')
    .insert({
      name: formData.is_festival ? null : formData.name,
      is_festival: formData.is_festival,
      festival_root_id: formData.festival_root_id,
      date_start: formData.date_start,
      date_end: formData.date_end,
      location_id: formData.location_id,
      doors_time: formData.doors_time || null,
      show_time: formData.show_time || null,
      source_link: formData.source_link,
      resource_status: formData.resource_status,
    })
    .select('*, festival_root:festival_roots(name), location:locations(*, country:countries(iso2))')
    .single()

  if (addConcertError) {
    throw addConcertError
  }

  const { error: addBandsError } = await supabase.from('j_concert_bands').insert(
    formData.bands?.map((item, index) => ({
      concert_id: newConcert.id,
      band_id: item.id,
      item_index: index,
    })) ?? []
  )

  if (addBandsError) {
    throw addBandsError
  }

  await addSearchRecord({
    type: 'concerts',
    id: newConcert.id,
    search_strings: null,
    image: (formData.bands?.[0]?.spotify_artist_images as SpotifyArtist['images'])?.[0]?.url || null,
    name: newConcert.is_festival ? null : newConcert.name,
    festival_root: newConcert.festival_root?.name || null,
    date_start: newConcert.date_start,
    date_end: newConcert.date_end,
    bands: formData.bands ?? [],
    location: newConcert.location.name,
    genres: null,
    country: newConcert.location.country?.iso2 || null,
    spotify_artist_id: formData.bands?.[0]?.spotify_artist_id || null,
    city: newConcert.location.city,
  })

  return { concertId: newConcert.id }
}

export const useAddConcert = () => {
  const [, setModal] = useModal()
  const queryClient = useQueryClient()
  const t = useTranslations('useAddConcert')

  return useMutation({
    mutationFn: addConcert,
    onError: error => {
      console.error(error)
      toast.error(error.message)
    },
    onSuccess: ({ concertId }) => {
      setModal(null)
      queryClient.invalidateQueries({ queryKey: ['concerts'] })
      toast.success(
        <div className="flex items-center gap-3">
          {t('concertAdded')}
          <Link href={`/concerts/${concertId}`} className="btn btn-small btn-tertiary">
            {t('open')}
          </Link>
        </div>
      )
    },
  })
}
