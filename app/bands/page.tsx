import supabase from '../../utils/supabase'
import { BandsPage } from '../../components/bands/BandsPage'
import { Band, ExtendedRes } from '../../types/types'
import React from 'react'

export const revalidate = 0

const fetchData = async (): Promise<ExtendedRes<Band[]>> => {
  const { data, count, error } = await supabase
    .from('bands')
    .select('*, country:countries(*), genres(*)', { count: 'exact' })
    .range(0, 24)
    .order('name')

  if (error) {
    throw error
  }

  return { data, count }
}

export default async function Page() {
  const bands = await fetchData()
  return <BandsPage initialBands={bands} />
}
