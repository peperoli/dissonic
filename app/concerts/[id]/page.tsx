import { ConcertPage } from '../../../components/concerts/ConcertPage'
import React from 'react'
import supabase from '../../../utils/supabase'
import { Concert } from '../../../types/types'

export const revalidate = 60

const fetchConcert = async (concertId: string): Promise<Concert> => {
  const { data, error } = await supabase
    .from('concerts')
    .select(
      '*, location:locations(*), bands!j_concert_bands(*, genres(*)), bands_seen:j_bands_seen(band_id, user_id)'
    )
    .eq('id', concertId)
    .single()

  if (error) {
    throw error
  }

  return data
}

export default async function Page({ params }: { params: { id: string } }) {
  const concert = await fetchConcert(params.id)
  return (
    <ConcertPage initialConcert={concert} />
  )
}
