import { HomePage } from '../components/concerts/HomePage'
import { Concert, WithCount } from '../types/types'
import supabase from '../utils/supabase'

const fetchData = async (): Promise<WithCount<Concert[]>> => {
  const { data, count, error } = await supabase
    .from('concerts')
    .select(
      '*, location:locations(*), bands!j_concert_bands(*), bands_seen:j_bands_seen(band_id, user_id)'
    )
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
