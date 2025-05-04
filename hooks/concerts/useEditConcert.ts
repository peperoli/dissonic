import { useMutation, useQueryClient } from '@tanstack/react-query'
import { EditConcert } from '@/types/types'
import supabase from '@/utils/supabase/client'
import { useQueryState } from 'nuqs'
import toast from 'react-hot-toast'
import { useTranslations } from 'next-intl'

const editConcert = async (newConcert: EditConcert) => {
  if (!newConcert.id) {
    throw new Error('Concert ID is required')
  }

  try {
    const { data: oldConcert, error: oldConcertError } = await supabase
      .from('concerts')
      .select('id, bands!j_concert_bands(*)')
      .eq('id', newConcert.id)
      .single()

    if (oldConcertError) {
      throw oldConcertError
    }

    const { error: editConcertError } = await supabase
      .from('concerts')
      .update({
        name: newConcert.is_festival ? null : newConcert.name,
        is_festival: newConcert.is_festival,
        festival_root_id: newConcert.is_festival ? newConcert.festival_root_id : null,
        date_start: newConcert.date_start,
        date_end: newConcert.is_festival ? newConcert.date_end : null,
        location_id: newConcert.location_id,
        doors_time: newConcert.doors_time,
        show_time: newConcert.show_time,
        source_link: newConcert.source_link,
        ticket_links: newConcert.ticket_links,
        ressource_status: newConcert.ressource_status,
      })
      .eq('id', newConcert.id)

    if (editConcertError) {
      throw editConcertError
    }

    try {
      const addBands = newConcert.bands?.filter(
        item => !oldConcert.bands?.find(item2 => item.id === item2.id)
      )
      const deleteBands = oldConcert.bands?.filter(
        item => !newConcert.bands?.find(item2 => item.id === item2.id)
      )

      const { error: addBandsError } = await supabase.from('j_concert_bands').insert(
        addBands?.map((item, index) => ({
          concert_id: newConcert.id!,
          band_id: item.id,
          item_index: index,
        })) ?? []
      )

      if (addBandsError) {
        throw addBandsError
      }

      newConcert.bands?.forEach(async (band, index) => {
        const { error: editBandsError } = await supabase
          .from('j_concert_bands')
          .update({ item_index: index })
          .eq('concert_id', newConcert.id!)
          .eq('band_id', band.id)

        if (editBandsError) {
          throw editBandsError
        }
      })

      if (deleteBands) {
        const { count } = await supabase
          .from('j_bands_seen')
          .select('*', { count: 'estimated' })
          .eq('concert_id', newConcert.id)
          .in(
            'band_id',
            deleteBands.map(item => item.id)
          )

        if (count && count > 0) {
          throw new Error('Cannot remove bands. Some bands have been marked as seen by users.')
        }

        const { error: deleteBandsError } = await supabase
          .from('j_concert_bands')
          .delete()
          .eq('concert_id', newConcert.id)
          .in(
            'band_id',
            deleteBands.map(item => item.id)
          )

        if (deleteBandsError) {
          throw deleteBandsError
        }
      }
    } catch (error) {
      throw error
    }
  } catch (error) {
    throw error
  }

  return { concertId: newConcert.id }
}

export const useEditConcert = () => {
  const queryClient = useQueryClient()
  const [_, setModal] = useQueryState('modal', { history: 'push' })
  const t = useTranslations('useEditConcert')

  return useMutation({
    mutationFn: editConcert,
    onError: error => {
      console.error(error)
      toast.error(error.message)
    },
    onSuccess: ({ concertId }) => {
      queryClient.invalidateQueries({ queryKey: ['concert', concertId] })
      queryClient.invalidateQueries({ queryKey: ['contributions-count', 'concerts', concertId] })
      setModal(null)
      toast.success(t('concertSaved'))
    },
  })
}
