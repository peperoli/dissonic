import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { LocationsPage } from '../../components/locations/LocationsPage'
import { ExtendedRes, Location } from '../../types/types'
import { cookies } from 'next/headers'

async function fetchData(): Promise<ExtendedRes<Location[]>> {
  const supabase = createServerComponentClient({ cookies })

  const { data, count, error } = await supabase
    .from('locations')
    .select('*', { count: 'estimated' })
    .range(0, 24)
    .order('name')

  if (error) {
    throw error
  }

  return { data, count }
}

export default async function Page() {
  const locations = await fetchData()
  return <LocationsPage initialLocations={locations} />
}
