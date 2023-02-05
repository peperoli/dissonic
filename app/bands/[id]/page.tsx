import { BandPage } from '../../../components/bands/BandPage'
import { Band } from '../../../types/types'
import supabase from '../../../utils/supabase'
import React from 'react'

const fetchData = async(params: { id: string }): Promise<Band> => {
  const { data, error } = await supabase
    .from('bands')
    .select('*, country:countries(id, iso2, name), genres(*)')
    .eq('id', params.id)
    .single()

  if (error) {
    throw error
  }

  return data
}

export default async function Page({ params }: { params: { id: string } }) {
  const band = await fetchData(params)
  return <BandPage initialBand={band} />
}
