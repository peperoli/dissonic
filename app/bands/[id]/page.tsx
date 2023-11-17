import { BandPage } from '../../../components/bands/BandPage'
import { Band } from '../../../types/types'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

const fetchData = async(params: { id: string }): Promise<Band> => {
  const supabase = createServerComponentClient({ cookies })

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
