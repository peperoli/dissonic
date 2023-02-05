import React from 'react'
import { LocationsPage } from '../../components/locations/LocationsPage'
import { Location } from '../../types/types'
import supabase from '../../utils/supabase'

export const revalidate = 0

async function fetchData(): Promise<Location[]> {
  const { data, error } = await supabase.from('locations').select('*').order('name')

  if (error) {
    throw error
  }

  return data
}

export default async function Page() {
  const locations = await fetchData()
  return <LocationsPage initialLocations={locations} />
}
