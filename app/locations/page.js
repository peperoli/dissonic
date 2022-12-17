import LocationsPage from '../../components/locations/LocationsPage'
import supabase from '../../utils/supabase'

async function fetchData() {
  const { data: locations, error } = await supabase.from('locations').select('*').order('name')

  if (error) {
    console.error(error)
  }

  return { locations }
}

export default async function Page() {
  const { locations } = await fetchData()
  return <LocationsPage initialLocations={locations} />
}
