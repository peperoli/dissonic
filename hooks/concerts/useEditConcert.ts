import { useMutation, useQueryClient } from '@tanstack/react-query'
import { EditConcert } from '@/types/types'
import supabase from '@/utils/supabase/client'
import { useQueryState } from 'nuqs'
import toast from 'react-hot-toast'
import { useTranslations } from 'next-intl'

const editConcert = async (newConcert: EditConcert) => {
  const concertId = newConcert.id

  if (!concertId) {
    throw new Error('Concert ID is required')
  }

  const { data: oldConcert, error: oldConcertError } = await supabase
    .from('concerts')
    .select('id, bands!j_concert_bands(*)')
    .eq('id', concertId)
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
      doors_time: newConcert.doors_time || null,
      show_time: newConcert.show_time || null,
      source_link: newConcert.source_link,
      resource_status: newConcert.resource_status,
    })
    .eq('id', concertId)

  if (editConcertError) {
    throw editConcertError
  }

  const addBands = newConcert.bands?.filter(
    item => !oldConcert.bands.find(item2 => item.id === item2.id)
  )
  const deleteBands = oldConcert.bands.filter(
    item => !newConcert.bands?.find(item2 => item.id === item2.id)
  )

  if (addBands?.length) {
    const { error: addBandsError } = await supabase.from('j_concert_bands').insert(
      addBands.map((item, index) => ({
        concert_id: concertId,
        band_id: item.id,
        item_index: index,
      }))
    )

    if (addBandsError) {
      throw addBandsError
    }
  }

  await Promise.all(
    newConcert.bands?.map(async (band, index) => {
      const { error: editBandsError } = await supabase
        .from('j_concert_bands')
        .update({ item_index: index })
        .eq('concert_id', concertId)
        .eq('band_id', band.id)

      if (editBandsError) {
        throw editBandsError
      }
    }) ?? []
  )

  if (deleteBands.length) {
    const { count } = await supabase
      .from('j_bands_seen')
      .select('*', { count: 'estimated' })
      .eq('concert_id', concertId)
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
      .eq('concert_id', concertId)
      .in(
        'band_id',
        deleteBands.map(item => item.id)
      )

    if (deleteBandsError) {
      throw deleteBandsError
    }
  }

  return { concertId }
}

export const useEditConcert = () => {
  const queryClient = useQueryClient()
  const [, setModal] = useQueryState('modal', { history: 'push' })
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
