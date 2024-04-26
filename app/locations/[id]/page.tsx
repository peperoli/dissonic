import { cookies } from 'next/headers'
import { createClient } from '../../../utils/supabase/server'
import supabase from '../../../utils/supabase/client'
import { LocationPage } from '@/components/locations/LocationPage'

export async function generateStaticParams() {
  const { data: locations, error } = await supabase.from('locations').select('id')

  if (error) {
    throw error
  }

  return locations?.map(location => ({ id: location.id.toString() }))
}

async function fetchData(params: { id: string }) {
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
  return (
    <LocationPage
      location={location}
      locationQueryState={cookieStore.get('locationQueryState')?.value}
    />
  )
}
