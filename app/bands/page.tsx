import supabase from '../../utils/supabase'
import { BandsPage } from '../../components/bands/BandsPage'
import { Band } from '../../types/types'
import React from 'react'

export const revalidate = 0

const fetchData = async (): Promise<Band[]> => {
  const { data, error } = await supabase
    .from('bands')
    .select('*, country:countries(*), genres(*)')
    .order('name')

  if (error) {
    throw error
  }

  return data
}

export default async function Page() {
  const bands = await fetchData()
  return <BandsPage initialBands={bands} />
}
