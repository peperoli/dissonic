import { HomePage } from '../components/concerts/HomePage'
import { Concert } from '../types/types'
import { cookies } from 'next/headers'
import { createClient } from '../utils/supabase/server'

const fetchData = async () => {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data, count, error } = await supabase
    .from('concerts')
    .select(
      `*,
      location:locations(*),
      bands:j_concert_bands(*, ...bands(*, genres(*))),
      bands_seen:j_bands_seen(band_id, user_id)`,
      { count: 'estimated' }
    )
    .range(0, 24)
    .order('date_start', { ascending: false })
    .order('item_index', { referencedTable: 'j_concert_bands', ascending: true })
    .returns<Concert[]>()

  if (error) {
    throw error
  }

  return { data, count }
}

export default async function Page() {
  const concerts = await fetchData()
  return <HomePage concerts={concerts} />
}
