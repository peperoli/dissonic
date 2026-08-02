import { useMutation, useQueryClient } from '@tanstack/react-query'
import { EditConcert } from '@/types/types'
import supabase from '@/utils/supabase/client'
import { useQueryState } from 'nuqs'
import toast from 'react-hot-toast'
import { useTranslations } from 'next-intl'
import { editConcertRecord } from '@/actions/algolia'

const editConcert = async (formData: EditConcert) => {
  const concertId = formData.id

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

  const { data: newConcert, error: newConcertError } = await supabase
    .from('concerts')
    .update({
      name: formData.is_festival ? null : formData.name,
      is_festival: formData.is_festival,
      festival_root_id: formData.is_festival ? formData.festival_root_id : null,
      date_start: formData.date_start,
      date_end: formData.is_festival ? formData.date_end : null,
      location_id: formData.location_id,
      doors_time: formData.doors_time || null,
      show_time: formData.show_time || null,
      source_link: formData.source_link,
      resource_status: formData.resource_status,
    })
    .eq('id', concertId)
    .select(
      `*,
      festival_root:festival_roots(id, name),
      location:locations(*, name, alt_names, city, country:countries(iso2))`
    )
    .single()

  if (newConcertError) {
    throw newConcertError
  }

  const addBands = formData.bands?.filter(
    item => !oldConcert.bands.find(item2 => item.id === item2.id)
  )
  const deleteBands = oldConcert.bands.filter(
    item => !formData.bands?.find(item2 => item.id === item2.id)
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
    formData.bands?.map(async (band, index) => {
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

  await editConcertRecord(`concerts-${concertId}`, { ...newConcert, bands: formData.bands ?? [] })

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
