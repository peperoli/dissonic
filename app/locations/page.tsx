import { getTranslations } from 'next-intl/server'
import { LocationsPage } from '../../components/locations/LocationsPage'
import { ExtendedRes, Location } from '../../types/types'
import { createClient } from '../../utils/supabase/server'

export async function generateMetadata() {
  const t = await getTranslations('LocationsPage')

  return {
    title: `${t('locations')} • Dissonic`,
  }
}

async function fetchData(): Promise<ExtendedRes<Location[]>> {
  const supabase = await createClient()

  const { data, count, error } = await supabase
    .from('locations')
    .select('*, country:countries(id, iso2)', { count: 'estimated' })
    .eq('is_archived', false)
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
