import { ConcertPage } from '../../../components/concerts/ConcertPage'
import supabase from '../../../utils/supabase'
import React from 'react'

export const revalidate = 0

async function fetchData(params) {
  const { data: concert, error } = await supabase
    .from('concerts')
    .select(
      `
      *,
      location:locations(*),
      bands!j_concert_bands(
        *,
        country:countries(*),
        genres(*)
      )
    `
    )
    .eq('id', params.id)
    .single()

  const { data: bands } = await supabase
    .from('bands')
    .select('*, country:countries(*), genres(*)')
    .order('name')

  const { data: locations } = await supabase.from('locations').select('*').order('name')

  const { data: profiles } = await supabase.from('profiles').select('*')

  if (error) {
    console.error(error)
  }

  return { concert, bands, locations, profiles }
}

export default async function Page({ params }) {
  const { concert, bands, locations, profiles } = await fetchData(params)
  return (
    <ConcertPage initialConcert={concert} bands={bands} locations={locations} profiles={profiles} />
  )
}
