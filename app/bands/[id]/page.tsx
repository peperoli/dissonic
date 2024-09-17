import { BandPage } from '../../../components/bands/BandPage'
import { cookies } from 'next/headers'
import { createClient } from '../../../utils/supabase/server'
import supabase from '../../../utils/supabase/client'

export async function generateStaticParams() {
  const { data: bands, error } = await supabase.from('bands').select('id')

  if (error) {
    throw error
  }

  return bands?.map(band => ({ id: band.id.toString() }))
}

async function fetchData(params: { id: string }) {
  const supabase = createClient()

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
    throw error
  }

  return data
}

export default async function Page({ params }: { params: { id: string } }) {
  const band = await fetchData(params)
  const cookieStore = cookies()
  return <BandPage initialBand={band} bandQueryState={cookieStore.get('bandQueryState')?.value} />
}
