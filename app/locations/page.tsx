import { LocationsPage } from '../../components/locations/LocationsPage'
import { ExtendedRes, Location } from '../../types/types'
import supabase from '../../utils/supabase'

export const revalidate = 0

async function fetchData(): Promise<ExtendedRes<Location[]>> {
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
