import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { HomePage } from '../components/concerts/HomePage'
import { Concert, ExtendedRes } from '../types/types'
import { cookies } from 'next/headers'

const fetchData = async (): Promise<ExtendedRes<Concert[]>> => {
  const supabase = createServerComponentClient({ cookies })

  const { data, count, error } = await supabase
    .from('concerts')
    .select('*, location:locations(*), bands!j_concert_bands(*), bands_seen:j_bands_seen(*)', {
      count: 'estimated',
    })
    .range(0, 24)
    .order('date_start', { ascending: false })

  if (error) {
    throw error
  }

  return { data, count }
}

export default async function Page() {
  const concerts = await fetchData()
  return <HomePage initialConcerts={concerts} />
}
