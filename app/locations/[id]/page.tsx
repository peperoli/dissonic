import { cookies } from 'next/headers'
import { createClient } from '../../../utils/supabase/server'
import supabase from '../../../utils/supabase/client'
import { LocationPage } from '@/components/locations/LocationPage'
import { notFound } from 'next/navigation'

export async function generateMetadata(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const location = await fetchData(params)

  return {
    title: `${location.name} • Dissonic`,
  }
}

export async function generateStaticParams() {
  const { data: locations, error } = await supabase
    .from('locations')
    .select('id')
    .eq('is_archived', false)

  if (error) {
    throw error
  }

  return locations?.map(location => ({ id: location.id.toString() }))
}

async function fetchData(params: { id: string }) {
  const supabase = await createClient()
  const locationId = parseInt(params.id)
  
  if (Number.isNaN(locationId)) {
    notFound()
  }


  const { data, error } = await supabase
    .from('locations')
    .select('*, country:countries(id, iso2), creator:profiles!locations_creator_id_fkey(*)')
    .eq('id', locationId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      notFound()
    }

    throw error
  }

  return data
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const location = await fetchData(params)
  const cookieStore = await cookies()
  return (
    <LocationPage
      location={location}
      locationQueryState={cookieStore.get('locationQueryState')?.value}
    />
  )
}
