import { BandPage } from '../../../components/bands/BandPage'
import { cookies } from 'next/headers'
import { createClient } from '../../../utils/supabase/server'
import supabase from '../../../utils/supabase/client'
import { notFound } from 'next/navigation'

export async function generateMetadata(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const band = await fetchData(params)

  return {
    title: `${band.name} • Dissonic`,
  }
}

export async function generateStaticParams() {
  const { data: bands, error } = await supabase.from('bands').select('id').eq('is_archived', false)

  if (error) {
    throw error
  }

  return bands?.map(band => ({ id: band.id.toString() }))
}

async function fetchData(params: { id: string }) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('bands')
    .select(
      `*,
      country:countries(id, iso2, name),
      genres(*),
      creator:profiles!bands_creator_id_fkey(*)`
    )
    .eq('id', params.id)
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
  const band = await fetchData(params)
  const cookieStore = await cookies()
  return (
    <BandPage initialBand={band} bandQueryState={cookieStore.get('bandsLastQueryState')?.value} />
  )
}
