import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AddConcert } from '@/types/types'
import supabase from '@/utils/supabase/client'
import { useModal } from '@/components/shared/ModalProvider'
import toast from 'react-hot-toast'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

const addConcert = async (concert: AddConcert) => {
  const { data: newConcert, error: addConcertError } = await supabase
    .from('concerts')
    .insert({
      name: concert.is_festival ? null : concert.name,
      is_festival: concert.is_festival,
      festival_root_id: concert.festival_root_id,
      date_start: concert.date_start,
      date_end: concert.date_end,
      location_id: concert.location_id,
      doors_time: concert.doors_time || null,
      show_time: concert.show_time || null,
      source_link: concert.source_link,
      resource_status: concert.resource_status,
    })
    .select()
    .single()

  if (addConcertError) {
    throw addConcertError
  }

  const { error: addBandsError } = await supabase.from('j_concert_bands').insert(
    concert.bands?.map((item, index) => ({
      concert_id: newConcert.id,
      band_id: item.id,
      item_index: index,
    })) ?? []
  )

  if (addBandsError) {
    throw addBandsError
  }

  return { concertId: newConcert.id }
}

export const useAddConcert = () => {
  const [_, setModal] = useModal()
  const queryClient = useQueryClient()
  const t = useTranslations('useAddConcert')

  return useMutation({
    mutationFn: addConcert,
    onError: error => { console.error(error); toast.error(error.message)},
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
