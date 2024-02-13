import { BandPage } from '../../../components/bands/BandPage'
import { cookies } from 'next/headers'
import { createClient } from '../../../utils/supabase/server'

const fetchData = async(params: { id: string }) => {
  const supabase = createClient(cookies())

  const { data, error } = await supabase
    .from('bands')
    .select('*, country:countries(id, iso2, name), genres(*)')
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
