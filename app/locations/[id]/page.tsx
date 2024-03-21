import { cookies } from 'next/headers'
import { createClient } from '../../../utils/supabase/server'
import { LocationPage } from '@/components/locations/LocationPage'

const fetchData = async(params: { id: string }) => {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase
    .from('locations')
    .select('*, country:countries(id, iso2)')
    .eq('id', params.id)
    .single()

  if (error) {
    throw error
  }

  return data
}

export default async function Page({ params }: { params: { id: string } }) {
  const location = await fetchData(params)
  const cookieStore = cookies()
  return <LocationPage location={location} locationQueryState={cookieStore.get('locationQueryState')?.value} />
}
